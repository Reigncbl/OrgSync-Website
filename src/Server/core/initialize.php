<?php
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);


defined('SITE_ROOT') ? null : define('SITE_ROOT', dirname(__DIR__, 2));

defined('INC_PATH') ? null : define('INC_PATH', SITE_ROOT . DS . 'Server' . DS . 'includes');
defined('CORE_PATH') ? null : define('CORE_PATH', SITE_ROOT . DS . 'Server' . DS . 'core');

require_once(INC_PATH . DS . "config.php");
require_once(CORE_PATH . DS . "userhandler.php");
require_once(CORE_PATH . DS . "organization.php");
require_once(CORE_PATH . DS . "eventhandler.php");
require_once(CORE_PATH . DS . "emailhandler.php");
?>
