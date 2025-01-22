<?php
class EventHandler {
    private $db;
    private $table = 'event_handler';

    public $event_id;
    public $event_title;
    public $event_des;
    public $date;
    public $date_started;
    public $date_ended;
    public $platform;
    public $platform_link;
    public $location;
    public $eventvisibility;
    public $banner;

    // Constructor receives the database connection
    public function __construct($db) {
        $this->db = $db;
    }

    // Method to create an event
    public function createEvent() {
        // Prepare SQL query to insert event data
        $query = "INSERT INTO " . $this->table . " 
                  (event_title, event_des, date, date_started, date_ended, platform, platform_link, location, eventvisibility, banner)
                  VALUES (:event_title, :event_des, :date, :date_started, :date_ended, :platform, :platform_link, :location, :eventvisibility, :banner)";
        
        // Prepare the statement
        $stmt = $this->db->prepare($query);

        // Bind parameters
        $stmt->bindParam(':event_title', $this->event_title);
        $stmt->bindParam(':event_des', $this->event_des);
        $stmt->bindParam(':date', $this->date);
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
    try {
        // Create query to fetch event data
        $query = 'SELECT 
            eventid,
            event_des,
            event_title,
            banner,
            date,
            date_started,
            date_ended,
            eventvisibility,
            platform,
            platform_link,
            location
        FROM ' . $this->table;
    
        $stmt = $this->db->prepare($query);
        $stmt->execute();
    
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Process each row
        foreach ($results as &$row) {
            if (!empty($row['banner'])) {
                // Ensure the banner is binary and base64 encode it
                $row['banner'] = base64_encode($row['banner']);
            }
        }

        return $results;

    } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        return null;
    }
}

}
?>
