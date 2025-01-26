<?php
// Allow CORS and specify the allowed methods
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Include initialization script
require_once(dirname(__FILE__) . '/../core/initialize.php');

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['message' => 'Method not allowed']);
    exit;
}

// Check if the user is logged in (org_id is set in the session)
if (!isset($_SESSION['student_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['message' => 'Unauthorized access. Please log in.']);
    exit;
}

// Validate and process the form data
if (isset($_POST['org_id'])) {
    $follow = new FollowHandler($db);

    // Assign student ID from the session
    $follow->student_id = $_SESSION['student_id'];

    // Assign the organization ID
    $follow->org_id = $_POST['org_id'];

    // Assign the current date and time for the followed_at field
    $follow->followed_at = date('Y-m-d H:i:s');

    // Create the follow record
    if ($follow->followOrganization()) {
        http_response_code(201); // Created
        echo json_encode(['message' => 'Successfully followed the organization.']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['message' => 'Failed to follow the organization.']);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'Missing required fields.']);
}
?>
