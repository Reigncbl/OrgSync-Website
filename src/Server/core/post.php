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
        $this ->accounttype = $row['account_type'];

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
         $this->accounttype = htmlspecialchars(strip_tags($this->accounttype));

         $stmt->bindParam(':firstname',$this->firstname);
         $stmt->bindParam(':lastname',$this->lastname);
         $stmt->bindParam(':email',$this->email);
         $stmt->bindParam(':password',$this->password);
         $stmt->bindParam(':orgtype',$this->orgtype);
         $stmt->bindParam(':account_type',$this->accounttype);

         if($stmt->execute()){
            return true;
         };

         echo "Error %s. \n", $stmt->error;
         return false;
    }
}