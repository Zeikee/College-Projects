document.addEventListener("DOMContentLoaded", function () {
    // Dropdown Toggle for Equipment, Facilities, and Logout
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default anchor behavior

            // Close all dropdowns first
            document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(dropdown => {
                dropdown.style.display = 'none'; // Hide any dropdowns that are not the current one
            });

            const dropdown = this.nextElementSibling; // Get the next sibling (the dropdown menu)

            // Toggle the display of the clicked dropdown
            if (dropdown && dropdown.style.display === "block") {
                dropdown.style.display = "none"; // Close it if it's already open
            } else if (dropdown) {
                dropdown.style.display = "block"; // Open it if it's closed
            }

            event.stopPropagation(); // Prevent bubbling up to window click listener
        });
    });
    // Close all dropdowns if clicked outside
    window.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown-toggle')) { // Use closest for more accurate detection
            // Close all dropdown menus
            document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(dropdown => {
                dropdown.style.display = 'none'; // Hide all dropdowns
            });
        }
    });
    const editModal = document.getElementById("editModal");
    const DeleteModal = document.getElementById("delete-modal");
    window.onclick = function (event) {
        if (event.target == editModal) {
            editModal.style.display = "none";
        }else if (event.target == DeleteModal) {
            DeleteModal.style.display = "none";
        }
    };
    function closeOtherDropdowns(currentDropdown) {
        const allDropdowns = document.querySelectorAll(".actions-dropdown");
        allDropdowns.forEach((dropdown) => {
            if (dropdown !== currentDropdown) {
                dropdown.style.display = "none";
            }
        });
    }
    // Status item activation
    const statusItems = document.querySelectorAll(".status-item");

    statusItems.forEach((item) => {
        item.addEventListener("click", () => {
            // Remove active class from all items
            statusItems.forEach((i) => i.classList.remove("active"));

            // Add active class to the clicked item
            item.classList.add("active");

            const statusFilter = item.getAttribute("data-status");
            const tableRows = document.querySelectorAll(".equipment-table tbody tr");

            // Show or hide table rows based on the status filter
            tableRows.forEach((row) => {
                const status = row.querySelector(".status").classList[1]; // Get the status class
                if (statusFilter === "all" || status === statusFilter) {
                    row.style.display = ""; // Show row
                } else {
                    row.style.display = "none"; // Hide row
                }
            });
        });
    });
    
    function CheckAMPM(time) {
        const [hours, minutes] = time.split(':').map(Number);
        let period = "AM";
        let convertedHour = hours;
    
        if (hours >= 13) {
            period = "PM";
            convertedHour = hours - 12;
        } else if (hours === 0) {
            convertedHour = 12;
        }
        const formattedHour = convertedHour === 0 ? 12 : convertedHour; 
        const formattedMinute = minutes.toString().padStart(2, '0');
    
        return `${formattedHour}:${formattedMinute} ${period}`;
    }

    function renderTable(data, equipmentData, userData) {
        const tbody = document.querySelector('.equipment-table tbody');
        tbody.innerHTML = '';
    
        const equipmentMap = Object.fromEntries(
            equipmentData.map(equipment => [equipment.equipmentID, equipment.equipmentName])
        );
        const equipmentImage = Object.fromEntries(
            equipmentData.map(equipment => [equipment.equipmentID, equipment.ImagePath])
        );
        const userMap = Object.fromEntries(
            userData.map(user => [user.userId, user])
        );
    
        // Iterate over data and render rows
        data.forEach(item => {
            const dateRange = JSON.parse(item.startdateenddate);
            const timeRange = JSON.parse(item.starttimeendtime);
    
            const startDate = dateRange.startdate;
            const startTime = timeRange.starttime;
            const endDate = dateRange.enddate;
            const endTime = timeRange.endtime;
    
            const durationInDays = Math.ceil(
                (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
            );
    
            const equipment = equipmentMap[item.equipmentID] || { equipmentName: 'Unknown Equipment' };
            const user = userMap[item.userId] || { firstName: 'Unknown', lastName: 'User' };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.ID}</td>
                <td>${equipmentMap[item.equipmentID]}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${item.quantity}</td>
                <td>${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(startTime)}</td>
                <td>${new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(endTime)}</td>
                <td>${durationInDays}</td>
                <td>${item.purpose}</td>
                <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    <div class="actions-wrapper">
                        <button class="actions-btn">Actions</button>
                        <ul class="actions-dropdown" style="display: none;">
                            ${generateActionOptions(item.status.toLowerCase())}
 
                        </ul>
                    </div>
                </td>
                <td style="display: none;">${item.ID}</td>
                <td style="display: none;">${item.equipmentID}</td>
                <td style="display: none;">${equipmentImage[item.equipmentID]}</td>
            `;
            tbody.appendChild(row);
        });
    
        // Attach event listeners and update counters
        attachEquipmentActionListeners();
        updateStatusCounters();
    }
    function generateActionOptions(status) {
        switch(status){
            case "pending":
                return `
                <li class="action-item" data-action="accept">Accept</li>
                <li class="action-item" data-action="decline">Decline</li>
                <li class="action-item" data-action="edit">Edit</li>
                `;    
                break;
            case "accepted":
                return `
                <li class="action-item" data-action="cancelled">Cancel</li>
                `;  
                break;
            case "declined":
            case "cancelled":
                return `
                <li class="action-item" data-action="accept">Accept</li>
                <li class="action-item" data-action="delete">Delete</li>
                `;  
                break;
            case "active":
                return `
                <li class="action-item" data-action="returned">Returned</li>
                <li class="action-item" data-action="delete">Delete</li>
                `;  
                break;
            default:
                return `
                <li class="action-item" data-action="edit">Edit</li>
                <li class="action-item" data-action="delete">Delete</li>
                `;
                break;
        }
    }
    /** Attach Listeners to Equipment Actions */
    function attachEquipmentActionListeners() {
        const actionButtons = document.querySelectorAll(".actions-btn");
        const actionItems = document.querySelectorAll(".action-item");

        actionButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const dropdown = e.target.nextElementSibling;
                dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";

                closeOtherDropdowns(dropdown);
                event.stopPropagation();
            });
        });

        actionItems.forEach(item => {
            item.addEventListener("click", (e) => {
                const action = e.target.dataset.action;
                const row = e.target.closest("tr");
                const ID = item.closest('tr').querySelector('td').innerText;

                switch(action){
                    case "accept":
                        UpdateStatus(ID, "Accepted");
                        break;
                    case "cancelled":
                    case "decline":
                        UpdateStatus(ID, "Cancelled");
                        break;
                    case "edit":
                        openEditModal(row); 
                        break;
                    case "delete":
                        openDeleteModal(row);
                        break;
                    case "returned":
                        UpdateStatus(ID, "Returned");
                        break;
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.matches(".actions-btn")) {
                document.querySelectorAll(".actions-dropdown").forEach(dropdown => {
                    dropdown.style.display = "none";
                });
            }
        });
    }
    function UpdateStatus (EquipmentID, status) {
        localStorage.setItem('EquipmentStatusData', JSON.stringify({
            EquipmentID,
            status
        }));
        const EquipmentStatusFormData = JSON.parse(localStorage.getItem('EquipmentStatusData'));
        if (EquipmentStatusFormData) {
            fetch('../../php/update/EquipmentStatus.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(EquipmentStatusFormData) // 1 for suspend
            })
            .then(response => response.text())
            .then(data => {
                populateTable(); // Re-populate the table after suspension
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error. Please try again.');
            });
        }
    }
    function openEditModal(row) {  

        // Gather necessary data from the row
        const equipmentID = row.cells[10].textContent.trim();
        const equipmentName = row.cells[1].textContent.trim();
        const borrowedBy = row.cells[2].textContent.trim();
        const quantity = row.cells[3].textContent.trim();
    
        // Extract borrowing date and time
        const borrowingDate = row.cells[4].textContent.split(':')[0].trim();
        let borrowingTime = row.cells[4].textContent.split(':')[1]?.trim() || '';
        borrowingTime = formatTimeForInput(borrowingTime);
    
        // Extract return date and time
        const returnDate = row.cells[5].textContent.split(':')[0].trim();
        let returnTime = row.cells[5].textContent.split(':')[1]?.trim() || '';
        returnTime = formatTimeForInput(returnTime); 
    
        const purpose = row.cells[7].textContent || ''; 
        const status = row.cells[8].textContent.trim(); 
        const imagepath = row.cells[12].textContent.trim(); 
        // Populate modal fields with data
        document.getElementById("equipment-edit-id").value = equipmentID;
        document.getElementById("borrowedBy").value = borrowedBy;
        document.getElementById("editQuantity").value = quantity;
    
        // Set borrowing date and time
        document.getElementById("editBorrowingDate").value = new Date(borrowingDate).toISOString().split('T')[0];
        document.getElementById("editBorrowingTime").value = borrowingTime;
    
        // Set return date and time
        document.getElementById("editReturnDate").value = new Date(returnDate).toISOString().split('T')[0];
        document.getElementById("editReturnTime").value = returnTime;
    
        document.getElementById("equipment-edit-purpose").value = purpose;
        document.getElementById("status").value = status;
    
        // Display equipment image
        document.getElementById("equipment-image").src = imagepath;
        document.getElementById("equipment-label").textContent = equipmentName;

        // Show modal
        document.getElementById("editModal").style.display = "block"; 

        document.getElementById("saveChanges").addEventListener("click", function (event) {
            const NewQuantity = document.getElementById("editQuantity").value;
            const NewBorrowDate = document.getElementById("editBorrowingDate").value;
            const NewBorrowTime = document.getElementById("editBorrowingTime").value;
            const NewReturnDate = document.getElementById("editReturnDate").value;
            const NewReturnTime = document.getElementById("editReturnTime").value;
            const NewStatus = document.getElementById("status").value;
            const NewPurpose = document.getElementById("equipment-edit-purpose").value;
            //equipmenttransaction
            if (confirm("Are you sure with the changes you made?")) {
                localStorage.setItem('editEquipmentData', JSON.stringify({
                    idofrow:equipmentID,
                    quantity:NewQuantity,
                    startdate:NewBorrowDate,
                    starttime:NewBorrowTime,
                    enddate:NewReturnDate,
                    endtime:NewReturnTime,
                    status:NewStatus,
                    purpose:NewPurpose
                }));
    
                const editEquipmenFormtData = JSON.parse(localStorage.getItem('editEquipmentData'));
                if (editEquipmenFormtData) {
                    fetch('../../php/update/equipmenttransaction.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(editEquipmenFormtData),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update the data');
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById("editModal").style.display = "none"; 
                        populateTable();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('There was an error confirming Update of Equipment. Please try again.');
                    });
                }
            }
        });
    }
    
    // Helper function to format time for input (24-hour format)
    function formatTimeForInput(time) {
        if (!time) return '00:00'; // Default to midnight if no time is provided
        const parts = time.split(':');
        if (parts.length === 1) {
            // If only hours are provided, pad with zero
            return parts[0].padStart(2, '0') + ':00'; // Default to minutes and seconds
        } else if (parts.length === 2) {
            // If hours and minutes are provided, pad hours and minutes if necessary
            return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
        }
        return '00:00'; // Fallback
    }
    

    function openDeleteModal(row) {
    
        // Gather necessary data from the row
        const equipmentID = row.cells[10].textContent.trim();
        const equipmentName = row.cells[1].textContent.trim();
        const borrowedBy = row.cells[2].textContent.trim();
        const quantity = row.cells[3].textContent.trim();
        const imagePath = row.cells[12].textContent.trim();
        // Populate modal fields with data
        document.getElementById("delete-equipment-name").innerHTML = `<strong>Equipment Name:</strong> ${equipmentName}`;
        document.getElementById("borrowed-by-info").innerHTML = `<strong>Borrowed By:</strong> ${borrowedBy}`;
        document.getElementById("quantity-info").innerHTML = `<strong>Quantity:</strong> ${quantity}`;

        const equipmentImage = document.getElementById("equipment-image-delete");

        // Check if the image exists
        const img = new Image();
        img.onload = function() {
            equipmentImage.src = imagePath;
        };
        img.onerror = function() {
            equipmentImage.src = '../../assets/images/default-image.png'; 
        };
        img.src = imagePath;

        // Set the equipment label
        document.getElementById("equipment-label").textContent = equipmentName;
    
        // Store the equipment ID in a data attribute for later use
        const confirmDeleteButton = document.getElementById("confirmDeleteButton");
        confirmDeleteButton.setAttribute("data-equipment-id", equipmentID);
        
        // Show the delete modal
        document.getElementById("delete-modal").style.display = "block";   

        document.getElementById("confirmDeleteButton").addEventListener("click", function (event) {

            if (confirm("Are you sure with the changes you made?")) {
                localStorage.setItem('DeleteEquipmentData', JSON.stringify({
                    idofrow:equipmentID
                }));
    
                const DeleteEquipmentFormData = JSON.parse(localStorage.getItem('DeleteEquipmentData'));
                if (DeleteEquipmentFormData) {
                    fetch('../../php/delete/equipmenttransaction.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(DeleteEquipmentFormData),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete the data');
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById("delete-modal").style.display = "none"; 
                        populateTable();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('There was an error confirming Update of Equipment. Please try again.');
                    });
                }
            }
        });
    }

    // Function to close the delete modal
    function closeDeleteModal() {
        document.getElementById("delete-modal").style.display = "none";
    }
    
    // Function to handle the deletion
    document.getElementById("confirmDeleteButton").addEventListener("click", function() {
        const equipmentID = this.getAttribute("data-equipment-id");
        
        // Logic to delete the equipment (e.g., remove from an array or database)
        deleteEquipmentById(equipmentID); // Implement this function based on your data structure
    
        // Close the modal
        closeDeleteModal();
    });
    
    // Example function to delete equipment by ID
    function deleteEquipmentById(equipmentID) {
        // Find the index of the equipment with the given ID
        const index = equipmentList.findIndex(equipment => equipment.id === equipmentID);

        if (index !== -1) {
            // Remove the equipment from the array
            equipmentList.splice(index, 1);
            console.log(`Deleted equipment with ID: ${equipmentID}`);

            // Update the UI (e.g., remove the row from the table)
            updateEquipmentTable();
        } else {
            console.log(`Equipment with ID: ${equipmentID} not found.`);
        }
    }



    function populateTable(sortBy = "default") {
        // Fetch facilities data
        fetch('/../../php/fetch/users.php')
        .then(response => response.json())
        .then(userData => {
            fetch('/../../php/fetch/equipmentContent.php')
                .then(response => response.json())
                .then(equipmentData => {
                    // Fetch main data
                    return fetch('/../../php/fetch/equipmenttransactionContent.php')
                        .then(response => response.json())
                        .then(data => {
                            let sortedData;
                            switch(sortBy){
                                case "id":
                                    sortedData = data.sort((a, b) => {
                                        return a.ID - b.ID; 
                                    });
                                    break;
                                case "name": 
                                    sortedData = data.sort((a, b) => {
                                        const equipmentA = equipmentData.find(equipment => equipment.equipmentID === a.equipmentID).equipmentName;
                                        const equipmentB = equipmentData.find(equipment => equipment.equipmentID === b.equipmentID).equipmentName;
                                        return equipmentA.localeCompare(equipmentB);
                                    });
                                    break;
                                case "date": 
                                    sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                                    break;
                                default: 
                                    sortedData = data;
                                break;
                            }
                        
                            renderTable(sortedData, equipmentData,userData);
                        });
                })
        }).catch(error => console.error('Error fetching data:', error));
    }
    populateTable();
    const searchBar = document.querySelector(".search-bar");
    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value.toLowerCase();
        const EquipmentRows = document.querySelectorAll(".equipment-table tbody tr");

        EquipmentRows.forEach((row) => {
            const EquipmentID = row.cells[0].textContent.toLowerCase();
            const EquipmentName = row.cells[1].textContent.toLowerCase();
            const BorrowerName = row.cells[2].textContent.toLowerCase();
            const Quantity = row.cells[3].textContent.toLowerCase();
            
            // Show row if either name or ID matches the search value
            if (EquipmentID.includes(searchValue) || EquipmentName.includes(searchValue) || BorrowerName.includes(searchValue) || Quantity.includes(searchValue)) {
                row.style.display = ""; // Show row
            } else {
                row.style.display = "none"; // Hide row
            }
        });
    });
    const sortSelect = document.querySelector(".sort-select");
    sortSelect.addEventListener("change", (event) => {
        const sortBy = event.target.value;
        populateTable(sortBy);
    });
    function updateStatusCounters() {
        const statusTable = document.querySelector(".equipment-table");
        const rows = statusTable.getElementsByTagName("tr");
        const counters = {
            all: 0,
            pending: 0,
            accepted: 0,
            active: 0,
            returned: 0,
            overdue: 0,
            cancelled: 0
        };
    
        for (let i = 1; i < rows.length; i++) {
            const status = rows[i].cells[8].textContent.toLowerCase(); // Assuming status is in the seventh cell
            counters.all++; // Count all entries
            if (counters[status] !== undefined) {
                counters[status]++;
            }
        }
    
        // Update the display counters
        document.querySelector('.status-item[data-status="all"] .status-number').innerText = counters.all;
        document.querySelector('.status-item[data-status="pending"] .status-number').innerText = counters.pending;
        document.querySelector('.status-item[data-status="accepted"] .status-number').innerText = counters.accepted;
        document.querySelector('.status-item[data-status="active"] .status-number').innerText = counters.active;
        document.querySelector('.status-item[data-status="returned"] .status-number').innerText = counters.returned;
        document.querySelector('.status-item[data-status="overdue"] .status-number').innerText = counters.overdue;
        document.querySelector('.status-item[data-status="cancelled"] .status-number').innerText = counters.cancelled;
    }

    // Modal and Doughnut Chart Functionality
    const reportBtn = document.querySelector('.generate-report-btn');
    const modal = document.getElementById('reportModal');
    const closeBtn = document.querySelector('.close-button');

    reportBtn.addEventListener('click', function (event) {
        event.preventDefault();
        modal.style.display = 'flex'; // Make the modal visible
    
        // Render the charts after ensuring the modal is displayed
        setTimeout(() => {
            fetch('/../../php/fetch/equipmentContent.php')
                .then(response => response.json())
                .then(EquipmentContent => {
                    return fetch('/../../php/fetch/users.php')
                        .then(response => response.json())
                        .then(userData => {
                            return fetch('/../../php/fetch/equipmenttransactionContent.php')
                                .then(response => response.json())
                                .then(EquipmentTransaction => {
                                    return fetch('/../../php/fetch/equipmentCount.php')
                                    .then(response => response.json())
                                    .then(EquipmentCount => {
                                        // Data processing for equipment chart
                                        const equipmentBorrowCounts = [];
                                        const equipmentNames = {};
                                        
                                        EquipmentContent.forEach(equipment => {
                                            equipmentNames[equipment.equipmentID] = equipment.equipmentName;
                                        });
                                    
                                        EquipmentCount.forEach(item => {
                                            equipmentBorrowCounts[item.equipmentID] = item.quantity;
                                        });
                                    
                                        const equipmentLabels = Object.keys(equipmentBorrowCounts).map(
                                            id => equipmentNames[id]
                                        );
                                        const equipmentCounts = Object.values(equipmentBorrowCounts);
                                        renderDoughnutChart(
                                            'doughnutChart',
                                            ' ',
                                            equipmentLabels,
                                            equipmentCounts
                                        );
                                    
                                        // Data processing for student chart
                                        const studentBorrowCounts = {};
                                        const studentNames = {};
                                    
                                        userData.forEach(user => {
                                            studentNames[user.userId] = `${user.firstName} ${user.lastName}`;
                                        });
                                    
                                        EquipmentTransaction.forEach(item => {
                                            studentBorrowCounts[item.userId] =
                                                (studentBorrowCounts[item.userId] || 0) + 1;
                                        });
                                    
                                        const studentLabels = Object.keys(studentBorrowCounts).map(
                                            id => studentNames[id]
                                        );
                                        const studentCounts = Object.values(studentBorrowCounts);
                                    
                                        renderDoughnutChart(
                                            'studentDoughnutChart',
                                            ' ',
                                            studentLabels,
                                            studentCounts
                                        );
                                    });
                                });
                        });
                })
                closeModal('reportModal');
        }, 100); 
    });
        
        // Reusable function to render a doughnut chart
    function renderDoughnutChart(canvasId, title, labels, counts) {
        const ctx = document.getElementById(canvasId).getContext('2d');
    
        const data = {
            labels: labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                    ],
                    hoverOffset: 4,
                },
            ],
        };
    
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title,
                    },
                },
            },
        };
    
        new Chart(ctx, config);
    }

    if(usertype.includes("custodian")){
        document.getElementById("admin-feature-account-li").style.display = "none";
    }
});