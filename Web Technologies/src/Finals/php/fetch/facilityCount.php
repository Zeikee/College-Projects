<?php
require '../functions.php';
$conn = connecttodb();

$sql = "SELECT facilityID, Seats FROM facilitytransaction"; 
$result = $conn->query($sql);

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $facilityID = $row['facilityID'];
        $Seats = $row['Seats'];
        if (isset($data[$facilityID])) {
            $data[$facilityID]['Seats'] += $Seats;
        } else {
            $data[$facilityID] = [
                'facilityID' => $facilityID,
                'Seats' => $Seats
            ];
        }
    }
}
$data = array_values($data);
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
