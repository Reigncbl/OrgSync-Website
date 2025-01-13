<?php

class Organization {

    // Database connection and table name
    private $conn;
    private $table = 'organizations';

    // Organization properties
    public $id;
    public $title;
    public $logo;
    public $description;
    public $email;
    public $facebook;
    public $instagram;
    public $linkedin;
    public $website;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Retrieve organizations from the database
    public function read() {
        $query = 'SELECT 
            id, title, logo, description, email, facebook, instagram, linkedin, website
        FROM ' . $this->table . ' 
        ORDER BY id ASC';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
?>
