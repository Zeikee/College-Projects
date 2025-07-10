<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
checkadmin();
username();
checkAdminOrCustodian();
if (isset($_POST['add_account'])) {
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirm_password'];
    $userType = $_POST['user_type'];

    if ($password !== $confirmPassword) {
        echo "<script>alert('Passwords do not match!');</script>";
    } else {
        // Hash the password for security
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $conn = connecttodb();

        $stmt = $conn->prepare("INSERT INTO user (emailAddress, password, firstName, lastName, userType) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $email, $hashedPassword, $firstName, $lastName, $userType);

        if ($stmt->execute()) {
            echo "<script>alert('Account added successfully!');</script>";
        } else {
            echo "<script>alert('Error adding account: " . $stmt->error . "');</script>";
        }

        $stmt->close();
        $conn->close();
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Equipments</title>
  <link rel="stylesheet" href="css/adminAddAccount.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
<header class="navbar">
        <div class="logo">
            <img src="../assets/images/logo.png" alt="Lend It Rocky Logo">
        </div>
        <div class="right-section">
            <nav>
                <ul>
                    <li><a href="index.php">Home</a></li>
                    <li id="admin-feature-account-li"><a href="adminAccountManagement.php">Accounts</a></li>
                    <li>
                        <a href="#" class="dropdown-toggle">Equipment <span id="equipment-arrow">&#x25BC;</span></a>
                        <ul>
                            <li><a href="adminEquipmentManagement.php">Manage Equipment</a></li>
                            <li><a href="adminEquipmentDashboard.php">View Borrowed Equipments</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="dropdown-toggle">Facilities <span id="facilities-arrow">&#x25BC;</span></a>
                        <ul>
                            <li><a href="adminFacilitiesManagement.php">Manage Facilities</a></li>
                            <li><a href="adminFacilitiesDashboard.php">View Reserved Facilities</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
        
        <!-- User Profile and Logout -->
        <div class="user-profile">
            <div class="user-profile-03"></div>
            <div class="user-info">
                <div class="name" id="username"></div>
                <span id="emailName"></span>
            </div>
        
            <!-- Dropdown toggle for Logout -->
            <a href="#" class="dropdown-toggle"><span id="user-arrow">&#x25BC;</span></a>
        
            <!-- Dropdown menu for Logout -->
            <ul class="user-dropdown-menu">
                <li><a href="?action=logout">Logout</a></li>
            </ul>
        </div>
    </header>


<!-- Main Content -->
<h1>Add Account</h1>
<div class="add-account-container">
    <img src="../assets/images/profile.png" alt="Accounts" class="add-account-image">
    <h2>ACCOUNTS</h2>
    <form method="POST">
        <select id="user_type" name="user_type" required>
            <option value="" disabled selected>Select user type</option>
            <option value="student">Student</option>
            <option value="custodian">Custodian</option>
            <option value="admin">Admin</option>
        </select>
        <input type="text" name="first_name" placeholder="First name" required>
        <input type="text" name="last_name" placeholder="Last name" required>
        <div class="email-input">
            <input type="text" name="email" placeholder="Email" required>
        </div>
        <input type="password" name="password" placeholder="Password" required>
        <input type="password" name="confirm_password" placeholder="Confirm Password" required>
        

        <button id="submit" name="add_account">Add</button>
    </form>
</div>
<script src="js/adminAddAccount.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
