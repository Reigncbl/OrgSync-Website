<?php
// follow_org.php

header('Content-Type: application/json');

// 1. Verify Request Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// 2. Decode JSON Payload
$requestPayload = json_decode(file_get_contents('php://input'), true);
if (!$requestPayload) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
    exit;
}

// 3. Extract and Validate Data
$orgId = $requestPayload['org_id'] ?? null;
$studentId = $requestPayload['student_id'] ?? null;
$dateAdmitted = $requestPayload['date_admitted'] ?? null;

if (!$orgId || !$studentId || !$dateAdmitted) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// 4. Database Connection
$host = 'localhost';
$dbname = 'your_database';
$username = 'your_username';
$password = 'your_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// 5. Check if the User is Already Following the Organization
try {
    $checkQuery = $pdo->prepare('SELECT COUNT(*) FROM followed_organizations WHERE org_id = :org_id AND student_id = :student_id');
    $checkQuery->execute(['org_id' => $orgId, 'student_id' => $studentId]);

    if ($checkQuery->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'You are already following this organization']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to check follow status']);
    exit;
}

// 6. Insert Follow Record
try {
    $insertQuery = $pdo->prepare('INSERT INTO followed_organizations (org_id, student_id, date_admitted) VALUES (:org_id, :student_id, :date_admitted)');
    $insertQuery->execute(['org_id' => $orgId, 'student_id' => $studentId, 'date_admitted' => $dateAdmitted]);

    echo json_encode(['success' => true, 'message' => 'Successfully followed the organization']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to follow the organization']);
}
?>
