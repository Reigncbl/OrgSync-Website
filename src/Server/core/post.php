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
    public $account_type;


    public function __construct($db) {
        $this->conn = $db;
    }

 // Retrieve users from the database
    public function read() {
        $query = 'SELECT 
            idusers,
            firstname,
            lastname,
            password,
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
        password,
        orgtype,
        account_type
    FROM ' . $this->table . ' 
        WHERE idusers = ? LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idusers);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this ->firstname =$row['firstname'];
        $this ->lastname =$row['lastname'];
        $this ->email =$row['email'];
        $this ->password =$row['password'];
        $this ->orgtype =$row['orgtype'];
        $this ->account_type = $row['account_type'];

    }
    
    public function create(){

        $query = ' INSERT INTO'. $this->table.'SET firstname = : firstname, lastname = :lastname,
         email = :email, password = :password, orgtype = :orgtype, account_type = :account_type';

         $stmt = $this ->conn->prepare($query);

         $this->firstname = htmlspecialchars(strip_tags($this->firstname));
         $this->lastname = htmlspecialchars(strip_tags($this->lastname));
         $this->email = htmlspecialchars(strip_tags($this->email));
         $this->password = htmlspecialchars(strip_tags($this->password));
         $this->orgtype = htmlspecialchars(strip_tags($this->orgtype));
         $this->account_type = htmlspecialchars(strip_tags($this->account_type));

         $stmt->bindParam(':firstname',$this->firstname);
         $stmt->bindParam(':lastname',$this->lastname);
         $stmt->bindParam(':email',$this->email);
         $stmt->bindParam(':password',$this->password);
         $stmt->bindParam(':orgtype',$this->orgtype);
         $stmt->bindParam(':account_type',$this->account_type);

         if($stmt->execute()){
            return true;
         };

         echo "Error %s. \n", $stmt->error;
         return false;
    }

    public function login($email, $password) {
        $query = "SELECT idusers, firstname, lastname, account_type 
                  FROM users 
                  WHERE email = :email AND password = :password";
    
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password); // Use hashed passwords in production
        $stmt->execute();
    
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    
        return false;
    }
    
}