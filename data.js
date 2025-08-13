// --- DATA (Simulated Database) ---
// This data would eventually be replaced by a backend API call.
const users = [
    { id: 1, name: 'Admin User', email: 'admin@visitlanka.com', password: 'password', role: 'admin', phone: '+94-77-123-4567' },
    { id: 2, name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user', phone: '+94-77-987-6543' },
    { id: 3, name: 'Regular User', email: 'user@visitlanka.com', password: 'password', role: 'user', phone: '+94-77-555-0123' }
];

let destinations = [
    { id: 1, userId: 1, title: 'Sigiriya Rock Fortress', location: 'Central', activities: ['Cultural & Historical', 'Adventure Sports'], duration: '1-3 Days', shortDesc: 'Ancient rock fortress with frescoes and panoramic views.', images: ['./images/1.png'] },
    { id: 2, userId: 1, title: 'Yala National Park', location: 'Southern', activities: ['Nature & Wildlife', 'Adventure Sports'], duration: '1-3 Days', shortDesc: 'Famous for wildlife, especially leopards and elephants.', images: ['./images/2.png'] },
    { id: 3, userId: 1, title: 'Ella', location: 'Uva', activities: ['Nature & Wildlife', 'Adventure Sports'], duration: '4-7 Days', shortDesc: 'Charming town in the highlands with stunning mountain views.', images: ['./images/3.png'] },
    { id: 4, userId: 1, title: 'Galle Fort', location: 'Southern', activities: ['Cultural & Historical'], duration: '1-3 Days', shortDesc: 'A UNESCO World Heritage site with Dutch colonial buildings.', images: ['./images/4.png'] },
    { id: 5, userId: 1, title: 'Temple of the Tooth', location: 'Central', activities: ['Cultural & Historical'], duration: '1-3 Days', shortDesc: 'A sacred Buddhist temple in the city of Kandy.', images: ['./images/5.png'] },
    { id: 6, userId: 1, title: 'Mirissa Beach', location: 'Southern', activities: ['Relaxation & Wellness', 'Adventure Sports'], duration: '4-7 Days', shortDesc: 'Famous for whale and dolphin watching.', images: ['./images/6.png'] },
    // Additional destinations to demonstrate load more functionality
    { id: 7, userId: 1, title: 'Nuwara Eliya', location: 'Central', activities: ['Nature & Wildlife'], duration: '4-7 Days', shortDesc: 'Hill station known as Little England with tea plantations.', images: ['./images/7.png'] },
    { id: 8, userId: 1, title: 'Polonnaruwa', location: 'North Central', activities: ['Cultural & Historical'], duration: '1-3 Days', shortDesc: 'Ancient capital with well-preserved ruins and monuments.', images: ['./images/8.png'] },
    { id: 9, userId: 1, title: 'Arugam Bay', location: 'Eastern', activities: ['Adventure Sports'], duration: '4-7 Days', shortDesc: 'World-renowned surfing destination with pristine beaches.', images: ['./images/9.png'] },
    { id: 10, userId: 1, title: 'Anuradhapura', location: 'North Central', activities: ['Cultural & Historical'], duration: '1-3 Days', shortDesc: 'Ancient sacred city with Buddhist temples and dagobas.', images: ['./images/10.png'] },
    { id: 11, userId: 1, title: 'Horton Plains', location: 'Central', activities: ['Nature & Wildlife', 'Adventure Sports'], duration: '1-3 Days', shortDesc: 'National park famous for Worlds End cliff and Bakers Falls.', images: ['./images/11.png'] },
    { id: 12, userId: 1, title: 'Trincomalee', location: 'Eastern', activities: ['Nature & Wildlife', 'Adventure Sports'], duration: '4-7 Days', shortDesc: 'Historic port city with beautiful beaches and hot springs.', images: ['./images/12.png'] },
];

let tours = [
    // Tours are now loaded from the database via API
    // Static data has been migrated to the database
];

let bookings = [];
let wishlists = [];
let galleryImages = [
    { id: 1, title: 'Sigiriya Rock Fortress', description: 'Ancient rock fortress with stunning views', url: './images/1.png', category: 'Cultural' },
    { id: 2, title: 'Yala National Park', description: 'Wildlife safari destination', url: './images/2.png', category: 'Wildlife' },
    { id: 3, title: 'Ella Hills', description: 'Beautiful hill country landscape', url: './images/3.png', category: 'Nature' },
    { id: 4, title: 'Galle Fort', description: 'Historic Dutch colonial fort', url: './images/4.png', category: 'Cultural' },
    { id: 5, title: 'Temple of the Tooth', description: 'Sacred Buddhist temple', url: './images/5.png', category: 'Cultural' },
    { id: 6, title: 'Mirissa Beach', description: 'Pristine southern beach', url: './images/6.png', category: 'Beach' },
    { id: 7, title: 'Nuwara Eliya', description: 'Tea country hills', url: './images/7.png', category: 'Nature' },
    { id: 8, title: 'Polonnaruwa', description: 'Ancient capital ruins', url: './images/8.png', category: 'Cultural' },
    { id: 9, title: 'Arugam Bay', description: 'Surfing paradise', url: './images/9.png', category: 'Beach' },
    { id: 10, title: 'Anuradhapura', description: 'Sacred ancient city', url: './images/10.png', category: 'Cultural' },
    { id: 11, title: 'Horton Plains', description: 'National park with Worlds End', url: './images/11.png', category: 'Nature' },
    { id: 12, title: 'Trincomalee', description: 'Eastern coast beaches', url: './images/12.png', category: 'Beach' }
];

// Global state variables
let destinationsPerPage = 6;
let toursPerPage = 6;
let currentDestinationsPage = 1;
let currentToursPage = 1;