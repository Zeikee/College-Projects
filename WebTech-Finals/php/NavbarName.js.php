<?php
// Start the session
session_start();

// Set the content type to JavaScript
header('Content-Type: application/javascript');

// Output JavaScript code
?>
document.getElementById('emailName').innerHTML = '<?php echo htmlspecialchars($_SESSION["emailAddress"], ENT_QUOTES, 'UTF-8'); ?>';
document.getElementById('username').innerHTML = '<?php echo htmlspecialchars($_SESSION["firstName"], ENT_QUOTES, 'UTF-8'); ?> '+'<?php echo htmlspecialchars($_SESSION["lastName"], ENT_QUOTES, 'UTF-8'); ?>';
if (document.getElementById('welcomeadmin')) {
    document.getElementById('welcomeadmin').innerHTML = '<?php echo htmlspecialchars($_SESSION["firstName"], ENT_QUOTES, 'UTF-8'); ?>';
}