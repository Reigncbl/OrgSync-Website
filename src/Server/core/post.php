<?php

class Post {

    // Database connection and table name
    private $conn;
    private $table = 'users';

    // User properties
    public $idusers;
    public $firstname;
    public $lastname;
    public $email;
    public $password;
    public $orgtype;
    public $accounttype;

    // Constructor with database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Retrieve users from the database
    public function read() {
        $query = 'SELECT 
            idusers,
            firstname,
            lastname,
            email,
            orgtype,
            accounttype
        FROM ' . $this->table . ' 
        ORDER BY idusers ASC';

        // Prepare and execute the statement
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
