document.addEventListener("DOMContentLoaded", function() {
    // Dropdown Toggle for Equipment, Facilities, and Logout
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor behavior

            // Close all dropdowns first
            document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(dropdown => {
                if (dropdown !== this.nextElementSibling) {
                    dropdown.style.display = 'none'; // Hide any dropdowns that are not the current one
                }
            });

            const dropdown = this.nextElementSibling; // Get the next sibling (the dropdown menu)

            // Toggle the display of the clicked dropdown
            if (dropdown.style.display === "block") {
                dropdown.style.display = "none"; // Close it if it's already open
            } else {
                dropdown.style.display = "block"; // Open it if it's closed
            }

            event.stopPropagation(); // Prevent bubbling up to window click listener
        });
    });

    // Close all dropdowns if clicked outside
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle')) {
            // Close all dropdown menus
            document.querySelectorAll('.navbar nav ul li ul, .user-dropdown-menu').forEach(dropdown => {
                dropdown.style.display = 'none'; // Hide all dropdowns
            });
        }
    });
    
    // Room Selection and Image Update
    const roomElement = document.getElementById('room');
    const imageElement = document.getElementById('room-image');
    const labelElement = document.getElementById('room-label');
    
    if (roomElement) {
        roomElement.addEventListener('change', function() {
            const selectedValue = this.value;
    
            // Update image and label based on selection
            if (selectedValue) {
                switch (selectedValue) {
                    case "1":
                        imageElement.src = "../assets/images/room223.png";
                        labelElement.textContent = "Room D223 Laboratory";
                        break;
                    case "2":
                        imageElement.src = "../assets/images/room422.png";
                        labelElement.textContent = "Room D422 Laboratory";
                        break;
                    case "3":
                        imageElement.src = "../assets/images/room423.png";
                        labelElement.textContent = "Room D423 Laboratory";
                        break;
                    case "4":
                        imageElement.src = "../assets/images/room424.png";
                        labelElement.textContent = "Room D424 Laboratory";
                        break;
                    case "5":
                        imageElement.src = "../assets/images/room425.png";
                        labelElement.textContent = "Room D425 Laboratory";
                        break;
                    case "6":
                        imageElement.src = "../assets/images/room427.png";
                        labelElement.textContent = "Photography Room";
                        break;
                    case "7":
                        imageElement.src = "../assets/images/room522.png";
                        labelElement.textContent = "Room D522 Laboratory";
                        break;
                    case "8":
                        imageElement.src = "../assets/images/room523.png";
                        labelElement.textContent = "Room D523 Laboratory";
                        break;
                    case "9":
                        imageElement.src = "../assets/images/room524.png";
                        labelElement.textContent = "Room D524 Laboratory";
                        break;
                    case "10":
                        imageElement.src = "../assets/images/room526.png";
                        labelElement.textContent = "Room D526 Laboratory";
                        break;
                    case "11":
                        imageElement.src = "../assets/images/room528.png";
                        labelElement.textContent = "Room D528 Laboratory";
                        break;
                    case "12":
                        imageElement.src = "../assets/images/room722.png";
                        labelElement.textContent = "Room D722 Laboratory";
                        break;
                    case "13":
                        imageElement.src = "../assets/images/room723.png";
                        labelElement.textContent = "Room D723 Laboratory";
                        break;
                    case "14":
                        imageElement.src = "../assets/images/room724.png";
                        labelElement.textContent = "Room D724 Laboratory";
                        break;
                    case "15":
                        imageElement.src = "../assets/images/room725.png";
                        labelElement.textContent = "Room D725 Laboratory";
                        break;
                    default:
                        imageElement.src = "../assets/images/facilities-default.png";
                        labelElement.textContent = "Please select a room";
                        break;
                }
            } else {
                imageElement.src = "../assets/images/facilities-default.png";
                labelElement.textContent = "Please select a room";
            }
        });
    }
});
