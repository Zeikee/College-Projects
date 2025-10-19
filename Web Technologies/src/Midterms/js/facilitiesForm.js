document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('facility-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const idofrow = 0;
        const startdate = document.getElementById('start-date').value;
        const starttime = document.getElementById('start-time').value;
        const enddate = document.getElementById('end-date').value;
        const endtime = document.getElementById('end-time').value;
        const roomid = document.getElementById('room').value;
        const room = document.getElementById('room-label').textContent;
        const purpose = document.getElementById('purpose').value;
        const specialinstructions = document.getElementById('special-instructions').value;
        const which = true;
        localStorage.setItem('facilitiesFormData', JSON.stringify({
            which,
            idofrow,
            roomid,
            startdate,
            starttime,
            enddate,
            endtime,
            room,
            purpose,
            specialinstructions
        }));

        const formData = JSON.parse(localStorage.getItem('facilitiesFormData'));
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
                window.location.href = 'facilitiesConfirmation.php';
            } else {
                alert(result.message);
            }
        })
        .catch(error => console.log('Error:', error));
    });

    const startDateElement = document.getElementById('start-date');
    const endDateElement = document.getElementById('end-date');
    const startTimeElement = document.getElementById('start-time');
    const endTimeElement = document.getElementById('end-time');
    const purposeElement = document.getElementById('purpose');

    //Clear previous error 
    startDateElement.setCustomValidity('');
    endDateElement.setCustomValidity('');
    purposeElement.setCustomValidity('');
    startTimeElement.setCustomValidity('');
    endTimeElement.setCustomValidity('');
    purposeElement.setCustomValidity('');

    //Disable UserInput, but userselect
    const elementIds = [startDateElement, endDateElement, startTimeElement, endTimeElement];
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

    //--Date--start
    const today = new Date(); //Declare date today
    const formattedDate = today.toISOString().split('T')[0]; //Date to day to string
    today.setDate(today.getDate() + 1); // Date tomorrow

    //Start Date
    document.getElementById('start-date').value =formattedDate;
    startDateElement.setAttribute('min', formattedDate);
    startDateElement.setAttribute('max', today.toISOString().split('T')[0]);
    //End Date
    document.getElementById('end-date').value = today.toISOString().split('T')[0];
    endDateElement.setAttribute('min', formattedDate);
    endDateElement.addEventListener('change', function(event) {
        const NewMaxStartValue = new Date(endDateElement.value);
        const formattedStartDateMax = NewMaxStartValue.toISOString().split('T')[0];
        startDateElement.setAttribute('max', formattedStartDateMax);
    });
    //--Date--end

    //--Time--start
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
    startTimeElement.addEventListener('change', function(event){
        const selectedTime = this.value;

        const startTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
        const endTimeDate = new Date(`1970-01-01T${endTimeElement.value}:00`);
        const duration = (endTimeDate - startTimeDate) / (1000 * 60);
        if (selectedTime < "07:29") {
            startTimeElement.value = "07:30";
            startTimeElement.setCustomValidity('Please select 7:30 AM onwards');
            startTimeElement.reportValidity();
            event.preventDefault();
            return;
        }else if(selectedTime > "18:00"){
            startTimeElement.value = "07:30";
            startTimeElement.setCustomValidity('Please select before 6:00 PM');
            startTimeElement.reportValidity();
            event.preventDefault();
            return;
        }else if(selectedTime > endTimeElement.value){
            startTimeElement.value = "07:30";
            startTimeElement.setCustomValidity('Please select before '+CheckAMPM(endTimeElement.value)+', You cant start a time after the end time.');
            startTimeElement.reportValidity();
            event.preventDefault();
            return;
        }
        if (duration < 60){
            const Subtract30ToStartedTime = new Date(endTimeDate.getTime() - 60 * 60 * 1000);
            const NewStartedTimeHour = String(Subtract30ToStartedTime.getHours()).padStart(2, '0');
            const NewStartedTimeMinute = String(Subtract30ToStartedTime.getMinutes()).padStart(2, '0');
            startTimeElement.value = `${NewStartedTimeHour}:${NewStartedTimeMinute}`;
            startTimeElement.setCustomValidity('Minimum duration of your reservation is 1 hour.');
            startTimeElement.reportValidity();
            event.preventDefault();
            return;
        }
    });
    
    endTimeElement.addEventListener('change', function(event){
        const selectedTime = this.value; 
        const endTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
        const startTimeDate = new Date(`1970-01-01T${startTimeElement.value}:00`);
        const duration = (endTimeDate - startTimeDate) / (1000 * 60);      
        if (selectedTime < startTimeElement.value) {
            endTimeElement.value = "09:30"
            endTimeElement.setCustomValidity('Please select '+CheckAMPM(startTimeElement.value)+'onwards');
            endTimeElement.reportValidity();
            event.preventDefault();
            endDateElement.setCustomValidity('');
            return;
        }else if(selectedTime > "18:00"){
            endTimeElement.value = "09:30"
            endTimeElement.setCustomValidity('Please select before 6:00 PM');
            endTimeElement.reportValidity();
            event.preventDefault();
            return;
        }
        if(duration < 60){
            const Add30MinutesToEndTIme = new Date(startTimeDate.getTime() + 60 * 60 * 1000);
            const NewEndtimeHour = String(Add30MinutesToEndTIme.getHours()).padStart(2, '0');
            const NewEndtimeMinute = String(Add30MinutesToEndTIme.getMinutes()).padStart(2, '0');
            endTimeElement.value = `${NewEndtimeHour}:${NewEndtimeMinute}`;
            endTimeElement.setCustomValidity('Minimum duration of your reservation is 1 hour.');
            endTimeElement.reportValidity();
            event.preventDefault();
            return;
        }
    });
    //--Time--end


    const ReserveproceedBtn = document.querySelector('.reserve-proceed-btn');

    ReserveproceedBtn.addEventListener('click', function(event) {
        if(startDateElement.validity.valueMissing){
            startDateElement.setCustomValidity('Please select a valid start date.');
            startDateElement.reportValidity();
            event.preventDefault();
            return;
        } else if(startDateElement.value < startDateElement.min){
            startDateElement.setCustomValidity('You cannot select a past date.');
            startDateElement.reportValidity();
            event.preventDefault();
            return;
        } else if(startDateElement.value > endDateElement.value){
            startDateElement.setCustomValidity('You cannot select a negative day for your reservation');
            startDateElement.reportValidity();
            event.preventDefault();
            return;
        }

        if(endDateElement.validity.valueMissing){
            endDateElement.setCustomValidity('Please select a valid start date.');
            endDateElement.reportValidity();
            event.preventDefault();
            return;
        }else if(endDateElement.value < startDateElement.min){
            endDateElement.setCustomValidity('You cant select a past date');
            endDateElement.reportValidity();
            event.preventDefault();
            return;
        }
        startDateElement.setCustomValidity('');
        endDateElement.setCustomValidity('');
        purposeElement.setCustomValidity('');
        startTimeElement.setCustomValidity('');
        endTimeElement.setCustomValidity('');
        purposeElement.setCustomValidity('');
        
    });

     const facilityModal = document.getElementById("facility-popup-modal");
     const openPopup = document.getElementById("open-popup");
     const closeBtn = document.querySelector(".close-btn");
 
     if (facilityModal && openPopup && closeBtn) {
         openPopup.addEventListener("click", function(event) {
             event.preventDefault(); // Prevent default anchor behavior
             facilityModal.style.display = "block"; // Show the modal
         });
 
         closeBtn.addEventListener("click", function() {
             facilityModal.style.display = "none"; // Hide the modal
         });
 
         window.addEventListener("click", function(event) {
             if (event.target == facilityModal) {
                 facilityModal.style.display = "none"; // Hide the modal
             }
         });
     }
 
     // Search and Filter Facilities
     const searchFacility = document.getElementById("search-facility");
     const facilityStatus = document.getElementById("facility-status");
 
     if (searchFacility && facilityStatus) {
         searchFacility.addEventListener("input", filterFacilities);
         facilityStatus.addEventListener("change", filterFacilities);
 
         function filterFacilities() {
             var searchValue = searchFacility.value.toLowerCase();
             var selectedStatus = facilityStatus.value;
             var facilityRows = document.querySelectorAll("#facility-list tr");
 
             facilityRows.forEach(function(row) {
                 var facilityName = row.children[0].textContent.toLowerCase();
                 var status = row.children[2].textContent.toLowerCase();
 
                 // Show or hide rows based on search term and status filter
                 var matchesSearch = facilityName.includes(searchValue);
                 var matchesStatus = (selectedStatus === "all") || (status === selectedStatus);
 
                 if (matchesSearch && matchesStatus) {
                     row.style.display = ""; // Show the row
                 } else {
                     row.style.display = "none"; // Hide the row
                 }
             });
         }
     }
});