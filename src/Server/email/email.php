<?php
// require 'C:\laragon\www\OrgSync-Website\vendor\autoload.php';
use SendGrid\Mail\Mail;

class NewsletterEmailer {
    private $conn;
    private $apiKey;
    private $fromEmail;
    private $fromName;

    public function __construct($db, $apiKey, $fromEmail, $fromName) {
        $this->conn = $db;
        $this->apiKey = $apiKey;
        $this->fromEmail = $fromEmail;
        $this->fromName = $fromName;
    }

    public function sendNewsletterEmails() {
        $query = 'SELECT  foreign_email FROM newsletter';
        $stmt = $this->conn->prepare($query);

        if (!$stmt->execute()) {
            print_r($stmt->errorInfo());
            return;
        }

        $htmlContent = '
       <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f8ff;
                color: #333;
                text-align: center;
                padding: 50px;
            }
            h1 {
                color: #ff6347;
                font-size: 3em;
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
            }
            p {
                font-size: 1.5em;
                color: #4caf50;
                background-color: #fff;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            body {
                background: linear-gradient(to right, #ff7e5f, #feb47b);
                background-size: cover;
                height: 100vh;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <h1>Welcome to Our Newsletter!</h1>
        <p>Thank you for subscribing.</p>
    </body>
</html>
';

        while ($subscriber = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Sending to {$subscriber['foreign_email']}...\n";

            try {
                $email = new Mail();
                $email->setFrom($this->fromEmail, $this->fromName);
                $email->setSubject("Welcome to Our Newsletter");
                $email->addTo($subscriber['foreign_email']);
                $email->addContent("text/html", $htmlContent);

                $sendgrid = new \SendGrid($this->apiKey);
                $response = $sendgrid->send($email);

                echo "Response Code: " . $response->statusCode() . "\n";
            } catch (Exception $e) {
                echo "Error: " . $e->getMessage() . "\n";
            }

            usleep(100000); 
        }
    }
}
?>