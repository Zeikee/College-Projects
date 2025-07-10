
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('equipment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const startdate = document.getElementById('borrowing-date').value;
        const starttime = document.getElementById('pickup-time').value;
        const enddate = document.getElementById('return-date').value;
        const endtime = document.getElementById('return-time').value;
        const purpose = document.getElementById('equipment-purpose').value;
        const equipmentWrappers = document.querySelectorAll('.equipment-quantity-wrapper');
        const equipmentData = [];
        equipmentWrappers.forEach(wrapper => {
            const selectElement = wrapper.querySelector('select[name="equipment"]');
            const quantityElement = wrapper.querySelector('input[name="quantity"]');

            if (selectElement && quantityElement) {
                const equipment = selectElement.value;
                const quantity = quantityElement.value;
                const match = equipment.match(/^([a-zA-Z]+)(\d+)$/);
                if (equipment) {
                    equipmentData.push({
                        equipmentID: match[2],
                        equipment: match[1],
                        quantity: parseInt(quantity, 10)
                    });
                }
            }
        });
        const which = false;
        const idofrow = 0;
        const idofequipment = equipmentData[0].equipmentID;
        localStorage.setItem('equipmentFormData', JSON.stringify({
            which,
            idofequipment,
            idofrow,
            startdate,
            starttime,
            enddate,
            endtime,
            purpose,
            equipmentData
        }));

        const formData = JSON.parse(localStorage.getItem('equipmentFormData'));
        fetch('/php/checker/check_reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                window.location.href = 'borrowConfirmationPage.php';
            } else {
                alert(result.message);
            }
        })
        .catch(error => console.log('Error:', error));
    });
});

// Add event listener for the "Add More Equipment" button
document.getElementById('add-equipment-btn').addEventListener('click', function() {
    // Create a new equipment quantity wrapper
    const newEquipmentWrapper = document.createElement('div');
    newEquipmentWrapper.classList.add('form-group', 'equipment-quantity-wrapper');

    // Create the select equipment div
    const selectEquipmentDiv = document.createElement('div');
    selectEquipmentDiv.classList.add('select-equipment');
    selectEquipmentDiv.innerHTML = `
        <label for="equipment">Select Equipment</label>
        <select name="equipment" required>
            <option value="" disabled selected>Select Equipment</option>
            <option value="Projector1">Projector</option>
            <option value="DSLR3">DSLR Camera</option>
            <option value="Microphone4">Microphone</option>
            <option value="Speaker5">Speaker</option>
            <option value="HDMICABLE6">HDMI Cable</option>
            <option value="Crimper7">Crimper</option>
            <option value="Gimbal8">Gimbal</option>
        </select>
    `;

    // Create the quantity div
    const quantityDiv = document.createElement('div');
    quantityDiv.classList.add('quantity');
    quantityDiv.innerHTML = `
        <label for="quantity">Quantity</label>
        <input type="number" name="quantity" value="1" min="1">
        <span class="available-items">Available items: 2</span>
    `;

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<img src="../assets/images/delete.png" alt="Delete Icon">';

    // Append the select equipment and quantity divs to the new wrapper
    newEquipmentWrapper.appendChild(selectEquipmentDiv);
    newEquipmentWrapper.appendChild(quantityDiv);
    newEquipmentWrapper.appendChild(deleteBtn);

    // Append the new wrapper to the equipment fields container
    document.getElementById('equipment-fields').appendChild(newEquipmentWrapper);

    // Add event listener for delete button
    deleteBtn.addEventListener('click', function() {
        newEquipmentWrapper.remove();
    });
    
});

