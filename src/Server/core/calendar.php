<?php
class Calendar {

    // Database connection and table name
    private $conn;
    private $table = 'calendar_events';

    // Organization properties
    public $calendar_id;
    public $student_id;
    public $event_id;
    public $org_id;
    public $is_attending;
    public $added_at;
    public $visibility_status;
    


    public function __construct($db) {
        $this->conn = $db;
    }

    // Retrieve organizations from the database
    public function read() {
        $query = 'SELECT 
            c.calendar_id, 
            c.student_id, 
            c.event_id, 
            c.org_id, 
            c.is_attending, 
            c.added_at, 
            e.event_des,
            e.event_title,
            e.banner,
            e.date,
            e.date_started,
            e.date_ended,
            e.eventvisibility,
            e.platform,
            e.platform_link,
            e.location
        FROM ' . $this->table . ' c
        INNER JOIN event_handler e ON c.event_id = e.eventid
        ORDER BY c.calendar_id ASC';

        

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
?>
