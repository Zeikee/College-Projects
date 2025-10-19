document.addEventListener('DOMContentLoaded', function() {
    const formData = JSON.parse(localStorage.getItem('facilitiesFormData'));

    if (formData) {
        // Display the borrow details
        document.getElementById('confirmation-details').innerHTML = `
            <p><strong>Date:</strong> ${formData.startdate} - ${formData.enddate}</p>
            <p><strong>Time:</strong> ${formData.starttime} - ${formData.endtime}</p>
            <p><strong>Facility:</strong> ${formData.room}</p>
            <p><strong>Purpose:</strong> ${formData.purpose}</p>
            <p><strong>Special Instructions:</strong> ${formData.specialinstructions}</p>
        `;
    }
});

function confirmFacilityBorrow() {
    const formData = JSON.parse(localStorage.getItem('facilitiesFormData'));

    if (formData) {
        // Send the form data to the server using a POST request
        fetch('php/insert/facilitytransaction.php', {
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
            sendWebSocketMessage(JSON.stringify({action: 'update'}));
            window.location.href = 'facilitiesDashboard.php';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error confirming the borrow. Please try again.');
        });
    }
}
// Go Back Function
function goBack() {
    window.history.back(); // Go back to the previous page (borrow form)
}
