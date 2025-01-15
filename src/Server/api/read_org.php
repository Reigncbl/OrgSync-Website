<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include the Organization class
require_once(dirname(__FILE__) . '/../core/Organization.php');  

// Initialize API
require_once(dirname(__FILE__) . '/../core/initialize.php');

// Organization instance
$organization = new Organization($db);

// Get organizations
$result = $organization->read();
$num = $result->rowCount();

if ($num > 0) {
    $org_arr = array();
    $org_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $org_item = array(
            'id' => $id,
            'name' => $title, 
            'logo' => $logo, 
            'description' => $description,
            'email' => $email,
            'facebook' => $facebook,
            'instagram' => $instagram,
            'linkedin' => $linkedin,
            'website' => $website
        );

        array_push($org_arr['data'], $org_item);
    }

    echo json_encode($org_arr);
} else {
    echo json_encode(array('message' => 'No organizations found.'));
}
?>
