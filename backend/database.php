<?php
/**
 * Database Connection
 * Visit Lanka Tourism System - Booking Module
 */

class Database {
    private $host = "localhost";
    private $db_name = "visit_lanka";
    private $username = "root";
    private $password = "";
    public $pdo;

    public function getConnection() {
        $this->pdo = null;

        try {
            $this->pdo = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->pdo->exec("set names utf8");
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            throw new Exception("Database connection failed: " . $exception->getMessage());
        }

        return $this->pdo;
    }
}

// Simple function for direct usage
function getDatabaseConnection() {
    $database = new Database();
    return $database->getConnection();
}
?>
