const initHeroSlideshow = () => {
    const slideshowContainer = document.getElementById('hero-slideshow');
    const dotsContainer = document.getElementById('sliderDots');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    
    if (!slideshowContainer) return;
    
    const images = [
        {
            url: 'https://www.distinctdestinations.in/DistinctDestinationsBackEndImg/BlogImage/kandy-perahera-a-many-splendoured-spectacle-L-distinctdestinations.jpg',
            title: 'Kandy Perahera Festival'
        },
        {
            url: 'https://whenonearth.net/wp-content/uploads/Sigiriya-Rock-Sri-Lanka.jpg',
            title: 'Sigiriya Rock Fortress'
        },
        {
            url: 'https://t4.ftcdn.net/jpg/00/44/24/23/360_F_44242356_PNJyjOEQiHHy0Yro4OLnIhEZiEG1fBwv.jpg',
            title: 'Tea Plantations'
        },
        {
            url: 'https://www.andbeyond.com/wp-content/uploads/sites/5/colombo-sri-lanka.jpg',
            title: 'Colombo City'
        }
    ];

    let currentSlide = 0;
    let slideInterval;

    // Create slides
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.style.backgroundImage = `url('${img.url}')`;
        slide.setAttribute('aria-label', img.title);
        if (index === 0) slide.classList.add('active');
        slideshowContainer.appendChild(slide);
    });

    // Create navigation dots
    if (dotsContainer) {
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    const goToSlide = (slideIndex) => {
        const slides = slideshowContainer.children;
        const dots = dotsContainer?.children || [];

        // Remove active class from current slide and dot
        slides[currentSlide]?.classList.remove('active');
        dots[currentSlide]?.classList.remove('active');

        // Update current slide index
        currentSlide = slideIndex;

        // Add active class to new slide and dot
        slides[currentSlide]?.classList.add('active');
        dots[currentSlide]?.classList.add('active');

        // Reset auto-play timer
        resetAutoPlay();
    };

    const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % images.length;
        goToSlide(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentSlide - 1 + images.length) % images.length;
        goToSlide(prevIndex);
    };

    const startAutoPlay = () => {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };

    const stopAutoPlay = () => {
        clearInterval(slideInterval);
    };

    const resetAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
    };

    // Event listeners for navigation
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Pause auto-play on hover
    slideshowContainer.addEventListener('mouseenter', stopAutoPlay);
    slideshowContainer.addEventListener('mouseleave', startAutoPlay);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slideshowContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slideshowContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    };

    // Start auto-play
    startAutoPlay();
};
