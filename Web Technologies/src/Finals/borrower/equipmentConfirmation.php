<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation</title>
    <link rel="icon" href="../assets/images/logo.png">
    <link rel="stylesheet" href="css/equipmentConfirmation.css">
    <link rel="stylesheet" href="css/homepage.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
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
                    <li>
                        <a href="#" class="dropdown-toggle">Equipment <span id="equipment-arrow">&#x25BC;</span></a>
                        <ul>
                            <li><a href="equipmentBorrow.php">Borrow Equipment</a></li>
                            <li><a href="equipmentDashboard.php">Dashboard</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="dropdown-toggle">Facilities <span id="facilities-arrow">&#x25BC;</span></a>
                        <ul>
                            <li><a href="facilitiesReservation.php">Reserve Facility</a></li>
                            <li><a href="facilitiesDashboard.php">Dashboard</a></li>
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


   <!-- Borrow Confirmation Section -->
   <div class="container">
    <h1>Borrow Confirmation</h1>
    <div class="confirmation-box">
        <h2>Borrow Details</h2>
        <div id="confirmation-details"></div>
    </div>

    <div class="button-container">
        <button onclick="equipmentConfirmation()" class="submit-btn">Confirm Borrow</button>
        <button onclick="goBack()" class="cancel-btn">Go Back</button>
    </div>
</div>
    <!-- Websocket.js for configuration of websockets -->
    <script src="js/equipmentConfirmation.js"></script>
    <script src="js/script.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
