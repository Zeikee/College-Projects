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

    
    // Add Account Form Submission
    const form = document.getElementById('addAccountForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form from refreshing the page

            const formData = new FormData(form);

            // Append @slu.edu.ph to emailAddress if not already present
            const emailField = form.querySelector('[name="email"]');
            if (emailField && !emailField.value.includes('@')) {
                formData.set('email', `${emailField.value}@slu.edu.ph`);
            }

            fetch('../php/addAccountHandler.php', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.status.includes("success")) {
                    // window.location.href = 'adminAccountManagement.php';
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});