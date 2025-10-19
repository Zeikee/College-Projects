// Retrieve form data from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const equipmentFormData = JSON.parse(localStorage.getItem('equipmentFormData'));

    if (equipmentFormData) {
        document.getElementById('confirmation-details').innerHTML = `
            <p><strong>Borrowing Date:</strong> ${equipmentFormData.startdate} at ${equipmentFormData.starttime}</p>
            <p><strong>Return Date:</strong> ${equipmentFormData.enddate} at ${equipmentFormData.endtime}</p>
            <p><strong>Purpose:</strong> ${equipmentFormData.purpose}</p>
            <p><strong>Items:</strong></p>
        `;
        if (equipmentFormData) {
            console.log('Equipment Data:', equipmentFormData);
            const equipmentList = document.getElementById('confirmation-details');
            const equipmentforeach = equipmentFormData.equipmentData;
            equipmentforeach.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${item.equipment} <strong>Quantity:</strong> ${item.quantity}`;
                equipmentList.appendChild(listItem);
            });
        }else{
            console.log('No equipment data found');
        }
    }
});

// Confirm Borrow Function
function equipmentConfirmation() {
    const formData = JSON.parse(localStorage.getItem('equipmentFormData'));
    if (formData) {
        fetch('../php/insert/equipmenttransaction.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to insert data');
            }
            return response.text();
        })
        .then(data => {
            const message = JSON.stringify({ action: 'update' });
            sendWebSocketMessage(message);
            window.location.href = 'equipmentDashboard.php';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error confirming the borrow. Please try again.');
        });
    }
}

// WebSocket Helper
function sendWebSocketMessage(message) {
    const wsUrl = 'ws://localhost:8080'; // Adjust the URL to your WebSocket server
    const socket = new WebSocket(wsUrl);

    socket.onopen = function () {
        socket.send(message); // Send the message
        socket.close(); // Close the connection after sending
    };

    socket.onerror = function (error) {
        console.error('WebSocket Error:', error);
        alert('Could not send WebSocket message.');
    };
}

// Go Back Function
function goBack() {
    window.history.back(); // Go back to the previous page (borrow form)
}
