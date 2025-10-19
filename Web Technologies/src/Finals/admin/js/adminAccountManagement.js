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

    function renderTable(data) {
        const tbody = document.querySelector('.account-table tbody'); // account-table
        tbody.innerHTML = '';
    
        data.forEach(item => {
            const row = document.createElement('tr');
            if (item.suspended && item.suspended.includes("1")) {
                row.innerHTML = `
                <td style="display: none;">${item.userId}</td>
                <td style="color: red;">${item.userType}</td>
                <td style="color: red;">${item.firstName}</td>
                <td style="color: red;">${item.lastName}</td>
                <td style="color: red;">${item.emailAddress}</td>
                <td>
                    <div class="actions-wrapper">
                        <button class="actions-btn">Actions</button>
                        <ul class="actions-dropdown" style="display: none;">
                            ${generateActionOptions(item.suspended)}
                        </ul>
                    </div>
                </td>
            `;
            } else {
                row.innerHTML = `
                <td style="display: none;">${item.userId}</td>
                <td>${item.userType}</td>
                <td>${item.firstName}</td>
                <td>${item.lastName}</td>
                <td>${item.emailAddress}</td>
                <td>
                    <div class="actions-wrapper">
                        <button class="actions-btn">Actions</button>
                        <ul class="actions-dropdown" style="display: none;">
                            ${generateActionOptions(item.suspended)}
                        </ul>
                    </div>
                </td>
            `;
            }
            tbody.appendChild(row);
        });
    
        // Attach action listeners to the buttons after rendering the table
        attachActionListeners();
    }
    function generateActionOptions(suspended) {
        switch(suspended){
            case "1":
                return `
                <li class="action-item" data-action="change-usertype">Change User Type</li>
                <li class="action-item" data-action="unsuspend">Unsuspend User</li>
                <li class="action-item" data-action="edit">Edit</li>
                <li class="action-item" data-action="delete">Delete</li>
                `;
                break;
            default:
                return `
                <li class="action-item" data-action="change-usertype">Change User Type</li>
                <li class="action-item" data-action="suspend">Suspend User</li>
                <li class="action-item" data-action="edit">Edit</li>
                <li class="action-item" data-action="delete">Delete</li>
                `;
                break;
        }

    }

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

        // Attach event listeners to action items
        const actionItems = document.querySelectorAll('.action-item');
        actionItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const row = item.closest('tr');
                const action = item.getAttribute('data-action');
                const userId = item.closest('tr').querySelector('td').innerText; // Get userId from the row
                const firstname = row.querySelector('td:nth-child(3)').innerText.trim(); // Get First Name
                const lastname = row.querySelector('td:nth-child(4)').innerText.trim(); // Get Last Name
                const email = row.querySelector('td:nth-child(5)').innerText.trim(); // Get Email

                switch (action) {
                    case 'change-usertype':
                        openUserTypeModal(userId);
                        break;
                    case 'suspend':
                        suspendUser(userId,1);
                        break;
                    case 'unsuspend':
                        unsuspendUser(userId,0);
                        break;
                    case 'edit':
                        editUser(userId,firstname,lastname,email);
                        break;
                    case 'delete':
                        deleteUser(userId);
                        break;
                    default:
                        console.warn(`No handler for action: ${action}`);
                }
                            // Close the dropdown after an action is clicked
            const dropdown = row.querySelector(".actions-dropdown");
            dropdown.style.display = "none";
            });
        });

        // Close dropdowns if clicked outside
        window.addEventListener("click", function (event) {
            if (!event.target.closest('.actions-wrapper')) {
                document.querySelectorAll('.actions-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none'; // Hide all dropdowns
                });
            }
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

// User Type Modal
function openUserTypeModal(userId) {
    openModal("userTypeModal");

    document.getElementById("changeusertype").onclick = function () {
        const usertype = document.getElementById("userType").value;
        localStorage.setItem('UserTypeEditData', JSON.stringify({
            userId,
            usertype
        }));

        const userTypeFormData = JSON.parse(localStorage.getItem('UserTypeEditData'));
        if (userTypeFormData) {
            fetch('../../php/update/usertype.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userTypeFormData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update data');
                }
                return response.text();
            })
            .then(data => {
                closeModal("userTypeModal");
                populateTable();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error confirming Update of UserType. Please try again.');
            });
        }
    };
}

