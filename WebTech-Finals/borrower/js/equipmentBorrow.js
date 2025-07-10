// Declare variables at the top, only once
const equipmentDropdown = document.getElementById("equipment");
const imageContainer = document.getElementById("image-container");
const equipmentImage = document.getElementById("equipment-image");
const equipmentLabel = document.getElementById("equipment-label");
const deleteButton = document.getElementById('delete-btn');
const quantityInput = document.getElementById('quantity');

// Event listener for equipment form submission
document.getElementById('equipment-form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const startdate = document.getElementById('borrowing-date').value;
    const starttime = document.getElementById('pickup-time').value;
    const enddate = document.getElementById('return-date').value;
    const endtime = document.getElementById('return-time').value;
    const purpose = document.getElementById('equipment-purpose').value;
    const equipmentWrappers = document.querySelectorAll('.equipment-selection-container');
    const equipmentData = [];

    equipmentWrappers.forEach(wrapper => {
        const selectElement = wrapper.querySelector('#equipment');
        const quantityElement = wrapper.querySelector('#quantity');

        if (selectElement && quantityElement) {
            const equipment = selectElement.options[selectElement.selectedIndex].text;
            const equipmentID = selectElement.value;
            const quantity = quantityElement.value;
            if (equipment) {
                equipmentData.push({
                    equipmentID: equipmentID,
                    equipment: equipment,
                    quantity: parseInt(quantity, 10)
                });
            }
        }
    });
    localStorage.setItem('equipmentFormData', JSON.stringify({
        startdate,
        starttime,
        enddate,
        endtime,
        purpose,
        equipmentData
    }));
    console.log("Equipment: ",equipmentWrappers);
    console.log("Quantity: ",quantity);
    window.location.href = 'equipmentConfirmation.php';
});
document.addEventListener("DOMContentLoaded", function () {
    fetch('../php/fetch/equipmentContent.php')
    .then(response => response.json())
    .then(equipmentData => {
        const equipmentDropdown = document.getElementById("equipment"); // Ensure this matches your dropdown's ID

        if (!equipmentDropdown) {
          console.error("Equipment dropdown element not found.");
          return;
        }

        equipmentDropdown.innerHTML = '<option value="" disabled selected hidden>Select a Equipment</option>';

        if (equipmentData.length === 0) {
            const noEquipmenOption = document.createElement("option");
            noEquipmenOption.value = "";
            noEquipmenOption.textContent = "No equipments available";
            equipmentDropdown.appendChild(noEquipmenOption);
            return;
        }
        equipmentData.forEach((equipment) => {
            const option = document.createElement("option");
            option.value = equipment.equipmentID;
            option.textContent = equipment.equipmentName;
            equipmentDropdown.appendChild(option);
        });
    }).catch(error => console.error('Error fetching data:', error));
});
// Event listener for equipment dropdown changes
equipmentDropdown.addEventListener("change", function () {
    const selectedValue = equipmentDropdown.value;
    fetch('../php/fetch/equipmentContent.php')
    .then(response => response.json())
    .then(equipmentData => {
        const TotalQuantity = {};
        equipmentData.forEach(equipment => {
            TotalQuantity[equipment.equipmentID] = equipment.equipmentTotalQuantity;
        });
        const ImagePath = {};
        equipmentData.forEach(equipment => {
            ImagePath[equipment.equipmentID] = equipment.ImagePath;
        });
        const AvailableText = document.getElementById('available-quantity');
        AvailableText.textContent = 'Available: '+ TotalQuantity[selectedValue];
        const ImageContainer = document.getElementById('equipment-image');
        ImageContainer.src = ImagePath[selectedValue];
    }).catch(error => console.error('Error fetching data:', error));
});

// Event listener for equipment selection change
equipmentDropdown.addEventListener('change', function () {
    const availableQuantityElem = document.getElementById('available-quantity');
    // If equipment is selected, show the delete button, image, and available quantity
    if (equipmentDropdown.value) {
        deleteButton.style.display = 'inline-block'; // Show delete button
        imageContainer.style.display = 'block'; // Show image
        availableQuantityElem.style.display = 'block'; // Show availability quantity
    } else {
        // If no equipment is selected, hide the delete button, image, and available quantity
        deleteButton.style.display = 'none'; // Hide delete button
        imageContainer.style.display = 'none'; // Hide image
        availableQuantityElem.style.display = 'none'; // Hide availability quantity
    }
});


// Event listener for delete button
deleteButton.addEventListener('click', function () {
        equipmentDropdown.value = ''; // Reset equipment selection
        quantityInput.value = ''; // Reset quantity input
        deleteButton.style.display = 'none'; // Hide delete button
        imageContainer.style.display = 'none'; // Hide image container
        const availableQuantityElem = document.getElementById('available-quantity');
availableQuantityElem.style.display = 'none'; // Hide availability quantity
});

