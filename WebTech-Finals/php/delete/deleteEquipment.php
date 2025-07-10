<?php
session_start();
require '../functions.php';
$conn = connecttodb();

$data = json_decode(file_get_contents("php://input"), true);
if($data){
    $insert_sql = "DELETE FROM equipment WHERE equipmentID = '{$data['equipmentID']}';";
    $result = mysqli_query($conn, $insert_sql);
    if($result){
        $response = array('status' => 'success', 'message' => 'Equipment deleted successfully');
    } else {
        $response = array('status' => 'error', 'message' => 'Failed to delete equipment');
    }
    echo json_encode($response);
}
?>