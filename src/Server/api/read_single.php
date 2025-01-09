<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Initialize API - corrected path
require_once(dirname(__FILE__) . '/../core/initialize.php');

// User instance
$post = new Post($db);

$post->idusers = isset($_GET['idusers'])? $_GET['idusers'] : die();

$post->read_single();

$post_arr = array(
    'idusers' => $post-> idusers,
    'firstname' => $post-> firstname,
    'lastname' => $post-> lastname,
    'email' => $post-> email,
    'orgtype' => $post-> orgtype,
    'account_type' => $post-> accounttype,
);

//create json

print_r(json_encode($post_arr));
