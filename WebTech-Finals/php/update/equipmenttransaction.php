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

    $insert_sql = "UPDATE equipmenttransaction 
    SET quantity = '{$data['quantity']}', status = '{$data['status']}', purpose = '{$data['purpose']}', startdateenddate = '$startdateenddate', starttimeendtime = '$starttimeendtime'
    WHERE ID = '{$data['idofrow']}';";
    echo $insert_sql;
    mysqli_query($conn, $insert_sql);
}
?>