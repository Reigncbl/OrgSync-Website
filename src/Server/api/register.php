<?php
header('Content-Type: application/json');

// Include database and UserHandler initialization
require_once(dirname(__FILE__) . '/../core/initialize.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $student_id = htmlspecialchars(trim($input['studentid'] ?? ''));
    $firstname = htmlspecialchars(trim($input['firstname'] ?? ''));
    $lastname = htmlspecialchars(trim($input['lastname'] ?? ''));
    $email = htmlspecialchars(trim($input['email'] ?? ''));
    $password = htmlspecialchars(trim($input['password'] ?? ''));
    $account_type = htmlspecialchars(trim($input['account_type'] ?? ''));

    if (empty($student_id) || empty($password)) {
        http_response_code(400);
        echo json_encode(['message' => 'Student ID and password are required.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid email address.']);
        exit;
    }

    // Assign to UserHandler object
    $userHandler = new UserHandler($db);
    $userHandler->student_id = $student_id;
    $userHandler->firstname = $firstname;
    $userHandler->lastname = $lastname;
    $userHandler->email = $email;
    $userHandler->password = $password; 
    $userHandler->account_type = $account_type;

    if ($userHandler->create()) {
        http_response_code(200);
        echo json_encode(['message' => 'User successfully registered.']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to register user.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
}
