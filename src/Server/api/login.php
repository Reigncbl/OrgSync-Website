<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

require_once(dirname(__FILE__) . '/../core/initialize.php');

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_lifetime' => 86400,
        'cookie_secure' => false,
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax'
    ]);
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->email) && !empty($data->password)) {
            $user = new UserHandler($db);
            $result = $user->login($data->email, $data->password);

            if ($result) {
                $_SESSION['logged_in'] = true;
                $_SESSION['student_id'] = $result['student_id'];
                $_SESSION['account_type'] = $result['account_type'];
                $_SESSION['org_id'] = $result['org_id'];

                http_response_code(200);
                echo json_encode([
                    'message' => 'Login successful',
                    'user' => [
                        'student_id' => $result['student_id'],
                        'firstname' => $result['firstname'],
                        'lastname' => $result['lastname'],
                        'email' => $result['email'],
                        'account_type' => $result['account_type'],
                        'org_id' => $result['org_id']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'Invalid email or password']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Email and password are required']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}