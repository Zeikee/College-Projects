<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Register</title>
    <link rel="icon" href="borrower/images/logo.png">
    <link rel="stylesheet" href="borrower/css/style.css">
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="borrower/images/logo.png" alt="Lend It Rocky Logo">
        </div>
        <div class="register-box">
            <h2>CREATE ACCOUNT</h2>
            <form action="register.php" method="post">
                <div class="input-group">
                    <label for="first-name"><i class="fas fa-user"></i></label>
                    <input name="firstName" type="text" id="first-name" placeholder="First name" required>
                </div>
                <div class="input-group">
                    <label for="last-name"><i class="fas fa-user"></i></label>
                    <input name="lastName" type="text" id="last-name" placeholder="Last name" required>
                </div>
                <div class="input-group">
                    <label for="email"><i class="fas fa-envelope"></i></label>
                    <input name="emailAddress" type="email" id="email" placeholder="Email/ID No" required>
                </div>
                <div class="input-group">
                    <label for="password"><i class="fas fa-lock"></i></label>
                    <input name="password" type="password" id="password" placeholder="Password" required>
                </div>
                <div class="input-group">
                    <label for="confirm-password"><i class="fas fa-lock"></i></label>
                    <input name="confirmPassword" type="password" id="confirm-password" placeholder="Confirm Password" required>
                </div>
                <button type="submit" class="btn-signup">SIGNUP</button>
            </form>
            <p id="error"></p>
            <p class="login-link">Already have an account? <a href="index.php">Login</a></p>
        </div>
    </div>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>

    <?php
    // Include database configuration file
    require_once "php/functions.php"; 
    $conn = connecttodb();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Retrieve input from the signup form
        $emailAddress = $_POST['emailAddress'];
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirmPassword'];
    
        // Password validation (check if they match)
        if ($password !== $confirmPassword) {
            echo "<script>document.getElementById('error').innerHTML = 'Passwords do not match.'</script>";
            exit;
        }
    
        // Check for existing email address
        $sql = "SELECT * FROM user WHERE emailAddress='$emailAddress'";
        $result = mysqli_query($conn, $sql);
    
        if (mysqli_num_rows($result) > 0) {
            echo "<script>document.getElementById('error').innerHTML = 'Email is already registered.'</script>";
            exit;
        }
    
        // Hash the password (only once, after confirming they match)
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user into the database
        $insert_sql = "INSERT INTO user (emailAddress, password, firstName, lastName, userType) 
                       VALUES ('$emailAddress', '$hashed_password', '$firstName', '$lastName', 'student');";
    
        if (mysqli_query($conn, $insert_sql)) {
            // Start session and store user data
            session_start();
            $_SESSION["loggedIn"] = true;
            $_SESSION["userId"] = mysqli_insert_id($conn);
            $_SESSION["emailAddress"] = $emailAddress;
            $_SESSION["firstName"] =  $firstName;
            $_SESSION["lastName"] = $lastName;
            $_SESSION["userType"] = "student";
            header("Location: borrower/index.php");
            exit;
        } else {
            // Display error if insertion fails
            echo "<script>document.getElementById('error').innerHTML = 'Error: ". mysqli_error($conn)."'</script>";
            exit;
        }
    }
    ?>
</body>
</html>
