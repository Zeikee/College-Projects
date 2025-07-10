<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
checkAdminOrCustodian();

if (isset($_POST['equipment_name']) && isset($_POST['quantity'])) {
    $equipmentName = $_POST['equipment_name'];
    $quantity = $_POST['quantity'];

    // Insert into database
    require '../php/db_connect.php'; // Include your DB connection file

    $stmt = $conn->prepare("INSERT INTO equipment (equipmentName, quantity) VALUES (?, ?)");
    $stmt->bind_param("ss", $equipmentName, $quantity);

    if ($stmt->execute()) {
        echo json_encode(array('status' => 'success', 'message' => 'Equipment added successfully!'));
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'Error adding equipment: ' . $stmt->error));
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array('status' => 'error', 'message' => 'Invalid form data'));
}
?>