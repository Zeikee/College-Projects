<?php
session_start();
require '../functions.php';
$conn = connecttodb();

$data = json_decode(file_get_contents("php://input"), true);
if($data){
    $insert_sql = "UPDATE user SET userType = '{$data['usertype']}' WHERE userId = '{$data['userId']}';";
    echo $insert_sql;
    mysqli_query($conn, $insert_sql);
}
?>