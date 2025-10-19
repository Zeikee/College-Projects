<?php
require '../functions.php';
$conn = connecttodb();

$sql = "SELECT equipmentID, quantity FROM equipmentTransaction"; 
$result = $conn->query($sql);

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $equipmentID = $row['equipmentID'];
        $quantity = $row['quantity'];
        if (isset($data[$equipmentID])) {
            $data[$equipmentID]['quantity'] += $quantity;
        } else {
            $data[$equipmentID] = [
                'equipmentID' => $equipmentID,
                'quantity' => $quantity
            ];
        }
    }
}
$data = array_values($data);
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
