//Initialize Websocket
const ws = new WebSocket(window.websocket.connection);
ws.onopen = function(event){
    console.log('Client connected');
    ws.onmessage = function(event) {
        const parsedData = JSON.parse(event.data);
        const action = parsedData.action;
        if (action === 'update') {
            populateTable();
        }
    };
};
// Get the file path of sthis file.
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
function renderTable(data, facilityData) {
    const tbody = document.querySelector('.facility-table tbody');
    tbody.innerHTML = '';

    const facilityMap = {};
    facilityData.forEach(facility => {
        facilityMap[facility.facilityID] = facility;
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
            <td style="display: none;">${item.facilityID}</td>
            <td style="display: none;">${item.userId}</td>
            <td>${facilityObject.facilityName}</td>
            <td>${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(startTime)}</td>
            <td>${new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} : ${CheckAMPM(endTime)}</td>
            <td>${durationInDays + 1}</td>
            <td>${item.purpose}</td>
            <td>${item.specialinstruction}</td>
            <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>
                <div class="actions-wrapper">
                    <button class="actions-btn">Actions</button>
                    <ul class="actions-dropdown" style="display: none;">
                        ${generateActionOptions(item.userId,item.status)}
                    </ul>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachActionListeners(); // Reattach action listeners after populating the table
    updateStatusCounters(); // Update counters after populating the table
}
function populateTable(sortBy = "default") {
    // Fetch facilities data
    fetch(getRunningScript() + '/../../php/fetch/facilitiesContent.php')
        .then(response => response.json())
        .then(facilityData => {
            // Fetch main data
            return fetch(getRunningScript() + '/../../php/fetch/facilitytransactionContent.php')
                .then(response => response.json())
                .then(data => {
                    let sortedData;

                    // Sort the data based on the sortBy parameter
                    if (sortBy === "default") {
                        sortedData = data; // Keep the original order
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
                    renderTable(sortedData, facilityData);
                });
        })
        .catch(error => console.error('Error fetching data:', error));
}
function generateActionOptions(useridrow,status) {
    switch(usertype){
        case "student":
            if(userid == useridrow){
                switch(status){
                    case "Pending":
                        return `
                        <li class="action-item" data-action="cancel">Cancel</li>
                        <li class="action-item show-details" data-action="show-details">Show More Details</li>
                        <li class="action-item" data-action="edit">Edit</li>
                        `;
                    case "Active":
                        return `
                        <li class="action-item" data-action="cancel">Cancel</li>
                        <li class="action-item show-details" data-action="show-details">Show More Details</li>
                        `;
                    default:
                        return `
                        <li class="action-item show-details" data-action="show-details">Show More Details</li>
                         `;
                }
            }else{
                return `
                <li class="action-item show-details" data-action="show-details">Show More Details</li>
                 `;
            }
        case "faculty":
            if (status === "Pending") {
                return `
                    <li class="action-item" data-action="cancel">Cancel</li>
                    <li class="action-item show-details" data-action="show-details">Show More Details</li>
                    <li class="action-item" data-action="edit">Edit</li>
                    <li class="action-item" data-action="delete">Delete</li>
                    <li class="action-item" data-action="accept">Accept</li>
                    <li class="action-item" data-action="reject">Reject</li>
                    <li class="action-item" data-action="suspend">Ban user</li>
                `;
            } else {
                return `
                     <li class="action-item show-details" data-action="show-details">Show More Details</li>
                `;
            }
        case "admin":
            if (status === "Pending") {
                return `
                    <li class="action-item" data-action="cancel">Cancel</li>
                    <li class="action-item show-details" data-action="show-details">Show More Details</li>
                    <li class="action-item" data-action="edit">Edit</li>
                    <li class="action-item" data-action="delete">Delete</li>
                    <li class="action-item" data-action="accept">Accept</li>
                    <li class="action-item" data-action="reject">Reject</li>
                    <li class="action-item" data-action="suspend">Ban user</li>
                `;
            } else {
                return `
                     <li class="action-item show-details" data-action="show-details">Show More Details</li>
                `;
            }
        default:
            return `
            <li class="action-item show-details" data-action="show-details">Show More Details</li>
             `;
    }
}
function updateStatusCounters() {
    const statusTable = document.querySelector(".facility-table");
    const rows = statusTable.getElementsByTagName("tr");
    const counters = {
        all: 0,
        pending: 0,
        active: 0,
        progress: 0,
        cancelled: 0,
        rejected: 0
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
    document.querySelector('.status-item[data-status="active"] .status-number').innerText = counters.active;
    document.querySelector('.status-item[data-status="progress"] .status-number').innerText = counters.progress;
    document.querySelector('.status-item[data-status="cancelled"] .status-number').innerText = counters.cancelled;
    document.querySelector('.status-item[data-status="rejected"] .status-number').innerText = counters.rejected;
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar");

    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value.toLowerCase();
        const facilityRows = document.querySelectorAll(".facility-table tbody tr");

        facilityRows.forEach((row) => {
            const facilityName = row.cells[3].textContent.toLowerCase();
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
   
       // Fetch facilities data based on sort option
       fetch(getRunningScript() + '/../../php/fetch/facilitiesContent.php')
           .then(response => response.json())
           .then(facilityData => {
               return fetch(getRunningScript() + '/../../php/fetch/facilitytransactionContent.php')
                   .then(response => response.json())
                   .then(data => {
                       let sortedData;
   
                       // Sort the data based on the selected criteria
                       if (sortBy === "default") {
                           sortedData = data; // Keep the original order
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
   
                       // Populate the table with the sorted data
                       renderTable(sortedData, facilityData);
                   });
           })
           .catch(error => console.error('Error fetching data:', error));
   });
});
// Attach action button listeners
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
            const idofrow = row.cells[0].textContent;
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
    
                        localStorage.setItem('facilitiesDeleteData', JSON.stringify({
                            idofrow
                        }));
            
                        const deleteFormData = JSON.parse(localStorage.getItem('facilitiesDeleteData'));
                        if (deleteFormData) {
                            fetch('php/delete/facilitytransaction.php', {
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
                                window.location.href = 'facilitiesDashboard.php';
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('There was an error confirming the borrow. Please try again.');
                            });
                        }
                    }
                break;
                case "accept":
                    localStorage.setItem('facilitiesUpdateStatusData', JSON.stringify({
                        type: 'accept',
                        idofrow
                    }));
                    const AcceptedStatusFormData = JSON.parse(localStorage.getItem('facilitiesUpdateStatusData'));        
                    fetch('php/update/facilitytransaction.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(AcceptedStatusFormData),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update data');
                        }
                        return response.text();
                    })
                    .then(data => {
                        window.location.href = 'facilitiesDashboard.php';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('There was an error confirming the borrow. Please try again.');
                    });
                break;
                case "reject":
                    localStorage.setItem('facilitiesUpdateStatusData', JSON.stringify({
                        type: 'reject',
                        idofrow
                    }));
                    const RejectedStatusFormData = JSON.parse(localStorage.getItem('facilitiesUpdateStatusData'));      
                    fetch('php/update/facilitytransaction.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(RejectedStatusFormData),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update data');
                        }
                        return response.text();
                    })
                    .then(data => {
                        window.location.href = 'facilitiesDashboard.php';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('There was an error confirming the borrow. Please try again.');
                    });
                break;
                case "suspend":

                break;
            }
            // Close the dropdown after an action is clicked
            const dropdown = row.querySelector(".actions-dropdown");
            dropdown.style.display = "none";
        });
    });
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
    const idoffacility = row.cells[1].textContent;
    const facility = row.cells[3].textContent; 
    const startReservation = row.cells[4].textContent; 
    const endReservation = row.cells[5].textContent; 
    const noOfDays = row.cells[6].textContent; 
    const purpose = row.cells[7].textContent; 
    const specialInstructions = row.cells[8].textContent; 

    document.getElementById("edit-facility-id").textContent=idoffacility;
    document.getElementById("edit-id").textContent=idofrow;
    document.getElementById("edit-room").value = facility;
    const startDateTime = new Date(startReservation);
    const startDate = `${startDateTime.getFullYear()}-${String(startDateTime.getMonth() + 1).padStart(2, '0')}-${String(startDateTime.getDate()).padStart(2, '0')}`;
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
    document.getElementById("editModal").style.display = "block";

    const startDateEditModal = document.getElementById("edit-startDate");
    const endDateEditModal = document.getElementById("edit-endDate");
    const startTimeEditModal = document.getElementById("edit-startTime");
    const endTimeEditModal = document.getElementById("edit-endTime");

    startDateEditModal.setAttribute('min', startDate);
    startDateEditModal.setAttribute('max', endDate);
    endDateEditModal.setAttribute('min', endDate);
    endDateEditModal.addEventListener('change', function(event) {
        const NewMaxStartValue = new Date(endDateElement.value);
        const formattedStartDateMax = NewMaxStartValue.toISOString().split('T')[0];
        startDateEditModal.setAttribute('max', formattedStartDateMax);
    });

    startDateEditModal.setCustomValidity('');
    endDateEditModal.setCustomValidity('');
    startTimeEditModal.setCustomValidity('');
    endTimeEditModal.setCustomValidity('');

    const elementIds = [startDateEditModal, endDateEditModal, startTimeEditModal, endTimeEditModal];
    elementIds.forEach((element) => {
        if (element) {
            element.addEventListener('keydown', function(event) {
                event.preventDefault();
                return; 
            });
        } else {
            console.log('Keydown: ','One of the elements is not valid: ',element);
        }
    });

    startTimeEditModal.addEventListener('change', function(event){
        const selectedTime = this.value;

        const startTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
        const endTimeDate = new Date(`1970-01-01T${endTimeEditModal.value}:00`);
        const duration = (endTimeDate - startTimeDate) / (1000 * 60);
        if (selectedTime < "07:29") {
            startTimeEditModal.value = "07:30";
            startTimeEditModal.setCustomValidity('Please select 7:30 AM onwards');
            startTimeEditModal.reportValidity();
            event.preventDefault();
            return;
        }else if(selectedTime > "18:00"){
            startTimeEditModal.value = "07:30";
            startTimeEditModal.setCustomValidity('Please select before 6:00 PM');
            startTimeEditModal.reportValidity();
            event.preventDefault();
            return;
        }else if(selectedTime > endTimeEditModal.value){
            startTimeEditModal.value = "07:30";
            startTimeEditModal.setCustomValidity('Please select before '+CheckAMPM(endTimeEditModal.value)+', You cant start a time after the end time.');
            startTimeEditModal.reportValidity();
            event.preventDefault();
            return;
        }
        if (duration < 60){
            const Subtract30ToStartedTime = new Date(endTimeDate.getTime() - 60 * 60 * 1000);
            const NewStartedTimeHour = String(Subtract30ToStartedTime.getHours()).padStart(2, '0');
            const NewStartedTimeMinute = String(Subtract30ToStartedTime.getMinutes()).padStart(2, '0');
            startTimeEditModal.value = `${NewStartedTimeHour}:${NewStartedTimeMinute}`;
            startTimeEditModal.setCustomValidity('Minimum duration of your reservation is 1 hour.');
            startTimeEditModal.reportValidity();
            event.preventDefault();
            return;
        }
    });
    
    endTimeEditModal.addEventListener('change', function(event){
        const selectedTime = this.value; 
        const endTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
        const startTimeDate = new Date(`1970-01-01T${startTimeEditModal.value}:00`);
        const duration = (endTimeDate - startTimeDate) / (1000 * 60);      
        if (selectedTime < startTimeEditModal.value) {
            endTimeEditModal.value = "09:30"
            endTimeEditModal.setCustomValidity('Please select '+CheckAMPM(startTimeEditModal.value)+'onwards');
            endTimeEditModal.reportValidity();
            event.preventDefault();
            return;
        }else if(selectedTime > "18:00"){
            endTimeEditModal.value = "09:30"
            endTimeEditModal.setCustomValidity('Please select before 6:00 PM');
            endTimeEditModal.reportValidity();
            event.preventDefault();
            return;
        }
        if(duration < 60){
            const Add30MinutesToEndTIme = new Date(startTimeDate.getTime() + 60 * 60 * 1000);
            const NewEndtimeHour = String(Add30MinutesToEndTIme.getHours()).padStart(2, '0');
            const NewEndtimeMinute = String(Add30MinutesToEndTIme.getMinutes()).padStart(2, '0');
            endTimeEditModal.value = `${NewEndtimeHour}:${NewEndtimeMinute}`;
            endTimeEditModal.setCustomValidity('Minimum duration of your reservation is 1 hour.');
            endTimeEditModal.reportValidity();
            event.preventDefault();
            return;
        }
    });
    //--Time--end

    document.getElementById("saveChanges").onclick = function () {
        const idofrow = document.getElementById("edit-id").textContent;
        const roomid = document.getElementById("edit-facility-id").textContent;
        const startdate = document.getElementById("edit-startDate").value;
        const enddate = document.getElementById("edit-endDate").value;
        const starttime = document.getElementById("edit-startTime").value;
        const endtime = document.getElementById("edit-endTime").value;
        const purpose = document.getElementById("edit-purpose").value;
        const specialinstructions = document.getElementById("edit-instructions").value;
        const which = true;
        const type = 'update';
        localStorage.setItem('facilitiesEditData', JSON.stringify({
            type,
            which,
            idofrow,
            roomid,
            startdate,
            starttime,
            enddate,
            endtime,
            purpose,
            specialinstructions
        }));
        const editFormData = JSON.parse(localStorage.getItem('facilitiesEditData'));
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
                        fetch('php/update/facilitytransaction.php', {
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
                            window.location.href = 'facilitiesDashboard.php';
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


function openDetailModal(row) {
    // Populate modal with equipment details
    document.getElementById("modal-id").textContent = row.cells[1].textContent.trim(); // Reservation ID
    document.getElementById("modal-name").textContent = row.cells[2].textContent.trim(); // Room/Facility Name

    // Split start date and time from cell[2] using ' : ' as a separator
    const startDateTime = row.cells[4].textContent.trim().split(' : ');
    if (startDateTime.length === 2) {
        document.getElementById("modal-startReservation").textContent = startDateTime[0]; // Start Date
        document.getElementById("modal-startTime").textContent = startDateTime[1]; // Start Time
    } else {
        document.getElementById("modal-startReservation").textContent = row.cells[4].textContent.trim(); // Fallback in case splitting fails
    }

    // Split end date and time from cell[3] using ' : ' as a separator
    const endDateTime = row.cells[5].textContent.trim().split(' : ');
    if (endDateTime.length === 2) {
        document.getElementById("modal-endReservation").textContent = endDateTime[0]; // End Date
        document.getElementById("modal-endTime").textContent = endDateTime[1]; // End Time
    } else {
        document.getElementById("modal-endReservation").textContent = row.cells[5].textContent.trim(); // Fallback in case splitting fails
    }

    // Fetch other details
    document.getElementById("modal-no-of-days").textContent = row.cells[6].textContent.trim(); // Number of Days
    document.getElementById("modal-purpose").textContent = row.cells[7].textContent.trim(); // Purpose
    document.getElementById("modal-status").textContent = row.cells[9].querySelector("span").textContent.trim(); // Status (inside span)

    // Show the modal
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