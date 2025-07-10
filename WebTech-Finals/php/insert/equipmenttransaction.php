<?php
session_start();
require '../functions.php';
$conn = connecttodb();
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $startdateenddate = json_encode([
        "startdate" => $data['startdate'],
        "enddate" => $data['enddate']
    ]);
    $starttimeendtime = json_encode([
        "starttime" => $data['starttime'],
        "endtime" => $data['endtime']
    ]);

    foreach ($data['equipmentData'] as $equipment) {
        $equipmentID = $equipment['equipmentID'];
        $quantity = (int)$equipment['quantity'];

        $insert_sql = "INSERT INTO equipmenttransaction (equipmentID, quantity, userId,purpose, status, startdateenddate, starttimeendtime) 
        VALUES ('$equipmentID', '$quantity','{$_SESSION["userId"]}','{$data['purpose']}','Pending','$startdateenddate', '$starttimeendtime');";
        mysqli_query($conn, $insert_sql);
    }
}
?>