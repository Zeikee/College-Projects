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
    <title>Equipments</title>
    <link rel="icon" href="../assets/images/logo.png">
    <link rel="stylesheet" href="css/homepage.css">
    <link rel="stylesheet" href="css/equipments.css">
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

    
    <div class="container">
        <a href="equipmentDashboard.php" class="back-link">Back to Dashboard</a>
        <h1>Equipments</h1>
        <div class="controls">
            <input type="text" id="searchInput" placeholder="Search for equipment...">
        </div>
        <table class="equipment-available-table">
            <thead>
                <tr>
                    <th>Equipment Name</th>
                    <th>Equipment ID</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <!-- Dynamic rows will be generated here -->
            </tbody>
        </table>
    </div>

    <script src="js/equipments.js"></script>
    <script src="js/script.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
