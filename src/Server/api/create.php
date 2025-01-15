<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
// Initialize API - corrected path
require_once(dirname(__FILE__) . '/../core/initialize.php');

// User instance
$post = new UserHandler($db);

$data = json_decode(file_get_contents("php://input"));

$post->student_id = $data->student_id;
$post->firstname = $data->firstname;
$post->lastname = $data->lastname;
$post->email = $data->email;
$post->password = $data->password;
$post->account_type = $data->account_type;

if($post->create()){
    echo json_encode(
        array('message' => 'User Created')
    );
} else {
    echo json_encode(
        array('message' => 'User Not Created')
    );
}




