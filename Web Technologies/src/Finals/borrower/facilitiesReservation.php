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
    <title>Lend It Rocky</title>
    <link rel="icon" href="../assets/images/logo.png">
    <link rel="stylesheet" href="css/facilitiesReservation.css">
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


    <h1 class="title">Borrow a Facility</h1>
    <div class="reservation-container">
        <!-- Start the form -->
        <form id="facility-form">


            <div class="facilities-link">
                <a href="#" id="open-popup">
                    <img src="../assets/images/facility-logo.png" alt="Facilities Icon" class="icon">
                    Click here to see available facilities
                </a>
            </div>

            <div class="reservation-selection-container">
                <div class="reservation-selection">
                    <label for="rooms">What kind of Reservation:</label>
                    <select name="rooms" id="rooms">
                        <option value="" disabled selected hidden>Select a reservation</option>
                        <option value="1">Full Reservation</option>
                        <option value="2">Partial Reservation</option>
                    </select>
                </div>
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
                    <input type="date" id="end-date">
                    <input type="time" id="end-time" value="08:30">
                </div>

            </div>

            <div class="room-selection-container">
                <!-- Room Selection -->
                <div class="room-selection">
                    <label for="room">Room Selection:</label>
                    <select id="roomDropdown" required>
                        <option value="" disabled selected hidden>Selec a Room</option>
                    </select>
                </div>

                <!-- Seat Reservation -->
                <div class="seats-container" id="seats-container" style="display: none;">
                    <label for="seats">No. of seats to be reserved:</label>
                    <input type="number" id="seats" name="seats" placeholder="How many seats?" min="0" max="30"
                        step="1">
                    <p id="AvailableSeatsText">Available seats:</p>
                </div>

            </div>

            <!-- Image Container -->
            <div class="image-container">
                <img id="room-image" src="../assets/images/facilities-default.png" alt="Room Image">
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
                <textarea id="special-instructions" name="special-instructions"
                    placeholder="Do you have special instructions?"></textarea>
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
            <table class="facility-available-table">
                <thead>
                    <tr>
                        <th>Facility/Room Name</th>
                        <th>Room ID</th>
                        <th>Total Seats</th>
                    </tr>
                </thead>
                <tbody id="facility-list">
                </tbody>
            </table>
        </div>
    </div>
    <script src="js/script.js"></script>
    <script src="js/facilitiesReservation.js"></script>
    <script src="../php/NavbarName.js.php"></script>.js.php">< </body>

</html>