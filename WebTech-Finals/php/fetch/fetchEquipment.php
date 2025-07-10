<?php
require '../php/functions.php';
session_start();
checkloggedin();
userlogout();
usertype();
checkAdminOrCustodian();

// Connect to the database
$conn = mysqli_connect("localhost", "root", "   ", "lenditrocky");

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Fetch equipment data from the database
$sql = "SELECT * FROM equipment";
$result = mysqli_query($conn, $sql);

// Check if the query was successful
if ($result) {
  $equipmentData = array();
  while ($row = mysqli_fetch_assoc($result)) {
    $equipmentData[] = $row;
  }
  echo json_encode($equipmentData);
} else {
  echo "Error: " . mysqli_error($conn);
}

// Close the connection
mysqli_close($conn);
?>