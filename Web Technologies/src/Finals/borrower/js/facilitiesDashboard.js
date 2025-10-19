const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function(event) {
    console.log("Success Reload1");
    const parsedData = JSON.parse(event.data);
    const action = parsedData.action;
    console.log("Event:", action);
    if (action === 'update') {
        populateTable();
        console.log("Success Reload2");
    }
};
// Get the file path of this file.
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
function renderTable(data, facilityData, userdata) {
    const tbody = document.querySelector('.facility-table tbody');
    tbody.innerHTML = '';

    const facilityMap = {};
    facilityData.forEach(facility => {
        facilityMap[facility.facilityID] = facility;
    });
    const FacilityImage = {};
    facilityData.forEach(facility => {
        FacilityImage[facility.facilityID] = facility.imagePath;
    });
    const FacilityNumber = {};
    facilityData.forEach(facility => {
        FacilityNumber[facility.facilityID] = facility.roomNumber;
    });
    const userSuspendedMap = {};
    userdata.forEach(user => {
        userSuspendedMap[user.userId] = user.suspended;
    });
    console.log("UserMap: ", FacilityNumber);
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
        if(userSuspendedMap[item.userId].includes("1")){
            row.innerHTML = `
            <td style="display: none;">${item.ID}</td>
            <td style="color: red;">${FacilityNumber[item.facilityID] } - ${facilityObject.facilityName}</td>
            <td style="color: red;">${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(startTime)}</td>
            <td style="color: red;">${new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(endTime)}</td>
            <td style="color: red;">${durationInDays + 1}</td>
            <td style="color: red;">${item.purpose}</td>
            <td style="color: red;">${item.specialinstruction && item.specialinstruction.trim() !== '' ? item.specialinstruction : '<strong><em>N/A</em></strong>'}</td>
            <td style="color: red;">${item.Seats}</td>
            <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>
                <div class="actions-wrapper">
                    <button class="actions-btn">Actions</button>
                    <ul class="actions-dropdown" style="display: none;">
                        ${generateActionOptions(item.status.toLowerCase())}
                        ${generateSuspendedOptions(userSuspendedMap[item.userId])}
                    </ul>
                </div>
            </td>
            <td style="display: none;">${FacilityImage[item.facilityID]}</td>
            <td style="display: none;">${item.userId}</td>
        `;
        }else{
            row.innerHTML = `
            <td style="display: none;">${item.ID}</td>
            <td>${FacilityNumber[item.facilityID] } - ${facilityObject.facilityName}</td>
            <td>${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(startTime)}</td>
            <td>${new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(endTime)}</td>
            <td>${durationInDays + 1}</td>
            <td>${item.purpose}</td>
            <td>${item.specialinstruction && item.specialinstruction.trim() !== '' ? item.specialinstruction : '<strong><em>N/A</em></strong>'}</td>
            <td>${item.Seats}</td>
            <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>
                <div class="actions-wrapper">
                    <button class="actions-btn">Actions</button>
                    <ul class="actions-dropdown" style="display: none;">
                        ${generateActionOptions(item.status.toLowerCase(), item.userId)}
                        ${generateSuspendedOptions(userSuspendedMap[item.userId])}
                    </ul>
                </div>
            </td>
            <td style="display: none;">${FacilityImage[item.facilityID]}</td>
            <td style="display: none;">${item.userId}</td>
        `;
        }
        tbody.appendChild(row);
    });

    attachActionListeners(); // Reattach action listeners after populating the table
    updateStatusCounters(); // Update counters after populating the table
}
function populateTable(sortBy = "default") {
    fetch('../php/fetch/facilityContent.php')
        .then(response => response.json())
        .then(facilityData => {
            return fetch('../php/fetch/facilitytransactionContent.php')
                .then(response => response.json())
                .then(data => {
                    fetch('../php/fetch/users.php')
                        .then(response => response.json())
                        .then(userdata => {
                            let sortedData;
                            if (sortBy === "default") {
                                sortedData = data; 
                            } else if (sortBy === "name") {
                                sortedData = data.sort((a, b) => {
                                    const facilityA = facilityData.find(facility => facility.facilityID === a.facilityID).facilityName;
                                    const facilityB = facilityData.find(facility => facility.facilityID === b.facilityID).facilityName;
                                    return facilityA.localeCompare(facilityB);
                                });
                            } else if (sortBy === "id") {
                                sortedData = data.sort((a, b) => a.ID.localeCompare(b.ID));
                            } else if (sortBy === "date") {
                                sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                            }
                        
                            // Render the table with sorted data
                            renderTable(sortedData, facilityData,userdata);
                        })
                })
        })
        .catch(error => console.error('Error fetching data:', error));
}
function generateSuspendedOptions(suspend) {
    if(usertype.includes("admin")){
        switch(suspend){
            case "1":
                return `
                <li class="action-item" data-action="unsuspend">Unsuspend User</li>
                `;
                break;
            default:
                return `
                <li class="action-item" data-action="suspend">Suspend User</li>
                `;
                break;
        }
    }else{
        return "";
    }
}
function generateActionOptions(status, currentid) {
    switch(status){
        case "pending":
            switch(usertype){
                case "student":
                    if(userId == currentid){
                        return`
                        <li class="action-item" data-action="edit">Edit</li>
                        <li class="action-item" data-action="delete">Delete</li>
                        <li class="action-item show-details" data-action="show-details">Show More Details</li>`;
                    }else{
                        return`
                        <li class="action-item show-details" data-action="show-details">Show More Details</li>`;
                    }
                    break;
                case "custodian":
                case "admin":
                    return `
                    <li class="action-item" data-action="accept">Accept</li>
                    <li class="action-item" data-action="rejected">Reject</li>
                    <li class="action-item" data-action="edit">Edit</li>
                    <li class="action-item" data-action="delete">Delete</li>
                    <li class="action-item show-details" data-action="show-details">Show More Details</li>
                    `;
                    break;
            } 
            break;
        case "accepted":
            switch(usertype){
                case "student":
                    return `
                    <li class="action-item show-details" data-action="show-details">Show More Details</li>
                    `;
                    break;
                case "custodian":
                case "admin":
                    return `
                    <li class="action-item" data-action="rejected">Reject</li>
                    <li class="action-item show-details" data-action="show-details">Show More Details</li>
                    `; 
                    break;
            } 
            break;
        case "rejected":
            switch(usertype){
                case "student":
                    if(userId == currentid){
                        return`
                        <li class="action-item" data-action="delete">Delete</li>
                        <li class="action-item show-details" data-action="show-details">Show More Details</li>`;
                    }else{
                        return`
                        <li class="action-item show-details" data-action="show-details">Show More Details</li>`;
                    }
                    break;
                case "custodian":
                case "admin":
                    return `
                    <li class="action-item" data-action="accept">Accept</li>
                    <li class="action-item show-details" data-action="show-details">Show More Details</li>
                    `; 
                    break;
            } 
            break;
        default:
            return `
            <li class="action-item show-details" data-action="show-details">Show More Details</li>
            `;
            break;
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
        const status = rows[i].cells[8].textContent.toLowerCase(); // Assuming status is in the seventh cell
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

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar");

    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value.toLowerCase();
        const facilityRows = document.querySelectorAll(".facility-table tbody tr");

        facilityRows.forEach((row) => {
            const facilityName = row.cells[0].textContent.toLowerCase();
            const facilityId = row.cells[1].textContent.toLowerCase();
            // Show row if either name or ID matches the search value
            if (facilityName.includes(searchValue) || facilityId.includes(searchValue)) {
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

    // Populate the initial table
    populateTable();
    
   // Add sorting event listener
   const sortSelect = document.querySelector(".sort-select");
   sortSelect.addEventListener("change", (event) => {
       const sortBy = event.target.value;
        populateTable(sortBy);
   });
});

// Delete action logic inside attachActionListeners function
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
            const row = event.currentTarget.closest("tr"); // Get the parent row


            switch(action){
                case "accept":
                    UpdateStatus(row.cells[0].textContent, "Accepted");
                    break;
                case "rejected":
                    UpdateStatus(row.cells[0].textContent, "Rejected");
                    break;
                case "edit":
                    openEditModal(row);
                    break;
                case "show-details":
                    openDetailModal(row);
                    break;
                case "delete":
                    DeleteFacility(row);
                    break;
                case "suspend":
                    suspendUser(row.cells[11].textContent, 1);
                    break;
                case "unsuspend":
                    suspendUser(row.cells[11].textContent, 0);
                    break;
            }

            // Close the dropdown after an action is clicked
            const dropdown = row.querySelector(".actions-dropdown");
            dropdown.style.display = "none";
        });
    });
}
function suspendUser(userId, status) {
    localStorage.setItem('suspendUserData', JSON.stringify({
        userId,
        suspend:status
    }));
    const suspendUserFormData = JSON.parse(localStorage.getItem('suspendUserData'));
    if (suspendUserFormData) {
        fetch('../../php/update/suspenduser.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(suspendUserFormData)
        })
        .then(response => response.text())
        .then(data => {
            populateTable();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error. Please try again.');
        });
    }
}
function UpdateStatus(FacilityID, status) {
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
            body: JSON.stringify(FacilityStatusFormData) 
        })
        .then(response => response.text())
        .then(data => {
            populateTable();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error. Please try again.');
        });
    }
}
function DeleteFacility(row){
    if (confirm("Are you sure you want to delete this item?")) {
        const FacilityID = row.cells[0].textContent; 

        const deleteFormData = {
            facilityID:FacilityID
        };

        fetch('../php/delete/facilitytransaction.php', {
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
            return response.text();  // Server response
        })
        .then(data => {
            populateTable();
            updateStatusCounters(); 
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error confirming the deletion. Please try again.');
        });
    }
}
// Close other dropdowns
function closeOtherDropdowns(currentDropdown) {
    const allDropdowns = document.querySelectorAll(".actions-dropdown");
    allDropdowns.forEach((dropdown) => {
        if (dropdown !== currentDropdown) {
            dropdown.style.display = "none"; // Close other dropdowns
        }
    });
}

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
    const dropdowns = document.querySelectorAll(".actions-dropdown");
    dropdowns.forEach((dropdown) => {
        dropdown.style.display = "none"; // Close dropdowns if clicking outside
    });
});

