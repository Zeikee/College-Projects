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
  <title>Equipments</title>
  <link rel="stylesheet" href="css/adminEquipmentManagement.css">
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
      <h1 class="title">Equipments</h1>
      <a href="adminAddEquipment.php" class="equipment-btn">Add Equipment</a>
  </div>

    <div class="parent-container">
      <div class="search-container">
          <input type="text" class="search-bar" placeholder="Search...">
          <select class="sort-dropdown">
              <option value="default">Sort by: Default</option>
              <option value="name">Sort by: Name</option>
              <option value="quantity">Sort by: Quantity</option>
              <option value="available">Sort by: Available</option>
              <option value="unavailable">Sort by: Unavailable</option>
          </select>
      </div>
      </div>
    <!-- Equipment Table -->
    <div class="table-container">
      <table class="equipment-table">
        <thead>
          <tr>
            <th>Equipment/s ID</th>
            <th>Equipment/s Name</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Unavailable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>

<!-- Edit Modal -->
<div id="edit-modal" class="modal-overlay">
    <div class="modal-container">
        <div class="modal-content">
            <span class="modal-close" onclick="document.getElementById('edit-modal').style.display='none'">&times;</span>
            <h2>Edit Equipment</h2>
            <img id="equipment-image" src="" alt="Equipment Image" style="max-width: 100%; height: auto; margin-bottom: 10px;">
            <label for="equipment-id">Equipment ID:</label>
            <input type="text" id="equipment-id" name="equipment-id" disabled>
            <label for="equipment-name">Equipment Name:</label>
            <input type="text" id="equipment-name" name="equipment-name">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity">
            <button id="confirmedit" class="edit-btn">Save Changes</button>
        </div>
    </div>
</div>

<!-- Modal for Delete -->
<div id="delete-modal" class="modal-overlay">
  <div class="modal-container">
    <div class="modal-content">
      <span class="modal-close" onclick="document.getElementById('delete-modal').style.display='none'">&times;</span>
      <h2>Delete Equipment</h2>
      <img id="delete-equipment-image" src="" alt="Equipment Image" style="max-width: 100%; height: auto; margin-bottom: 10px;">
      <p id="delete-equipment-name"></p>
      <p id="delete-equipment-id"></p>
      <p id="delete-equipment-quantity"></p>
      <p>Are you sure you want to delete this equipment?</p>
      <button type="button" class="delete-btn">Delete</button>
      <button type="button" class="cancel-btn" onclick="document.getElementById('delete-modal').style.display='none'">Cancel</button>
    </div>
  </div>
</div>

<script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
<script src="js/adminEquipmentManagement.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
