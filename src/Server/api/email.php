<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once(dirname(__FILE__) . '/../core/initialize.php');


$data = json_decode(file_get_contents("php://input"));

if (isset($data->foreign_email)) {
 
    $post = new EmailHandler($db);
    $post->foreign_email = $data->foreign_email;

    
    if ($post->create()) {
        echo json_encode(array('message' => 'User Created'));
    } else {
        echo json_encode(array('message' => 'User Not Created'));
    }
} else {
    
    echo json_encode(array('message' => 'Missing required fields'));
}

?>
