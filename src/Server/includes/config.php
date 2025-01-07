<?php

$db_user = 'root';
$db_pass = 'root';
$db_name = 'web_dev';

$db = new PDO( ('mysql:host=localhost;dbname=' . $db_name), $db_user, $db_pass );

//attributes
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

define('APP_NAME', 'Web Development');
?>