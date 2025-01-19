<?php
require_once 'C:\laragon\www\OrgSync-Website\src\Server\email\email.php'; 

$db_user = '';
$db_pass = '';
$db_name = '';

$fromEmail = 'johncarlo.lorieta@gmail.com';
$fromName = 'John Carlo Lorieta';
try {
    
    $db = new PDO('mysql:host=localhost;dbname=' . $db_name . ';charset=utf8mb4', $db_user, $db_pass);

    // Set PDO attributes
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

 
    define('APP_NAME', 'Web Development');


$emailer = new NewsletterEmailer($db,, $fromEmail, $fromName);


$emailer->sendNewsletterEmails();

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
