<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
usertype();
checkAdminOrCustodian();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Homepage</title>
    <link rel="stylesheet" href="css/adminHomePage.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
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
    <h1>Welcome, <span id="welcomeadmin"></span>!</h1>

    <!-- Card Container -->
    <div class="card-container">
        <!-- Card 1 -->
        <div class="card">
            <img src="../assets/images/equipment.png" alt="Equipments" class="card-image">
            <h3 class="card-title">Equipments</h3>
            <button class="card-button" onclick="window.location.href='adminEquipmentManagement.php'">View</button>
        </div>

        <!-- Card 2 -->
        <div class="card">
            <img src="../assets/images/classroom.png" alt="Facilities" class="card-image">
            <h3 class="card-title">Facilities</h3>
            <button class="card-button" onclick="window.location.href='adminFacilitiesManagement.php'">View</button>
        </div>

        <!-- Card 3 -->
        <div class="card" id= "admin-feature-account-card">
            <img src="../assets/images/profile.png" alt="Accounts" class="card-image">
            <h3 class="card-title">Accounts</h3>
            <button class="card-button" onclick="window.location.href='adminAccountManagement.php'">View</button>
        </div>
    </div>
</body>
<script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
<script src="js/adminHomePage.js"></script>
<script src="../php/NavbarName.js.php"></script>
</html>
