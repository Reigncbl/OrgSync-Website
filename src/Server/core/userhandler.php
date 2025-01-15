<?php

class UserHandler {

    // Database connection and table name
    private $conn;
    private $table = 'users';

    // User properties
    public $student_id;
    public $firstname;
    public $lastname;
    public $email;
    public $password;
    public $account_type;


    public function __construct($db) {
        $this->conn = $db;
    }

 // Retrieve users from the database
    public function read() {
        $query = 'SELECT 
            student_id,
            firstname,
            lastname,
            password,
            email,
            account_type
        FROM ' . $this->table . ' 
        ORDER BY student_id ASC';

     
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function read_single(){
        $query = 'SELECT 
        student_id,
        firstname,
        lastname,
        email,
        password,
        account_type
    FROM ' . $this->table . ' 
        WHERE student_id = ? LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->student_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this ->firstname =$row['firstname'];
        $this ->lastname =$row['lastname'];
        $this ->email =$row['email'];
        $this ->password =$row['password'];
        $this ->account_type = $row['account_type'];

    }
    
    public function create()
    {
        $query = 'INSERT INTO ' . $this->table . ' 
                  (student_id, firstname, lastname, email, password, account_type) 
                  VALUES (:student_id, :firstname, :lastname, :email, :password, :account_type)';
    
        $stmt = $this->conn->prepare($query);
    
        if (!$stmt) {
            echo "Error preparing statement: " . $this->conn->errorInfo()[2];
            return false;
        }
    
        $this->student_id = htmlspecialchars(strip_tags($this->student_id ?? ''));
        $this->firstname = htmlspecialchars(strip_tags($this->firstname ?? ''));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname ?? ''));
        $this->email = htmlspecialchars(strip_tags($this->email ?? ''));
        $this->password = htmlspecialchars($this->password ?? ''); 
        $this->account_type = htmlspecialchars(strip_tags($this->account_type ?? ''));
    
        $stmt->bindParam(':student_id', $this->student_id);
        $stmt->bindParam(':firstname', $this->firstname);
        $stmt->bindParam(':lastname', $this->lastname);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':account_type', $this->account_type);
    
        if ($stmt->execute()) {
            return true;
        }
    
        $errorInfo = $stmt->errorInfo();
        echo "Error: " . $errorInfo[2];
        return false;
    }
    

    public function login($email, $password) {
        $query = "SELECT student_id,
        firstname,
        lastname,
        email,
        password,
        account_type
                  FROM users 
                  WHERE email = :email AND password = :password";
    
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password); 
        $stmt->execute();
    
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    
        return false;
    }
    
}