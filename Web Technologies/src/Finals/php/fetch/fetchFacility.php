<?php
require '../functions.php';
$conn = connecttodb();

// Query to fetch all rooms from the database
$sql = "SELECT * FROM facility"; 
$result = $conn->query($sql);
$data = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Structure data (e.g., Room Name, Room ID)
        $data[] = array(
            'room_id' => $row['roomNumber'], 
            'room_name' => $row['facilityName'],
            'facility_id' => $row['facilityID']
        );
    }
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
