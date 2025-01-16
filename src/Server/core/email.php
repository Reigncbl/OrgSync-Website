<?php
require 'C:\laragon\www\OrgSync-Website\vendor\autoload.php';
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
        <body>
            <h1>Welcome to Our Newsletter!</h1>
            <p>Thank you for subscribing.</p>
        </body>
        </html>';

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

            usleep(100000); // Delay
        }
    }
}
?>