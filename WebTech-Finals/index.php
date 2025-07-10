<?php
require_once "php/functions.php";
session_start();
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] == true) {
    usertype();
    if($_SESSION["loggedin"] == true && $_SESSION["userType"] == "admin" || $_SESSION["userType"] == "custodian"){
        header("location: admin/index.php");
        exit;
    }else{
        header("location: borrower/index.php");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Login</title>
    <link rel="icon" href="/assets/images/logo.png">
    <link rel="stylesheet" href="/borrower/css/style.css">
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="/assets/images/logo.png" alt="Lend It Rocky Logo">
        </div>
        <div class="login-box">
            <h2>LOGIN</h2>
            <form action="index.php" method="post">
                <div class="input-group">
                    <label for="email"><i class="fas fa-user"></i></label>
                    <input name="emailAddress" type="email" id="email" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <label for="password"><i class="fas fa-lock"></i></label>
                    <input name="passwordinput" type="password" id="password" placeholder="Password" required>
                    <span class="show-password"><i class="fas fa-eye-slash"></i></span>
                    <p id="error"></p>
                </div>
                <a href="#" class="forgot-password">Forgot Password</a>
                <button type="submit" class="btn-signin">Sign In</button>
            </form>
            <p class="register-link">Don’t have an account yet? <a href="../register.php">Register</a></p>
        </div>
    </div>

    <?php
    // Include database configuration file 
    $conn = connecttodb();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $emailAddress = trim($_POST["emailAddress"]);
        $passwordinput = trim($_POST["passwordinput"]);


        $sql = "SELECT * FROM user WHERE emailAddress='$emailAddress';";
        $result = mysqli_query($conn, $sql);
        
        if (mysqli_num_rows($result) > 0) {
            $user = mysqli_fetch_assoc($result);
            if (password_verify($passwordinput,$user['password'])) {
                $_SESSION["loggedin"] = true;
                $_SESSION["userId"] = $user['userId'];
                $_SESSION["emailAddress"] = $user['emailAddress'];
                $_SESSION["firstName"] = $user['firstName'];
                $_SESSION["lastName"] = $user['lastName'];
                $_SESSION["userType"] = $user['userType'];
                if($_SESSION["userType"] === "admin" || $_SESSION["userType"] === "custodian"){
                    header("Location: /admin/index.php");
                }else{
                    header("Location: /borrower/index.php");
                }
                
            }else{
                echo "<script>document.getElementById('error').innerHTML = 'The password you entered was not valid.';</script>";
                exit;
            }
        }else{
            echo "<script>document.getElementById('error').innerHTML = 'No account found with that email.'</script>";
            exit;
        }
    }
    ?>
</body>
</html>
