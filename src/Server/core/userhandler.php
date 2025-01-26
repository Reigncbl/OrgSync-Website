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
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

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
            LEFT JOIN user_organizations so 
            ON s.student_id = so.student_id
        WHERE s.email = :email";
    
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
    
        // Debug: Log the raw database results
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        error_log("Raw database results: " . json_encode($rows));
    
        if (count($rows) > 0) {
            $userData = $rows[0];
            $hashed_password = $userData['password'];
            unset($userData['password']);
    
            // Collect all org_ids
            $userData['org_ids'] = array();
            foreach ($rows as $row) {
                if (!is_null($row['org_id'])) {
                    $userData['org_ids'][] = $row['org_id'];
                }
            }
    
            // Debug: Log the aggregated org_ids
            error_log("Aggregated org_ids: " . json_encode($userData['org_ids']));
    
            if (password_verify($password, $hashed_password)) {
                return $userData;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}