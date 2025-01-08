<?php

$db_user = 'root';
$db_pass = 'root';
$db_name = 'web_dev';

try {
    // Corrected the charset to utf8mb4
    $db = new PDO('mysql:host=localhost;dbname=' . $db_name . ';charset=utf8mb4', $db_user, $db_pass);

    // Set PDO attributes
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Define app name
    define('APP_NAME', 'Web Development');
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
