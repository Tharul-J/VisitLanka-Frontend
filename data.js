// --- DATA (Simulated Database) ---
// This data would eventually be replaced by a backend API call.
const users = [
    { id: 1, name: 'Admin User', email: 'admin@visitlanka.com', password: 'password', role: 'admin' },
    { id: 2, name: 'Regular User', email: 'user@visitlanka.com', password: 'password', role: 'user' }
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
    { 
        id: 1, 
        name: 'Highland Adventure', 
        type: 'Adventure', 
        price: 1200, 
        groupSize: 'small', 
        image: './images/13.png',
        description: 'Embark on an unforgettable highland adventure through the misty mountains of Sri Lanka. Experience breathtaking views, ancient temples, and traditional village life.',
        highlights: ['Ella Rock hiking', 'Nine Arches Bridge', 'Tea plantation visit', 'Little Adams Peak'],
        duration: '3 days'
    },
    { 
        id: 2, 
        name: 'Ancient Kingdoms', 
        type: 'Cultural', 
        price: 800, 
        groupSize: 'medium', 
        image: './images/14.png',
        description: 'Journey through Sri Lanka\'s rich cultural heritage visiting ancient kingdoms, UNESCO World Heritage sites, and sacred temples.',
        highlights: ['Sigiriya Rock Fortress', 'Dambulla Cave Temple', 'Polonnaruwa ruins', 'Temple of the Tooth'],
        duration: '4 days'
    },
    { 
        id: 3, 
        name: 'Leopard Safari', 
        type: 'Wildlife', 
        price: 600, 
        groupSize: 'small', 
        image: './images/15.png',
        description: 'Experience the thrill of wildlife photography and animal spotting in Yala National Park, home to the highest density of leopards in the world.',
        highlights: ['Yala National Park safari', 'Leopard spotting', 'Elephant encounters', 'Bird watching'],
        duration: '2 days'
    },
    { 
        id: 4, 
        name: 'Southern Coast Explorer', 
        type: 'Beach', 
        price: 1800, 
        groupSize: 'large', 
        image: './images/16.png',
        description: 'Discover the pristine beaches of southern Sri Lanka, enjoy whale watching, and explore the historic Galle Fort.',
        highlights: ['Whale watching in Mirissa', 'Galle Fort exploration', 'Beach relaxation', 'Stilt fishing in Koggala'],
        duration: '5 days'
    },
    // Additional tours to demonstrate load more functionality
    { 
        id: 5, 
        name: 'Tea Country Express', 
        type: 'Cultural', 
        price: 950, 
        groupSize: 'medium', 
        image: './images/17.png',
        description: 'Journey through the emerald hills of Sri Lanka\'s tea country, visiting plantations and experiencing local culture.',
        highlights: ['Tea factory tours', 'Scenic train rides', 'Mountain hiking', 'Local village visits'],
        duration: '3 days'
    },
    { 
        id: 6, 
        name: 'Surf & Sand Adventure', 
        type: 'Adventure', 
        price: 750, 
        groupSize: 'small', 
        image: './images/18.png',
        description: 'Perfect your surfing skills on the legendary waves of Arugam Bay while enjoying the laid-back beach lifestyle.',
        highlights: ['Surfing lessons', 'Beach camping', 'Local seafood', 'Sunset photography'],
        duration: '4 days'
    },
    { 
        id: 7, 
        name: 'Sacred Cities Pilgrimage', 
        type: 'Cultural', 
        price: 680, 
        groupSize: 'large', 
        image: './images/19.png',
        description: 'Explore the sacred cities of Anuradhapura and Polonnaruwa, discovering ancient Buddhist heritage and architecture.',
        highlights: ['Ancient dagobas', 'Buddhist temples', 'Archaeological sites', 'Meditation sessions'],
        duration: '3 days'
    },
    { 
        id: 8, 
        name: 'Eastern Beaches Getaway', 
        type: 'Beach', 
        price: 1100, 
        groupSize: 'medium', 
        image: './images/20.png',
        description: 'Discover the untouched beauty of Sri Lanka\'s eastern coastline with pristine beaches and crystal-clear waters.',
        highlights: ['Trincomalee beaches', 'Snorkeling', 'Hot springs visit', 'Dolphin watching'],
        duration: '4 days'
    },
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
