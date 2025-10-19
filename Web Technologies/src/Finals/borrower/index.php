
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
        <div class="user-profile">
            <div class="user-profile-03"></div>
            <div class="user-info">
                <div class="name" id="username"></div>
                <span id="emailName"></span>
            </div>
            <a href="#" class="dropdown-toggle"><span id="user-arrow">&#x25BC;</span></a>
            <ul class="user-dropdown-menu">
                <li><a href="?action=logout">Logout</a></li>
            </ul>
        </div>
    </header>
    <section class="banner">
        <div class="banner-content">
            <h1>WITH ROCKY,</h1>
            <h1>YOU'RE ALWAYS EQUIPPED</h1>
        </div>
        <div class="banner-overlay"></div>
    </section>
    <section class="services">
        <div class="service-card">
            <h2>Borrow Equipment</h2>
            <p>Need Cisco equipment, a camera, or some cables for your project? The "Borrow Equipment" section makes it easy to borrow all the tools you need for your IT, CS, or MMA courses. Simply choose the gear you need, request it, and pick it up when it's ready!</p>
            <a href="equipmentBorrow.php">
                <button class="btn-class">Borrow Now</button>
            </a>
        </div>
        <div class="service-card">
            <h2>Reserve Facilities</h2>
            <p>Need a space for a class, project, or meeting? The "Reserve Facilities" section makes it simple to book Computer Labs, Media Rooms, Meeting Rooms, and more. Just choose the facility you need, reserve it, and you're all set!</p>
            <a href="facilitiesReservation.php">
                <button class="btn-class">Reserve Now</button>
            </a>
        </div>
    </section>
    <footer>
        <div class="footer-content">
            <p>Contact 6RockyKasiRolls for more information</p>
        </div>
    </footer>
    <script src="js/script.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
