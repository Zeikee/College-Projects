document.addEventListener("DOMContentLoaded", function () {
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
    function closeOtherDropdowns(currentDropdown) {
        const allDropdowns = document.querySelectorAll(".actions-dropdown");
        allDropdowns.forEach((dropdown) => {
            if (dropdown !== currentDropdown) {
                dropdown.style.display = "none";
            }
        });
    }
    // Close all dropdowns if clicked outside
    window.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown-toggle')) { // Use closest for more accurate detection
            // Close all dropdown menus
            document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(dropdown => {
                dropdown.style.display = 'none'; // Hide all dropdowns
            });
        }
    });

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
                    case "rejected":
                        UpdateStatus(ID, "Rejected");
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
    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.matches(".actions-btn")) {
            document.querySelectorAll(".actions-dropdown").forEach(dropdown => {
                dropdown.style.display = "none";
            });
        }
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

    function renderTable(data,facilityData, userData) {
        const tbody = document.querySelector('.facility-table tbody'); // account-table
        tbody.innerHTML = '';

        const facilityMap = {};
        facilityData.forEach(facility => {
            facilityMap[facility.facilityID] = facility;
        });
        const facilityImage = {};
        facilityData.forEach(facility => {
            facilityImage[facility.facilityID] = facility.imagePath;
        });
        const userMap = {};
        userData.forEach(user => {
            userMap[user.userId] = user.firstName + ' ' + user.lastName;
        });

        data.forEach(item => {
            const dateObject = JSON.parse(JSON.stringify(item, null, 2));
            const DateRange = JSON.parse(dateObject.startdateenddate);
            const TimeRange = JSON.parse(dateObject.starttimeendtime);
    
            const startDate = DateRange.startdate;
            const startTime = TimeRange.starttime;
            const endDate = DateRange.enddate;
            const endTime = TimeRange.endtime;
    
            const timeDifference = new Date(endDate) - new Date(startDate);
            const durationInDays = timeDifference / (1000 * 60 * 60 * 24);
            const facilityObject = facilityMap[item.facilityID];

            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.ID}</td>
            <td>${facilityObject.facilityName}</td>
            <td>${userMap[item.userId]}</td>
            <td>${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(startTime)}</td>
            <td>${new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(endTime)}</td>
            <td>${item.Seats}</td>
            <td>${durationInDays}</td>
            <td>${item.purpose}</td>
            <td>${item.specialInstructions && item.specialInstructions.trim() !== '' ? item.specialInstructions : '<strong><em>N/A</em></strong>'}</td>
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
            <td style="display: none;">${facilityObject.facilityID}</td>
            <td style="display: none;">${facilityImage[item.facilityID]}</td>
        `;

            tbody.appendChild(row);
        });
        attachEquipmentActionListeners();
        updateStatusCounters();
    }
    function generateActionOptions(status) {
        switch(status){
            case "pending":
                return `
                <li class="action-item" data-action="accept">Accept</li>
                <li class="action-item" data-action="rejected">Reject</li>
                <li class="action-item" data-action="edit">Edit</li>
                `;    
                break;
            case "accepted":
                return `
                <li class="action-item" data-action="rejected">Reject</li>
                `;  
                break;
            case "rejected":
                return `
                <li class="action-item" data-action="accept">Accept</li>
                <li class="action-item" data-action="delete">Delete</li>
                `;  
                break;
            case "inprogress":
                return `
                <li class="action-item" data-action="delete">Delete</li>
                `;  
                break;
            default:
                return `
                <li class="action-item" data-action="delete">Delete</li>
                `;
                break;
        }
    }
    function populateTable(sortBy = "default") {
        fetch('../../php/fetch/facilityContent.php')
            .then(response => response.json())
            .then(facilityData => {
                fetch('../../php/fetch/facilitytransactionContent.php')
                    .then(response => response.json())
                    .then(data => {
                        fetch('../../php/fetch/users.php')
                        .then(response => response.json())
                        .then(userData=> {
                        let sortedData;
                        switch(sortBy){
                            case "name":
                                sortedData = data.sort((a, b) => {
                                    const facilityA = facilityData.find(facility => facility.facilityID === a.facilityID).facilityName;
                                    const facilityB = facilityData.find(facility => facility.facilityID === b.facilityID).facilityName;
                                    return facilityA.localeCompare(facilityB);
                                });
                                break;
                            case "id":
                                sortedData = data.sort((a, b) => a.ID.localeCompare(b.ID));
                                break;
                            case "date":
                                sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                                break;
                            default:
                                sortedData = data;
                                break;
                        }
                        renderTable(sortedData, facilityData, userData);
                    })
                    });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    populateTable();
    
    const searchBar = document.querySelector(".search-bar");
    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value.toLowerCase();
        const EquipmentRows = document.querySelectorAll(".facility-table tbody tr");

        EquipmentRows.forEach((row) => {
            const ReservationID = row.cells[0].textContent.toLowerCase();
            const FacilityName = row.cells[1].textContent.toLowerCase();
            const BorrowerName = row.cells[2].textContent.toLowerCase();
            
            // Show row if either name or ID matches the search value
            if (ReservationID.includes(searchValue) || FacilityName.includes(searchValue) || BorrowerName.includes(searchValue)) {
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

    function UpdateStatus (FacilityID, status) {
        localStorage.setItem('FacilityStatusData', JSON.stringify({
            FacilityID,
            status
        }));
        const FacilityStatusFormData = JSON.parse(localStorage.getItem('FacilityStatusData'));
        if (FacilityStatusFormData) {
            fetch('../../php/update/FacilityStatus.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FacilityStatusFormData) // 1 for suspend
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
    function updateStatusCounters() {
        const statusTable = document.querySelector(".facility-table");
        const rows = statusTable.getElementsByTagName("tr");
        const counters = {
            all: 0,
            pending: 0,
            inprogress: 0,
            accepted: 0,
            rejected: 0,
            done: 0
        };
    
        for (let i = 1; i < rows.length; i++) {
            const status = rows[i].cells[9].textContent.toLowerCase(); // Assuming status is in the seventh cell
            counters.all++; // Count all entries
            if (counters[status] !== undefined) {
                counters[status]++;
            }
        }
    
        // Update the display counters
        document.querySelector('.status-item[data-status="all"] .status-number').innerText = counters.all;
        document.querySelector('.status-item[data-status="pending"] .status-number').innerText = counters.pending;
        document.querySelector('.status-item[data-status="inprogress"] .status-number').innerText = counters.inprogress;
        document.querySelector('.status-item[data-status="accepted"] .status-number').innerText = counters.accepted;
        document.querySelector('.status-item[data-status="rejected"] .status-number').innerText = counters.rejected;
        document.querySelector('.status-item[data-status="done"] .status-number').innerText = counters.done;
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
                const tableRows = document.querySelectorAll(".facility-table tbody tr");
    
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

   // Modal and Doughnut Chart Functionality for Facilities
const reportBtn = document.querySelector('.generate-report-btn');
const modal = document.getElementById('reportModal');
const closeBtn = document.querySelector('.close-button');

reportBtn.addEventListener('click', function (event) {
    event.preventDefault();
    modal.style.display = 'flex'; // Make the modal visible

    // Render the charts after ensuring the modal is displayed
    setTimeout(() => {
        
        Promise.all([
            fetch('../../php/fetch/facilityContent.php'), // Fetch facility data
            fetch('../../php/fetch/users.php'), // Fetch user data
            fetch('../../php/fetch/facilitytransactionContent.php'), // Fetch transaction data
            fetch('../../php/fetch/facilityCount.php') // Fetch facility count data
        ])
        .then(responses => {
            // Check if all responses are OK
            responses.forEach(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            });
            return Promise.all(responses.map(response => response.json()));
        })
        .then(([FacilityContent, userData, FacilityTransaction, FacilityCount]) => {
            // Data processing for facility chart
            const facilityNames = {};
            FacilityContent.forEach(facility => {
                facilityNames[facility.facilityID] = facility.facilityName;
            });

            const facilityReservationCounts = {};
            FacilityCount.forEach(item => {
                facilityReservationCounts[item.facilityID] = (facilityReservationCounts[item.facilityID] || 0) + 1;
            });

            const facilityLabels = Object.keys(facilityReservationCounts).map(
                id => facilityNames[id] || id // Fallback to ID if name is not found
            );
            const facilityCounts = Object.values(facilityReservationCounts);

            renderDoughnutChart(
                'facilityDoughnutChart',
                '',
                facilityLabels,
                facilityCounts
            );

            // Data processing for student chart
            const studentBorrowCounts = {};
            const studentNames = {};
            userData.forEach(user => {
                studentNames[user.userId] = `${user.firstName} ${user.lastName}`;
            });

            FacilityTransaction.forEach(item => {
                studentBorrowCounts[item.userId] = (studentBorrowCounts[item.userId] || 0) + 1;
            });

            const studentLabels = Object.keys(studentBorrowCounts).map(
                id => studentNames[id] || id
            );
            const studentCounts = Object.values(studentBorrowCounts);

            renderDoughnutChart(
                'studentDoughnutChart',
                '',
                studentLabels,
                studentCounts
            );
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
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

    // Clear previous chart if it exists
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    // Create a new chart
    ctx.chart = new Chart(ctx, config);
}

function openEditModal(row) {
    // Gather necessary data from the row
    const reservationID = row.cells[0].textContent.trim();
    const facilityName = row.cells[1].textContent.trim();
    const reservedBy = row.cells[2].textContent.trim();
    const startDate = row.cells[3].textContent.split(':')[0].trim();
    const startTime = formatTimeForInput(row.cells[3].textContent.split(':')[1]?.trim() || '');
    const endDate = row.cells[4].textContent.split(':')[0].trim();
    const endTime = formatTimeForInput(row.cells[4].textContent.split(':')[1]?.trim() || '');
    const seats = row.cells[5].textContent.trim();
    const purpose = row.cells[7].textContent.trim();
    const specialInstructions = row.cells[8].textContent.trim();
    const status = row.cells[9].textContent.trim();
    const ImageURL = row.cells[13].textContent.trim();
    // Populate modal fields with data
    document.getElementById("reservation-edit-id").value = reservationID;
    document.getElementById("facility-name").value = facilityName;
    document.getElementById("reservedBy").value = reservedBy;
    document.getElementById("editStartDate").value = new Date(startDate).toISOString().split('T')[0];
    document.getElementById("editStartTime").value = startTime;
    document.getElementById("editEndDate").value = new Date(endDate).toISOString().split('T')[0];
    document.getElementById("editEndTime").value = endTime;
    document.getElementById("editSeats").value = seats;
    document.getElementById("editPurpose").value = purpose;
    document.getElementById("editSpecialInstructions").value = specialInstructions;
    document.getElementById("status").value = status;
    document.getElementById("facility-image").src = `../assets/${ImageURL}`;
    document.getElementById("facility-label").textContent = facilityName;

    // Show modal
    document.getElementById("editModal").style.display = "block"; 

    document.getElementById("saveChanges").addEventListener("click", function (event) {
        const NewStartDate = document.getElementById("editStartDate").value;
        const NewStartTime = document.getElementById("editStartTime").value;
        const NewEndDate = document.getElementById("editEndDate").value;
        const NewEndTime = document.getElementById("editEndTime").value;
        const NewSeats = document.getElementById("editSeats").value;
        const NewPurpose = document.getElementById("editPurpose").value;
        const NewSpecialInstruction = document.getElementById("editSpecialInstructions").value;
        const NewStatus = document.getElementById("status").value;

        //equipmenttransaction
        if (confirm("Are you sure with the changes you made?")) {
            localStorage.setItem('editFacilityData', JSON.stringify({
                idofrow:reservationID,
                purpose:NewPurpose,
                specialinstructions:NewSpecialInstruction,
                startdate:NewStartDate,
                starttime:NewStartTime,
                enddate:NewEndDate,
                endtime:NewEndTime,
                seats:NewSeats,
                status:NewStatus,
                switch:false
                
            }));

            const editFacilityFormData = JSON.parse(localStorage.getItem('editFacilityData'));
            if (editFacilityFormData) {
                fetch('../../php/update/facilitytransaction.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editFacilityFormData),
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
        return '00:00';
    }
    // Function to open the delete modal
    function openDeleteModal(button) {
        const row = button.closest('tr'); // Get the closest row
        const reservationID = row.cells[0].textContent.trim(); // Assuming ID is in the first cell
        console.log(reservationID);
        const reservationName = row.cells[1].textContent.trim(); // Assuming name is in the second cell
        const reservedBy = row.cells[2].textContent.trim(); // Assuming reserved by is in the third cell
        const quantity = row.cells[3].textContent.trim(); // Assuming quantity is in the fourth cell
        const imageUrl = row.cells[13].textContent.trim(); // Assuming image URL is in the fifth cell

        // Populate the modal with reservation data
        document.getElementById("delete-reservation-name").textContent = reservationName;
        document.getElementById("reserved-by-info").textContent = `Reserved by: ${reservedBy}`;
        document.getElementById("quantity-info").textContent = `Quantity: ${quantity}`;
        document.getElementById("reservation-image-delete").src = imageUrl.toLowerCase(); // Set the image source

        // Show the delete modal
        document.getElementById("delete-modal").style.display = "block"; 

        document.getElementById("confirmDeleteButton").addEventListener("click", function (event) {
            if (confirm("Are you sure with the changes you made?")) {
                localStorage.setItem('DeleteFacilityData', JSON.stringify({
                    facilityID:reservationID
                }));
    
                const DeleteFacilityFormData = JSON.parse(localStorage.getItem('DeleteFacilityData'));
                if (DeleteFacilityFormData) {
                    fetch('../../php/delete/facilitytransaction.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(DeleteFacilityFormData),
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

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            openDeleteModal(this); // Call the function to open the delete modal
        });
    });

    // Close the modal when the user clicks on <span> (x)
    document.querySelector('.close').addEventListener('click', closeDeleteModal);

    // Confirm delete action
    document.getElementById('confirmDeleteButton').addEventListener('click', function() {
        const reservationName = document.getElementById("delete-reservation-name").textContent;
        // Here you would add your delete logic (e.g., API call to delete the reservation)
        console.log(`Reservation ${reservationName} deleted.`); // Placeholder for delete action
        closeDeleteModal(); // Close the modal after deletion
    });
    if(usertype.includes("custodian")){
        document.getElementById("admin-feature-account-li").style.display = "none";
    }
}); 