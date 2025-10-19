document.addEventListener("DOMContentLoaded", function () {
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = "none";
    }
    function openModal(modalId) {
        document.getElementById(modalId).style.display = "block";
    }
// Dropdown Toggle for Equipment, Facilities, and Logout
document.querySelectorAll('.dropdown-toggle').forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default anchor behavior

        // Get the clicked dropdown menu
        const dropdown = this.nextElementSibling;

        // Close all other dropdowns first
        document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                otherDropdown.style.display = 'none'; // Hide any dropdowns that are not the current one
            }
        });

        // Toggle the display of the clicked dropdown
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
       
        event.stopPropagation(); // Prevent bubbling up to window click listener
    });
});

// Close all dropdowns if clicked outside
window.addEventListener('click', function (event) {
    // Close all dropdown menus
    document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(dropdown => {
        dropdown.style.display = 'none';
    });
});

// Prevent dropdown from closing when clicking inside
document.querySelectorAll('.user-dropdown-menu, .navbar nav ul li ul').forEach(dropdown => {
    dropdown.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent click inside dropdown from propagating
    });
});

    function renderTable(data) {
        const tbody = document.querySelector('.equipment-table tbody'); //account-table
        tbody.innerHTML = '';

        data.forEach(item => {
            const unavailable = item.equipmentTotalQuantity - item.equipmentBorrowed;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.equipmentID}</td>
            <td>${item.equipmentName}</td>
            <td>${item.equipmentTotalQuantity}</td>
            <td>${unavailable}</td>
            <td>${item.equipmentBorrowed}</td>
            <td>
                <div class="actions-wrapper">
                    <button class="actions-btn">Actions</button>
                    <ul class="actions-dropdown" style="display: none;">
                        <li class="action-item" data-action="edit">Edit</li>
                        <li class="action-item" data-action="delete">Delete</li>
                    </ul>
                </div>
            </td>
            <td style="display: none;">${item.ImagePath}</td>
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
                const equipmentID = row.querySelector('td').innerText; // Get equipmentID from the row
                const equipmentName = row.querySelector('td:nth-child(2)').innerText.trim(); // Get Equipment Name
                const totalQuantity = row.querySelector('td:nth-child(3)').innerText.trim(); // Get Total Quantity
                const borrowed = row.querySelector('td:nth-child(5)').innerText.trim(); // Get Borrowed Quantity
                const imagepath = row.querySelector('td:nth-child(7)').innerText.trim(); // Get Borrowed Quantity
                switch (action) {
                    case 'edit':
                        editEquipment(equipmentID, equipmentName, totalQuantity, imagepath);
                        break;
                    case 'delete':
                        deleteEquipment(equipmentID, equipmentName, totalQuantity, borrowed, imagepath);
                        break;
                    default:
                        console.warn(`No handler for action: ${action}`);
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
// Add close event listener for all modals
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        closeModal(); 
    });
});

    function populateTable(sortBy = "default") {
        // Fetch facilities data
        fetch('../php/fetch/equipmentContent.php')
            .then(response => response.json())
            .then(equipmentData => {
                let sortedData;
                switch(sortBy){
                    case "name":
                        sortedData = equipmentData.sort((a, b) => {
                            return a.equipmentName.localeCompare(b.equipmentName);
                        });
                        break;
                    case "quantity":
                        sortedData = equipmentData.sort((a, b) => {
                            return b.equipmentTotalQuantity - a.equipmentTotalQuantity; 
                        });
                        break;
                    case "available":
                        sortedData = equipmentData.sort((a, b) => {
                            const first = a.equipmentTotalQuantity - a.equipmentBorrowed;
                            const second = b.equipmentTotalQuantity - b.equipmentBorrowed;
                            return second - first; 
                        });
                        break;
                    case "unavailable":
                        sortedData = equipmentData.sort((a, b) => {
                            return b.equipmentBorrowed - a.equipmentBorrowed; 
                        });
                        break;
                    default:
                        sortedData = equipmentData;
                        break;
                }
                renderTable(sortedData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    const sortSelect = document.querySelector(".sort-dropdown");
    sortSelect.addEventListener("change", (event) => {
        const sortBy = event.target.value;
        populateTable(sortBy);
    });

    populateTable();

    const searchBar = document.querySelector(".search-bar");
    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value.toLowerCase();
        const equipmentRows = document.querySelectorAll(".equipment-table tbody tr");

        equipmentRows.forEach((row) => {
            const equipmentName = row.cells[1].textContent.toLowerCase();
            const equipmentId = row.cells[0].textContent.toLowerCase();
            // Show row if either name or ID matches the search value
            if (equipmentName.includes(searchValue) || equipmentId.includes(searchValue)) {
                row.style.display = ""; // Show row
            } else {
                row.style.display = "none"; // Hide row
            }
        });
    });

// Function to handle editing equipment
function editEquipment(equipmentID, equipmentName, totalQuantity, imagepath) {
    const modal = document.getElementById("edit-modal");
    modal.style.display = 'block';

    // Populate modal fields with data
    document.getElementById("equipment-id").value = equipmentID; // Ensure this is set
    document.getElementById("equipment-name").value = equipmentName;
    document.getElementById("quantity").value = totalQuantity;

    // Set the equipment image
    document.getElementById("equipment-image").src = imagepath; // Adjusted path

    document.getElementById("confirmedit").onclick = function () {
        const equipmentID = document.getElementById('equipment-id').value; // Fetch the ID again
        const equipmentname = document.getElementById('equipment-name').value;
        const equipmentquantity = document.getElementById('quantity').value;

        if (confirm("Are you sure with the changes you made?")) {
            localStorage.setItem('editEquipmentData', JSON.stringify({
                equipmentID,
                equipmentname,
                equipmentquantity,
                imagePath: imagepath // Include image path
            }));

            const editUserFormData = JSON.parse(localStorage.getItem('editEquipmentData'));
            if (editUserFormData) {
                fetch('../../php/update/editEquipmentData.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editUserFormData), // Fixed variable name
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update data');
                    }
                    return response.text();
                })
                .then(data => {
                    populateTable(); // Refresh the table after updating
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error confirming Update of Equipment. Please try again.');
                });
            }
            closeModal("edit-modal"); // Close the modal after the operation
        }
    };
}

