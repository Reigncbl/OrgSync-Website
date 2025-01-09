<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
// Initialize API - corrected path
require_once(dirname(__FILE__) . '/../core/initialize.php');

// User instance
$post = new Post($db);

$data = json_decode(file_get_contents("php://input"));

$post->firstname = $data->firstname;
$post->firstname = $data->firstname;
$post->firstname = $data->firstname;
$post->firstname = $data->firstname;
$post->firstname = $data->firstname;



