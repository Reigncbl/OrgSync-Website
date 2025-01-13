<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include the Organization class
require_once(dirname(__FILE__) . '/../core/Organization.php');  // Adjust path if needed

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
            'name' => $title,  // 'title' from the table
            'logo' => $logo,   // 'logo' from the table
            'description' => $description,  // 'description' from the table
            'email' => $email,  // 'email' from the table
            'facebook' => $facebook,  // 'facebook' from the table
            'instagram' => $instagram,  // 'instagram' from the table
            'linkedin' => $linkedin,  // 'linkedin' from the table
            'website' => $website  // 'website' from the table
        );

        array_push($org_arr['data'], $org_item);
    }

    echo json_encode($org_arr);
} else {
    echo json_encode(array('message' => 'No organizations found.'));
}
?>
