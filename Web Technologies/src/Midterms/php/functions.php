<?php
function connecttodb(){
    $servername = 'localhost';
    $username = 'root';
    $password = '';
    $database = 'lenditrocky';

    $conn = mysqli_connect($servername, $username, $password, $database);

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    return $conn;
}
function checkloggedin(){
    if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
        header("location: index.php");
        exit;
    }
}
function userlogout(){
    if (isset($_GET['action']) && $_GET['action'] === 'logout') {
        $_SESSION["loggedin"] = false;
        header("Location: index.php"); 
        exit;
    }
}

function usertype() {
    $conn = connecttodb();
    unset($_SESSION['userType']);
    if (!isset($_SESSION['emailAddress'])) {
        return null;
    }
    $emailAddress = $_SESSION['emailAddress'];
    $sql = "SELECT userType FROM user WHERE emailAddress = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $emailAddress);
        $stmt->execute();
        $stmt->bind_result($userType);
        if ($stmt->fetch()) {
            $_SESSION['userType'] = $userType;
            return $userType;
        } else {
            return null;
        }
    } else {
        return null;
    }
}
?>