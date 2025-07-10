<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
usertype();
checkadmin();
username();
checkAdminOrCustodian();
?>
    
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Equipments</title>
  <link rel="stylesheet" href="css/adminAccountManagement.css">
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
     <div class="main-container">
    <div class="dashboard-actions">
        <a href="index.php" class="back-link"><img src="../assets/images/back-icon.png" alt="Back Icon" class="back-icon">Back to Home</a>
        <h1 class="title">Accounts</h1>
        <a href="adminAddAccount.php" class="account-btn">Add Account</a>
    </div>

    <div class="parent-container">
      <div class="search-container">
          <input type="text" class="search-bar" placeholder="Search...">
          <select class="sort-dropdown">
              <option value="default">Sort by: Default</option>
              <option value="firstname">Sort by: First Name</option>
              <option value="lastname">Sort by: Last Name</option>
              <option value="usertype">Sort by: User Type</option>
          </select>
      </div>
      </div>

    <div class="table-container">
      <table class="account-table">
        <thead>
            <tr>
                <th>User Type</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
        </table>
    </div>

    <div id="userTypeModal" class="usertype-modal">
        <div class="usertype-modal-content">
        <span class="close" onclick="document.getElementById('userTypeModal').style.display='none'">&times;</span>
    <h2 class="usertype-header">Type of User</h2>
    <div class="user-selection">
            <select id="userType" name="userType">
                <option value="" disabled selected hidden>Select a user type</option>
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="custodian">Custodian</option>
            </select>
        </div>
        <button id="changeusertype" class="change-btn">Change</button>
        </div>
    </div>
<!-- Unified Modal (Suspend/Unsuspend) -->
<div id="suspendModal" class="suspend-modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="closeModal('suspendModal')">&times;</span>
        <h3 id="modalTitle">Confirm Suspend User</h3>
        <p id="modalText">Are you sure you want to suspend this user?</p>
        <p id="suspend-userId" style="display: none;"></p> <!-- Hidden field to store user ID -->
        <button id="confirmAction">Yes, Suspend</button>
        <button onclick="closeModal('suspendModal')">Cancel</button>
    </div>
</div>
    <!-- Edit Modal -->
    <div id="editModal" class="edit-modal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('editModal').style.display='none'">&times;</span>
        <h3>Edit User Details</h3>
        <p style="display: none;" id="edit-id"></p>
        <label for="edit-firstName">First Name: </label>
        <input type="text" id="edit-firstName" />

        <label for="edit-lastName">Last Name: </label>
        <input type="text" id="edit-lastName" />

        <label for="edit-email">Email: </label>
        <input type="email" id="edit-email" />

        <button id="saveChanges">Save Changes</button>
    </div>
    </div>


<!-- Delete Modal -->
<div id="deleteModal" class="delete-modal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('deleteModal').style.display='none'">&times;</span>
        <h3>Confirm Delete User</h3>
        <p>Are you sure you want to delete this user?</p>
        <p id="delete-userId" style="display: none;"></p> <!-- Hidden field to store user ID -->
        <button id="confirmDelete">Yes, Delete</button>
        <button class="cancel-btn" onclick="document.getElementById('deleteModal').style.display='none'">Cancel</button>
    </div>
</div>
</div>
</body>
<script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
<script src="js/adminAccountManagement.js"></script>
<script src="../php/NavbarName.js.php"></script>

<?php
require '../php/db_connect.php'; // Include database connection
// Fetch users from the database
$query = "SELECT userType, firstName, lastName, emailAddress FROM user";
$result = $conn->query($query);
?>

</html>
