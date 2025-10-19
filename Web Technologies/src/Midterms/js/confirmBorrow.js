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
        }
    }
});

// Confirm Borrow Function
function confirmBorrow() {
    const formData = JSON.parse(localStorage.getItem('equipmentFormData'));
    if (formData) {
        fetch('php/insert/equipmenttransaction.php', {
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
            console.log('Server Response:', data);
            sendWebSocketMessage(JSON.stringify({action: 'update'}));
            window.location.href = 'equipmentLendingDashboard.php';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error confirming the borrow. Please try again.');
        });
    }
    
}
const getRunningScript = () => {
    return decodeURI(new Error().stack.match(/([^ \n\(@])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)[0])
}
function goBack() {
    window.history.back();
}