<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Initialize API - corrected path
require_once(dirname(__FILE__) . '/../core/initialize.php');

// User instance
$post = new UserHandler($db);

$post->student_id = isset($_GET['student_id'])? $_GET['student_id'] : die();

$post->read_single();

$post_arr = array(
    'idusers' => $post-> student_id,
    'firstname' => $post-> firstname,
    'lastname' => $post-> lastname,
    'email' => $post-> email,
    'password' => $post-> password,
    'account_type' => $post-> account_type,
);

//create json

print_r(json_encode($post_arr));
