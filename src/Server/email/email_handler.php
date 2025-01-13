<?php
  require 'vendor/autoload.php';
    use Mailgun\Mailgun;

    $mg = Mailgun::create('key-example'); // For US servers
    $mg = Mailgun::create('key-example', 'https://api.eu.mailgun.net'); // For EU servers

    // Now, compose and send your message.
    // $mg->messages()->send($domain, $params);
    $mg->message()->send('sandboxfeb29da9a3074c8482462988028f0ef3.mailgun.org', [
    	'from'		=> 'mailgun@YOUR_DOMAIN_NAME',
    	'to'			=> 'YOU@YOUR_DOMAIN_NAME',
    	'subject' => 'Hello',
    	'text'		=> 'Testing some Mailgun awesomeness!'
    ]);
    ?>