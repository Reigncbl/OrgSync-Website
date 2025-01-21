<?php
class EventHandler {
    private $db;
    public $event_title;
    public $event_des;
    public $date_started;
    public $date_ended;
    public $platform;
    public $platform_link;
    public $location;
    public $eventvisibility;
    public $banner;
    public $date;

    // Constructor receives the database connection
    public function __construct($db) {
        $this->db = $db;
    }

    // Method to create an event
    public function createEvent() {
        // Prepare SQL query to insert event data
        $query = "INSERT INTO event_handler (event_title, event_des, date, date_started, date_ended, platform, platform_link, location, eventvisibility, banner)
                  VALUES (:event_title, :event_des, :date, :date_started, :date_ended, :platform, :platform_link, :location, :eventvisibility, :banner)";
        
        // Prepare the statement
        $stmt = $this->db->prepare($query);
    
        // Bind parameters
        $stmt->bindParam(':event_title', $this->event_title);
        $stmt->bindParam(':event_des', $this->event_des);
        $stmt->bindParam(':date', $this->date); // Binding the date parameter
        $stmt->bindParam(':date_started', $this->date_started);
        $stmt->bindParam(':date_ended', $this->date_ended);
        $stmt->bindParam(':platform', $this->platform);
        $stmt->bindParam(':platform_link', $this->platform_link);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':eventvisibility', $this->eventvisibility);
        $stmt->bindParam(':banner', $this->banner);
    
        // Execute the query and check for success
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

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
    
}
?>
