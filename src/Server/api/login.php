<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Initialize API
require_once(dirname(__FILE__) . '/../core/initialize.php');

try {
    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Retrieve input data
        $data = json_decode(file_get_contents("php://input"));

        // Validate input
        if (!empty($data->email) && !empty($data->password)) {
            // User instance
            $user = new Post($db);

            // Verify user credentials
            $result = $user->login($data->email, $data->password);
            if ($result) {
                // Authentication successful
                http_response_code(200);
                echo json_encode(array(
                    'message' => 'Login successful',
                    'user' => $result
                ));
            } else {
                // Authentication failed
                http_response_code(401);
                echo json_encode(array('message' => 'Invalid email or password'));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'Email and password are required'));
        }
    } else {
        http_response_code(405);
        echo json_encode(array('message' => 'Method not allowed'));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Internal Server Error', 'error' => $e->getMessage()));
}
