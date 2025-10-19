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

    const form = document.getElementById('addFacilityForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const fileInput = document.getElementById('image-upload');
            const file = fileInput.files[0];
            if (!file) {
                alert('Please select an image file.');
                return;
            }

            const FacilityRoomNumber = document.getElementById("NewFacilityRoomNumber").value;
            const FacilityName = document.getElementById("NewFacilityName").value;
            const FacilitySeats = document.getElementById("NewFacilitySeats").value;
            const FacilityOtherInfoed = document.getElementById("OtherInfo").value;

            localStorage.setItem('NewFacilityTextData', JSON.stringify({
                FacilityRoomNumber:FacilityRoomNumber,
                FacilityName:FacilityName,
                FacilityTotalSeats:FacilitySeats,
                FacilityOtherInfo:FacilityOtherInfoed
            }));
            const NewFacilityTextData = JSON.parse(localStorage.getItem('NewFacilityTextData'));
            const NewFacilityData = new FormData();
            NewFacilityData.append('facilityData', JSON.stringify(NewFacilityTextData)); 
            NewFacilityData.append('facilityImage', file);

            if (NewFacilityData && NewFacilityTextData) {
                fetch('../../php/insert/Facility.php', {
                    method: 'POST',
                    body: NewFacilityData
                })
                .then(response => response.text())
                .then(data => {
                    window.location.href = 'adminFacilitiesManagement.php';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error. Please try again.');
                });
            }
        });
    }
    // Image upload and preview logic
    const fileInput = document.getElementById('image-upload');
    const previewImage = document.getElementById('preview-image');
    const defaultImage = document.getElementById('default-image'); // Reference to the default image
    const facilitiesHeading = document.querySelector('h2'); // Reference to the heading
    
    // Event listener for file input change
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0]; // Get the selected file
    
        if (file) {
            // Validate that the file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
    
                // When the file is successfully read, update the preview image's src
                reader.onload = function (e) {
                    previewImage.src = e.target.result; // Set the image source
                    previewImage.style.display = 'block'; // Make the image visible
                    defaultImage.style.display = 'none'; // Hide the default image
                    facilitiesHeading.style.display = 'none'; // Hide the heading
                };
    
                reader.readAsDataURL(file); // Read the file as a data URL
            } else {
                alert('Please upload a valid image file.');
                previewImage.style.display = 'none'; // Hide the preview if the file is invalid
                defaultImage.style.display = 'block'; // Show the default image again
                facilitiesHeading.style.display = 'block'; // Show the heading again
            }
        } else {
            // If no file is selected, hide the preview image and show the default image
            previewImage.src = '';
            previewImage.style.display = 'none';
            defaultImage.style.display = 'block';
            facilitiesHeading.style.display = 'block';
        }


    });
       
    if(usertype.includes("custodian")){
        document.getElementById("admin-feature-account-li").style.display = "none";
    }
});