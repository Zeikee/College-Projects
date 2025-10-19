<?php
session_start();
require '../functions.php';
$conn = connecttodb();

$data = json_decode(file_get_contents("php://input"), true);
if($data){
    $startdateenddate = json_encode([
        "startdate" => $data['startdate'],
        "enddate" => $data['enddate']
    ]);
    $starttimeendtime = json_encode([
        "starttime" => $data['starttime'],
        "endtime" => $data['endtime']
    ]);
    $insert_sql = "INSERT INTO facilitytransaction (userId,facilityID,status, purpose, specialinstruction, startdateenddate, starttimeendtime, Seats) 
    VALUES ('{$_SESSION["userId"]}','{$data['roomid']}', 'Pending','{$data['purpose']}', '{$data['specialinstructions']}', '$startdateenddate', '$starttimeendtime', '{$data['seats']}');";
    mysqli_query($conn, $insert_sql);
}
?>