// Add close event listener for all modals
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        closeModal(); 
    });
});

// Function to suspend user
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
            body: JSON.stringify(suspendUserFormData) // 1 for suspend
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

// Function to unsuspend user
function unsuspendUser(userId, status) {
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
            body: JSON.stringify(suspendUserFormData) // 1 for suspend
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


// Edit User
function editUser(userId, firstname, lastname, email) {
    openModal("editModal");
    document.getElementById('edit-firstName').value = firstname;
    document.getElementById('edit-lastName').value = lastname;
    document.getElementById('edit-email').value = email;

    document.getElementById("saveChanges").onclick = function () {
        const newfirstname = document.getElementById('edit-firstName').value;
        const newlastname = document.getElementById('edit-lastName').value;
        const newemail = document.getElementById('edit-email').value;
        if (confirm("Are you sure with the changes you made?")) {
            localStorage.setItem('editUserData', JSON.stringify({
                userId,
                newfirstname,
                newlastname,
                newemail
            }));

            const editUserFormData = JSON.parse(localStorage.getItem('editUserData'));
            if (editUserFormData) {
                fetch('../../php/update/edituser.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editUserFormData),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update data');
                    }
                    return response.text();
                })
                .then(data => {
                    populateTable();
                    closeModal("editModal");
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error confirming Update of User. Please try again.');
                });
            }
        }
    };
}

// Delete User
function deleteUser(userId) {
    openModal("deleteModal");
    document.getElementById("confirmDelete").onclick = function () {
        if (confirm("Are you sure you want to delete this user?")) {
            localStorage.setItem('DeleteUserData', JSON.stringify({
                userId
            }));

            const DeleteUserFormData = JSON.parse(localStorage.getItem('DeleteUserData'));
            if (DeleteUserFormData) {
                fetch('../../php/delete/deleteuser.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(DeleteUserFormData),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to Delete data');
                    }
                    return response.text();
                })
                .then(data => {
                    closeModal("deleteModal");
                    populateTable();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error confirming Delete of User. Please try again.');
                });
            }
            
        }
    };
}

    function populateTable(sortBy = "default") {
        // Fetch facilities data
        fetch('../../php/fetch/users.php')
            .then(response => response.json())
            .then(usersData => {
                let sortedData;

                if (sortBy === "default") {
                    sortedData = usersData; 
                } else if (sortBy === "firstname") {
                    sortedData = usersData.sort((a, b) => {
                        return a.firstName.localeCompare(b.firstName);
                    });
                } else if (sortBy === "lastname") {
                    sortedData = usersData.sort((a, b) => {
                        return a.lastName.localeCompare(b.lastName);
                    });
                } else if (sortBy === "usertype") {
                    sortedData = usersData.sort((a, b) => {
                        return a.userType.localeCompare(b.userType);
                    });
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
        const accountRows = document.querySelectorAll(".account-table tbody tr");

        accountRows.forEach((row) => {
            const usertype = row.cells[1].textContent.toLowerCase();
            const firstname = row.cells[2].textContent.toLowerCase();
            const lastname = row.cells[3].textContent.toLowerCase();
            const email = row.cells[4].textContent.toLowerCase();
            
            const mix = firstname +" "+ lastname
            // Show row if either name or ID matches the search value
            if (usertype.includes(searchValue) || firstname.includes(searchValue) || lastname.includes(searchValue) || mix.includes(searchValue) || email.includes(searchValue)) {
                row.style.display = ""; // Show row
            } else {
                row.style.display = "none"; // Hide row
            }
        });
    });
    if(usertype.includes("custodian")){
        document.getElementById("admin-feature-account-li").style.display = "none";
    }
});