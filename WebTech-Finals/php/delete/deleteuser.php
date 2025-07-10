<?php
session_start();
require '../functions.php';
$conn = connecttodb();

$data = json_decode(file_get_contents("php://input"), true);
if($data){
    $insert_sql = "DELETE FROM user WHERE userId = '{$data['userId']}';";
    mysqli_query($conn, $insert_sql);
}
?>