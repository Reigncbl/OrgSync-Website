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
    //retrieve the number of users from the database
 

    public function read_single() {
        $query = 'SELECT 
            student_id,
            firstname,
            lastname,
            email,
            account_type
        FROM ' . $this->table . ' 
        WHERE student_id = ? LIMIT 1';
    
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->student_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        $this->firstname = $row['firstname'];
        $this->lastname = $row['lastname'];
        $this->email = $row['email'];
        $this->account_type = $row['account_type'];
    }
    
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (student_id, firstname, lastname, email, password, account_type) 
                  VALUES (?, ?, ?, ?, ?, ?)";
                  
        $stmt = $this->conn->prepare($query);
        error_log("Raw password before hashing: " . $this->password);

        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

        error_log("Hashed password: " . $this->password);
        return $stmt->execute([
            $this->student_id,
            $this->firstname,
            $this->lastname,
            $this->email,
            $this->password,
            $this->account_type
        ]);
        
    }
    
    public function login($email, $password) {
        $query = "SELECT 
        s.student_id, 
        s.firstname, 
        s.lastname, 
        s.email,
        s.password,
        s.account_type, 
        so.org_id
    FROM 
        users s 
        INNER JOIN user_organizations so 
        ON s.student_id = so.student_id
    WHERE s.email = :email";
    
        // Debug: Log the query
        error_log("Executing query: $query");
    
        $stmt = $this->conn->prepare($query);
    
        // Bind parameters
        $stmt->bindParam(':email', $email);
    
        // Execute the query
        $stmt->execute();
    
        // Debug: Log the row count
        error_log("Row count after query execution: " . $stmt->rowCount());
    
        // Check if a record exists
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // Debug: Log fetched data (excluding sensitive info like passwords)
            error_log("Fetched user data: " . json_encode([
                'student_id' => $row['student_id'],
                'account_type' => $row['account_type'],
                'org_id' => $row['org_id']
            ]));
    
            $hashed_password = $row['password'];
    
            // Verify the password
            if (password_verify($password, $hashed_password)) {
                unset($row['password']); // Exclude password from results
                return $row; // Return user data
            } else {
                error_log("Password verification failed for email: $email");
            }
        } else {
            error_log("No user found with email: $email");
        }
    
        return false; // Return false on failure
    }
    
    
    
}