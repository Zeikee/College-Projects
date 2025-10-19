<?php
session_start();
require '../functions.php';
$conn = connecttodb();

if (isset($_FILES['equipmentImage']) && $_FILES['equipmentImage']['error'] === UPLOAD_ERR_OK) {
    $equipmentData = json_decode($_POST['equipmentData'], true);
    $fileTmpPath = $_FILES['equipmentImage']['tmp_name'];
    $fileName = $_FILES['equipmentImage']['name'];
    $fileType = $_FILES['equipmentImage']['type'];
    
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($fileType, $allowedMimeTypes)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid image type. Only JPG, PNG, and GIF are allowed.']);
        exit;
    }

    $uploadFolder = '../../assets/images/equipment/';
    if (!is_dir($uploadFolder)) {
        mkdir($uploadFolder, 0777, true);
    }

    switch ($fileType) {
        case 'image/jpeg':
            $newfile = $equipmentData['EquipmentName'] . ".jpg";
            break;
        case 'image/png':
            $newfile = $equipmentData['EquipmentName'] . ".png";
            break;
        case 'image/gif':
            $newfile = $equipmentData['EquipmentName'] . ".gif";
            break;
        default:
            $newfile = $equipmentData['EquipmentName'] . ".png"; 
            break;
    }

    $FileNameData = "/assets/images/equipment/" . $newfile;
    $destinationPath = "../.." . $FileNameData;
    if (!move_uploaded_file($fileTmpPath, $destinationPath)) {
        echo json_encode(['status' => 'error', 'message' => 'Error moving the uploaded image.']);
        exit;
    }
    
    if (isset($_POST['equipmentData'])) {
        $equipmentName = $equipmentData['EquipmentName'] ?? '';
        $quantity = isset($equipmentData['EquipmentQuantity']) ? (int)$equipmentData['EquipmentQuantity'] : 0;
        $equipmentBorrowed = isset($equipmentData['EquipmentBorrowed']) ? (int)$equipmentData['EquipmentBorrowed'] : 0; // Default to 0 if not set

        // Validate input
        if (empty($equipmentName) || empty($quantity)) {
            echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
            exit;
        }

        // Prepare the SQL statement
        $query = "INSERT INTO equipment (equipmentName, equipmentTotalQuantity, equipmentBorrowed, imagePath) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            echo json_encode(['status' => 'error', 'message' => 'Database query preparation failed.']);
            exit;
        }
        $stmt->bind_param('siis', $equipmentName, $quantity, $equipmentBorrowed, $FileNameData);
        
        // Execute the statement and check for success
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Equipment created successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error creating equipment.']);
        }

        // Close the statement and connection
        $stmt->close();
        $conn->close();
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No image uploaded or file upload error.']);
}
?>