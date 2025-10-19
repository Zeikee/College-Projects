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
    <title>Equipment Lending Dashboard</title>
    <link rel="stylesheet" href="css/equipmentLendingDashboard.css">
    <link rel="stylesheet" href="css/homepage.css">
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


    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1>Equipment Lending Dashboard</h1>
            <div class="dashboard-actions">
                <a href="equipments.php" class="check-equipment">Check Available Equipments</a>
                <a href="borrowForm.php" class="borrow-btn">Borrow Equipment</a>
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
            <div class="status-item" data-status="active">
                <span class="status-number">#</span>
                <span class="status-label">Active</span>
            </div>
            <div class="status-item" data-status="done">
                <span class="status-number">#</span>
                <span class="status-label">Done/Returned</span>
            </div>
            <div class="status-item" data-status="overdue">
                <span class="status-number">#</span>
                <span class="status-label">Overdue</span>
            </div>
            <div class="status-item" data-status="rejected">
                <span class="status-number">#</span>
                <span class="status-label">Rejected</span>
            </div>
            <div class="status-item" data-status="cancelled">
                <span class="status-number">#</span>
                <span class="status-label">Cancelled</span>
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

        
            <table class="equipment-table">
                <thead>
                    <tr>
                        <th>Borrow ID</th>
                        <th>Equipment Name</th>
                        <th>Equipment ID</th>
                        <th>Quantity</th>
                        <th>Borrowing Date/Time</th>
                        <th>Return Date/Time</th>
                        <th>No of Days</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                   
                </tbody>
            </table>
        
    </div>

    <!-- Modal -->
    <!-- Edit Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('editModal').style.display='none'">&times;</span>
            <h3>Edit Borrowing Details</h3>
            <p style="display: none;" id="equipmentID-edit"></p>
            <p style="display: none;" id="equipment-edit-id"></p>
            <label for="editQuantity">Quantity:</label>
            <input type="text" id="editQuantity" />
        
            <label for="editBorrowingDate">Borrowing Date:</label>
            <input type="date" id="editBorrowingDate" />
        
            <label for="editBorrowingTime">Borrowing Time:</label>
            <input type="time" id="editBorrowingTime" placeholder="HH:MM" />
        
            <label for="editReturnDate">Return Date:</label>
            <input type="date" id="editReturnDate" />
        
            <label for="editReturnTime">Return Time:</label>
            <input type="time" id="editReturnTime" placeholder="HH:MM" />

            <label for="equipment-edit-purpose">Purpose: </label>
            <input type="text" id="equipment-edit-purpose" placeholder="Enter the purpose" />

            <button id="saveChanges">Save Changes</button>
        </div>
    </div>

    <div id="detailModal" class="modal">
        <div class="modal-content">
            <span class="close"onclick="document.getElementById('detailModal').style.display='none'">&times;</span>
            <h2>Equipment Details</h2>
            <p><strong>Name:</strong> <span id="modal-name"></span></p>
            <p><strong>ID:</strong> <span id="modal-id"></span></p>
            <p><strong>Quantity:</strong> <span id="modal-quantity"></span></p>
            <p><strong>Borrowing Date:</strong> <span id="modal-borrowing-date"></span></p>
            <p><strong>Return Date:</strong> <span id="modal-return-date"></span></p>
            <p><strong>Number of Days:</strong> <span id="modal-no-of-days"></span></p>
            <p><strong>Purpose:</strong> <span id="modal-purpose"></span></p>
            <p><strong>Status:</strong> <span id="modal-status"></span></p>
        </div>
    </div>
    
    <script>var usertype = <?php echo json_encode(htmlspecialchars($_SESSION["userType"], ENT_QUOTES, 'UTF-8')); ?>;</script>
    <!-- Websocket.js for configuration of websockets -->
    <script src="js/websocket.js"></script>
    <script src="js/equipmentLendingDashboard.js"></script>
    <script src="js/script.js"></script>
    <script src="js/NavbarName.js.php"></script>
</body>
</html>
