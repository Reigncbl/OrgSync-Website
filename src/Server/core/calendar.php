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

   
    
        public function add($data) {
            // Capture and validate session values
            $student_id = (string)$_SESSION['student_id'];
            $org_id = (int)$_SESSION['org_id'];
    
            // Debug session values
            debug('Binding session values in Calendar::add', 'DEBUG', [
                'student_id' => $student_id,
                'org_id' => $org_id
            ]);
    
            $query = 'INSERT INTO ' . $this->table . ' 
                      (student_id, event_id, org_id, is_attending, added_at, visibility_status) 
                      VALUES 
                      (:student_id, :event_id, :org_id, :is_attending, :added_at, :visibility_status)';
    
            $stmt = $this->conn->prepare($query);
    
            // Bind parameters with explicit types
            $stmt->bindParam(':student_id', $student_id, PDO::PARAM_STR);
            $stmt->bindParam(':event_id', $data['event_id'], PDO::PARAM_INT);
            $stmt->bindParam(':org_id', $org_id, PDO::PARAM_INT);
            $stmt->bindParam(':is_attending', $data['is_attending'], PDO::PARAM_BOOL);
            $stmt->bindParam(':added_at', $data['added_at'], PDO::PARAM_STR);
            $stmt->bindParam(':visibility_status', $data['visibility_status'], PDO::PARAM_STR);
    
            $result = $stmt->execute();
    
            // Debug insertion result
            debug('Insert operation result', 'DEBUG', [
                'success' => $result,
                'rowCount' => $stmt->rowCount(),
                'errorInfo' => $stmt->errorInfo()
            ]);
    
            return $result;
        }
    
}
   
?>