// Get modal elements
const editModal = document.getElementById("editModal");
const detailModal = document.getElementById("detailModal");

// Get close elements for both modals
const closeEditModal = editModal.querySelector(".close-edit");
const closeDetailModal = detailModal.querySelector("modal-close");

function openEditModal(row) {
    const idofrow = row.cells[0].textContent;
    const facility = row.cells[1].textContent; 
    const startReservation = row.cells[2].textContent; 
    const endReservation = row.cells[3].textContent; 
    const noOfDays = row.cells[4].textContent; 
    const purpose = row.cells[5].textContent; 
    const specialInstructions = row.cells[6].textContent; 
    const imagePath = row.cells[10].textContent; 

    document.getElementById("edit-id").textContent=idofrow;
    document.getElementById("edit-room").value = facility;
    const startDateTime = new Date(startReservation);
    const startDate = startDateTime.toISOString().split('T')[0];
    const startTime = startDateTime.toTimeString().split(' ')[0].slice(0, 5); 

    document.getElementById("edit-startDate").value = startDate;
    document.getElementById("edit-startTime").value = startTime;
    const endDateTime = new Date(endReservation);
    const endDate = endDateTime.toISOString().split('T')[0]; 
    const endTime = endDateTime.toTimeString().split(' ')[0].slice(0, 5); 

    document.getElementById("edit-endDate").value = endDate;
    document.getElementById("edit-endTime").value = endTime;
    document.getElementById("edit-NoOfDays").value = noOfDays;
    document.getElementById("edit-purpose").value = purpose;
    document.getElementById("edit-instructions").value = specialInstructions;
    document.getElementById("image-edit-details").src = imagePath;
    document.getElementById("editModal").style.display = "block";
    document.getElementById("facility-edit-status").innerHTML = row.cells[8].textContent;


    document.getElementById("saveChanges").onclick = function () {
        if (confirm("Are you sure you want to edit this item?")) {
            row.cells[5].textContent = document.getElementById("edit-purpose").value;
            row.cells[6].textContent = document.getElementById("edit-instructions").value;
            const idofrow = document.getElementById("edit-id").textContent;
            const purpose = document.getElementById("edit-purpose").value;
            const startdate = document.getElementById("edit-startDate").value;
            const starttime = document.getElementById("edit-startTime").value;
            const enddate = document.getElementById("edit-endDate").value;
            const endtime = document.getElementById("edit-endTime").value;
            const specialinstructions = document.getElementById("edit-instructions").value;
            const status = document.getElementById("facility-edit-status").textContent;
            localStorage.setItem('facilitiesEditData', JSON.stringify({
                idofrow,
                purpose,
                startdate,
                starttime,
                enddate,
                endtime,
                specialinstructions,
                status,
                swtch:true
            }));

            const editFormData = JSON.parse(localStorage.getItem('facilitiesEditData'));
            if (editFormData) {
                fetch('../php/update/facilitytransaction.php', {
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
                    console.log(data);
                    window.location.href = 'facilitiesDashboard.php';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error confirming the borrow. Please try again.');
                });
            }
            document.getElementById("editModal").style.display = "none";
         }
    };
}


