document.addEventListener('DOMContentLoaded', () => {
    // Note: All variables and functions from data.js, modals.js,
    // slideshow.js, and auth.js are available globally because they are
    // loaded via script tags before this file.

    // --- State variables ---
    let chartInstance = null;
    let currentTour = null;
    let currentDestination = null;

    // --- RENDER FUNCTIONS ---
    const renderDestinations = (loadMore = false) => {
        const grid = document.getElementById('destinations-grid');
        const loadMoreBtn = document.getElementById('load-more-destinations');
        const loadingDiv = document.getElementById('destinations-loading');
        
        if (!grid) return;
        
        // Get filter values with fallbacks
        const provinceFilter = document.getElementById('province-filter')?.value || 'all';
        const activityFilter = document.getElementById('activity-filter')?.value || 'all';
        const durationFilter = document.getElementById('duration-filter')?.value || 'all';
        const searchFilter = document.getElementById('search-input')?.value?.toLowerCase() || '';
        
        const filteredDests = destinations.filter(d => 
            (provinceFilter === 'all' || d.location === provinceFilter) &&
            (activityFilter === 'all' || d.activities.includes(activityFilter)) &&
            (durationFilter === 'all' || d.duration === durationFilter) &&
            (d.title.toLowerCase().includes(searchFilter) || d.location.toLowerCase().includes(searchFilter))
        );

        // Reset pagination when filters change
        if (!loadMore) {
            currentDestinationsPage = 1;
            grid.innerHTML = '';
        }

        const startIndex = loadMore ? (currentDestinationsPage - 1) * destinationsPerPage : 0;
        const endIndex = currentDestinationsPage * destinationsPerPage;
        const destinationsToShow = filteredDests.slice(startIndex, endIndex);
        
        if (filteredDests.length === 0) {
            grid.innerHTML = `<p class="text-gray-600 md:col-span-3 text-center">No destinations found.</p>`;
            loadMoreBtn.classList.add('hidden');
            return;
        }

        const destinationCards = destinationsToShow.map(dest => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform cursor-pointer destination-card" data-destination-id="${dest.id}">
                <img src="${dest.images[0]}" alt="${dest.title}" class="w-full h-56 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-xl font-bold mb-2">${dest.title}</h3>
                    <p class="text-sm text-gray-500 mb-3">桃 ${dest.location} Province</p>
                    <p class="text-gray-600 text-sm mb-4 flex-grow">${dest.shortDesc}</p>
                    <div class="mt-auto">
                        <span class="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                            ${dest.duration}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        if (loadMore) {
            // Show loading animation
            loadingDiv.classList.remove('hidden');
            setTimeout(() => {
                loadingDiv.classList.add('hidden');
                grid.innerHTML += destinationCards;
            }, 800); // Simulate loading time
        } else {
            grid.innerHTML = destinationCards;
        }

        // Show/hide load more button
        const hasMoreDestinations = endIndex < filteredDests.length;
        loadMoreBtn.classList.toggle('hidden', !hasMoreDestinations);
    };
    
    const renderTours = (loadMore = false) => {
        const grid = document.getElementById('tours-grid');
        const loadMoreBtn = document.getElementById('load-more-tours');
        const loadingDiv = document.getElementById('tours-loading');
        
        if (!grid) return;
        
        // Get filter values with fallbacks
        const typeFilter = document.getElementById('tour-type-filter')?.value || 'all';
        const priceFilter = document.getElementById('tour-price-filter')?.value || 'all';
        const groupSizeFilter = document.getElementById('group-size-filter')?.value || 'all';
        const searchFilter = document.getElementById('tour-search-input')?.value?.toLowerCase() || '';
        
        const filteredTours = tours.filter(tour =>
            (typeFilter === 'all' || tour.type === typeFilter) &&
            (priceFilter === 'all' || (priceFilter === 'low' && tour.price < 500) || (priceFilter === 'medium' && tour.price >= 500 && tour.price <= 1500) || (priceFilter === 'high' && tour.price > 1500)) &&
            (groupSizeFilter === 'all' || tour.groupSize === groupSizeFilter) &&
            (tour.name.toLowerCase().includes(searchFilter))
        );

        // Reset pagination when filters change
        if (!loadMore) {
            currentToursPage = 1;
            grid.innerHTML = '';
        }

        const startIndex = loadMore ? (currentToursPage - 1) * toursPerPage : 0;
        const endIndex = currentToursPage * toursPerPage;
        const toursToShow = filteredTours.slice(startIndex, endIndex);

        if (filteredTours.length === 0) {
            grid.innerHTML = `<p class="text-gray-600 md:col-span-3 text-center">No tours found.</p>`;
            loadMoreBtn.classList.add('hidden');
            return;
        }

        const tourCards = toursToShow.map(tour => `
            <div class="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 tour-card" data-tour-id="${tour.id}">
                <img src="${tour.image}" alt="${tour.name}" class="w-full h-56 object-cover rounded-lg shadow-md" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
                <div class="pt-4 flex justify-between items-center">
                    <h3 class="text-lg font-bold">${tour.name}</h3>
                    <p class="text-lg font-semibold text-teal-600">$${tour.price}</p>
                </div>
                <div class="flex items-center text-sm text-gray-500 mb-3">
                    <p class="capitalize">${tour.type} Tour</p>
                    <span class="mx-2">窶｢</span>
                    <p class="capitalize">${tour.groupSize} Group</p>
                </div>
                <button class="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors">
                    View Details & Book
                </button>
            </div>
        `).join('');

        if (loadMore) {
            // Show loading animation
            loadingDiv.classList.remove('hidden');
            setTimeout(() => {
                loadingDiv.classList.add('hidden');
                grid.innerHTML += tourCards;
            }, 800); // Simulate loading time
        } else {
            grid.innerHTML = tourCards;
        }

        // Show/hide load more button
        const hasMoreTours = endIndex < filteredTours.length;
        loadMoreBtn.classList.toggle('hidden', !hasMoreTours);
    };

    const renderUserBookings = () => {
        const container = document.getElementById('user-bookings-container');
        const noBookingsDiv = document.getElementById('no-user-bookings');
        const bookingsList = document.getElementById('user-bookings-list');
        
        if (!container || !getCurrentUser()) return;
        
        const userBookings = bookings.filter(b => b.userId === getCurrentUser().id);
        
        if (userBookings.length === 0) {
            noBookingsDiv.classList.remove('hidden');
            bookingsList.innerHTML = '';
        } else {
            noBookingsDiv.classList.add('hidden');
            bookingsList.innerHTML = userBookings.map(booking => {
                const tour = tours.find(t => t.id === booking.tourId);
                return `
                    <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-gray-900 mb-2">${tour?.name || 'Unknown Tour'}</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span class="font-medium">Date:</span> ${booking.date}
                                    </div>
                                    <div>
                                        <span class="font-medium">Guests:</span> ${booking.guests}
                                    </div>
                                    <div>
                                        <span class="font-medium">Total Price:</span> $${booking.totalPrice}
                                    </div>
                                    <div>
                                        <span class="font-medium">Status:</span> 
                                        <span class="px-2 py-1 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${booking.status}</span>
                                    </div>
                                </div>
                                ${booking.specialRequests ? `<div class="mt-3"><span class="font-medium text-gray-700">Special Requests:</span> ${booking.specialRequests}</div>` : ''}
                            </div>
                            <div class="mt-4 md:mt-0 md:ml-6">
                                <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cancel-booking-btn" data-booking-id="${booking.id}">
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    };

    const renderTourDetail = (tourId) => {
        const tour = tours.find(t => t.id == tourId);
        if (!tour) return;
        
        currentTour = tour;
        const content = document.getElementById('tour-detail-content');
        
        content.innerHTML = `
            <div class="relative">
                <img src="${tour.image}" alt="${tour.name}" class="w-full h-96 object-cover">
                <div class="absolute top-4 left-4">
                    <button id="back-to-tours" class="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-100 flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i> Back to Tours
                    </button>
                </div>
            </div>
            
            <div class="p-8">
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">${tour.name}</h1>
                        <div class="flex items-center mb-6">
                            <span class="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mr-4">${tour.type} Tour</span>
                            <span class="text-gray-600 capitalize mr-4">${tour.groupSize} Group</span>
                            <span class="text-gray-600">${tour.duration || '3-5 days'}</span>
                        </div>
                        
                        <div class="prose max-w-none mb-8">
                            <h3 class="text-xl font-semibold mb-3">About This Tour</h3>
                            <p class="text-gray-600 leading-relaxed mb-6">
                                ${tour.description || `Embark on an unforgettable ${tour.type.toLowerCase()} adventure with our ${tour.name}. This carefully crafted experience offers the perfect blend of excitement, culture, and natural beauty that Sri Lanka is famous for. Our expert guides will ensure you have a safe and memorable journey.`}
                            </p>
                            
                            <h3 class="text-xl font-semibold mb-3">Tour Highlights</h3>
                            <ul class="list-disc list-inside text-gray-600 space-y-1 mb-6">
                                ${tour.highlights ? tour.highlights.map(highlight => `<li>${highlight}</li>`).join('') : `
                                    <li>Professional tour guide</li>
                                    <li>Transportation</li>
                                    <li>Entrance fees to attractions</li>
                                    <li>Refreshments</li>
                                    <li>Photography assistance</li>
                                `}
                            </ul>
                            
                            <h3 class="text-xl font-semibold mb-3">What's Included</h3>
                            <ul class="list-disc list-inside text-gray-600 space-y-1">
                                <li>Professional tour guide</li>
                                <li>Air-conditioned transportation</li>
                                <li>Entrance fees to all attractions</li>
                                <li>Meals as specified in itinerary</li>
                                <li>Photography assistance</li>
                                <li>Travel insurance</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div>
                        <div class="bg-gray-50 rounded-xl p-6 sticky top-4">
                            <div class="text-center mb-6">
                                <div class="text-3xl font-bold text-teal-600 mb-2">$${tour.price}</div>
                                <div class="text-gray-600">per person</div>
                            </div>
                            
                            ${getCurrentUser() ? `
                                <form id="booking-form" class="space-y-4">
                                    <div>
                                        <label for="booking-date" class="block text-gray-700 font-medium mb-2">Select Date</label>
                                        <input type="date" id="booking-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required min="${new Date().toISOString().split('T')[0]}">
                                    </div>
                                    
                                    <div>
                                        <label for="booking-guests" class="block text-gray-700 font-medium mb-2">Number of Guests</label>
                                        <select id="booking-guests" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required>
                                            <option value="">Select guests</option>
                                            <option value="1">1 Guest</option>
                                            <option value="2">2 Guests</option>
                                            <option value="3">3 Guests</option>
                                            <option value="4">4 Guests</option>
                                            <option value="5">5 Guests</option>
                                            <option value="6">6 Guests</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label for="special-requests" class="block text-gray-700 font-medium mb-2">Special Requests (Optional)</label>
                                        <textarea id="special-requests" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Any special requirements or requests..."></textarea>
                                    </div>
                                    
                                    <div class="border-t pt-4">
                                        <div class="flex justify-between items-center mb-4">
                                            <span class="text-gray-700">Total Price:</span>
                                            <span id="total-price" class="text-xl font-bold text-teal-600">$${tour.price}</span>
                                        </div>
                                        <button type="submit" class="w-full bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800 font-medium transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </form>
                            ` : `
                                <div class="text-center">
                                    <p class="text-gray-600 mb-4">Please log in to book this tour</p>
                                    <button class="w-full bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800 font-medium nav-link" data-target="login">
                                        Login to Book
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Update total price when guests change
        const guestsSelect = document.getElementById('booking-guests');
        const totalPriceSpan = document.getElementById('total-price');
        
        if (guestsSelect && totalPriceSpan) {
            guestsSelect.addEventListener('change', () => {
                const guests = parseInt(guestsSelect.value) || 1;
                const total = tour.price * guests;
                totalPriceSpan.textContent = `$${total}`;
            });
        }
    };

    const renderDestinationDetail = (destinationId) => {
        const destination = destinations.find(d => d.id == destinationId);
        if (!destination) return;
        
        currentDestination = destination;
        const content = document.getElementById('destination-detail-content');
        
        content.innerHTML = `
            <div class="relative">
                <img src="${destination.images[0]}" alt="${destination.title}" class="w-full h-96 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
                <div class="absolute top-4 left-4">
                    <button id="back-to-destinations" class="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-100 flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i> Back to Destinations
                    </button>
                </div>
            </div>
            
            <div class="p-8">
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">${destination.title}</h1>
                        <div class="flex items-center mb-6">
                            <span class="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mr-4">桃 ${destination.location} Province</span>
                            <span class="text-gray-600">${destination.duration}</span>
                        </div>
                        
                        <div class="prose max-w-none mb-8">
                            <h3 class="text-xl font-semibold mb-3">About This Destination</h3>
                            <p class="text-gray-600 leading-relaxed mb-6">
                                ${destination.shortDesc} This magnificent destination offers a unique blend of ${destination.activities.join(' and ').toLowerCase()} experiences that will create lasting memories of your visit to Sri Lanka.
                            </p>
                            
                            <h3 class="text-xl font-semibold mb-3">Activities Available</h3>
                            <ul class="list-disc list-inside text-gray-600 space-y-1 mb-6">
                                ${destination.activities.map(activity => `<li>${activity}</li>`).join('')}
                                <li>Photography opportunities</li>
                                <li>Local cultural experiences</li>
                                <li>Guided tours available</li>
                            </ul>
                            
                            <h3 class="text-xl font-semibold mb-3">Best Time to Visit</h3>
                            <p class="text-gray-600 mb-4">
                                The ideal time to visit ${destination.title} depends on the activities you're interested in. Generally, the dry season (December to March) offers the best weather conditions for most activities.
                            </p>
                            
                            <h3 class="text-xl font-semibold mb-3">Getting There</h3>
                            <p class="text-gray-600">
                                ${destination.title} is located in the ${destination.location} Province of Sri Lanka. Various transportation options are available including private tours, public transport, and guided excursions.
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <div class="bg-gray-50 rounded-xl p-6 sticky top-4">
                            <div class="text-center mb-6">
                                <h3 class="text-2xl font-bold text-teal-600 mb-2">Explore ${destination.title}</h3>
                                <div class="text-gray-600">Recommended duration: ${destination.duration}</div>
                            </div>
                            
                            <div class="space-y-4 mb-6">
                                <div class="flex items-center">
                                    <i class="fas fa-map-marker-alt text-teal-500 mr-3"></i>
                                    <span class="text-gray-700">${destination.location} Province</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-clock text-teal-500 mr-3"></i>
                                    <span class="text-gray-700">${destination.duration}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-tags text-teal-500 mr-3"></i>
                                    <span class="text-gray-700">${destination.activities.join(', ')}</span>
                                </div>
                            </div>
                            
                            <div class="space-y-3">
                                ${getCurrentUser() ? `
                                    <button id="add-to-wishlist-btn" class="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium transition-colors" data-destination-id="${destination.id}">
                                        <i class="fas fa-heart mr-2"></i>Add to Wishlist
                                    </button>
                                ` : `
                                    <button id="add-to-wishlist-btn" class="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium transition-colors" data-destination-id="${destination.id}">
                                        <i class="fas fa-heart mr-2"></i>Login to Add to Wishlist
                                    </button>
                                `}
                                <button id="share-destination-btn" class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 font-medium transition-colors" data-destination-id="${destination.id}">
                                    <i class="fas fa-share-alt mr-2"></i>Share Destination
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Update wishlist button state if user is logged in
        if (getCurrentUser()) {
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                const isInWishlist = wishlists.some(w => w.userId === getCurrentUser().id && w.destinationId === destination.id);
                updateWishlistButton(destination.id, isInWishlist);
            }, 200);
        }
    };

    const renderGallery = () => {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;
        
        // Use the dedicated gallery images array
        grid.innerHTML = galleryImages.map(img => `
            <div class="overflow-hidden rounded-lg shadow-md">
                <img src="${img.url}" alt="${img.title}" class="w-full h-full object-cover cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-300 gallery-image" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';" title="${img.title} - ${img.description}">
            </div>
        `).join('');
    };

    // Wishlist Functions
    const addToWishlist = (destinationId) => {
        if (!getCurrentUser()) {
            navigateToPage('login');
            showAlert('Login Required', 'Please log in to add destinations to your wishlist.');
            return;
        }
        
        const existingWishlistItem = wishlists.find(w => w.userId === getCurrentUser().id && w.destinationId === destinationId);
        if (existingWishlistItem) {
            showAlert('Already in Wishlist', 'This destination is already in your wishlist.');
            // Update button to show correct state
            setTimeout(() => updateWishlistButton(destinationId, true), 100);
            return;
        }
        
        const newWishlistItem = {
            id: Date.now(),
            userId: getCurrentUser().id,
            destinationId: destinationId,
            addedDate: new Date().toISOString()
        };
        
        wishlists.push(newWishlistItem);
        
        showAlert('Added to Wishlist Successfully!', 'Destination has been added to your wishlist!');
        
        // Update button state and wishlist display immediately
        updateWishlistButton(destinationId, true);
        
        // Also update after a short delay to ensure DOM is updated
        setTimeout(() => {
            updateWishlistButton(destinationId, true);
            renderUserWishlist();
        }, 100);
    };

    const removeFromWishlist = (destinationId) => {
        console.log('removeFromWishlist called with destinationId:', destinationId);
        console.log('currentUser:', getCurrentUser());
        console.log('wishlists before removal:', wishlists);
        
        if (!getCurrentUser()) {
            console.error('No current user found');
            showAlert('Error', 'Please log in to manage your wishlist.');
            return;
        }
        
        const wishlistIndex = wishlists.findIndex(w => w.userId === getCurrentUser().id && w.destinationId === destinationId);
        console.log('wishlistIndex found:', wishlistIndex);
        
        if (wishlistIndex > -1) {
            wishlists.splice(wishlistIndex, 1);
            console.log('wishlists after removal:', wishlists);
            showAlert('Removed from Wishlist', 'Destination has been removed from your wishlist.');
            
            // Update button state and wishlist display immediately
            updateWishlistButton(destinationId, false);
            renderUserWishlist();
            
            // Also update after a short delay to ensure DOM is updated
            setTimeout(() => {
                updateWishlistButton(destinationId, false);
                renderUserWishlist();
            }, 100);
        } else {
            console.log('Item not found in wishlist');
            showAlert('Error', 'Item not found in your wishlist.');
        }
    };

    const updateWishlistButton = (destinationId, isInWishlist) => {
        const btn = document.getElementById('add-to-wishlist-btn');
        if (btn && btn.dataset.destinationId == destinationId) {
            if (isInWishlist) {
                btn.innerHTML = '<i class="fas fa-heart-broken mr-2"></i>Remove from Wishlist';
                btn.className = 'w-full bg-red-200 text-red-700 py-3 px-6 rounded-lg hover:bg-red-300 font-medium transition-colors';
            } else {
                btn.innerHTML = '<i class="fas fa-heart mr-2"></i>Add to Wishlist';
                btn.className = 'w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium transition-colors';
            }
        }
    };

    const renderUserWishlist = () => {
        const container = document.getElementById('user-wishlist-container');
        const noWishlistDiv = document.getElementById('no-user-wishlist');
        const wishlistGrid = document.getElementById('user-wishlist-grid');
        
        if (!container || !getCurrentUser()) return;
        
        const userWishlistItems = wishlists.filter(w => w.userId === getCurrentUser().id);
        
        if (userWishlistItems.length === 0) {
            if (noWishlistDiv) noWishlistDiv.classList.remove('hidden');
            if (wishlistGrid) wishlistGrid.classList.add('hidden');
            return;
        }
        
        if (noWishlistDiv) noWishlistDiv.classList.add('hidden');
        if (wishlistGrid) wishlistGrid.classList.remove('hidden');
        
        const wishlistCards = userWishlistItems.map(wishlistItem => {
            const destination = destinations.find(d => d.id === wishlistItem.destinationId);
            if (!destination) return '';
            
            return `
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img src="${destination.images[0]}" alt="${destination.title}" class="w-full h-48 object-cover cursor-pointer destination-card" data-destination-id="${destination.id}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold mb-2 cursor-pointer destination-card" data-destination-id="${destination.id}">${destination.title}</h3>
                        <p class="text-sm text-gray-500 mb-2">桃 ${destination.location} Province</p>
                        <p class="text-gray-600 text-sm mb-3">${destination.shortDesc}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-gray-400">Added ${new Date(wishlistItem.addedDate).toLocaleDateString()}</span>
                            <button class="text-red-500 hover:text-red-700 text-sm remove-wishlist-btn" 
                                    onclick="removeFromWishlist(${destination.id}); return false;" 
                                    data-destination-id="${destination.id}">
                                <i class="fas fa-trash mr-1"></i>Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).filter(card => card !== '').join('');
        
        if (wishlistGrid) wishlistGrid.innerHTML = wishlistCards;
    };

    const shareDestination = (destinationId) => {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        
        const currentUrl = window.location.href.split('#')[0];
        const shareUrl = `${currentUrl}#destination-${destinationId}`;
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                showAlert('Link Copied!', `Link to ${destination.title} has been copied to your clipboard.`);
            }).catch(() => {
                fallbackCopyToClipboard(shareUrl, destination.title);
            });
        } else {
            fallbackCopyToClipboard(shareUrl, destination.title);
        }
    };

    const fallbackCopyToClipboard = (text, destinationTitle) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showAlert('Link Copied!', `Link to ${destinationTitle} has been copied to your clipboard.`);
        } catch (err) {
            showAlert('Copy Failed', 'Could not copy link. Please copy the URL manually from your browser.');
        } finally {
            document.body.removeChild(textArea);
        }
    };

    // Profile Editing Functions
    const toggleProfileEditMode = (isEditMode) => {
        const displayMode = document.getElementById('profile-display-mode');
        const editMode = document.getElementById('profile-edit-mode');
        
        if (isEditMode) {
            displayMode.classList.add('hidden');
            editMode.classList.remove('hidden');
            
            // Populate edit form with current user data
            document.getElementById('edit-user-name').value = getCurrentUser().name;
            document.getElementById('edit-user-email').value = getCurrentUser().email;
            document.getElementById('edit-user-password').value = '';
            document.getElementById('edit-user-confirm-password').value = '';
        } else {
            displayMode.classList.remove('hidden');
            editMode.classList.add('hidden');
        }
    };

    const updateUserProfile = (name, email, password = null) => {
        // Find user in array and update
        const userIndex = users.findIndex(u => u.id === getCurrentUser().id);
        if (userIndex > -1) {
            users[userIndex].name = name;
            users[userIndex].email = email;
            if (password) {
                users[userIndex].password = password;
            }
            
            // Update current user object
            getCurrentUser().name = name;
            getCurrentUser().email = email;
            if (password) {
                getCurrentUser().password = password;
            }
            
            // Update display
            document.getElementById('user-profile-name').textContent = name;
            document.getElementById('user-profile-email').textContent = email;
            
            // Update header if it shows user name
            const headerUserName = document.getElementById('user-name-display');
            if (headerUserName) {
                headerUserName.textContent = name;
            }
            
            showAlert('Profile Updated', 'Your profile has been updated successfully!');
            toggleProfileEditMode(false);
        }
    };

    const renderAdminTables = () => {
        const destTbody = document.getElementById('admin-destinations-table-body');
        if (destTbody) destTbody.innerHTML = destinations.map(dest => `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="p-3">
                    <img src="${dest.images[0] || './images/default-destination.png'}" 
                         alt="${dest.title}" 
                         class="w-16 h-12 object-cover rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                         onerror="this.onerror=null;this.src='https://placehold.co/64x48/cccccc/ffffff?text=No+Image';"
                         title="Click to view full image"
                         onclick="showImageModal('${dest.images[0] || ''}', '${dest.title}')">
                </td>
                <td class="p-3 font-medium">${dest.title}</td> 
                <td class="p-3 text-gray-600">${dest.location}</td> 
                <td class="p-3 text-gray-600">Admin User</td>
                <td class="p-3">
                    <button class="text-blue-500 hover:text-blue-700 hover:underline mr-4 edit-destination-btn font-medium" data-id="${dest.id}">Edit</button>
                    <button class="text-red-500 hover:text-red-700 hover:underline delete-destination-btn font-medium" data-id="${dest.id}">Delete</button>
                </td>
            </tr>`).join('');
        
        const tourTbody = document.getElementById('admin-tours-table-body');
        if (tourTbody) tourTbody.innerHTML = tours.map(tour => `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="p-3">
                    <img src="${tour.image || './images/default-tour.png'}" 
                         alt="${tour.name}" 
                         class="w-16 h-12 object-cover rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                         onerror="this.onerror=null;this.src='https://placehold.co/64x48/cccccc/ffffff?text=No+Image';"
                         title="Click to view full image"
                         onclick="showImageModal('${tour.image || ''}', '${tour.name}')">
                </td>
                <td class="p-3 font-medium">${tour.name}</td> 
                <td class="p-3 text-gray-600">$${tour.price}</td>
                <td class="p-3">
                    <button class="text-blue-500 hover:text-blue-700 hover:underline mr-4 edit-tour-btn font-medium" data-id="${tour.id}">Edit</button>
                    <button class="text-red-500 hover:text-red-700 hover:underline delete-tour-btn font-medium" data-id="${tour.id}">Delete</button>
                </td>
            </tr>`).join('');
            
        const bookingsTbody = document.getElementById('admin-bookings-table-body');
        if (bookingsTbody) bookingsTbody.innerHTML = bookings.map(booking => {
            const tour = tours.find(t => t.id === booking.tourId);
            const user = users.find(u => u.id === booking.userId);
            return `
                <tr class="border-b">
                    <td class="p-3">${tour?.name || 'Unknown Tour'}</td>
                    <td class="p-3">${user?.name || 'Unknown User'}</td>
                    <td class="p-3">${booking.guests}</td>
                    <td class="p-3">${booking.date}</td>
                </tr>
            `;
        }).join('');
        
        // Update dashboard stats
        updateAdminStats();
    };

    const renderAdminGallery = () => {
        const grid = document.getElementById('admin-gallery-grid');
        if (!grid) return;
        
        grid.innerHTML = galleryImages.map(img => `
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img src="${img.url}" alt="${img.title}" class="w-full h-32 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
                <div class="p-3">
                    <h3 class="font-semibold text-sm mb-1">${img.title}</h3>
                    <p class="text-xs text-gray-500 mb-2">${img.category}</p>
                    <p class="text-xs text-gray-600 mb-3">${img.description}</p>
                    <div class="flex justify-between">
                        <button class="text-blue-500 hover:text-blue-700 text-xs edit-gallery-btn" data-id="${img.id}">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="text-red-500 hover:text-red-700 text-xs delete-gallery-btn" data-id="${img.id}">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    };

    const addGalleryImage = (title, description, url, category) => {
        const newImage = {
            id: Math.max(0, ...galleryImages.map(img => img.id)) + 1,
            title,
            description,
            url,
            category
        };
        
        galleryImages.push(newImage);
        renderAdminGallery();
        renderGallery(); // Update main gallery
        showAlert('Success', 'Image added to gallery successfully!');
    };

    const updateGalleryImage = (id, title, description, url, category) => {
        const index = galleryImages.findIndex(img => img.id === id);
        if (index > -1) {
            galleryImages[index] = { id, title, description, url, category };
            renderAdminGallery();
            renderGallery(); // Update main gallery
            showAlert('Success', 'Image updated successfully!');
        }
    };

    const deleteGalleryImage = (id) => {
        const index = galleryImages.findIndex(img => img.id === id);
        if (index > -1) {
            galleryImages.splice(index, 1);
            renderAdminGallery();
            renderGallery(); // Update main gallery
            showAlert('Success', 'Image deleted successfully!');
        }
    };

    const renderChart = () => {
        const ctx = document.getElementById('destinationsChart');
        if (!ctx) return;
        const locationCounts = destinations.reduce((acc, {location}) => ({...acc, [location]: (acc[location] || 0) + 1}), {});
        if(chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(locationCounts),
                datasets: [{ label: '# of Destinations', data: Object.values(locationCounts), backgroundColor: 'rgba(20, 184, 166, 0.6)', borderColor: 'rgba(13, 148, 136, 1)', borderWidth: 1 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    };

    // --- UI & STATE UPDATE ---
    const updateUIForLogin = () => {
        document.querySelectorAll('[data-target="account"]').forEach(link => link.classList.remove('hidden'));
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('logout-btn').classList.remove('hidden');
        document.getElementById('mobile-login-btn').classList.add('hidden');
        document.getElementById('mobile-logout-btn').classList.remove('hidden');
        document.getElementById('mobile-user-account-link').classList.remove('hidden');
        
        if (getCurrentUser()?.role === 'admin') {
            document.querySelectorAll('[data-target="admin"]').forEach(link => link.classList.remove('hidden'));
            document.getElementById('mobile-admin-link').classList.remove('hidden');
        }
    };
    
    const updateUIForLogout = () => {
        document.querySelectorAll('[data-target="account"], [data-target="admin"]').forEach(link => link.classList.add('hidden'));
        document.getElementById('login-btn').classList.remove('hidden');
        document.getElementById('logout-btn').classList.add('hidden');
        document.getElementById('mobile-login-btn').classList.remove('hidden');
        document.getElementById('mobile-logout-btn').classList.add('hidden');
        document.getElementById('mobile-user-account-link').classList.add('hidden');
        document.getElementById('mobile-admin-link').classList.add('hidden');
        navigateToPage('home-page');
    };

    const navigateToPage = (pageId) => {
        document.querySelectorAll('.page-section').forEach(sec => sec.classList.toggle('active', sec.id === pageId));
        document.getElementById('main-header').style.display = (pageId === 'admin') ? 'none' : 'block';

        if (pageId === 'admin') {
            document.getElementById('admin-user-name').textContent = getCurrentUser().name;
            document.getElementById('admin-user-email').textContent = getCurrentUser().email;
            navigateToAdminSection('admin-dashboard');
        }
        
        if (pageId === 'account' && getCurrentUser()) {
            document.getElementById('user-profile-name').textContent = getCurrentUser().name;
            document.getElementById('user-profile-email').textContent = getCurrentUser().email;
            renderUserBookings();
            renderUserWishlist();
        }
        
        // Setup filters and render content when navigating to destinations or tours
        if (pageId === 'home-page') {
            // Re-setup filters and render when going to home page (which includes destinations and tours)
            setTimeout(() => {
                setupDestinationFilters();
                setupTourFilters();
                renderDestinations();
                renderTours();
            }, 100);
        }
    };

    const updateAdminStats = () => {
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-destinations').textContent = destinations.length;
        document.getElementById('total-bookings').textContent = bookings.length;
    };

    // Destination form management functions
    const loadDestinationForEdit = (destination) => {
        document.getElementById('post-destination-form-title').textContent = 'Edit Destination';
        document.getElementById('post-destination-submit-btn').textContent = 'Update Destination';
        document.getElementById('post-destination-id').value = destination.id;
        document.getElementById('post-destination-title').value = destination.title;
        document.getElementById('post-destination-location').value = destination.location;
        document.getElementById('post-destination-activities').value = destination.activities.join(', ');
        document.getElementById('post-destination-duration').value = destination.duration;
        document.getElementById('post-destination-short-desc').value = destination.shortDesc;
        document.getElementById('post-destination-images-url').value = destination.images[0] || '';
        
        // Show image preview if image exists
        if (destination.images[0]) {
            const previewContainer = document.getElementById('destination-image-preview');
            const previewImg = document.getElementById('destination-preview-img');
            previewImg.src = destination.images[0];
            previewContainer.classList.remove('hidden');
        }
    };

    const clearDestinationForm = () => {
        document.getElementById('post-destination-form-title').textContent = 'Add New Destination';
        document.getElementById('post-destination-submit-btn').textContent = 'Submit';
        document.getElementById('post-destination-form').reset();
        document.getElementById('post-destination-id').value = '';
        
        // Hide image preview
        document.getElementById('destination-image-preview').classList.add('hidden');
    };

    // Tour form management functions
    const loadTourForEdit = (tour) => {
        document.getElementById('post-tour-form-title').textContent = 'Edit Tour';
        document.getElementById('post-tour-submit-btn').textContent = 'Update Tour';
        document.getElementById('post-tour-id').value = tour.id;
        document.getElementById('post-tour-name').value = tour.name;
        document.getElementById('post-tour-type').value = tour.type;
        document.getElementById('post-tour-price').value = tour.price;
        document.getElementById('post-tour-group-size').value = tour.groupSize;
        document.getElementById('post-tour-image').value = tour.image || '';
        
        // Show image preview if image exists
        if (tour.image) {
            const previewContainer = document.getElementById('tour-image-preview');
            const previewImg = document.getElementById('tour-preview-img');
            previewImg.src = tour.image;
            previewContainer.classList.remove('hidden');
        }
    };

    const clearTourForm = () => {
        document.getElementById('post-tour-form-title').textContent = 'Add New Tour';
        document.getElementById('post-tour-submit-btn').textContent = 'Submit';
        document.getElementById('post-tour-form').reset();
        document.getElementById('post-tour-id').value = '';
        
        // Hide image preview
        document.getElementById('tour-image-preview').classList.add('hidden');
    };

    const navigateToAdminSection = (sectionId) => {
        document.querySelectorAll('.admin-section').forEach(sec => sec.classList.toggle('active', sec.id === sectionId));
        if (sectionId === 'admin-dashboard') {
            updateAdminStats();
            renderChart();
        }
        if (sectionId === 'admin-destinations' || sectionId === 'admin-tours') renderAdminTables();
        if (sectionId === 'admin-gallery') renderAdminGallery();
    };
    
    // Simple image modal for destination table images
    const showImageModal = (imageSrc, title) => {
        if (!imageSrc) return;
        
        // Use existing lightbox modal
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightboxModal && lightboxImage) {
            lightboxImage.src = imageSrc;
            lightboxImage.alt = title;
            lightboxModal.style.display = 'flex';
        }
    };

    // Image preview functionality for destination and tour forms
    const setupImagePreview = () => {
        // Destination form image preview
        const destImageUrlInput = document.getElementById('post-destination-images-url');
        const destPreviewContainer = document.getElementById('destination-image-preview');
        const destPreviewImg = document.getElementById('destination-preview-img');
        
        if (destImageUrlInput && destPreviewContainer && destPreviewImg) {
            destImageUrlInput.addEventListener('input', (e) => {
                const url = e.target.value.trim();
                if (url) {
                    destPreviewImg.src = url;
                    destPreviewContainer.classList.remove('hidden');
                } else {
                    destPreviewContainer.classList.add('hidden');
                }
            });
        }

        // Tour form image preview
        const tourImageUrlInput = document.getElementById('post-tour-image');
        const tourPreviewContainer = document.getElementById('tour-image-preview');
        const tourPreviewImg = document.getElementById('tour-preview-img');
        
        if (tourImageUrlInput && tourPreviewContainer && tourPreviewImg) {
            tourImageUrlInput.addEventListener('input', (e) => {
                const url = e.target.value.trim();
                if (url) {
                    tourPreviewImg.src = url;
                    tourPreviewContainer.classList.remove('hidden');
                } else {
                    tourPreviewContainer.classList.add('hidden');
                }
            });
        }
    };

    // --- INITIALIZATION ---
    const init = () => {
        // Check if URL contains a shared destination link
        const hash = window.location.hash;
        if (hash.startsWith('#destination-')) {
            const destinationId = parseInt(hash.replace('#destination-', ''));
            const destination = destinations.find(d => d.id === destinationId);
            if (destination) {
                renderDestinationDetail(destinationId);
                navigateToPage('destination-detail');
                return;
            }
        }
        
        navigateToPage('home-page');
        initHeroSlideshow();
        
        // Setup filters with a small delay to ensure DOM is ready
        setTimeout(() => {
            setupDestinationFilters();
            setupTourFilters();
            renderDestinations();
            renderTours();
            renderGallery();
        }, 100);
    };

    // --- EVENT HANDLERS ---
    document.body.addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const targetId = navLink.dataset.target;
            const href = navLink.getAttribute('href');
            
            if (targetId) { // It's a page switch
                navigateToPage(targetId);
            } else if (href && href.startsWith('#')) { // It's a scroll link
                navigateToPage('home-page');
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        
                        // Setup filters when navigating to specific sections
                        if (href === '#destinations') {
                            setTimeout(() => {
                                setupDestinationFilters();
                                renderDestinations();
                            }, 200);
                        } else if (href === '#tours') {
                            setTimeout(() => {
                                setupTourFilters();
                                renderTours();
                            }, 200);
                        }
                    }
                }, 0);
            }
            document.getElementById('mobile-menu').classList.add('hidden');
        }

        // Tour card clicks
        if (e.target.closest('.tour-card')) {
            const tourId = e.target.closest('.tour-card').dataset.tourId;
            if (tourId) {
                renderTourDetail(parseInt(tourId));
                navigateToPage('tour-detail');
            }
        }
        
        // Destination card clicks
        if (e.target.closest('.destination-card')) {
            const destinationId = e.target.closest('.destination-card').dataset.destinationId;
            if (destinationId) {
                renderDestinationDetail(parseInt(destinationId));
                navigateToPage('destination-detail');
            }
        }
        
        // Back to tours button
        if (e.target.id === 'back-to-tours') {
            navigateToPage('home-page');
            setTimeout(() => {
                document.getElementById('tours').scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
        
        // Back to destinations button
        if (e.target.id === 'back-to-destinations') {
            navigateToPage('home-page');
            setTimeout(() => {
                document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
        
        // Add to wishlist button
        if (e.target.id === 'add-to-wishlist-btn') {
            const destinationId = parseInt(e.target.dataset.destinationId);
            
            // Check current button text to determine action instead of checking wishlist state
            const buttonText = e.target.textContent.trim();
            
            if (buttonText.includes('Remove from Wishlist')) {
                removeFromWishlist(destinationId);
            } else {
                addToWishlist(destinationId);
            }
        }
        
        // Share destination button
        if (e.target.id === 'share-destination-btn') {
            const destinationId = parseInt(e.target.dataset.destinationId);
            shareDestination(destinationId);
        }
        
        // Remove from wishlist button (for wishlist page)
        if (e.target.closest('.remove-wishlist-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target.closest('.remove-wishlist-btn');
            const destinationId = parseInt(button.dataset.destinationId);
            console.log('Remove wishlist button clicked for destination:', destinationId);
            if (destinationId) {
                removeFromWishlist(destinationId);
            }
            return false;
        }
        
        // Logout buttons
        if (e.target.id === 'logout-btn' || e.target.id === 'mobile-logout-btn') {
            logout();
            updateUIForLogout();
            showAlert('Logged Out', 'You have been successfully logged out.');
        }

        if (e.target.closest('.admin-nav-link')) {
            e.preventDefault();
            navigateToAdminSection(e.target.closest('.admin-nav-link').dataset.target);
        }

        if (e.target.id === 'admin-logout-btn') {
            logout();
            updateUIForLogout();
        }

        // Cancel booking
        if (e.target.classList.contains('cancel-booking-btn')) {
            const bookingId = parseInt(e.target.dataset.bookingId);
            showConfirm('Cancel Booking', 'Are you sure you want to cancel this booking?', () => {
                bookings = bookings.filter(b => b.id !== bookingId);
                renderUserBookings();
                updateAdminStats();
                showAlert('Booking Cancelled', 'Your booking has been cancelled successfully.');
            });
        }

        if (e.target.id === 'mobile-menu-button') document.getElementById('mobile-menu').classList.toggle('hidden');
        if (e.target.classList.contains('gallery-image')) {
            document.getElementById('lightbox-modal').style.display = 'flex';
            document.getElementById('lightbox-image').src = e.target.src;
        }
        if (e.target.id === 'lightbox-modal' || e.target.classList.contains('lightbox-close')) {
            document.getElementById('lightbox-modal').style.display = 'none';
        }

        // Admin actions
        if (e.target.classList.contains('delete-destination-btn')) {
            if (!getCurrentUser() || getCurrentUser().role !== 'admin') {
                showAlert('Access Denied', 'Only administrators can delete destinations.');
                return;
            }
            const id = e.target.dataset.id;
            showConfirm('Delete Destination', 'Are you sure?', () => {
                destinations = destinations.filter(d => d.id != id);
                renderAdminTables(); 
                updateAdminStats();
                renderChart(); 
                renderDestinations();
                showAlert('Success', 'Destination deleted.');
            });
        }
        if (e.target.classList.contains('delete-tour-btn')) {
            if (!getCurrentUser() || getCurrentUser().role !== 'admin') {
                showAlert('Access Denied', 'Only administrators can delete tours.');
                return;
            }
            const id = e.target.dataset.id;
            showConfirm('Delete Tour', 'Are you sure?', () => {
                tours = tours.filter(t => t.id != id);
                renderAdminTables(); 
                updateAdminStats();
                renderTours();
                showAlert('Success', 'Tour deleted.');
            });
        }
        if (e.target.id === 'add-destination-btn' || e.target.classList.contains('edit-destination-btn')) {
            // Check if user is admin
            if (!getCurrentUser() || getCurrentUser().role !== 'admin') {
                showAlert('Access Denied', 'Only administrators can add or edit destinations.');
                return;
            }
            
            // If editing, load destination data
            if (e.target.classList.contains('edit-destination-btn')) {
                const destinationId = parseInt(e.target.dataset.id);
                const destination = destinations.find(d => d.id === destinationId);
                if (destination) {
                    loadDestinationForEdit(destination);
                } else {
                    showAlert('Error', 'Destination not found.');
                    return;
                }
            } else {
                // Clear form for new destination
                clearDestinationForm();
            }
            
            navigateToPage('post-destination');
        }
        
        // Gallery management actions
        if (e.target.classList.contains('edit-gallery-btn')) {
            const id = parseInt(e.target.dataset.id);
            const image = galleryImages.find(img => img.id === id);
            if (image) {
                // Populate form with existing data
                document.getElementById('gallery-title').value = image.title;
                document.getElementById('gallery-description').value = image.description;
                document.getElementById('gallery-url').value = image.url;
                document.getElementById('gallery-category').value = image.category;
                
                // Mark form as editing
                const form = document.getElementById('add-gallery-form');
                form.dataset.editId = id;
                document.querySelector('#add-gallery-form button[type="submit"]').textContent = 'Update Image';
                
                // Scroll to form
                form.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        if (e.target.classList.contains('delete-gallery-btn')) {
            const id = parseInt(e.target.dataset.id);
            const image = galleryImages.find(img => img.id === id);
            showConfirm('Delete Image', `Are you sure you want to delete "${image?.title}"?`, () => {
                deleteGalleryImage(id);
            });
        }
        
        if (e.target.id === 'cancel-gallery-add') {
            const form = document.getElementById('add-gallery-form');
            form.reset();
            delete form.dataset.editId;
            document.querySelector('#add-gallery-form button[type="submit"]').textContent = 'Add Image';
        }
        
        // Profile editing buttons
        if (e.target.id === 'edit-profile-btn') {
            toggleProfileEditMode(true);
        }
        
        if (e.target.id === 'cancel-edit-profile-btn') {
            toggleProfileEditMode(false);
        }
         if (e.target.id === 'add-tour-btn' || e.target.classList.contains('edit-tour-btn')) {
            // Check if user is admin
            if (!getCurrentUser() || getCurrentUser().role !== 'admin') {
                showAlert('Access Denied', 'Only administrators can add or edit tours.');
                return;
            }
            
            // If editing, load tour data
            if (e.target.classList.contains('edit-tour-btn')) {
                const tourId = parseInt(e.target.dataset.id);
                const tour = tours.find(t => t.id === tourId);
                if (tour) {
                    loadTourForEdit(tour);
                } else {
                    showAlert('Error', 'Tour not found.');
                    return;
                }
            } else {
                // Clear form for new tour
                clearTourForm();
            }
            
            navigateToPage('post-tour');
        }
        
        if (e.target.id === 'cancel-destination-post' || e.target.id === 'cancel-tour-post') {
            navigateToPage('admin');
        }
        
        // Load More buttons
        if (e.target.id === 'load-more-destinations') {
            currentDestinationsPage++;
            renderDestinations(true);
        }
        
        if (e.target.id === 'load-more-tours') {
            currentToursPage++;
            renderTours(true);
        }
    });

    // --- Form submissions & Filters ---
    document.getElementById('login-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const result = login(email); // Use the function from auth.js
        if (result.success) {
            updateUIForLogin();
            if (result.user.role === 'admin') {
                navigateToPage('admin');
            } else {
                navigateToPage('home-page');
            }
            showAlert(`Welcome back, ${result.user.name}!`, "You have successfully logged in.");
        } else { showAlert('Login Failed', 'User not found.'); }
    });
    
    // Booking form submission
    document.body.addEventListener('submit', (e) => {
        if (e.target.id === 'booking-form') {
            e.preventDefault();
            
            if (!getCurrentUser()) {
                showAlert('Login Required', 'Please log in to book a tour.');
                return;
            }
            
            const date = document.getElementById('booking-date').value;
            const guests = parseInt(document.getElementById('booking-guests').value);
            const specialRequests = document.getElementById('special-requests').value;
            const totalPrice = currentTour.price * guests;
            
            const newBooking = {
                id: bookings.length + 1,
                userId: getCurrentUser().id,
                tourId: currentTour.id,
                date: date,
                guests: guests,
                specialRequests: specialRequests,
                totalPrice: totalPrice,
                status: 'confirmed',
                bookingDate: new Date().toISOString().split('T')[0]
            };
            
            bookings.push(newBooking);
            
            // Update admin stats if admin is logged in
            updateAdminStats();
            
            // Show booking confirmation
            const bookingDetails = document.getElementById('booking-details');
            bookingDetails.innerHTML = `
                <h3 class="text-lg font-semibold mb-3">Booking Details</h3>
                <div class="space-y-2">
                    <div><span class="font-medium">Tour:</span> ${currentTour.name}</div>
                    <div><span class="font-medium">Date:</span> ${date}</div>
                    <div><span class="font-medium">Guests:</span> ${guests}</div>
                    <div><span class="font-medium">Total Price:</span> $${totalPrice}</div>
                    <div><span class="font-medium">Booking Reference:</span> VL-${String(newBooking.id).padStart(6, '0')}</div>
                    ${specialRequests ? `<div><span class="font-medium">Special Requests:</span> ${specialRequests}</div>` : ''}
                </div>
            `;
            
            navigateToPage('booking-confirmation');
        }
        
        // Gallery form submission
        if (e.target.id === 'add-gallery-form') {
            e.preventDefault();
            
            const title = document.getElementById('gallery-title').value;
            const description = document.getElementById('gallery-description').value;
            const url = document.getElementById('gallery-url').value;
            const category = document.getElementById('gallery-category').value;
            
            if (e.target.dataset.editId) {
                // Update existing image
                const editId = parseInt(e.target.dataset.editId);
                updateGalleryImage(editId, title, description, url, category);
                delete e.target.dataset.editId;
                document.querySelector('#add-gallery-form button[type="submit"]').textContent = 'Add Image';
            } else {
                // Add new image
                addGalleryImage(title, description, url, category);
            }
            
            // Reset form
            e.target.reset();
        }
        
        // Destination form submission
        if (e.target.id === 'post-destination-form') {
            e.preventDefault();
            
            // Check if user is admin
            if (!getCurrentUser() || getCurrentUser().role !== 'admin') {
                showAlert('Access Denied', 'Only administrators can add or edit destinations.');
                return;
            }
            
            const destinationId = document.getElementById('post-destination-id').value;
            const title = document.getElementById('post-destination-title').value.trim();
            const location = document.getElementById('post-destination-location').value.trim();
            const activities = document.getElementById('post-destination-activities').value.trim();
            const duration = document.getElementById('post-destination-duration').value;
            const shortDesc = document.getElementById('post-destination-short-desc').value.trim();
            const imageUrl = document.getElementById('post-destination-images-url').value.trim();
            
            // Validate form
            if (!title || !location || !shortDesc) {
                showAlert('Validation Error', 'Title, location, and description are required.');
                return;
            }
            
            if (destinationId) {
                // Update existing destination
                const destIndex = destinations.findIndex(d => d.id === parseInt(destinationId));
                if (destIndex > -1) {
                    destinations[destIndex].title = title;
                    destinations[destIndex].location = location;
                    destinations[destIndex].activities = activities ? activities.split(',').map(a => a.trim()) : [];
                    destinations[destIndex].duration = duration;
                    destinations[destIndex].shortDesc = shortDesc;
                    if (imageUrl) destinations[destIndex].images = [imageUrl];
                    
                    showAlert('Success', 'Destination updated successfully!');
                    renderAdminTables();
                    updateAdminStats();
                    renderChart();
                    navigateToPage('admin');
                }
            } else {
                // Add new destination
                const newDestination = {
                    id: destinations.length + 1,
                    userId: getCurrentUser().id,
                    title: title,
                    location: location,
                    activities: activities ? activities.split(',').map(a => a.trim()) : [],
                    duration: duration,
                    shortDesc: shortDesc,
                    images: imageUrl ? [imageUrl] : ['./images/default-destination.png']
                };
                
                destinations.push(newDestination);
                showAlert('Success', 'Destination added successfully!');
                renderAdminTables();
                updateAdminStats();
                renderChart();
                renderDestinations();
                navigateToPage('admin');
            }
        }
        
        // Tour form submission
        if (e.target.id === 'post-tour-form') {
            e.preventDefault();
            
            // Check if user is admin
            if (!getCurrentUser() || getCurrentUser().role !== 'admin') {
                showAlert('Access Denied', 'Only administrators can add or edit tours.');
                return;
            }
            
            const tourId = document.getElementById('post-tour-id').value;
            const name = document.getElementById('post-tour-name').value.trim();
            const type = document.getElementById('post-tour-type').value;
            const price = parseInt(document.getElementById('post-tour-price').value);
            const groupSize = document.getElementById('post-tour-group-size').value;
            const image = document.getElementById('post-tour-image').value.trim();
            
            // Validate form
            if (!name || !type || !price || !groupSize || !image) {
                showAlert('Validation Error', 'All fields are required.');
                return;
            }
            
            if (tourId) {
                // Update existing tour
                const tourIndex = tours.findIndex(t => t.id === parseInt(tourId));
                if (tourIndex > -1) {
                    tours[tourIndex].name = name;
                    tours[tourIndex].type = type;
                    tours[tourIndex].price = price;
                    tours[tourIndex].groupSize = groupSize;
                    tours[tourIndex].image = image;
                    
                    showAlert('Success', 'Tour updated successfully!');
                    renderAdminTables();
                    updateAdminStats();
                    renderTours();
                    navigateToPage('admin');
                }
            } else {
                // Add new tour
                const newTour = {
                    id: tours.length + 1,
                    name: name,
                    type: type,
                    price: price,
                    groupSize: groupSize,
                    image: image,
                    description: `Experience ${name} - ${type.toLowerCase()} tour with amazing ${type.toLowerCase()} activities.`,
                    highlights: ['Professional guides', 'All equipment included', 'Transportation provided', 'Memorable experience'],
                    duration: groupSize === 'small' ? '1 day' : groupSize === 'medium' ? '2 days' : '3 days'
                };
                
                tours.push(newTour);
                showAlert('Success', 'Tour added successfully!');
                renderAdminTables();
                updateAdminStats();
                renderTours();
                navigateToPage('admin');
            }
        }
        
        // Profile edit form submission
        if (e.target.id === 'edit-profile-form') {
            e.preventDefault();
            
            const name = document.getElementById('edit-user-name').value.trim();
            const email = document.getElementById('edit-user-email').value.trim();
            const password = document.getElementById('edit-user-password').value;
            const confirmPassword = document.getElementById('edit-user-confirm-password').value;
            
            // Validate form
            if (!name || !email) {
                showAlert('Validation Error', 'Name and email are required.');
                return;
            }
            
            // Check if email is already taken by another user
            const existingUser = users.find(u => u.email === email && u.id !== getCurrentUser().id);
            if (existingUser) {
                showAlert('Email Taken', 'This email is already used by another user.');
                return;
            }
            
            // Validate password if provided
            if (password) {
                if (password.length < 6) {
                    showAlert('Password Too Short', 'Password must be at least 6 characters long.');
                    return;
                }
                if (password !== confirmPassword) {
                    showAlert('Password Mismatch', 'Passwords do not match.');
                    return;
                }
            }
            
            // Update profile
            updateUserProfile(name, email, password || null);
        }
    });
    
    // Setup event listeners for destination filters
    const setupDestinationFilters = () => {
        // Reset filters to default state first
        const elements = ['province-filter', 'activity-filter', 'duration-filter', 'search-input'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'SELECT') {
                    element.value = 'all';
                } else if (element.tagName === 'INPUT') {
                    element.value = '';
                }
            }
        });
        
        // Setup event listeners
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Remove existing listeners to prevent duplicates
                element.removeEventListener('input', renderDestinations);
                element.removeEventListener('change', renderDestinations);
                // Add both input and change events for better responsiveness
                element.addEventListener('input', () => {
                    renderDestinations(false); // Always reset pagination on filter change
                });
                element.addEventListener('change', () => {
                    renderDestinations(false); // Always reset pagination on filter change
                });
            }
        });
        
        const clearBtn = document.getElementById('clear-filters-btn');
        if (clearBtn) {
            clearBtn.removeEventListener('click', clearDestinationFilters);
            clearBtn.addEventListener('click', clearDestinationFilters);
        }
    };
    
    const clearDestinationFilters = () => {
        document.getElementById('province-filter').value = 'all';
        document.getElementById('activity-filter').value = 'all';
        document.getElementById('duration-filter').value = 'all';
        document.getElementById('search-input').value = '';
        renderDestinations();
    };
    
    // Setup event listeners for tour filters
    const setupTourFilters = () => {
        // Reset filters to default state first
        const elements = ['tour-type-filter', 'tour-price-filter', 'group-size-filter', 'tour-search-input'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'SELECT') {
                    element.value = 'all';
                } else if (element.tagName === 'INPUT') {
                    element.value = '';
                }
            }
        });
        
        // Setup event listeners
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Remove existing listeners to prevent duplicates
                element.removeEventListener('input', renderTours);
                element.removeEventListener('change', renderTours);
                // Add both input and change events for better responsiveness
                element.addEventListener('input', () => {
                    renderTours(false); // Always reset pagination on filter change
                });
                element.addEventListener('change', () => {
                    renderTours(false); // Always reset pagination on filter change
                });
            }
        });
    };

    init();
    setupImagePreview();
});
