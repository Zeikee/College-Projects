//Initialize Websocket
const ws = new WebSocket(window.websocket.connection);
ws.onopen = function(event){
    console.log('Connected to the server.');
    ws.onmessage = function(event) {
        const parsedData = JSON.parse(event.data);
        const action = parsedData.action;
        if (action === 'update') {
            populateTable();
        }
    };
};
//Initialize Websocket end
const getRunningScript = () => {
    return decodeURI(new Error().stack.match(/([^ \n\(@])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)[0])
}
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

function renderTable(data, equimentData) {
    const tbody = document.querySelector('.equipment-table tbody');
    tbody.innerHTML = '';

    const equipmentMap = {};
    equimentData.forEach(equipment => {
        equipmentMap[equipment.equipmentID] = equipment;
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
        const equipmentObject = equipmentMap[item.equipmentID];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.ID}</td>
            <td>${equipmentObject.equipmentName}</td>
            <td>${equipmentObject.equipmentID}</td>
            <td>${item.quantity}</td>
            <td>${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(startTime)}</td>
            <td>${new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(endTime)}</td>
            <td>${durationInDays + 1}</td>
            <td>${item.purpose}</td>
            <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>
                <div class="actions-wrapper">
                    <button class="actions-btn">Actions</button>
                    <ul class="actions-dropdown" style="display: none;">
                        ${generateActionOptions(item.status)}
                    </ul>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachActionListeners();
    updateStatusCounters();
}
function populateTable(sortBy = "default") {
    // Fetch facilities data
    fetch(getRunningScript() + '/../../php/fetch/equipmentContent.php')
        .then(response => response.json())
        .then(equipmentData => {
            // Fetch main data
            return fetch(getRunningScript() + '/../../php/fetch/equipmenttransactionContent.php')
                .then(response => response.json())
                .then(data => {
                    let sortedData;

                    // Sort the data based on the sortBy parameter
                    if (sortBy === "default") {
                        sortedData = data; // Keep the original order
                    } else if (sortBy === "name") {
                        sortedData = data.sort((a, b) => {
                            const facilityA = equipmentData.find(facility => facility.equipmentID === a.equipmentID).equipmentName;
                            const facilityB = equipmentData.find(facility => facility.equipmentID === b.equipmentID).equipmentName;
                            return facilityA.localeCompare(facilityB);
                        });
                    } else if (sortBy === "id") {
                        sortedData = data.sort((a, b) => a.ID.localeCompare(b.ID));
                    } else if (sortBy === "date") {
                        sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                    }

                    // Render the table with sorted data
                    renderTable(sortedData, equipmentData);
                });
        })
        .catch(error => console.error('Error fetching data:', error));
}
function generateActionOptions(status) {
    console.log("user Type: ", usertype);
    if(usertype.includes("student")){
        if (status === "Pending") {
            return `
                <li class="action-item" data-action="cancel">Cancel</li>
                <li class="action-item show-details" data-action="show-details">Show More Details</li>
                <li class="action-item" data-action="edit">Edit</li>
                <li class="action-item" data-action="delete">Delete</li>
            `;
        } else {
            return `
                 <li class="action-item show-details" data-action="show-details">Show More Details</li>
            `;
        }
    }else if(usertype.includes("faculty")){
        if (status === "Pending") {
            return `
                <li class="action-item" data-action="cancel">Cancel</li>
                <li class="action-item show-details" data-action="show-details">Show More Details</li>
                <li class="action-item" data-action="edit">Edit</li>
                <li class="action-item" data-action="delete">Delete</li>
                <li class="action-item" data-action="reject">Accept</li>
                <li class="action-item" data-action="reject">Reject</li>
            `;
        } else {
            return `
                 <li class="action-item show-details" data-action="show-details">Show More Details</li>
            `;
        }
    }else if(usertype.includes("admin")){
        if (status === "Pending") {
            return `
                <li class="action-item" data-action="cancel">Cancel</li>
                <li class="action-item show-details" data-action="show-details">Show More Details</li>
                <li class="action-item" data-action="edit">Edit</li>
                <li class="action-item" data-action="delete">Delete</li>
                <li class="action-item" data-action="reject">Reject</li>
                <li class="action-item" data-action="reject">Ban user</li>
            `;
        } else {
            return `
                 <li class="action-item show-details" data-action="show-details">Show More Details</li>
            `;
        }
    }
}
function updateStatusCounters() {
    const statusTable = document.querySelector(".equipment-table");
    const rows = statusTable.getElementsByTagName("tr");
    const counters = {
        all: 0,
        pending: 0,
        active: 0,
        done: 0,
        cancelled: 0,
        rejected: 0,
        overdue: 0
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
    document.querySelector('.status-item[data-status="done"] .status-number').innerText = counters.done;
    document.querySelector('.status-item[data-status="cancelled"] .status-number').innerText = counters.cancelled;
    document.querySelector('.status-item[data-status="active"] .status-number').innerText = counters.active;
    document.querySelector('.status-item[data-status="rejected"] .status-number').innerText = counters.rejected;
    document.querySelector('.status-item[data-status="overdue"] .status-number').innerText = counters.overdue;
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar");

    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value.toLowerCase();
        const equipmentRows = document.querySelectorAll(".equipment-table tbody tr");

        equipmentRows.forEach((row) => {
            const equipmentName = row.cells[0].textContent.toLowerCase();
            const equipmentId = row.cells[1].textContent.toLowerCase();
            // Show row if either name or ID matches the search value
            if (equipmentName.includes(searchValue) || equipmentId.includes(searchValue)) {
                row.style.display = ""; // Show row
            } else {
                row.style.display = "none"; // Hide row
            }
        });
    });

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

    // Populate the initial table
    populateTable();
    
   // Add sorting event listener
   const sortSelect = document.querySelector(".sort-select");
   sortSelect.addEventListener("change", (event) => {
       const sortBy = event.target.value;
   
       // Fetch facilities data based on sort option
       fetch(getRunningScript() + '/../../php/fetch/equipmentContent.php')
           .then(response => response.json())
           .then(equipmentData => {
               return fetch(getRunningScript() + '/../../php/fetch/equipmenttransactionContent.php')
                   .then(response => response.json())
                   .then(data => {
                       let sortedData;
   
                       // Sort the data based on the selected criteria
                       if (sortBy === "default") {
                           sortedData = data; // Keep the original order
                       } else if (sortBy === "name") {
                           sortedData = data.sort((a, b) => {
                               const equipmentA = equipmentData.find(equipment => equipment.equipmentID === a.equipmentID).equipmentName;
                               const equipmentB = equipmentData.find(equipment => equipment.equipmentID === b.equipmentID).equipmentName;
                               return equipmentA.localeCompare(equipmentB);
                           });
                       } else if (sortBy === "id") {
                        sortedData = data;
                       } else if (sortBy === "date") {
                           sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                       }
                       renderTable(sortedData, equipmentData);
                   });
           })
           .catch(error => console.error('Error fetching data:', error));
   });
});
function attachActionListeners() {
    const actionButtons = document.querySelectorAll(".actions-btn");
    actionButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const dropdown = button.nextElementSibling; // Get the dropdown menu
            const isVisible = dropdown.style.display === "block";
            dropdown.style.display = isVisible ? "none" : "block"; // Toggle dropdown visibility

            // Close other dropdowns
            closeOtherDropdowns(dropdown);
            event.stopPropagation(); // Prevent click event from bubbling up
        });
    });

    const actionItems = document.querySelectorAll(".action-item");
    actionItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            const action = event.currentTarget.getAttribute("data-action");
            const row = event.currentTarget.closest("tr");

            switch(action){
                case "edit":
                    openEditModal(row);
                break;
                case "show-details":
                    openDetailModal(row);
                break;
                case "cancel":
                    const statusCell = row.querySelector(".status");
                    statusCell.textContent = "Cancelled";
                    statusCell.classList.remove("pending");
                    statusCell.classList.add("cancelled");
                    updateStatusCounters();
                break;
                case "delete":
                    if (confirm("Are you sure you want to delete this item?")) {
                        const idofrow = row.cells[0].textContent;
                        localStorage.setItem('equipmentDeleteData', JSON.stringify({
                            idofrow
                        }));
            
                        const deleteFormData = JSON.parse(localStorage.getItem('equipmentDeleteData'));
                        if (deleteFormData) {
                            fetch('php/delete/equipmenttransaction.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(deleteFormData),
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete data');
                                }
                                return response.text();
                            })
                            .then(data => {
                                console.log(data);
                                window.location.href = 'equipmentLendingDashboard.php';
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('There was an error confirming the borrow. Please try again.');
                            });
                        }
                    }
                break;
            }
            // Close the dropdown after an action is clicked
            const dropdown = row.querySelector(".actions-dropdown");
            dropdown.style.display = "none";
        });
    });
}