// Function to handle deleting equipment
function deleteEquipment(equipmentID, equipmentName, quantity, unavailable, imagePath) {
    console.log("Value: ", parseInt(unavailable, 10));
    if (parseInt(unavailable, 10) > 0) {
        alert("Sorry, you can't do that! Equipment is being used.");
        return;
    }
    
    const deleteModal = document.getElementById("delete-modal");
    
    // Populate the modal with equipment name, ID, and quantity
    document.getElementById("delete-equipment-name").innerHTML = 
        "<strong>Equipment Name: </strong>" + equipmentName;
    document.getElementById("delete-equipment-id").innerHTML = 
        "<strong>Equipment ID: </strong>" + equipmentID;
    document.getElementById("delete-equipment-quantity").innerHTML = 
        "<strong>Quantity: </strong>" + quantity;
    // Set the equipment image
    document.getElementById("delete-equipment-image").src = imagePath;

    deleteModal.style.display = "block";
    
    deleteModal.querySelector(".delete-btn").onclick = () => {
        // Make an API call to delete the equipment
        fetch('../../php/delete/deleteEquipment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ equipmentID })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status.includes("success")) {
                    populateTable();
                } else {
                    alert("Error deleting equipment: " + data.error);
                }
                deleteModal.style.display = "none";
            })
            .catch(error => console.error("Error deleting equipment:", error));
    };
    
    deleteModal.querySelector(".cancel-btn").onclick = () => {
        deleteModal.style.display = "none";
    };
    
    const closeButton = deleteModal.querySelector(".modal-close");
    if (closeButton) {
        closeButton.onclick = () => {
            deleteModal.style.display = "none";
        };
    } else {
        console.error("Close button not found in delete modal!");
    }

    // Close the modal if clicked outside of its content
    window.onclick = (event) => {
        if (event.target === deleteModal) {
            deleteModal.style.display = "none";
        }
    };
}
if(usertype.includes("custodian")){
    document.getElementById("admin-feature-account-li").style.display = "none";
}


});