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
  <title>Facilities Management</title>
  <link rel="stylesheet" href="css/adminFacilitiesManagement.css">
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


    <!-- Title -->
    <div class="dashboard-actions">
      <a href="index.php" class="back-link"><img src="../assets/images/back-icon.png" alt="Back Icon" class="back-icon">Back to Home</a>
      <h1 class="title">Facilities</h1>
      <a href="adminAddFacilities.php" class="facility-btn">Add Facility</a>
  </div>

    <div class="parent-container">
      <div class="search-container">
          <input type="text" class="search-bar" placeholder="Search...">
          <select class="sort-dropdown">
              <option value="default">Sort by: Default</option>
              <option value="id">Sort by: ID</option>
              <option value="name">Sort by: Facility Name</option>
              <option value="roomnumber">Sort by: Room Number</option>
              <option value="totalseats">Sort by: Total Seats</option>
              <option value="totalseats">Sort by: Total Reserved Seats</option>
          </select>
      </div>
      </div>
    <!-- Facilities Table -->
    <div class="table-container">
      <table class="facility-table">
        <thead>
          <tr>
            <th>Facility ID</th>
            <th>Room/Facility Number</th>
            <th>Room/Facility Name</th>
            <th>Total Seat/s Available</th>
            <th>Total Seat/s Reserved</th>
            <th>Other Information</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>

<!-- Modal for Edit -->
<div id="edit-modal" class="modal-overlay">
  <div class="modal-container">
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h2>Edit Facility</h2>
      <form id="edit-form">
      <img id="facility-image" src="" alt="facility Image" style="max-width: 100%; height: auto; margin-bottom: 10px;">
        <label for="facility-id">Facility ID:</label>
        <input type="text" id="facility-id" name="facility-id" disabled>
        <label for="room_number">Room Number:</label>
        <input type="text" id="room_number" name="room_number">
        <label for="facility_name">Facility Name:</label>
        <input type="text" id="facility_name" name="facility_name">
        <label for="seats">Total Seats:</label>
        <input type="number" id="seats" name="seats">
        <label for="reserved_seats">Reserved Seats:</label>
        <input type="number" id="reserved_seats" name="reserved_seats">
        <label for="facility-info">Other Information:</label>
        <input type="text" id="facility-info" name="facility-info">
        <button type="button" class="edit-btn">Save Changes</button>
      </form>
    </div>
  </div>
</div>


<!-- Modal for Delete -->
<div id="delete-modal" class="modal-overlay">
  <div class="modal-container">
    <div class="modal-content">
      <div class="close-btn">&times;</div>
      <h2>Delete Facility</h2>
      <img id="delete-facility-image" src="" alt="Facility Image" style="max-width: 100%; height: auto; margin-bottom: 10px;">
      <p id="delete-facility-id"></p>
      <p id="delete-facility-number"></p>
      <p id="delete-facility-name"></p>
      <p id="delete-facility-info"></p>
      <p>Are you sure you want to delete this facility?</p>
      <button type="button" class="delete-btn">Delete</button>
      <button type="button" class="cancel-btn">Cancel</button>
    </div>
  </div>
</div>


<script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
<script src="js/adminFacilitiesManagement.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
