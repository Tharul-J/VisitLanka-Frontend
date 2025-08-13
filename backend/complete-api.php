<?php
/**
 * Visit Lanka Tours & Bookings API
 * Handles only Tours and Bookings functionalityy
 */
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    require_once 'database.php';
    $pdo = getDatabaseConnection();
    
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    
    // Helper function to send response
    function sendResponse($success, $message, $data = null, $code = 200) {
        http_response_code($code);
        $response = ['success' => $success, 'message' => $message];
        if ($data !== null) {
            $response['data'] = $data;
        }
        echo json_encode($response);
        exit;
    }
    
    // For testing purposes - assume logged in user
    // In production, this would come from your auth system
    function getCurrentUserId() {
        // You can set this manually or get from your auth system
        return $_SESSION['user_id'] ?? 1; // Default to user ID 1 for testing
    }
    
    function isAdmin() {
        // You can set this based on your auth system
        return $_SESSION['user_role'] === 'admin' ?? false;
    }
    
    // ===========================================
    // TOURS ENDPOINTS
    // ===========================================
    
    if ($action === 'tours') {
        if ($method === 'GET') {
            // Get all tours
            $stmt = $pdo->query("SELECT * FROM tours ORDER BY created_at DESC");
            $tours = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(true, "Tours retrieved successfully", ['tours' => $tours]);
            
        } elseif ($method === 'POST') {
            // Create new tour (admin only for production)
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                sendResponse(false, "Invalid JSON data", null, 400);
            }
            
            $required = ['name', 'type', 'price', 'duration', 'description'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    sendResponse(false, "Missing required field: $field", null, 400);
                }
            }
            
            $stmt = $pdo->prepare("
                INSERT INTO tours (name, type, price, group_size, duration, description, highlights, image) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $highlights = $input['highlights'] ?? 'Amazing experience, Professional guide, Great value';
            $image = $input['image'] ?? './images/default-tour.png';
            $group_size = $input['group_size'] ?? 'medium';
            
            $stmt->execute([
                $input['name'],
                $input['type'],
                $input['price'],
                $group_size,
                $input['duration'],
                $input['description'],
                $highlights,
                $image
            ]);
            
            $tourId = $pdo->lastInsertId();
            
            // Get the created tour
            $stmt = $pdo->prepare("SELECT * FROM tours WHERE id = ?");
            $stmt->execute([$tourId]);
            $tour = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse(true, "Tour created successfully", ['tour' => $tour]);
        }
    }
    
    // ===========================================
    // BOOKINGS ENDPOINTS
    // ===========================================
    
    elseif ($action === 'bookings') {
        if ($method === 'GET') {
            // Get bookings for current user
            $userId = getCurrentUserId();
            
            $stmt = $pdo->prepare("
                SELECT b.*, t.name as tour_name, t.price as tour_price 
                FROM bookings b
                JOIN tours t ON b.tour_id = t.id
                WHERE b.user_id = ?
                ORDER BY b.created_at DESC
            ");
            $stmt->execute([$userId]);
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse(true, "Bookings retrieved successfully", ['bookings' => $bookings]);
            
        } elseif ($method === 'POST') {
            // Create new booking
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                sendResponse(false, "Invalid JSON data", null, 400);
            }
            
            $required = ['tour_id', 'booking_date', 'guests'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    sendResponse(false, "Missing required field: $field", null, 400);
                }
            }
            
            $userId = getCurrentUserId();
            
            // Verify tour exists
            $stmt = $pdo->prepare("SELECT * FROM tours WHERE id = ?");
            $stmt->execute([$input['tour_id']]);
            $tour = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$tour) {
                sendResponse(false, "Tour not found", null, 404);
            }
            
            // Calculate total price
            $totalPrice = $tour['price'] * $input['guests'];
            
            $stmt = $pdo->prepare("
                INSERT INTO bookings (user_id, tour_id, booking_date, guests, total_price, customer_phone, special_requests, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            ");
            
            $stmt->execute([
                $userId,
                $input['tour_id'],
                $input['booking_date'],
                $input['guests'],
                $totalPrice,
                $input['customer_phone'] ?? null,
                $input['special_requests'] ?? null
            ]);
            
            $bookingId = $pdo->lastInsertId();
            
            // Get the created booking with tour details
            $stmt = $pdo->prepare("
                SELECT b.*, t.name as tour_name, t.price as tour_price 
                FROM bookings b
                JOIN tours t ON b.tour_id = t.id
                WHERE b.id = ?
            ");
            $stmt->execute([$bookingId]);
            $booking = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse(true, "Booking created successfully with PENDING status", ['booking' => $booking]);
            
        } elseif ($method === 'PUT') {
            // Update booking status (admin only in production)
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || empty($input['booking_id']) || empty($input['status'])) {
                sendResponse(false, "Missing booking_id or status", null, 400);
            }
            
            $validStatuses = ['pending', 'confirmed', 'cancelled'];
            if (!in_array($input['status'], $validStatuses)) {
                sendResponse(false, "Invalid status. Use: " . implode(', ', $validStatuses), null, 400);
            }
            
            $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
            $result = $stmt->execute([$input['status'], $input['booking_id']]);
            
            if ($stmt->rowCount() > 0) {
                sendResponse(true, "Booking status updated to " . strtoupper($input['status']));
            } else {
                sendResponse(false, "Booking not found or no changes made", null, 404);
            }
        }
    }
    
    // ===========================================
    // ADMIN DASHBOARD STATS
    // ===========================================
    
    elseif ($action === 'stats') {
        if ($method === 'GET') {
            // Get dashboard statistics
            $stats = [];
            
            // Total tours
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM tours");
            $stats['total_tours'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Total bookings
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings");
            $stats['total_bookings'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Pending bookings
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
            $stats['pending_bookings'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Confirmed bookings
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'");
            $stats['confirmed_bookings'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Total revenue (confirmed bookings only)
            $stmt = $pdo->query("SELECT SUM(total_price) as revenue FROM bookings WHERE status = 'confirmed'");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['total_revenue'] = $result['revenue'] ? floatval($result['revenue']) : 0;
            
            // Recent bookings
            $stmt = $pdo->query("
                SELECT b.*, t.name as tour_name, u.name as customer_name 
                FROM bookings b
                JOIN tours t ON b.tour_id = t.id
                LEFT JOIN users u ON b.user_id = u.id
                ORDER BY b.created_at DESC
                LIMIT 5
            ");
            $stats['recent_bookings'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse(true, "Statistics retrieved successfully", ['stats' => $stats]);
        }
    }
    
    // ===========================================
    // GET ALL BOOKINGS (ADMIN VIEW)
    // ===========================================
    
    elseif ($action === 'all-bookings') {
        if ($method === 'GET') {
            // Get all bookings for admin dashboard
            $stmt = $pdo->query("
                SELECT b.*, t.name as tour_name, t.price as tour_price, u.name as customer_name, u.email as customer_email
                FROM bookings b
                JOIN tours t ON b.tour_id = t.id
                LEFT JOIN users u ON b.user_id = u.id
                ORDER BY b.created_at DESC
            ");
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse(true, "All bookings retrieved successfully", ['bookings' => $bookings]);
        }
    }
    
    else {
        sendResponse(false, "Invalid action", null, 404);
    }
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    sendResponse(false, "Database error occurred", null, 500);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    sendResponse(false, "An error occurred", null, 500);
}
?>
