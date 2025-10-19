
document.addEventListener('DOMContentLoaded', function() {
    const formData = JSON.parse(localStorage.getItem('facilitiesReservationData'));

    if (formData) {
        // Display the borrow details
        document.getElementById('confirmation-details').innerHTML = `
            <p><strong>Date:</strong> ${formData.startdate} - ${formData.enddate}</p>
            <p><strong>Time:</strong> ${formData.starttime} - ${formData.endtime}</p>
            <p><strong>Facility:</strong> ${formData.room}</p>
            <p><strong>Purpose:</strong> ${formData.purpose}</p>
            <p><strong>Special Instructions:</strong> ${formData.specialinstructions}</p>
            <p><strong>Seats:</strong> ${formData.seats}</p>
        `;
        if (formData) {
            console.log('Equipment Data:', formData);
            const facilityList = document.getElementById('confirmation-details');
            const facilityforeach = formData.facilityData;
            facilityforeach.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${item.equipment} <strong>Quantity:</strong> ${item.quantity}`;
                facilityList.appendChild(listItem);
            });
        }else{
            console.log('No equipment data found');
        }
    }
});

function confirmFacilityBorrow() {
    const formData = JSON.parse(localStorage.getItem('facilitiesReservationData'));

    if (formData) {
        // Send the form data to the server using a POST request
        fetch('../php/insert/facilitytransaction.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            console.log('Response Status:', response.status);
            if (!response.ok) {
                throw new Error('Failed to insert data');
            }
            return response.text();
        })
        .then(data => {
            console.log('Server Response:', data);
            const message = JSON.stringify({action: 'update'});
            sendWebSocketMessage(message);
            window.location.href = 'facilitiesDashboard.php';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error confirming the borrow. Please try again.');
        });
    }
}
function sendWebSocketMessage(message) {
    const wsUrl = 'ws://localhost:8080'; // Adjust the URL to your WebSocket server
    const socket = new WebSocket(wsUrl);

    socket.onopen = function() {
        socket.send(message); // Send the message
        socket.close(); // Close the connection after sending
    };

    socket.onerror = function(error) {
        console.error('WebSocket Error:', error);
        alert('Could not send WebSocket message.');
    };
}
// Go Back Function
function goBack() {
    window.history.back(); // Go back to the previous page (borrow form)
}
