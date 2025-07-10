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
    <title>Dashboard</title>
    <link rel="icon" href="../assets/images/logo.png">
    <link rel="stylesheet" href="../admin/css/adminEquipmentDashboard.css">
    <link rel="stylesheet" href="css/adminHomePage.css">
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

    <div class="dashboard-container">
        <div class="dashboard-header">
            <h2>Equipment Lending Dashboard</h2>
                <div class="dashboard-actions">
                    <a href="adminAddEquipment.php" class="add-btn">Add Equipment</a>
                </div>
        </div>

        <div class="status-counters">
            <div class="status-item" data-status="all">
                <span class="status-number">#</span>
                <span class="status-label">All</span>
            </div>
            <div class="status-item" data-status="pending">
                <span class="status-number">#</span>
                <span class="status-label">Pending</span>
            </div>
            <div class="status-item" data-status="accepted">
                <span class="status-number">#</span>
                <span class="status-label">Accepted</span>
            </div>
            <div class="status-item" data-status="active">
                <span class="status-number">#</span>
                <span class="status-label">Active</span>
            </div>
            <div class="status-item" data-status="returned">
                <span class="status-number">#</span>
                <span class="status-label">Returned</span>
            </div>
            <div class="status-item" data-status="overdue">
                <span class="status-number">#</span>
                <span class="status-label">Overdue</span>
            </div>
            <div class="status-item" data-status="cancelled">
                <span class="status-number">#</span>
                <span class="status-label">Cancelled/ <br>Declined</span>
            </div>
        </div>

        <div class="dashboard-controls">
            <div class="search-and-sorting">
              <input class="search-bar" type="text" placeholder="Search...">
              <select class="sort-select">
                <option value="default">Sort by: Default</option>
                <option value="id">Sort by: ID</option>
                <option value="name">Sort by: Name</option>
                <option value="date">Sort by: Date</option>
            </select>
            </div>
            <div class="report">
              <a href="#" class="generate-report-btn">Generate Report</a>
            </div>
          </div>

        <div class="table-container">
            <table class="equipment-table">
                <thead>
                    <tr>
                        <th>Equipment ID</th>
                        <th>Equipment/s Name</th>
                        <th>Borrowed By</th>
                        <th>Quantity </th>
                        <th>Borrowing Date</th>
                        <th>Return Date</th>
                        <th>No. of Days</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>


    <!-- Modal -->
    <div id="reportModal" class="report-modal" style="display: none;">
    <div class="report-modal-content">
    <span class="close-button" onclick="document.getElementById('reportModal').style.display='none'">&times;</span>
        <h3 class="report-title">Generated Report</h3>
        <div class="charts-container">
            <div class="chart-wrapper">
                <h3>Most Borrowed Equipment</h3>
                <canvas id="doughnutChart" width="400" height="400"></canvas>
            </div>
            <div class="chart-wrapper">
                <h3>Top Borrowing Students</h3>
                <canvas id="studentDoughnutChart" width="400" height="400"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Edit Modal -->
<div id="editModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('editModal').style.display='none'">&times;</span>
        <h3>Edit Equipment Borrowing Details</h3>
        
        <div class="image-container" id="image-container">
            <img id="equipment-image" src="" alt="Equipment Image" />
            <p id="equipment-label"></p>
        </div>
        
        <label for="equipment-id">Equipment ID:</label>
        <input type="text" id="equipment-edit-id" disabled />
        <label for="borrowedBy">Borrowed By:</label>
        <input type="text" id="borrowedBy" disabled />

        <label for="editQuantity">Quantity:</label>
        <input type="number" id="editQuantity" />

        <label for="editBorrowingDate">Borrowing Date:</label>
        <input type="date" id="editBorrowingDate" />

        <label for="editBorrowingTime">Borrowing Time:</label>
        <input type="time" id="editBorrowingTime" />

        <label for="editReturnDate">Return Date:</label>
        <input type="date" id="editReturnDate" />

        <label for="editReturnTime">Return Time:</label>
        <input type="time" id="editReturnTime" />

        <label for="status">Status:</label>
        <select id="status">
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
        </select>

        <label for="equipment-edit-purpose">Purpose: </label>
        <input type="text" id="equipment-edit-purpose"/>

        <button id="saveChanges">Save Changes</button>
    </div>
</div>


<!-- Modal for Delete -->
<div id="delete-modal" class="modal" style="display: none;">
  <div class="modal-container">
    <div class="modal-content">
<span class="close" onclick="document.getElementById('delete-modal').style.display='none'">&times;</span>
      <div>
    <img id="equipment-image-delete" src="" alt="Equipment Image" style="max-width: 100%; height: auto;">
</div>
      <span id="delete-equipment-name"></span><p id="equipment-label"></p>
      <p id="borrowed-by-info"></p>
      <p id="quantity-info"></p>
      <p>Are you sure you want to delete this equipment?</p>
      
      <button type="button" class="delete-btn" id="confirmDeleteButton">Delete</button>
      <button type="button" class="cancel-btn" onclick="closeDeleteModal()">Cancel</button>
    </div>
  </div>
</div>
<script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/adminEquipmentDashboard.js"></script>
    <script src="../php/NavbarName.js.php"></script>
    <style>
        .image-container img{
            max-width: 540px;
            max-height: 450px;
            height: auto;
            object-fit: cover;
        }
    </style>
</body>

</html>