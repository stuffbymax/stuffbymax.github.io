<?php 
if ($_SERVER["REQUEST_METHOD"] == "POST") { 
  $name = $_POST["name"]; 
  $email = $_POST["email"]; 
  $message = $_POST["message"]; 
 
  $to = "heroesbiggie@gmail.com"; 
  $subject = "New Contact Form Submission"; 
  $body = "You have received a new message from the contact form:\n\n" . 
          "Name: $name\n" . 
          "Email: $email\n" . 
          "Message:\n$message\n"; 
  $header = "From: $name <$email>\r\n" . 
            "Reply-To: $email\r\n" . 
            "X-Mailer: PHP/" . phpversion(); 
 
  if (mail($to, $subject, $body, $header)) { 
    echo "Message sent successfully!"; 
  } else { 
    echo "An error occurred while trying to send the message."; 
  } 
} 
?> 