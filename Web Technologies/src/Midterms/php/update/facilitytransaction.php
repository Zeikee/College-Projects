<?php
session_start();
require '../functions.php';
$conn = connecttodb();

$data = json_decode(file_get_contents("php://input"), true);
if($data){
    
    switch ($data['type']) {
        case 'update':
            $insert_sql = "UPDATE facilitytransaction 
            SET status = ?, purpose = ?, specialinstruction = ?
            WHERE ID = ?;";
            $stmt = $conn->prepare($insert_sql);
            $status = 'Pending';
            $stmt->bind_param("sssi", $status, $data['purpose'], $data['specialinstructions'], $data['idofrow']);
        break;
        case 'accept':
            $insert_sql = "UPDATE facilitytransaction 
            SET status = ?
            WHERE ID = ?;";
            $stmt = $conn->prepare($insert_sql);
            $status = 'Active';
            $stmt->bind_param("si", $status, $data['idofrow']);
        break;
        case 'reject':
            $insert_sql = "UPDATE facilitytransaction 
            SET status = ?
            WHERE ID = ?;";
            $stmt = $conn->prepare($insert_sql);
            $status = 'Rejected';
            $stmt->bind_param("si", $status, $data['idofrow']);
        break;
        default:
            echo 'Not valid type of request';
        break;
    }
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Transaction updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update transaction: ' . $stmt->error]);
    }
    $stmt->close();
}
$conn->close();
?>