<?php
// Replace wildcard (*) with specific origin and allow credentials
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');
session_start();

// Debugging function
function debug($message, $level = 'INFO', $context = []) {
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[{$timestamp}] [{$level}] " . $message;
    
    if (!empty($context)) {
        $log_entry .= " | " . json_encode($context);
    }
    
    error_log($log_entry . "\n", 3, 'calendar_debug.log');
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

try {
    // Debug: Log script start and session info
    debug('Calendar Add API Endpoint Started', 'START', [
        'remote_ip' => $_SERVER['REMOTE_ADDR'],
        'request_method' => $_SERVER['REQUEST_METHOD']
    ]);

    // Verify user is logged in
    if (!isset($_SESSION['student_id']) || !isset($_SESSION['org_id'])) {
        debug('Unauthorized access attempt', 'SECURITY', [
            'student_id' => $_SESSION['student_id'] ?? 'NOT SET',
            'org_id' => $_SESSION['org_id'] ?? 'NOT SET'
        ]);
        http_response_code(401);
        throw new Exception('Unauthorized: User or organization not identified');
    }

    // Log authenticated user details
    debug('User authenticated', 'AUTH', [
        'student_id' => $_SESSION['student_id'],
        'org_id' => $_SESSION['org_id']
    ]);

    require_once(dirname(__FILE__) . '/../core/initialize.php');

    // Get raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Debug: Log incoming data
    debug('Received POST data', 'INFO', [
        'raw_data' => $data
    ]);

    // Validate required fields
    $required_fields = ['event_id', 'is_attending', 'visibility_status'];
    $missing_fields = [];
    foreach ($required_fields as $field) {
        if (!isset($data[$field])) {
            $missing_fields[] = $field;
        }
    }

    if (!empty($missing_fields)) {
        debug('Missing required fields', 'VALIDATION', [
            'missing_fields' => $missing_fields
        ]);
        http_response_code(400);
        throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
    }

    // Prepare data for insertion
    $calendar_data = [
        'event_id' => $data['event_id'],
        'is_attending' => $data['is_attending'],
        'added_at' => date('Y-m-d H:i:s'),
        'visibility_status' => $data['visibility_status']
    ];

    // Debug: Log prepared data
    debug('Prepared calendar data', 'INFO', [
        'calendar_data' => $calendar_data
    ]);

    // Instantiate Calendar class
    $calendar = new Calendar($db);

    // Attempt to add the event
    $result = $calendar->add($calendar_data);

    if ($result) {
        debug('Event added successfully', 'SUCCESS', [
            'event_id' => $data['event_id']
        ]);
        http_response_code(201);
        echo json_encode([
            'message' => 'Event added successfully',
            'data' => $calendar_data
        ]);
    } else {
        debug('Failed to add event', 'ERROR');
        throw new Exception('Failed to add event');
    }

} catch (Exception $e) {
    debug('Request processing failed', 'ERROR', [
        'error_message' => $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
    http_response_code(400);
    echo json_encode([
        'message' => 'Authentication or request error', 
        'error' => $e->getMessage()
    ]);
}
?>