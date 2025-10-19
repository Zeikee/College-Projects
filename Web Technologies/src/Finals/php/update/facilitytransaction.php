<?php
session_start();
require '../functions.php';
$conn = connecttodb();

$data = json_decode(file_get_contents("php://input"), true);
if($data){
    if($data['switch']){
        $insert_sql = "UPDATE facilitytransaction 
        SET status = 'Pending', purpose = '{$data['purpose']}', specialinstruction = '{$data['specialinstructions']}'
        WHERE ID = '{$data['idofrow']}';";
        mysqli_query($conn, $insert_sql);
    }else{
        $startdateenddate = json_encode([
            "startdate" => $data['startdate'],
            "enddate" => $data['enddate']
        ]);
        $starttimeendtime = json_encode([ 
            "starttime" => $data['starttime'],
            "endtime" => $data['endtime']
        ]);
        $insert_sql = "UPDATE facilitytransaction 
        SET status = '{$data['status']}', purpose = '{$data['purpose']}', specialinstruction = '{$data['specialinstructions']}', Seats = '{$data['seats']}', startdateenddate = '$startdateenddate', starttimeendtime = '$starttimeendtime'
        WHERE ID = '{$data['idofrow']}';";
        mysqli_query($conn, $insert_sql);
    }
}
?>