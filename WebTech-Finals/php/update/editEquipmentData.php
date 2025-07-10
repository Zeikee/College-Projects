<?php
session_start();
require '../functions.php';
$conn = connecttodb();

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("UPDATE equipment SET equipmentName = ?, equipmentTotalQuantity = ?, imagePath = ? WHERE equipmentID = ?");
    
    // Bind parameters
    $stmt->bind_param("sisi", $data['equipmentname'], $data['equipmentquantity'], $data['imagePath'], $data['equipmentID']);
    
    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Equipment updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update equipment."]);
    }

    // Close the statement
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "No data received."]);
}

// Close the database connection
$conn->close();
?>