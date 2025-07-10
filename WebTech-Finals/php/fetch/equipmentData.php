<?php
require '../functions.php';
$conn = connecttodb();

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the equipment ID was sent via GET request
if (isset($_GET['equipment_id'])) {
    $equipmentId = intval($_GET['equipment_id']);

    // Query to fetch the equipment details
    $sql = "SELECT equipmentName, Available, ImagePath FROM equipment WHERE equipmentID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $equipmentId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Return equipment data as JSON
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "No equipment found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid request"]);
}

$conn->close();
?>
