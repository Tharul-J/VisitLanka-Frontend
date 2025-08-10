
# Visit Lanka - Explore the Pearl of the Indian Ocean


## 📋 Table of Contents
- [Features](#-features)
- [Current Setup (Frontend)](#-current-setup-frontend)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Backend Development Plan](#-backend-development-plan)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Hero Slideshow** - Stunning image carousel with Sri Lankan destinations
- **Destinations Browser** - Browse and filter destinations by province, activity, and duration
- **Tours Catalog** - View available tour packages with pricing and details
- **Image Gallery** - Interactive gallery with lightbox view
- **User Authentication** - Login/Register system with role-based access
- **Admin Panel** - Complete admin dashboard for content management
- **Booking System** - Tour booking with confirmation
- **Wishlist** - Save favorite destinations
- **Contact Form** - Get in touch functionality

### 👥 User Roles
- **Admin** (`admin@visitlanka.com` / `password`)
  - Manage destinations and tours
  - View all bookings
  - Manage gallery images
  - User management
  - Dashboard analytics

- **Regular User** (`user@visitlanka.com` / `password`)
  - Browse destinations and tours
  - Make bookings
  - Manage wishlist
  - Update profile

## 🛠 Current Setup (Frontend)

The project is currently a **frontend-only** implementation using vanilla JavaScript, HTML5, and CSS3.

### 📁 File Structure
```
Visit Lanka/
├── index.html          # Main HTML file
├── main.css           # Stylesheet
├── app.js            # Main application logic
├── auth.js           # Authentication functions
├── data.js           # Sample data and global variables
├── modals.js         # Modal functionality
├── slideshow.js      # Hero slideshow logic
├── images/           # Image assets (23 images)
│   ├── logo.png
│   ├── 1.png to 23.png
└── README.md         # This file
```

## 💻 Technology Stack

### Frontend (Current)
- **HTML5** - Semantic markup
- **CSS3** - Styling with Flexbox/Grid
- **Vanilla JavaScript** - ES6+ features
- **Tailwind CSS** - Utility-first CSS framework (CDN)
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter)

### Backend (Planned)
- **PHP 8.0+** - Server-side scripting
- **MySQL 8.0+** - Database
- **Apache/Nginx** - Web server
- **Composer** - PHP dependency management

## 🚀 Installation & Setup

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional for file:// protocol issues)

### Quick Start
1. **Download/Clone** the project files
2. **Open in browser** - Double-click `index.html` OR
3. **Local server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # PHP
   php -S localhost:8000
   
   # Node.js (with live-server)
   npx live-server
   ```
4. **Access** at `http://localhost:8000`

### Test Accounts
- **Admin**: `admin@visitlanka.com` / `password`
- **User**: `user@visitlanka.com` / `password`

## 📂 Project Structure

### Current Frontend Structure
```
Visit Lanka/
├── index.html                 # Main application file
├── main.css                  # Styles and responsive design
├── JavaScript Files/
│   ├── data.js              # Data arrays and global variables
│   ├── auth.js              # Login/logout functions
│   ├── modals.js            # Alert/confirm dialogs
│   ├── slideshow.js         # Hero image carousel
│   └── app.js               # Main app logic and event handlers
└── images/                   # Static assets
    ├── logo.png             # Site logo
    └── 1.png - 23.png       # Destination/tour images
```

### Planned Backend Structure
```
Visit Lanka/
├── frontend/                 # Current files
├── backend/                  # PHP backend
│   ├── config/
│   │   ├── database.php     # DB connection
│   │   └── config.php       # App settings
│   ├── api/                 # REST API endpoints
│   │   ├── auth/           # Authentication
│   │   ├── destinations/   # Destinations CRUD
│   │   ├── tours/          # Tours CRUD
│   │   ├── bookings/       # Booking management
│   │   ├── gallery/        # Gallery management
│   │   └── users/          # User management
│   ├── classes/            # PHP Classes
│   │   ├── Database.php
│   │   ├── User.php
│   │   ├── Destination.php
│   │   ├── Tour.php
│   │   └── Booking.php
│   ├── includes/           # Utility files
│   └── uploads/            # File uploads
└── database/
    └── visit_lanka.sql     # Database schema
```

## 🗄️ Database Schema

### Tables Overview
1. **users** - User accounts and authentication
2. **destinations** - Tourist destinations
3. **activities** - Activity types (hiking, cultural, etc.)
4. **destination_activities** - Many-to-many relationship
5. **destination_images** - Multiple images per destination
6. **tours** - Tour packages
7. **tour_highlights** - Tour feature points
8. **bookings** - Customer bookings
9. **wishlists** - User saved destinations
10. **gallery** - Site gallery images
11. **contact_messages** - Contact form submissions

### Key Relationships
- Users → Destinations (One-to-Many)
- Users → Bookings (One-to-Many)
- Users → Wishlists (One-to-Many)
- Destinations ↔ Activities (Many-to-Many)
- Tours → Bookings (One-to-Many)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login.php` - User login
- `POST /api/auth/register.php` - User registration
- `POST /api/auth/logout.php` - User logout

### Destinations
- `GET /api/destinations/get_all.php` - List destinations (with filters)
- `GET /api/destinations/get_by_id.php` - Single destination
- `POST /api/destinations/create.php` - Create destination (admin)
- `PUT /api/destinations/update.php` - Update destination (admin)
- `DELETE /api/destinations/delete.php` - Delete destination (admin)

### Tours
- `GET /api/tours/get_all.php` - List tours (with filters)
- `GET /api/tours/get_by_id.php` - Single tour
- `POST /api/tours/create.php` - Create tour (admin)
- `PUT /api/tours/update.php` - Update tour (admin)
- `DELETE /api/tours/delete.php` - Delete tour (admin)

### Bookings
- `POST /api/bookings/create.php` - Make booking
- `GET /api/bookings/user_bookings.php` - User's bookings
- `GET /api/bookings/all.php` - All bookings (admin)
- `PUT /api/bookings/update_status.php` - Update booking status

## 🎨 Design Features

### UI/UX Highlights
- **Clean Modern Design** - Minimalist and professional
- **Green Color Scheme** - Representing nature and tourism
- **Mobile-First** - Responsive design for all devices
- **Smooth Animations** - CSS transitions and hover effects
- **Accessible** - ARIA labels and semantic HTML
- **Fast Loading** - Optimized images and efficient code

### Interactive Elements
- **Hero Slideshow** - Auto-playing with manual controls
- **Filter System** - Real-time destination/tour filtering
- **Modal System** - Custom alerts and confirmations
- **Image Lightbox** - Gallery image expansion
- **Form Validation** - Client-side validation with feedback
- **Pagination** - Load more functionality

## 🔧 Development

### Prerequisites for Backend Development
- PHP 8.0+
- MySQL 8.0+
- Composer
- Apache/Nginx

### Development Workflow
1. Set up local PHP/MySQL environment
2. Create database using provided schema
3. Implement PHP classes and API endpoints
4. Update frontend to consume APIs
5. Add file upload functionality
6. Implement email notifications
7. Add advanced features (caching, optimization)


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

----

© Tharul-J
