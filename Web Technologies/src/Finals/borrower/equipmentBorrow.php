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
    <title>Borrow Equipment</title>
    <link rel="icon" href="../assets/images/logo.png">
    <link rel="stylesheet" href="css/equipmentBorrow.css">
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

    <form id="equipment-form">
    <div class="container">
        <a href="equipmentDashboard.php" class="back-link">Back to Dashboard</a>
        <h1>Borrow Equipment</h1>
        <h5 class="note">NOTE: Click the dropdown to check available items. If an item isn't listed, it's unavailable.</h5>
        
        <div class="equipment-selection-container">
    <!-- Equipment Selection -->
    <div class="equipment-selection">
        <label for="equipment">Select Equipment:</label>
        <select id="equipment">
            <option value="" disabled selected hidden>Select Equipment</option>
        </select>
    </div>

    <!-- Quantity Selection -->
    <div class="quantity-selection" id="quantity-selection">
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" min="1" value="" required>
        <p class="available-quantity" id="available-quantity">Available: 3</p>
    </div>

    <button type="button" class="delete-btn" id="delete-btn">
        <img src="../assets/images/delete.png" alt="Delete Icon" class="delete-img">
    </button>

    <!-- Dynamic Image Container (Moved inside the same container, below the fields) -->
    <div class="dynamic-image-container" id="dynamic-image-container" style="display: none;">
        <img id="dynamic-equipment-image" src=" " alt="Equipment Image">
        <p id="dynamic-equipment-label"></p>
    </div>
</div>

<!-- Image Container (Moved Outside) - If needed for another specific image -->
<div class="image-container" id="image-container" style="display: none;">
    <img id="equipment-image" src=" " alt="Equipment Image">
    <p id="equipment-label"></p>
</div>

<div id="equipment-list-container">
    <!-- Other content goes here -->
</div>


<button class="add-equipment" type="button" id="add-equipment-btn">+ Add More Equipment</button>

           <!-- Date and Time Picker -->
           <div class="date-time-picker">
            <label>Select Borrowing Date and Time:</label>
            
              <!--Start Date and Time --> 
            <div class="date-time-input">
                <input type="date" id="borrowing-date">
                <input type="time" id="pickup-time" value="07:30">
            </div>
        
            <!-- End Date and Time -->
            <div class="date-time-input">
                <input type="date" id="return-date">
                <input type="time" id="return-time" value="08:30">
            </div> 
</div>

                       <!-- Date and Time Picker 
           <div class="date-time-picker">
            <label>Select Reservation Date and Time:</label>
            
             Start Date and Time 
            <div class="date-time-input">
                <input type="date" id="start-date">
                <input type="time" id="start-time" value="07:30">
            </div>
        
            End Date and Time 
            <div class="date-time-input">
                <input type="date" id="end-date">
                <input type="time" id="end-time" value="08:30">
            </div> -->

        <!-- Purpose -->
        <div class="form-group">
            <label for="equipment-purpose">Purpose</label>
            <textarea id="equipment-purpose" rows="4" placeholder="Enter purpose here" required></textarea>
        </div>
        
        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Proceed</button>
    </div>
</form>

    <script src="js/equipmentBorrow.js"></script>
    <script src="js/script.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
