document.addEventListener("DOMContentLoaded", function () {
    // Dropdown Toggle for Equipment, Facilities, and Logout
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default anchor behavior

            // Close all dropdowns first
            document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(dropdown => {
                if (dropdown !== this.nextElementSibling) {
                    dropdown.style.display = 'none'; // Hide any dropdowns that are not the current one
                }
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

    
    const closeModal = (modalId) => {
        document.getElementById(modalId).style.display = "none";
    };

    const openModal = (modalId) => {
        document.getElementById(modalId).style.display = "block";
    };
    function renderTable(data, Transaction, Count) {
        const tbody = document.querySelector('.facility-table tbody');
        tbody.innerHTML = '';

        const FacilitySeats = Object.fromEntries(
            Count.map(Facility => [Facility.facilityID, Facility.Seats])
        );
    
        data.forEach(facility => {
            const availableSeats = parseInt(FacilitySeats[facility.facilityID], 10) ||  facility.TotalSeats;
            const Reserved = parseInt(facility.TotalSeats, 10) - parseInt(FacilitySeats[facility.facilityID], 10) || 0;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${facility.facilityID}</td>
                <td>${facility.roomNumber}</td>
                <td>${facility.facilityName}</td>
                <td>${availableSeats}</td>
                <td>${Reserved}</td>
                <td>${facility.otherInfo}</td>
                <td>
                    <div class="actions-wrapper">
                        <button class="actions-btn">Actions</button>
                        <ul class="actions-dropdown" style="display: none;">
                            <li class="action-item" data-action="edit">Edit</li>
                            <li class="action-item" data-action="delete">Delete</li>
                        </ul>
                    </div>
                </td>
                <td style="display: none;">${facility.imagePath}</td>
            `;
            tbody.appendChild(row);
        });
    
        attachActionListeners();
    }
    
    function attachActionListeners() {
        const actionButtons = document.querySelectorAll(".actions-btn");
        actionButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const dropdown = button.nextElementSibling; // Get the dropdown menu
                const isVisible = dropdown.style.display === "block";
                dropdown.style.display = isVisible ? "none" : "block"; // Toggle dropdown visibility
                closeOtherDropdowns(dropdown);
                event.stopPropagation(); // Prevent click event from bubbling up
            });
        });
    
        const actionItems = document.querySelectorAll('.action-item');
        actionItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const row = item.closest('tr');
                const action = item.getAttribute('data-action');
                const FacilityID = row.querySelector('td').innerText; // Assuming the first column is the ID
    
                // Corrected indexing based on your table structure
                const facilityDetails = {
                    roomNumber: row.querySelector("td:nth-child(2)").innerText.trim(), // Adjusted index
                    facilityName: row.querySelector("td:nth-child(3)").innerText.trim(), // Adjusted index
                    seats: row.querySelector("td:nth-child(4)").innerText.trim(), // Adjusted index
                    reservedSeats: row.querySelector("td:nth-child(5)").innerText.trim(), // Adjusted index
                    otherInfo: row.querySelector("td:nth-child(6)").innerText.trim(), // Adjusted index
                    imagePath: row.querySelector("td:nth-child(8)").innerText.trim(), // Adjusted index
                };
                switch(action){
                    case "edit":
                        editFacility(FacilityID, facilityDetails);
                        break;
                    case "delete":
                        deleteFacility(FacilityID, facilityDetails.facilityName, facilityDetails.roomNumber, facilityDetails.otherInfo, facilityDetails.imagePath);
                        break;
                }
                
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
    function populateTable(sortBy = "default") {
        // Fetch facilities data
        fetch('../php/fetch/facilityContent.php')
            .then(response => response.json())
            .then(FacilityContent => {
                fetch('../php/fetch/facilitytransactionContent.php')
                .then(response => response.json())
                .then(FacilityTransaction => {
                    fetch('../php/fetch/facilityCount.php')
                    .then(response => response.json())
                    .then(FacilityCount => {
                        let sortedData;
                        const FacilitySeats = Object.fromEntries(
                            FacilityCount.map(Facility => [Facility.facilityID, Facility.Seats])
                        );
                        switch(sortBy){
                            case "roomnumber":
                                sortedData = FacilityContent.sort((a, b) => {
                                    return b.roomNumber - a.roomNumber; 
                                });
                                break;
                            case "name":
                                sortedData = FacilityContent.sort((a, b) => {
                                    return a.facilityName.localeCompare(b.facilityName);
                                });
                                break;
                            case "id":
                                sortedData = FacilityContent.sort((a, b) => {
                                    return a.facilityID - b.facilityID; 
                                });
                                break;
                            case "totalseats":
                                sortedData = FacilityContent.sort((a, b) => {
                                    const countA = FacilityCount.find(item => item.facilityID === a.facilityID)?.Seats || 0;
                                    const countB = FacilityCount.find(item => item.facilityID === b.facilityID)?.Seats || 0;
                                    return countB - countA;
                                });
                                break;
                            case "reservedseats":
                                sortedData = FacilityContent.sort((a, b) => {
                                    const reservedA = parseInt(a.TotalSeats, 10) - parseInt(FacilitySeats[a.facilityID], 10) || 0;
                                    const reservedB = parseInt(b.TotalSeats, 10) - parseInt(FacilitySeats[b.facilityID], 10) || 0;
                                    return reservedA - reservedB;
                                });
                                break;
                            default:
                                sortedData = FacilityContent;
                                break;
                        }
                        renderTable(sortedData,FacilityTransaction,FacilityCount);
                    })
                })
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    const searchBar = document.querySelector(".search-bar");
    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value.toLowerCase();
        const accountRows = document.querySelectorAll(".facility-table tbody tr");

        accountRows.forEach((row) => {
            const FacilityID = row.cells[0].textContent.toLowerCase();
            const RoomNumber = row.cells[1].textContent.toLowerCase();
            const FacilityName = row.cells[2].textContent.toLowerCase();
            
            if (FacilityID.includes(searchValue) || RoomNumber.includes(searchValue) || FacilityName.includes(searchValue)) {
                row.style.display = ""; // Show row
            } else {
                row.style.display = "none"; // Hide row
            }
        });
    });
    /** Edit Facility */
const editFacility = (FacilityID, { roomNumber, facilityName, seats, reservedSeats, otherInfo, imagePath }) => {


    // Set the values in the modal
    document.getElementById("facility-id").value = FacilityID;
    document.getElementById("room_number").value = roomNumber; // Ensure this is set
    document.getElementById("facility_name").value = facilityName;
    document.getElementById("seats").value = seats;
    document.getElementById("reserved_seats").value = reservedSeats;
    document.getElementById("facility-info").value = otherInfo;

    // Construct the image path
    document.getElementById("facility-image").src = imagePath; // Set the image source

    openModal("edit-modal");

    document.querySelector(".edit-btn").onclick = () => {
        const updatedDetails = {
            facilityID: document.getElementById("facility-id").value,
            roomNumber: document.getElementById("room_number").value,
            facilityName: document.getElementById("facility_name").value,
            seats: document.getElementById("seats").value,
            reservedSeats: document.getElementById("reserved_seats").value,
            otherInfo: document.getElementById("facility-info").value
        };

        if (confirm("Are you sure you want to save changes?")) {
            fetch("../../php/update/editFacilityData.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedDetails),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status.includes("success")) {
                        populateTable();
                    } else {
                        alert("Error updating facility: " + data.error);
                    }
                    closeModal("edit-modal");
                })
                .catch((error) => console.error("Error updating facility:", error));
        }
    };

    document.querySelector("#edit-modal .modal-close").onclick = () => closeModal("edit-modal");
};

   /** Delete Facility */
const deleteFacility = (FacilityID, facilityName,facilityNumber, OtherInfo, imagePath) => {
    openModal("delete-modal");
    document.getElementById("delete-facility-id").innerHTML = 
    "<strong>Facility ID: </strong>&nbsp" + FacilityID;
    document.getElementById("delete-facility-number").innerHTML = 
        "<strong>Room/Facility Number:</strong>&nbsp" + facilityNumber;
    document.getElementById("delete-facility-name").innerHTML = 
        "<strong>Room/Facility Name:</strong>&nbsp" + facilityName;
        document.getElementById("delete-facility-info").innerHTML = 
        "<strong>Description:</strong>&nbsp" + OtherInfo;
     // Set the equipment image
     document.getElementById("delete-facility-image").src = imagePath;
    document.querySelector(".delete-btn").onclick = () => {

        fetch("../php/delete/deleteFacility.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ facilityID:FacilityID }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status.includes("success")) {
                populateTable();
            } else {
                alert("Error deleting facility: " + data.error);
            }
            closeModal("delete-modal"); // Close the modal after action
        })
        .catch((error) => console.error("Error deleting facility:", error));
    };

    // Cancel button click handler
    document.querySelector(".cancel-btn").onclick = () => closeModal("delete-modal");

    // Close modal when clicking outside the modal container
    window.onclick = (event) => {
        if (event.target === document.getElementById("delete-modal")) {
            closeModal("delete-modal");
        }
    };

    // Close modal on 'x' button click
    document.querySelector(".close-btn").onclick = () => closeModal("delete-modal");
};


    // Initialize Facilities Table
    populateTable();
    const sortSelect = document.querySelector(".sort-dropdown");
    sortSelect.addEventListener("change", (event) => {
        const sortBy = event.target.value;
        console.log(sortBy);
        populateTable(sortBy);
    });
    if(usertype.includes("custodian")){
        document.getElementById("admin-feature-account-li").style.display = "none";
    }
});
