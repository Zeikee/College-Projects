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
    <title>Lend It Rocky</title>
    <link rel="stylesheet" href="css/facilitiesForm.css">
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


    <h1 class="title">Borrow a Facility</h1>
    <div class="reservation-container">
        <!-- Start the form -->
        <form id ="facility-form">


            <div class="facilities-link">
                <a href="#" id="open-popup">
                    <img src="images/facility-logo.png" alt="Facilities Icon" class="icon">
                    Click here to see available facilities
                </a>
            </div>
    
           <!-- Date and Time Picker -->
           <div class="date-time-picker">
            <label>Select Reservation Date and Time:</label>
            
            <!-- Start Date and Time -->
            <div class="date-time-input">
                <input type="date" id="start-date">
                <input type="time" id="start-time" value="07:30">
            </div>
        
           <!-- End Date and Time --> 
            <div class="date-time-input">
                <input type="date" id="end-date" value="2024-01-02">
                <input type="time" id="end-time" value="09:30">
            </div>

        </div>
    
        <div class="room-selection-container">
            <!-- Room Selection -->
            <div class="room-selection">
                <label for="room">Room Selection:</label>
                <select id="room"required>
                <option value="" disabled selected hidden>Select a room</option>
                    <option value="1">Room 528 Laboratory</option>
                    <option value="2">Room 427 Laboratory</option>
                    <option value="3">Room 223 Laboratory</option>
                    <option value="4">Room 422 Laboratory</option>
                    <option value="5">Room 424 Laboratory</option>
                    <option value="6">Room 425 Laboratory</option>
                    <option value="7">Room 522 Laboratory</option>
                    <option value="8">Room 524 Laboratory</option>
                    <option value="9">Room 526 Laboratory</option>
                    <option value="10">Room 722 Laboratory</option>
                    <option value="11">Room 723 Laboratory</option>
                    <option value="12">Room 724 Laboratory</option>
                    <option value="13">Room 725 Laboratory</option>
                </select>
            </div>
        </div>
        
        <!-- Image Container -->
        <div class="image-container">
            <img id="room-image" src="images/default.png" alt="Room Image">
            <p id="room-label">Please select a room</p>
        </div>
    
        <!-- Purpose Field -->
        <div class="textarea-container">
            <label for="purpose">Purpose:</label>
            <textarea id="purpose" name="purpose" placeholder="Enter your purpose" required></textarea>
        </div>
    
        <!-- Special Instructions -->
        <div class="textarea-container">
            <label for="special-instructions">Special Instructions: (Optional)</label>
            <textarea id="special-instructions" name="special-instructions" placeholder="Do you have special instructions?"></textarea>
        </div>
        
        <!-- Proceed Button -->
        <button type="submit" class="reserve-proceed-btn">Proceed</button>
        </form>
    </div>

<!-- Popup Modal for Facilities -->
<div id="facility-popup-modal" class="popup-modal">
    <div class="popup-content">
        <span class="close-btn">&times;</span>
        <h2>Facilities</h2>

        <!-- Search bar -->
        <div class="search-filter-container">
            <input type="text" id="search-facility" placeholder="Search for facility...">
            <select id="facility-status">
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
            </select>
        </div>

        <!-- Facilities Table -->
        <table>
            <thead>
                <tr>
                    <th>Facility Name</th>
                    <th>Facility ID</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="facility-list">
                <!-- <tr>
                    <td>Room 223</td>
                    <td>R223</td>
                    <td>Available</td>
                </tr>
                <tr>
                    <td>Room 422</td>
                    <td>R422</td>
                    <td>Unavailable</td>
                </tr>
                <tr>
                    <td>Room 528</td>
                    <td>R528</td>
                    <td>Available</td>
                </tr>
                <tr>
                    <td>Room 724</td>
                    <td>R724</td>
                    <td>Unavailable</td>
                </tr> -->
            </tbody>
        </table>
    </div>
</div>
  <script src="js/script.js"></script>
  <script src="js/facilitiesForm.js"></script>
  <script src="js/NavbarName.js.php"></script>
</body>
</html>