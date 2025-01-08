<?php
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

// Define the site root correctly (adjusted to match your project structure)
defined('SITE_ROOT') ? null : define('SITE_ROOT', dirname(__DIR__, 2));

// Define paths for includes and core directories
defined('INC_PATH') ? null : define('INC_PATH', SITE_ROOT . DS . 'Server' . DS . 'includes');
defined('CORE_PATH') ? null : define('CORE_PATH', SITE_ROOT . DS . 'Server' . DS . 'core');

// Include necessary files
require_once(INC_PATH . DS . "config.php");
require_once(CORE_PATH . DS . "post.php");
?>
