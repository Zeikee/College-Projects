<?php
require '../functions.php';
$conn = connecttodb();

$sql = "SELECT * FROM equipment"; 
$result = $conn->query($sql);
$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>