function openDetailModal(row) {
    // Populate modal with equipment details
    document.getElementById("modal-id").textContent = row.cells[0].textContent.trim(); // Reservation ID
    document.getElementById("modal-name").textContent = row.cells[1].textContent.trim(); // Room/Facility Name

    // Split start date and time from cell[2] using ' : ' as a separator
    const startDateTime = row.cells[2].textContent.trim().split(' : ');
    if (startDateTime.length === 2) {
        document.getElementById("modal-startReservation").textContent = startDateTime[0]; // Start Date
        document.getElementById("modal-startTime").textContent = startDateTime[1]; // Start Time
    } else {
        document.getElementById("modal-startReservation").textContent = row.cells[2].textContent.trim(); // Fallback in case splitting fails
    }

    // Split end date and time from cell[3] using ' : ' as a separator
    const endDateTime = row.cells[3].textContent.trim().split(' : ');
    if (endDateTime.length === 2) {
        document.getElementById("modal-endReservation").textContent = endDateTime[0]; // End Date
        document.getElementById("modal-endTime").textContent = endDateTime[1]; // End Time
    } else {
        document.getElementById("modal-endReservation").textContent = row.cells[3].textContent.trim(); // Fallback in case splitting fails
    }
    document.getElementById("modal-no-of-days").textContent = row.cells[4].textContent.trim(); // Number of Days
    document.getElementById("modal-purpose").textContent = row.cells[5].textContent.trim(); // Purpose
    document.getElementById("modal-status").textContent = row.cells[8].textContent.trim();  // Status (inside span)

    document.getElementById("image-show-details").src = row.cells[10].textContent.trim();  // Status (inside span)
    
    document.getElementById("detailModal").style.display = "block";

}

// Close modals when clicking outside of them
window.onclick = function (event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
    if (event.target == detailModal) {
        detailModal.style.display = "none";
    }
};