function validatePurpose() {
    const purposeField = document.getElementById('equipment-purpose');
    const purposeValue = purposeField.value.trim();
    if (purposeValue === "") {
        purposeField.setCustomValidity("Purpose cannot be empty.");
        purposeField.reportValidity();
        return false;
    }
    if (purposeValue.length > 200) {
        purposeField.setCustomValidity("Purpose cannot exceed 200 characters.");
        purposeField.reportValidity();
        return false;
    }
    purposeField.setCustomValidity(''); // Clear previous validation messages
    return true;
}

// Validate purpose field
document.getElementById('equipment-purpose').addEventListener('input', validatePurpose);

        document.addEventListener('DOMContentLoaded', function () {
            const borrowingDateElement = document.getElementById('borrowing-date');
            const returnDateElement = document.getElementById('return-date');
            const pickupTimeElement = document.getElementById('pickup-time');
            const returnTimeElement = document.getElementById('return-time');
        
            // Function to get the current date in YYYY-MM-DD format in the local time zone
            function getLocalDateString() {
                const today = new Date();
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() is 0-based
                const day = today.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        
            // Set today's date as the minimum for the borrowing date
            const formattedDate = getLocalDateString();
            borrowingDateElement.value = formattedDate;
            borrowingDateElement.setAttribute('min', formattedDate);
        
            // Function to update return date based on borrowing date
            function updateReturnDate(borrowingDate) {
                const selectedBorrowingDate = new Date(borrowingDate);
                if (selectedBorrowingDate) {
                    const formattedReturnDate = selectedBorrowingDate.toISOString().split('T')[0]; // Only the date part
                    returnDateElement.value = formattedReturnDate;
                    returnDateElement.setAttribute('min', formattedReturnDate); // Set min to borrowing date
                    // No max limit, we don't restrict return date anymore
                }
            }
        
            // Function to validate the dates
            function validateDates() {
                const borrowingDate = borrowingDateElement.value;
                const returnDate = returnDateElement.value;
        
                // Check if the return date is before the borrowing date
                if (new Date(returnDate) < new Date(borrowingDate)) {
                    returnDateElement.setCustomValidity("Return date cannot be earlier than borrowing date.");
                    returnDateElement.reportValidity();
                } else {
                    returnDateElement.setCustomValidity(""); // Clear any previous validation
                }
            }
        
            // Set initial return date on page load
            updateReturnDate(formattedDate);
        
            // Update return date when borrowing date changes
            borrowingDateElement.addEventListener('change', function () {
                updateReturnDate(this.value);
                validateDates(); // Revalidate dates when borrowing date changes
            });
        
            // Validate return date on change
            returnDateElement.addEventListener('change', function () {
                validateDates();
            });
        
            // Function to check AM/PM format
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
        
            // Validate pickup time
            pickupTimeElement.addEventListener('change', function (event) {
                const selectedPickupTime = this.value;
                const pickupTimeDate = new Date(`1970-01-01T${selectedPickupTime}:00`);
                const returnTimeElementNew = document.getElementById('return-time');
                const returnTimeDate = new Date(`1970-01-01T${returnTimeElementNew.value}:00`);
                const duration = (returnTimeDate - pickupTimeDate) / (1000 * 60);
        
                if (selectedPickupTime < "07:30") {
                    pickupTimeElement.value = "07:30";
                    pickupTimeElement.setCustomValidity('Please select 7:30 AM onwards');
                    pickupTimeElement.reportValidity();
                    event.preventDefault();
                    return;
                } else if (selectedPickupTime > "18:00") {
                    pickupTimeElement.value = "07:30";
                    pickupTimeElement.setCustomValidity('Please select before 6:00 PM');
                    pickupTimeElement.reportValidity();
                    event.preventDefault();
                    return;
                } else if (selectedPickupTime > returnTimeElement.value) {
                    pickupTimeElement.value = "07:30";
                    pickupTimeElement.setCustomValidity('Please select before ' + CheckAMPM(returnTimeElement.value) + ', you can’t start a time after the return time.');
                    pickupTimeElement.reportValidity();
                    event.preventDefault();
                    return;
                }
        
                if (duration < 60) {
                    const Subtract30ToStartedTime = new Date(returnTimeDate.getTime() - 60 * 60 * 1000);
                    const NewStartedTimeHour = String(Subtract30ToStartedTime.getHours()).padStart(2, '0');
                    const NewStartedTimeMinute = String(Subtract30ToStartedTime.getMinutes()).padStart(2, '0');
                    pickupTimeElement.value = `${NewStartedTimeHour}:${NewStartedTimeMinute}`;
                    pickupTimeElement.setCustomValidity('Minimum duration of your reservation is 1 hour.');
                    pickupTimeElement.reportValidity();
                    event.preventDefault();
                    return;
                }
            });
        
            // Validate return time
            returnTimeElement.addEventListener('change', function (event) {
                const selectedReturnTime = this.value;
                const returnTimeDate = new Date(`1970-01-01T${selectedReturnTime}:00`);
                const PickupTimeElementNew = document.getElementById('pickup-time');
                const pickupTimeDate = new Date(`1970-01-01T${PickupTimeElementNew.value}:00`);
                const duration = (returnTimeDate - pickupTimeDate) / (1000 * 60);
        
                if (selectedReturnTime < pickupTimeElement.value) {
                    returnTimeElement.value = "08:30";
                    returnTimeElement.setCustomValidity('Please selects ' + CheckAMPM(pickupTimeElement.value) + ' onwards');
                    returnTimeElement.reportValidity();
                    event.preventDefault();
                    return;
                } else if (selectedReturnTime > "18:00") {
                    returnTimeElement.value = "08:30";
                    returnTimeElement.setCustomValidity('Please select before 6:00 PM');
                    returnTimeElement.reportValidity();
                    event.preventDefault();
                    return;
                }
        
                if (duration < 60) {
                    const Add30MinutesToEndTime = new Date(pickupTimeDate.getTime() + 60 * 60 * 1000);
                    const NewEndtimeHour = String(Add30MinutesToEndTime.getHours()).padStart(2, '0');
                    const NewEndtimeMinute = String(Add30MinutesToEndTime.getMinutes()).padStart(2, '0');
                    returnTimeElement.value = `${NewEndtimeHour}:${NewEndtimeMinute}`;
                    returnTimeElement.setCustomValidity('Minimum duration of your reservation is 1 hour.');
                    returnTimeElement.reportValidity();
                    event.preventDefault();
                    return;
                }
            });
        });
            
        document.getElementById('equipment').addEventListener('change', function (event) {
            const selectedEquipment = event.target.value;
            const availableQuantityElem = document.getElementById('available-quantity');
            
            // Update the available quantity based on the selected equipment
            let availableQuantity = 0;
        
            // Example logic for different equipment - you can change these values
            switch (selectedEquipment) {
                case '1':  // Projector
                    availableQuantity = 3;
                    break;
                case '2':  // DSLR Camera
                    availableQuantity = 2;
                    break;
                case '3':  // Microphone
                    availableQuantity = 5;
                    break;
                case '4':  // Speaker
                    availableQuantity = 4;
                    break;
                case '5':  // HDMI Cable
                    availableQuantity = 6;
                    break;
                case '6':  // Crimper
                    availableQuantity = 2;
                    break;
                case '7':  // Gimbal
                    availableQuantity = 1;
                    break;
                default:
                    availableQuantity = 0; // No equipment selected
            }
        
            // Update the displayed available quantity
            if (availableQuantity > 0) {
                availableQuantityElem.textContent = `Available: ${availableQuantity}`;
                availableQuantityElem.style.display = 'block'; // Show the quantity
            } else {
                availableQuantityElem.style.display = 'none'; // Hide if no valid equipment is selected
            }
        });
            
        // Create the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<img src="../assets/images/delete.png" alt="Delete Icon">';


        // Add event listener for delete button
        deleteBtn.addEventListener('click', function() {
            newEquipmentWrapper.remove();
        });

        document.getElementById('add-equipment-btn').addEventListener('click', function () {
            // Clone the equipment-selection-container template
            const equipmentTemplate = document.querySelector('.equipment-selection-container');
            const newEquipmentWrapper = equipmentTemplate.cloneNode(true);
        
            // Clear values in the cloned container
            const equipmentSelect = newEquipmentWrapper.querySelector('#equipment');
            const quantityInput = newEquipmentWrapper.querySelector('#quantity');
            const availableQuantity = newEquipmentWrapper.querySelector('#available-quantity');
            const dynamicImageContainer = newEquipmentWrapper.querySelector('#dynamic-image-container');
            const dynamicEquipmentImage = newEquipmentWrapper.querySelector('#dynamic-equipment-image');
            const dynamicEquipmentLabel = newEquipmentWrapper.querySelector('#dynamic-equipment-label');
            const deleteButton = newEquipmentWrapper.querySelector('#delete-btn');
        
            // Reset dropdown, quantity input, and dynamic content
            equipmentSelect.value = '';
            quantityInput.value = '';
            availableQuantity.textContent = 'Available:';
            dynamicImageContainer.style.display = 'none';

            equipmentSelect.addEventListener("change", function () {
                const selectedValue = this.value;
                fetch('../php/fetch/equipmentContent.php')
                .then(response => response.json())
                .then(equipmentData => {
                    const TotalQuantity = {};
                    equipmentData.forEach(equipment => {
                        TotalQuantity[equipment.equipmentID] = equipment.equipmentTotalQuantity;
                    });
                    const ImagePath = {};
                    equipmentData.forEach(equipment => {
                        ImagePath[equipment.equipmentID] = equipment.ImagePath;
                    });
                    dynamicEquipmentImage.src =ImagePath[selectedValue];
                    dynamicImageContainer.style.display = 'block';
                    availableQuantity.textContent = `Available: ${TotalQuantity[selectedValue]}`;
                }).catch(error => console.error('Error fetching data:', error));
            });

            // Add delete functionality
            deleteButton.addEventListener('click', function () {
                newEquipmentWrapper.remove(); // Remove the entire cloned container
            });
        
            // Append the new wrapper to the equipment list container
            document.getElementById('equipment-list-container').appendChild(newEquipmentWrapper);
        });
    