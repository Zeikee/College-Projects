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
    <link rel="stylesheet" href="css/adminFacilitiesDashboard.css">
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
            <h2>Facilities Dashboard</h2>
                <div class="dashboard-actions">
                    <a href="adminAddFacilities.php" class="add-btn">Add Facility</a>
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
            <div class="status-item" data-status="inprogress">
                <span class="status-number">#</span>
                <span class="status-label">In Progress</span>
            </div>
            <div class="status-item" data-status="accepted">
                <span class="status-number">#</span>
                <span class="status-label">Accepted</span>
            </div>
            <div class="status-item" data-status="rejected">
                <span class="status-number">#</span>
                <span class="status-label">Rejected</span>
            </div>
            <div class="status-item" data-status="done">
                <span class="status-number">#</span>
                <span class="status-label">Done</span>
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
            <table class="facility-table">
                <thead>
                    <tr>
                        <th>Reservation ID</th>
                        <th>Reservation Name</th>
                        <th>Reserved By:</th>
                        <th>Start Date/s and time of Reservation</th>
                        <th>End Date/s and time of Reservation</th>
                        <th>Seat/s Reserved</th>
                        <th>No. of Day/s</th>
                        <th>Purpose</th>
                        <th>Special Instructions</th>
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
                <h3>Most Reserved Facilities</h3>
                <canvas id="facilityDoughnutChart" width="400" height="400"></canvas>
            </div>
            <div class="chart-wrapper">
                <h3>Top Borrowing Students</h3>
                <canvas id="studentDoughnutChart" width="400" height="400"></canvas>
            </div>
        </div>
    </div>
</div>

 <!-- Edit Modal -->
<div id="editModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('editModal').style.display='none'">&times;</span>
        <h3>Edit Reservation Details</h3>
        
        <div class="image-container" id="image-container">
            <img id="facility-image" src="" alt="Reservation Image" />
            <p id="facility-label"></p>
        </div>
        
        <label for="reservation-id">Reservation ID:</label>
        <input type="text" id="reservation-edit-id" disabled />
        
        <label for="facility-name">Facility Name:</label>
        <input type="text" id="facility-name" disabled />

        <label for="reservedBy">Reserved By:</label>
        <input type="text" id="reservedBy" disabled/>

        <label for="editStartDate">Start Date:</label>
        <input type="date" id="editStartDate" />

        <label for="editStartTime">Start Time:</label>
        <input type="time" id="editStartTime" />

        <label for="editEndDate">End Date:</label>
        <input type="date" id="editEndDate" />

        <label for="editEndTime">End Time:</label>
        <input type="time" id="editEndTime" />

        <label for="editSeats">Seats Reserved:</label>
        <input type="number" id="editSeats" />

        <label for="editPurpose">Purpose:</label>
        <input type="text" id="editPurpose" />

        <label for="editSpecialInstructions">Special Instructions:</label>
        <input type="text" id="editSpecialInstructions" />

        <label for="status">Status:</label>
        <select id="status">
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
        </select>

        <button id="saveChanges">Save Changes</button>
    </div>
</div>

<!-- Delete Modal -->
<div id="delete-modal" class="modal" style="display: none;">
    <div class="modal-container">
        <div class="modal-content">
            <!-- Close Button -->
            <span class="close" onclick="document.getElementById('delete-modal').style.display='none'">&times;</span>
            
            <!-- Image Display -->
            <div>
                <img id="reservation-image-delete" src="" alt="Reservation Image" style="max-width: 100%; height: auto;">
            </div>
            
            <!-- Reservation Details -->
            <span id="delete-reservation-name"></span>
            <p id="reservation-label"></p>
            <p id="reserved-by-info"></p>
            <p id="quantity-info"></p>
            <p>Are you sure you want to delete this reservation?</p>
            
            <!-- Action Buttons -->
            <button type="button" class="delete-btn" id="confirmDeleteButton">Delete</button>
            <button type="button" class="cancel-btn" onclick="document.getElementById('delete-modal').style.display='none'">Cancel</button>
        </div>
    </div>
</div>

<script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="js/adminFacilitiesDashboard.js"></script>
<script src="../php/NavbarName.js.php"></script>

<style>
    .image-container img {
        max-width: 540px;
        max-height: 450px;
        height: auto;
        object-fit: cover;
    }
</style>
</body>

</html>