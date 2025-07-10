<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
usertype();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facilities Dashboard</title>
    <link rel="icon" href="../assets/images/logo.png">
    <link rel="stylesheet" href="css/facilitiesDashboard.css">
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


    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1>Facilities Dashboard</h1>
            <div class="dashboard-actions">
                <a href="facilities.php" class="check-facilities">Check Available Facilities</a>
                <a href="facilitiesReservation.php" class="borrow-btn">Reserve Facility</a>
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

        <div class="filter-section">
            <input type="text" class="search-bar" placeholder="Search...">
            <select class="sort-select">
                <option value="default">Sort by: Default</option>
                <option value="name">Sort by: Name</option>
                <option value="id">Sort by: ID</option>
                <option value="date">Sort by: Date</option>
            </select>
        </div>

        <div class="table-container">
            <table class="facility-table">
                <thead>
                    <tr>
                        <th>Room/Facility Name</th>
                        <th>Start Date and time of Reservation</th>
                        <th>End Date and time of Reservation</th>
                        <th>No. of Day/s</th>
                        <th>Purpose</th>
                        <th>Special Instruction/s</th>
                        <th>Seats</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
 

<!-- Modal -->
<!-- Edit Modal -->
<div id="editModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('editModal').style.display='none'">&times;</span>
        <h3>Edit Facility Details</h3>
        <div>
        <img id="image-edit-details" src="" alt="Facility Details Image" style="max-width: 100%; height: auto;">
        </div>
        <p style="display: none;" id="edit-id"></p>
        <label for="edit-room">Room/Facility: </label>
        <input type="text" id="edit-room" readonly />

        <!-- Flexbox Container for Start Reservation Date and Time -->
        <div class="edit-container">
            <div class="edit-item">
                <label for="edit-startDate">Start Reservation Date: </label>
                <input type="date" id="edit-startDate" readonly />
            </div>
            <div class="edit-item">
                <label for="edit-startTime">Start Reservation Time: </label>
                <input type="time" id="edit-startTime" readonly />
            </div>
        </div>

        <!-- Flexbox Container for End Reservation Date and Time -->
        <div class="edit-container">
            <div class="edit-item">
                <label for="edit-endDate">End Reservation Date: </label>
                <input type="date" id="edit-endDate" readonly />
            </div>
            <div class="edit-item">
                <label for="edit-endTime">End Reservation Time: </label>
                <input type="time" id="edit-endTime" readonly />
            </div>
        </div>

        <label for="edit-NoOfDays">No. of Days:</label>
        <input type="text" id="edit-NoOfDays" placeholder="Enter No. of Days" readonly />

        <label for="edit-purpose">Purpose: </label>
        <input type="text" id="edit-purpose" placeholder="Enter the purpose" />
    
        <label for="edit-instructions">Special Instructions: </label>
        <input type="text" id="edit-instructions" placeholder="Edit Instructions" />
        <p style="display: none;" id="facility-edit-status"></p>
        <button id="saveChanges">Save Changes</button>
    </div>
</div>


<!-- Detail Modal -->
<div id="detailModal" class="modal">
    <div class="modal-content">
        <span id="closeDetailModal" class="close" onclick="document.getElementById('detailModal').style.display='none'">&times;</span>
        <h2>Facility Details</h2>
        <div>
        <img id="image-show-details" src="" alt="Facility Details Image" style="max-width: 100%; height: auto;">
        </div>
        <br>
        <p><strong>Reservation ID:</strong> <span id="modal-id"></span></p>
        <p><strong>Room/Facility Name:</strong> <span id="modal-name"></span></p>
        <p><strong>Start of Reservation Date:</strong> <span id="modal-startReservation"></span></p>
        <p><strong>Start of Reservation Time:</strong> <span id="modal-startTime"></span></p>
        <p><strong>End of Reservation Date:</strong> <span id="modal-endReservation"></span></p>
        <p><strong>End of Reservation Time:</strong> <span id="modal-endTime"></span></p>
        <p><strong>Number of Days:</strong> <span id="modal-no-of-days"></span></p>
        <p><strong>Purpose:</strong> <span id="modal-purpose"></span></p>
        <p><strong>Status:</strong> <span id="modal-status"></span></p>
        <div class="action-buttons">
<a href="facilitiesReservation.php" class="borrow-again-btn">Borrow Again</a>
            </div>
        </div>
    </div>



    <script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
    <script>var userId = <?php echo json_encode(htmlspecialchars($_SESSION["userId"], ENT_QUOTES, 'UTF-8')); ?>;</script>
    <script src="js/facilitiesDashboard.js"></script>
    <script src="js/script.js"></script>
<script src="../php/NavbarName.js.php"></script>
</body>
</html>
