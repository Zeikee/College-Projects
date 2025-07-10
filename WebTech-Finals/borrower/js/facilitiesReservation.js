document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("facility-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission by default

      const roomid = document.getElementById("rooms").value; // Get selected room ID
      const startdate = document.getElementById("start-date").value;
      const starttime = document.getElementById("start-time").value;
      const enddate = document.getElementById("end-date").value;
      const endtime = document.getElementById("end-time").value;
      const room = document.getElementById("roomDropdown").value;
      const purpose = document.getElementById("purpose").value;
      const specialinstructions = document.getElementById("special-instructions").value;
      let seatss = document.getElementById("seats").value;
      const reservationType = document.getElementById("rooms").value; // Get reservation type (Full or Partial)
      // Check if the room is selected
      if (!reservationType) {
        alert("Please specify whether the reservation is full or partial");
        return; // Stop form submission
      }

      // If the reservation is partial, ensure that seats are specified
      
      if (reservationType === "2" && !seats) { // Partial reservation
        alert("Please specify the number of seats for the partial reservation.");
        return; // Stop form submission
      }
      if(reservationType === "1"){
        seatss = "30";
      }
      // Proceed with storing data in localStorage if room is selected and seats are provided for partial reservation
      localStorage.setItem(
        "facilitiesReservationData",
        JSON.stringify({
          roomid,
          startdate,
          starttime,
          enddate,
          endtime,
          room,
          purpose,
          specialinstructions,
          seats:seatss
        })
      );

      // Proceed to confirmation page
      window.location.href = "facilitiesConfirmation.php";
    });

  const reservationTypeSelect = document.getElementById("rooms");
  const seatsContainer = document.getElementById("seats-container");

  // Function to handle the change event for reservation type
  reservationTypeSelect.addEventListener("change", function () {
    if (this.value === "1") {
      // Full Reservation
      seatsContainer.style.display = "none"; // Hide seat counter
    } else if (this.value === "2") {
      // Partial Reservation
      seatsContainer.style.display = "flex"; // Show seat counter
    }
  });

  // Initial check to set the correct display on page load
  if (reservationTypeSelect.value === "1") {
    seatsContainer.style.display = "none"; // Hide seat counter if Full Reservation is selected by default
  } else if (reservationTypeSelect.value === "2"){
    seatsContainer.style.display = "block"; // Show seat counter if Partial Reservation is selected
  }
});

  const startDateElement = document.getElementById("start-date");
  const endDateElement = document.getElementById("end-date");
  const startTimeElement = document.getElementById("start-time");
  const endTimeElement = document.getElementById("end-time");
  const purposeElement = document.getElementById("purpose");

  // Clear previous error
  startDateElement.setCustomValidity("");
  endDateElement.setCustomValidity("");
  purposeElement.setCustomValidity("");
  startTimeElement.setCustomValidity("");
  endTimeElement.setCustomValidity("");

  // Disable UserInput, but allow user to select
  const elementIds = [
    startDateElement,
    endDateElement,
    startTimeElement,
    endTimeElement,
  ];
  elementIds.forEach((element) => {
    if (element) {
      element.addEventListener("keydown", function (event) {
        event.preventDefault();
        return;
      });
    } else {
      console.log("Keydown: ", "One of the elements is not valid: ", element);
    }
  });

  // Function to get the current date in YYYY-MM-DD format in local timezone
  function getLocalDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because getMonth() is 0-based
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Set today's date as the minimum for the start date
  const formattedDate = getLocalDateString();
  startDateElement.value = formattedDate;
  startDateElement.setAttribute("min", formattedDate);

  // Dynamically set the end date to exactly 1 day after the start date
  function updateEndDate(startDate) {
    const selectedStartDate = new Date(startDate);
    if (selectedStartDate) {
      // Add 1 day to the selected start date
      const newEndDate = new Date(
        selectedStartDate.getTime() + 24 * 60 * 60 * 1000
      );
      const formattedEndDate = newEndDate.toISOString().split("T")[0];
      endDateElement.value = formattedEndDate; // Set end date value
      endDateElement.setAttribute("min", formattedEndDate); // Set min to exactly 1 day after start date
      endDateElement.setAttribute("max", formattedEndDate); // Set max to exactly 1 day after start date
    }
  }

  // Set initial values on page load
  updateEndDate(formattedDate);

  // Update end date when start date changes
  startDateElement.addEventListener("change", function () {
    updateEndDate(this.value);
  });

  // --Time-- start
  function CheckAMPM(time) {
    const [hours, minutes] = time.split(":").map(Number);
    let period = "AM";
    let convertedHour = hours;

    if (hours >= 13) {
      period = "PM";
      convertedHour = hours - 12;
    } else if (hours === 0) {
      convertedHour = 12;
    }
    const formattedHour = convertedHour === 0 ? 12 : convertedHour;
    const formattedMinute = minutes.toString().padStart(2, "0");

    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  startTimeElement.addEventListener("change", function (event) {
    const selectedTime = this.value;

    const startTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
    const endTimeDate = new Date(`1970-01-01T${endTimeElement.value}:00`);
    const duration = (endTimeDate - startTimeDate) / (1000 * 60);
    console.log("Dur", duration);

    if (selectedTime < "07:29") {
      startTimeElement.value = "07:30";
      startDateElement.setCustomValidity("Please select 7:30 AM onwards");
      startDateElement.reportValidity();
      event.preventDefault();
      return;
    } else if (selectedTime > "18:00") {
      startTimeElement.value = "07:30";
      startDateElement.setCustomValidity("Please select before 6:00 PM");
      startDateElement.reportValidity();
      event.preventDefault();
      return;
    } else if (selectedTime > endTimeElement.value) {
      startTimeElement.value = "07:30";
      startDateElement.setCustomValidity(
        "Please select before " +
          CheckAMPM(endTimeElement.value) +
          ", You can’t start a time after the end time."
      );
      startDateElement.reportValidity();
      event.preventDefault();
      return;
    }

    if (duration < 60) {
      const Subtract30ToStartedTime = new Date(
        endTimeDate.getTime() - 60 * 60 * 1000
      );
      const NewStartedTimeHour = String(
        Subtract30ToStartedTime.getHours()
      ).padStart(2, "0");
      const NewStartedTimeMinute = String(
        Subtract30ToStartedTime.getMinutes()
      ).padStart(2, "0");
      startTimeElement.value = `${NewStartedTimeHour}:${NewStartedTimeMinute}`;
      startDateElement.setCustomValidity(
        "Minimum duration of your reservation is 1 hour."
      );
      startDateElement.reportValidity();
      event.preventDefault();
      return;
    }
  });

  endTimeElement.addEventListener("change", function (event) {
    const selectedTime = this.value;
    const endTimeDate = new Date(`1970-01-01T${selectedTime}:00`);
    const startTimeDate = new Date(`1970-01-01T${startTimeElement.value}:00`);
    const duration = (endTimeDate - startTimeDate) / (1000 * 60);
    console.log("Dured", duration);

    if (selectedTime < startTimeElement.value) {
      endTimeElement.value = "09:30";
      endTimeElement.setCustomValidity(
        "Please select " + CheckAMPM(startTimeElement.value) + " onwards"
      );
      endTimeElement.reportValidity();
      event.preventDefault();
      endDateElement.setCustomValidity("");
      return;
    } else if (selectedTime > "18:00") {
      endTimeElement.value = "09:30";
      endTimeElement.setCustomValidity("Please select before 6:00 PM");
      endTimeElement.reportValidity();
      event.preventDefault();
      return;
    }

    if (duration < 60) {
      const Add30MinutesToEndTIme = new Date(
        startTimeDate.getTime() + 60 * 60 * 1000
      );
      const NewEndtimeHour = String(Add30MinutesToEndTIme.getHours()).padStart(
        2,
        "0"
      );
      const NewEndtimeMinute = String(
        Add30MinutesToEndTIme.getMinutes()
      ).padStart(2, "0");
      endTimeElement.value = `${NewEndtimeHour}:${NewEndtimeMinute}`;
      endTimeElement.setCustomValidity(
        "Minimum duration of your reservation is 1 hour."
      );
      endTimeElement.reportValidity();
      event.preventDefault();
      return;
    }
  });
  //--Time-- end

  const ReserveproceedBtn = document.querySelector(".reserve-proceed-btn");

  ReserveproceedBtn.addEventListener("click", function (event) {
    if (startDateElement.validity.valueMissing) {
      startDateElement.setCustomValidity("Please select a valid start date.");
      startDateElement.reportValidity();
      event.preventDefault();
      return;
    } else if (startDateElement.value < startDateElement.min) {
      startDateElement.setCustomValidity("You cannot select a past date.");
      startDateElement.reportValidity();
      event.preventDefault();
      return;
    } else if (startDateElement.value > endDateElement.value) {
      startDateElement.setCustomValidity(
        "You cannot select a negative day for your reservation"
      );
      startDateElement.reportValidity();
      event.preventDefault();
      return;
    }

    if (endDateElement.validity.valueMissing) {
      endDateElement.setCustomValidity("Please select a valid start date.");
      endDateElement.reportValidity();
      event.preventDefault();
      return;
    } else if (endDateElement.value < startDateElement.min) {
      endDateElement.setCustomValidity("You cant select a past date");
      endDateElement.reportValidity();
      event.preventDefault();
      return;
    }
    startDateElement.setCustomValidity("");
    endDateElement.setCustomValidity("");
    purposeElement.setCustomValidity("");
    startTimeElement.setCustomValidity("");
    endTimeElement.setCustomValidity("");
    purposeElement.setCustomValidity("");
  });

  const facilityModal = document.getElementById("facility-popup-modal");
  const openPopup = document.getElementById("open-popup");
  const closeBtn = document.querySelector(".close-btn");

  if (facilityModal && openPopup && closeBtn) {
    openPopup.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      facilityModal.style.display = "block"; // Show the modal

      function renderTable(data) {
        const tbody = document.querySelector('.facility-available-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.facilityName}</td>
            <td>${item.roomNumber}</td>
            <td>${item.TotalSeats}</td>
            `;
            tbody.appendChild(row);
        });
    }
    function populateTable(sortBy = "default") {
        fetch('../php/fetch/facilityContent.php')
            .then(response => response.json())
            .then(facilityData => {
                let sortedData;
                switch(sortBy){
                    case "id":
                        sortedData = facilityData.sort((a, b) => a.ID.localeCompare(b.ID));
                        break;
                    case "name":
                        sortedData = data.sort((a, b) => {
                            const facilityA = facilityData.find(facility => facility.facilityID === a.facilityID).facilityName;
                            const facilityB = facilityData.find(facility => facility.facilityID === b.facilityID).facilityName;
                            return facilityA.localeCompare(facilityB);
                        });
                        break;
                    default:
                        sortedData = facilityData;
                        break;
                }
                // Render the table with sorted data
                renderTable(sortedData);
            })
            .catch(error => console.error('Error fetching data:', error));
      }
      populateTable();  
    });

    closeBtn.addEventListener("click", function () {
      facilityModal.style.display = "none"; // Hide the modal
    });

    window.addEventListener("click", function (event) {
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

      facilityRows.forEach(function (row) {
        var facilityName = row.children[0].textContent.toLowerCase();
        var status = row.children[2].textContent.toLowerCase();

        // Show or hide rows based on search term and status filter
        var matchesSearch = facilityName.includes(searchValue);
        var matchesStatus =
          selectedStatus === "all" || status === selectedStatus;

        if (matchesSearch && matchesStatus) {
          row.style.display = ""; // Show the row
        } else {
          row.style.display = "none"; // Hide the row
        }
      });
    }
  }

// Fetch rooms and populate the dropdown
document.addEventListener("DOMContentLoaded", function () {
  fetch("../php/fetch/fetchFacility.php") // Adjust the path as needed
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const roomDropdown = document.getElementById("roomDropdown"); // Ensure this matches your dropdown's ID

      if (!roomDropdown) {
        console.error("Room dropdown element not found.");
        return;
      }

      // Clear existing options
      roomDropdown.innerHTML = '<option value="" disabled selected hidden>Select a Room</option>';

      if (data.length === 0) {
        const noRoomsOption = document.createElement("option");
        noRoomsOption.value = "";
        noRoomsOption.textContent = "No rooms available";
        roomDropdown.appendChild(noRoomsOption);
        return;
      }

      // Populate options dynamically
      data.forEach((room) => {
        const option = document.createElement("option");
        option.value = room.facility_id;
        option.textContent = room.room_name + ' - ' + room.room_id;
        roomDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching room data:", error);

      // Optional: Show an error message in the dropdown
      const roomDropdown = document.getElementById("roomDropdown");
      if (roomDropdown) {
        roomDropdown.innerHTML =
          '<option value="">Error loading rooms</option>';
      }
    });


    const RoomDrop = document.getElementById("roomDropdown");
    RoomDrop.addEventListener("change", (event) => {
        const sortBy = event.target.value;
          fetch('../../php/fetch/facilityContent.php')
              .then(response => response.json())
              .then(FacilityContent => {
                  var roomDropdown = document.getElementById("room-image");
                  const ImagePathFacility = {};
                  FacilityContent.forEach(facility => {
                    ImagePathFacility[facility.facilityID] = facility.imagePath;
                  });
                  const TotalSeats = {};
                  FacilityContent.forEach(facility => {
                    TotalSeats[facility.facilityID] = facility.TotalSeats;
                  });
                  roomDropdown.src = ImagePathFacility[sortBy];
                  const reservationTypeSelect = document.getElementById("rooms");
                  if(reservationTypeSelect.value === "2"){
                    const TextForm = document.getElementById("AvailableSeatsText");
                    TextForm.innerHTML = "Available Seats: " + TotalSeats[sortBy];
                  }
              })
          .catch(error => console.error('Error fetching data:', error));
    });
});
