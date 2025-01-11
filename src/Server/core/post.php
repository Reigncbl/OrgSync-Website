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
            account_type
        FROM ' . $this->table . ' 
        ORDER BY idusers ASC';

     
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function read_single(){
        $query = 'SELECT 
        idusers,
        firstname,
        lastname,
        email,
        orgtype,
        account_type
    FROM ' . $this->table . ' 
        WHERE idusers = ? LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this ->firstname =$row['firstname'];
        $this ->lastname =$row['lastname'];
        $this ->email =$row['email'];
        $this ->orgtype =$row['orgtype'];
        $this ->firstname =$row['firstname'];

    }
}
