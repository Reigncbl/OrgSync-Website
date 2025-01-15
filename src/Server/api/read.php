<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Initialize API - corrected path
require_once(dirname(__FILE__) . '/../core/initialize.php');

// User instance
$user = new UserHandler($db);

$result = $user->read();

$num = $result->rowCount();

if ($num > 0) {
    $user_arr = array();
    $user_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $user_item = array(
            'idusers' => $idusers,
            'firstname' => $firstname,
            'lastname' => $lastname,
            'email' => $email,
            'account_type' => $account_type,
            'orgtype' => $orgtype,
            'password' => $password
          
        );

        array_push($user_arr['data'], $user_item);
    }

    echo json_encode($user_arr);

} else {
    echo json_encode(array('message' => 'No users found.'));
}
?>