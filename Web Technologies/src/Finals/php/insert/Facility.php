<?php
session_start();
require '../functions.php';
$conn = connecttodb();

if (isset($_FILES['facilityImage']) && $_FILES['facilityImage']['error'] === UPLOAD_ERR_OK) {
    $facilityData = json_decode($_POST['facilityData'], true);
    $fileTmpPath = $_FILES['facilityImage']['tmp_name'];
    $fileName = $_FILES['facilityImage']['name'];
    $fileType = $_FILES['facilityImage']['type'];

    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($fileType, $allowedMimeTypes)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid image type. Only JPG, PNG, and GIF are allowed.']);
        exit;
    }

    $uploadFolder = '../../assets/images/facility/';
    if (!is_dir($uploadFolder)) {
        mkdir($uploadFolder, 0777, true);
    }

    switch($fileType){
        case 'image/jpeg':
            $newfile = $facilityData['FacilityRoomNumber'] . ".jpg";
            break;
        case 'image/png':
            $newfile = $facilityData['FacilityRoomNumber'] . ".png";
            break;
        case 'image/gif':
            $newfile = $facilityData['FacilityRoomNumber'] . ".gif";
            break;
        default:
            $newfile = $facilityData['FacilityRoomNumber'] . ".png";
            break;
    }

    $FileNameData = "/assets/images/facility/" . $newfile; 
    $destinationPath = "../.." . $FileNameData; 
    if (!move_uploaded_file($fileTmpPath, $destinationPath)) {
        echo json_encode(['status' => 'error', 'message' => 'Error moving the uploaded image.']);
        exit;
    }
    if (isset($_POST['facilityData'])) {

        $facilityRoomNumber = $facilityData['FacilityRoomNumber'] ?? '';
        $facilityName = $facilityData['FacilityName'] ?? '';
        $facilityTotalSeats = isset($facilityData['FacilityTotalSeats']) ? (int)$facilityData['FacilityTotalSeats'] : 0;
        $facilityotherinfo = $facilityData['FacilityOtherInfo'] ?? '';
        
        if (empty($facilityRoomNumber) || empty($facilityName) || empty($facilityTotalSeats) || empty($facilityotherinfo)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
            exit;
        }

        $query = "INSERT INTO facility (facilityName, roomNumber, TotalSeats, otherInfo, imagePath) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            echo json_encode(['status' => 'error', 'message' => 'Database query preparation failed.']);
            exit;
        }
        $stmt->bind_param('ssiss', $facilityName, $facilityRoomNumber, $facilityTotalSeats, $facilityotherinfo, $FileNameData);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Facility created successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error creating facility.']);
        }

        $stmt->close();
        $conn->close();
    }
}else{
    echo json_encode(['status' => 'error', 'message' => 'No image uploaded or file upload error.']);
}
?>