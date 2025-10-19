<?php
session_start();
require '../functions.php';
$conn = connecttodb();
$data = json_decode(file_get_contents("php://input"), true);
$success = true;
$idofrow;
if ($data) {
    if ($data['which']) { // Facility
        $data['tablename'] = 'facilitytransaction';
        $column = 'facilityID';
    } else { // Equipment
        $data['tablename'] = 'equipmenttransaction';
        $column = 'equipmentID';
    }

    // Encode date and time data as JSON
    $startdateenddate = json_encode([
        "startdate" => $data['startdate'],
        "enddate" => $data['enddate']
    ]);
    $starttimeendtime = json_encode([
        "starttime" => $data['starttime'],
        "endtime" => $data['endtime']
    ]);

    if($data['which']){
        // Check if the current data matches an existing entry for the same ID
        $same_data_sql = "SELECT * FROM {$data['tablename']}
        WHERE ID = '{$data['idofrow']}'
        AND $column = '{$data['roomid']}'
        AND startdateenddate = '$startdateenddate'
        AND starttimeendtime = '$starttimeendtime'";

        $same_data_result = mysqli_query($conn, $same_data_sql);

        if (mysqli_num_rows($same_data_result) > 0) {
            echo json_encode([
                "success" => true,
                "message" => "No changes detected; reservation is already up-to-date."
            ]);
        } else {
            // Check for overlapping reservations (if data has changed)
            $check_sql = "SELECT * FROM {$data['tablename']}
            WHERE $column = ?
                AND ((JSON_UNQUOTE(JSON_EXTRACT(startdateenddate, '$.startdate')) <= ? 
                AND JSON_UNQUOTE(JSON_EXTRACT(startdateenddate, '$.enddate')) >= ?)
                AND (JSON_UNQUOTE(JSON_EXTRACT(starttimeendtime, '$.starttime')) < ? 
                AND JSON_UNQUOTE(JSON_EXTRACT(starttimeendtime, '$.endtime')) > ?))
                AND Seats >= ?";
                $simulated_sql = str_replace(
                    ['?', '?', '?', '?', '?', '?'], 
                    [
                        "'{$data['roomid']}'",
                        "'{$data['enddate']}'",
                        "'{$data['startdate']}'",
                        "'{$data['endtime']}'",
                        "'{$data['starttime']}'",
                        $data['seats']
                    ], 
                    $check_sql
                );
                
                echo $simulated_sql;
            $stmt = $conn->prepare($check_sql);
            $stmt->bind_param('sssssi', $data['roomid'], $data['startdate'], $data['enddate'], $data['starttime'], $data['endtime'], $data['seats']); // 6 parameters, not 7
            $stmt->execute();
            $check_result = $stmt->get_result();
        
            if (mysqli_num_rows($check_result) > 0) {
                echo json_encode([
                    "success" => false,
                    "message" => "The selected facility is already reserved for the specified time range. Please choose a different time or date."
                ]);
                exit;
            } else {
                // No overlaps; success message
                echo json_encode([
                    "success" => false,
                    "message" => "Reservation updated successfully!"
                ]);
            }
        }
    }else{
        // Check if reservation data matches an existing entry for the same equipment
        $same_data_sql = "SELECT * FROM equipmenttransaction
            WHERE ID = '{$data['idofrow']}'
            AND equipmentID = '{$data['idofequipment']}'
            AND startdateenddate = '$startdateenddate'
            AND starttimeendtime = '$starttimeendtime'";
        $same_data_result = mysqli_query($conn, $same_data_sql);

        if (mysqli_num_rows($same_data_result) > 0) {
            echo json_encode([
                "success" => true,
                "message" => "No changes detected; The equipment reservation is already up-to-date."
            ]);

        }else{
           // Equipment Reservation Check
            foreach ($data['equipmentData'] as $equipment) {
                $equipmentID = $equipment['equipmentID'];
                $quantity = (int)$equipment['quantity'];

                // Check for overlapping equipment reservations
                $check_sql = "SELECT * FROM equipmenttransaction
                WHERE equipmentID = '{$equipmentID}'
                    AND ((JSON_UNQUOTE(JSON_EXTRACT(startdateenddate, '$.startdate')) <= '{$data['enddate']}' 
                    AND JSON_UNQUOTE(JSON_EXTRACT(startdateenddate, '$.enddate')) >= '{$data['startdate']}')
                    AND (JSON_UNQUOTE(JSON_EXTRACT(starttimeendtime, '$.starttime')) <= '{$data['endtime']}' 
                    AND JSON_UNQUOTE(JSON_EXTRACT(starttimeendtime, '$.endtime')) >= '{$data['starttime']}'))";
                $check_result = mysqli_query($conn, $check_sql);
                if (mysqli_num_rows($check_result) > 0) {
                    echo json_encode([
                        "success" => false,
                        "message" => "The selected equipment ({$equipment['equipment']}) is already reserved for the specified time range. Please choose a different time or date."
                    ]);
                    $success=false;
                    break;
                }
            }
            if($success){
                // Success for equipment reservation
                echo json_encode([
                    "success" => true,
                    "message" => "Equipment reservation updated successfully!"
                ]);
            }
        }
    }

} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid data received."
    ]);
}
?>
