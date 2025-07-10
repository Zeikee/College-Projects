<?php
session_start();
require '../functions.php';
$conn = connecttodb();

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $facilityID = $data['facilityID'];
    $roomNumber = $data['roomNumber'];
    $facilityName = $data['facilityName'];
    $seats = $data['seats'];
    $otherInfo = $data['otherInfo'];

    $update_sql = "UPDATE facility SET facilityName = '$facilityName', roomNumber = '$roomNumber', TotalSeats = '$seats', OtherInfo = '$otherInfo' WHERE facilityID = $facilityID";
    if (mysqli_query($conn, $update_sql)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "error" => mysqli_error($conn)]);
    }
} else {
    echo json_encode(["status" => "error", "error" => "Invalid input data"]);
}
?>