document.addEventListener('DOMContentLoaded', function () {
    // Function to validate quantity input
    function validateQuantity(inputElement) {
        const quantity = parseInt(inputElement.value);
        const availableItems = parseInt(inputElement.closest('.quantity').querySelector('.available-items').textContent.match(/\d+/)[0]);

        if (quantity > availableItems) {
            inputElement.setCustomValidity(`Only ${availableItems} items are available.`);
            inputElement.reportValidity();
        } else {
            inputElement.setCustomValidity('');
        }
    }
    // Function to validate the purpose field
    function validatePurpose() {
        const purposeField = document.getElementById('purpose');
        const purposeValue = purposeField.value.trim();
        
        // Check if it's empty
        if (purposeValue === "") {
            purposeField.setCustomValidity("Purpose cannot be empty.");
            purposeField.reportValidity();
            return false;
        }

        // Check if it exceeds 200 characters
        if (purposeValue.length > 200) {
            purposeField.setCustomValidity("Purpose cannot exceed 200 characters.");
            purposeField.reportValidity();
            return false;
        }

        purposeField.setCustomValidity(''); // Clear any previous validation messages
        return true;
    }
    // Add event listener for quantity input changes
    document.getElementById('equipment-fields').addEventListener('input', function (event) {
        if (event.target.name === 'quantity') {
            validateQuantity(event.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
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

    const startdateElement = document.getElementById('borrowing-date');
    const enddateElement = document.getElementById('return-date');
    const starttimeElement = document.getElementById('pickup-time');
    const endtimeElement = document.getElementById('return-time');

    //--Date--start
    const today = new Date(); //Declare date today
    const formattedDate = today.toISOString().split('T')[0]; //Date to day to string
    today.setDate(today.getDate() + 1); // Date tomorrow

    //Start Date
    document.getElementById('borrowing-date').value =formattedDate;
    startdateElement.setAttribute('min', formattedDate);
    startdateElement.setAttribute('max', today.toISOString().split('T')[0]);

    //End Date
    document.getElementById('return-date').value = today.toISOString().split('T')[0];
    enddateElement.setAttribute('min', formattedDate);
    enddateElement.addEventListener('change', function(event) {
        const NewMaxStartValue = new Date(enddateElement.value);
        const formattedStartDateMax = NewMaxStartValue.toISOString().split('T')[0];
        startdateElement.setAttribute('max', formattedStartDateMax);
    }); 
    //--Date--end

    starttimeElement.addEventListener('change', function(event){
        const selectedTime = this.value;

        const startTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
        const endTimeDate = new Date(`1970-01-01T${endtimeElement.value}:00`);
        const duration = (endTimeDate - startTimeDate) / (1000 * 60);
        if (selectedTime < "07:29") {
            starttimeElement.value = "07:30";
            starttimeElement.setCustomValidity('Please select 7:30 AM onwards');
            starttimeElement.reportValidity();
            event.preventDefault();
            return;
        }else if(selectedTime > "18:00"){
            starttimeElement.value = "07:30";
            starttimeElement.setCustomValidity('Please select before 6:00 PM');
            starttimeElement.reportValidity();
            event.preventDefault();
            return;
        }else if(selectedTime > endtimeElement.value){
            starttimeElement.value = "07:30";
            starttimeElement.setCustomValidity('Please select before '+CheckAMPM(endtimeElement.value)+', You cant start a time after the end time.');
            starttimeElement.reportValidity();
            event.preventDefault();
            return;
        }
        if (duration < 60){
            const Subtract30ToStartedTime = new Date(endTimeDate.getTime() - 60 * 60 * 1000);
            const NewStartedTimeHour = String(Subtract30ToStartedTime.getHours()).padStart(2, '0');
            const NewStartedTimeMinute = String(Subtract30ToStartedTime.getMinutes()).padStart(2, '0');
            starttimeElement.value = `${NewStartedTimeHour}:${NewStartedTimeMinute}`;
            starttimeElement.setCustomValidity('Minimum duration of your reservation is 1 hour.');
            starttimeElement.reportValidity();
            event.preventDefault();
            return;
        }
    });

    endtimeElement.addEventListener('change', function(event){
        const selectedTime = this.value; 
        const endTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
        const startTimeDate = new Date(`1970-01-01T${starttimeElement.value}:00`);
        const duration = (endTimeDate - startTimeDate) / (1000 * 60);      
        if (selectedTime < starttimeElement.value) {
            endtimeElement.value = "09:30"
            endtimeElement.setCustomValidity('Please select '+CheckAMPM(starttimeElement.value)+'onwards');
            endtimeElement.reportValidity();
            event.preventDefault();
            endDateElement.setCustomValidity('');
            return;
        }else if(selectedTime > "18:00"){
            endtimeElement.value = "09:30"
            endtimeElement.setCustomValidity('Please select before 6:00 PM');
            endtimeElement.reportValidity();
            event.preventDefault();
            return;
        }
        if(duration < 60){
            const Add30MinutesToEndTIme = new Date(startTimeDate.getTime() + 60 * 60 * 1000);
            const NewEndtimeHour = String(Add30MinutesToEndTIme.getHours()).padStart(2, '0');
            const NewEndtimeMinute = String(Add30MinutesToEndTIme.getMinutes()).padStart(2, '0');
            endtimeElement.value = `${NewEndtimeHour}:${NewEndtimeMinute}`;
            endtimeElement.setCustomValidity('Minimum duration of your reservation is 1 hour.');
            endtimeElement.reportValidity();
            event.preventDefault();
            return;
        }
    });
    //--Time--end

});


const newEquipmentWrapper = document.createElement('div');
newEquipmentWrapper.classList.add('form-group', 'equipment-quantity-wrapper');

// Create the select equipment div
const selectEquipmentDiv = document.createElement('div');
selectEquipmentDiv.classList.add('select-equipment');
selectEquipmentDiv.innerHTML = `
    <label for="equipment">Select Equipment</label>
    <select name="equipment" required>
        <option value="" disabled selected>Select Equipment</option>
        <option value="Projector1">Projector</option>
        <option value="DSLR3">DSLR Camera</option>
        <option value="Microphone4">Microphone</option>
        <option value="Speaker5">Speaker</option>
        <option value="HDMICABLE6">HDMI Cable</option>
        <option value="Crimper7">Crimper</option>
        <option value="Gimbal8">Gimbal</option>
    </select>
`;

// Create the quantity div
const quantityDiv = document.createElement('div');
quantityDiv.classList.add('quantity');
quantityDiv.innerHTML = `
    <label for="quantity">Quantity</label>
    <input type="number" name="quantity" value="1" min="1">
    <span class="available-items">Available items: 2</span>
`;

// Create the delete button
const deleteBtn = document.createElement('button');
deleteBtn.type = 'button';
deleteBtn.classList.add('delete-btn');
deleteBtn.innerHTML = '<img src="../assets/images/delete.png" alt="Delete Icon">';

// Append the select equipment and quantity divs to the new wrapper
newEquipmentWrapper.appendChild(selectEquipmentDiv);
newEquipmentWrapper.appendChild(quantityDiv);
newEquipmentWrapper.appendChild(deleteBtn);

// Append the new wrapper to the equipment fields container
document.getElementById('equipment-fields').appendChild(newEquipmentWrapper);

// Add event listener for delete button
deleteBtn.addEventListener('click', function() {
    newEquipmentWrapper.remove();
});
 