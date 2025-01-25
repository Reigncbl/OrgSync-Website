<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Initialize API
require_once(dirname(__FILE__) . '/../core/initialize.php');

// Start session only if not already active
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));

        // Debug: Log incoming request data
        error_log("Login request data: " . json_encode($data));

        if (!empty($data->email) && !empty($data->password)) {
            $user = new UserHandler($db);
            
            // Debug: Log parameters for login
            error_log("Login parameters - Email: {$data->email}, Password: [HIDDEN]");

            $result = $user->login($data->email, $data->password);

            // Debug: Log result of login attempt
            error_log("Login result: " . json_encode($result));

            if ($result) {
                // Store user data in session
                $_SESSION['logged_in'] = true;
                $_SESSION['student_id'] = $result['student_id'];
                $_SESSION['account_type'] = $result['account_type'];
                $_SESSION['org_id'] = $result['org_id'];
            
                // Log session values
                error_log("Session values set:");
                error_log("Logged In: " . $_SESSION['logged_in']);
                error_log("Student ID: " . $_SESSION['student_id']);
                error_log("Account Type: " . $_SESSION['account_type']);
                error_log("Org ID: " . $_SESSION['org_id']);
            
                http_response_code(200);
                echo json_encode([
                    'message' => 'Login successful',
                    'user' => [
                        'student_id' => $result['student_id'],
                        'account_type' => $result['account_type'],
                        'org_id' => $result['org_id']
                    ]
                ]);
            } else {
                error_log("Invalid email or password");
                http_response_code(401);
                echo json_encode(['message' => 'Invalid email or password']);
            }
        } else {
            error_log("Missing email or password");
            http_response_code(400);
            echo json_encode(['message' => 'Email and password are required']);
        }
    } else {
        error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
    }
} catch (PDOException $e) {
    // Debug: Log SQL exception details
    error_log("PDOException in login.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Internal Server Error', 'error' => $e->getMessage()]);
} catch (Exception $e) {
    // Debug: Log generic exception details
    error_log("Exception in login.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Internal Server Error', 'error' => $e->getMessage()]);
}
?>
