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

    public function read($org_id = null) {
        try {
            // Base query
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
                location,
                org_id
            FROM ' . $this->table;
    
            // Add organization filter if provided
            if ($org_id !== null) {
                $query .= ' WHERE org_id = :org_id';
            }
    
            $stmt = $this->db->prepare($query);
            
            // Bind organization ID if provided
            if ($org_id !== null) {
                $stmt->bindParam(':org_id', $org_id, PDO::PARAM_INT);
            }
    
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Process banner images
            foreach ($results as &$row) {
                if (!empty($row['banner'])) {
                    $row['banner'] = base64_encode($row['banner']);
                }
                // Ensure org_id is properly typed
                $row['org_id'] = $row['org_id'] !== null ? (int)$row['org_id'] : null;
            }
    
            return $results;
    
        } catch (PDOException $e) {
            error_log('Database error in EventHandler::read(): ' . $e->getMessage());
            return null;
        }
    }
}
?>
