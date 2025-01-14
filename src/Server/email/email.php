<?php
require __DIR__ . '/../../../vendor/autoload.php'; 

use SendGrid\Mail\Mail;

$email = new \SendGrid\Mail\Mail(); 
$email->setFrom("johncarlo.lorieta@gmail.com", "John Carlo Lorieta");
$email->setSubject("Welcome to Our Service!");
$email->addTo("jcbarv@gmail.com", "JC Barv");

// HTML layout for the email
$htmlContent = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .content {
            padding: 20px;
            text-align: center;
            color: #333333;
        }
        .content p {
            line-height: 1.6;
        }
        .footer {
            background-color: #f4f4f4;
            color: #777777;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to Our Service!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>JC Barv</strong>,</p>
            <p>Thank you for joining us! We're excited to have you on board.</p>
            <p>Click the button below to get started:</p>
            <a href="https://example.com" class="button">Get Started</a>
        </div>
        <div class="footer">
            <p>&copy; 2025 Our Service. All rights reserved.</p>
            <p>If you did not sign up for this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
HTML;

// Add HTML content to the email
$email->addContent("text/html", $htmlContent);

$sendgrid = new \SendGrid(''); // Replace with your API key

try {
    $response = $sendgrid->send($email); 
    print $response->statusCode() . "\n";
    print_r($response->headers());
    print $response->body() . "\n";
} catch (Exception $e) {
    echo 'Caught exception: '. $e->getMessage() . "\n";
}
?>
