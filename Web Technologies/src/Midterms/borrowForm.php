<?php
require 'php/functions.php';
session_start();
checkloggedin();
userlogout();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Borrow Equipment</title>
    <link rel="stylesheet" href="css/borrowForm.css">
    <link rel="stylesheet" href="css/homepage.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <header class="navbar">
        <div class="logo">
            <img src="images/logo.png" alt="Lend It Rocky Logo">
        </div>
        <div class="right-section">
            <nav>
                <ul>
                    <li><a href="homepage.php">Home</a></li>
                    <li>
                        <a href="#" class="dropdown-toggle">Equipment <span id="equipment-arrow">&#x25BC;</span></a>
                        <ul>
                            <li><a href="borrowForm.php">Borrow Equipment</a></li>
                            <li><a href="equipmentLendingDashboard.php">Dashboard</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="dropdown-toggle">Facilities <span id="facilities-arrow">&#x25BC;</span></a>
                        <ul>
                            <li><a href="facilitiesForm.php">Reserve Facility</a></li>
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

    <form id ="equipment-form">
        <div class="container">
            <a href="equipmentLendingDashboard.php" class="back-link">Back to Dashboard</a>
            <h1>Borrow Equipment</h1>
            <h5 class="note">NOTE: Click the dropdown to check available items. If an item isn't listed, it's unavailable.</h5>
                <div id="equipment-fields">
                    <div class="form-group equipment-quantity-wrapper">

                    </div>
                </div>
                <button class="add-equipment" type="button" id="add-equipment-btn">+ Add More Equipment</button>
                <div class="form-group">
                    <label for="borrowing-date">Select Borrowing Date</label>
                    <input type="date" id="borrowing-date" value="2024-11-01">
                    <input type="time" id="pickup-time" value="07:30">
                </div>
                <div class="form-group">
                    <label for="return-date">Select Return Date</label>
                    <input type="date" id="return-date" value="2024-11-02">
                    <input type="time" id="return-time" value="09:30">
                </div>
                <div class="form-group">
                    <label for="purpose">Purpose</label>
                    <textarea id="equipment-purpose"  required></textarea>
                </div>
                <button type="submit" class="submit-btn">Proceed</button>
        </div>
    </form>
    <script src="js/borrowForm.js"></script>
    <script src="js/script.js"></script>
    <script src="js/NavbarName.js.php"></script>
</body>
</html>