function closeOtherDropdowns(currentDropdown) {
    const allDropdowns = document.querySelectorAll(".actions-dropdown");
    allDropdowns.forEach((dropdown) => {
        if (dropdown !== currentDropdown) {
            dropdown.style.display = "none";
        }
    });
}

document.addEventListener("click", (event) => {
    const dropdowns = document.querySelectorAll(".actions-dropdown");
    dropdowns.forEach((dropdown) => {
        dropdown.style.display = "none"; // Close dropdowns if clicking outside
    });
});

const editModal = document.getElementById("editModal");
const detailModal = document.getElementById("detailModal");
const closeEditModal = editModal.querySelector(".close");
const closeDetailModal = detailModal.querySelector(".close-button");

function openEditModal(row) {
    //Gather inputs
    const quantity = row.cells[3].textContent;
    const borrowingDateTime = row.cells[4].textContent;
    const startDateTime = new Date(borrowingDateTime);
    const startDate = startDateTime.toISOString().split('T')[0];
    const startTime = startDateTime.toTimeString().split(' ')[0].slice(0, 5);
    const returnDateTIme = row.cells[5].textContent;
    const endDateTime = new Date(returnDateTIme);
    const endDate = endDateTime.toISOString().split('T')[0];
    const endTime = endDateTime.toTimeString().split(' ')[0].slice(0, 5);

    //Rewrite inputs
    document.getElementById("equipmentID-edit").textContent = row.cells[2].textContent;
    document.getElementById("equipment-edit-id").textContent = row.cells[0].textContent;
    document.getElementById("editQuantity").value = quantity;
    document.getElementById("editBorrowingDate").value = startDate;
    document.getElementById("editBorrowingTime").value = startTime;
    document.getElementById("editReturnDate").value = endDate;
    document.getElementById("editReturnTime").value = endTime;
    document.getElementById("equipment-edit-purpose").value = row.cells[7].textContent;

    //Show Edit modal
    document.getElementById("editModal").style.display = "block";

    // Save changes event
    document.getElementById("saveChanges").onclick = function () {
        const idofrow = document.getElementById("equipment-edit-id").textContent;
        const quantity = document.getElementById("editQuantity").value;
        const startdate = document.getElementById("editBorrowingDate").value;
        const starttime = document.getElementById("editBorrowingTime").value;
        const enddate = document.getElementById("editReturnDate").value;
        const endtime = document.getElementById("editReturnTime").value;
        const purpose = document.getElementById("equipment-edit-purpose").value;
        const which = false;
        const idofequipment = document.getElementById("equipmentID-edit").textContent;
        localStorage.setItem('equipmentEditData', JSON.stringify({
            idofequipment,
            which,
            idofrow,
            quantity,
            startdate,
            starttime,
            enddate,
            endtime,
            purpose
        }));
        const editFormData = JSON.parse(localStorage.getItem('equipmentEditData'));
        fetch('/php/checker/check_reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editFormData),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                if (confirm("Are you sure you want to edit this item?")) {
                    if (editFormData) {
                        fetch('php/update/equipmenttransaction.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(editFormData),
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to update data');
                            }
                            return response.text();
                        })
                        .then(data => {
                            window.location.href = 'equipmentLendingDashboard.php';
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('There was an error confirming the borrow. Please try again.');
                        });
                    }
                    document.getElementById("editModal").style.display = "none";
                    sendWebSocketMessage(JSON.stringify({action: 'update'}));
                 }
            } else {
                alert(result.message);
                return;
            }
        })
        .catch(error => console.log('Error:', error));
    };
}

// Function to open the details modal and show data
function openDetailModal(row) {
    // Populate modal with equipment details
    document.getElementById("modal-name").textContent = row.cells[0].textContent;
    document.getElementById("modal-id").textContent = row.cells[1].textContent;
    document.getElementById("modal-quantity").textContent = row.cells[3].textContent;
    document.getElementById("modal-borrowing-date").textContent = row.cells[4].textContent;
    document.getElementById("modal-return-date").textContent = row.cells[5].textContent;
    document.getElementById("modal-no-of-days").textContent = row.cells[6].textContent;
    document.getElementById("modal-purpose").textContent = row.cells[7].textContent;
    document.getElementById("modal-status").textContent = row.cells[8].textContent;

    // Show modal
    detailModal.style.display = "block";
}

// Close modals when clicking on close button
closeEditModal.onclick = function () {
    editModal.style.display = "none";
};

// closeDetailModal.onclick = function () {
//     detailModal.style.display = "none";
// };

// Close modals when clicking outside of them
window.onclick = function (event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
    if (event.target == detailModal) {
        detailModal.style.display = "none";
    }
};