<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
checkAdminOrCustodian();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Add Facilities</title>
  <link rel="stylesheet" href="css/adminAddFacilities.css">
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
    <h1>Add a Facility</h1>
    <div class="add-facility-container">
    <img id="default-image" src="../assets/images/classroom.png" alt="Facilities" class="add-facility-image">
      <h2>FACILITIES</h2>
    <form id="addFacilityForm" action="adminAddFacilities.php" method="POST">
        <!-- File upload input -->
        <div class="image-upload-wrap">
            <img id="preview-image" alt="Uploaded Preview">
            <label class="imageUpload" for="image-upload">Upload Image</label>
            <input id="image-upload" type="file" name="facility_image" accept="image/*" class="image-input">
        </div>
        <input id="NewFacilityRoomNumber" type="text" name="room_number" placeholder="Facility Number" required>
        <input id="NewFacilityName" type="text" name="facility_name" placeholder="Facility Name" required>
        <input id="NewFacilitySeats" type="text" name="total_seats" placeholder="Total Seats" required>
        <input id="OtherInfo" type="text" name="other_info" placeholder="Facility Description" required>
        <button type="submit" name="add_facility">Add</button>
    </form>
    </div>
    <script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
<script src="js/adminAddFacilities.js"></script>
<script src="../php/NavbarName.js.php"></script>

</body>
</html>
