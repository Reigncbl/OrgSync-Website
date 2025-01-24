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
    $query = "SELECT student_id, firstname, lastname, email, password, account_type
              FROM users 
              WHERE email = :email";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $hashed_password = $row['password'];

        // Debug: Log input password and stored hash
        error_log("Input password: " . $password);
        error_log("Stored hash: " . $hashed_password);

        if (password_verify($password, $hashed_password)) {
            unset($row['password']);
            return $row;
        } else {
            error_log("Password verification failed");
        }
    } else {
        error_log("No user found with email: " . $email);
    }

    return false;
}
    
    
}