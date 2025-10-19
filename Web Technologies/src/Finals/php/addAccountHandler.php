<?php
require 'functions.php'; // Ensure you include necessary functions
session_start();

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $firstName = $_POST['firstName'] ?? '';
    $lastName = $_POST['lastName'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';

    // Validate inputs
    if (empty($firstName) || empty($lastName) || empty($email) || empty($password) || empty($confirmPassword)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    if ($password !== $confirmPassword) {
        echo json_encode(['status' => 'error', 'message' => 'Passwords do not match.']);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert data into the database
    $conn = db_connect(); // Assuming this function connects to the database
    $query = "INSERT INTO users (firstName, lastName, email, password, userType) VALUES (?, ?, ?, ?, 'User')";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssss', $firstName, $lastName, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Account created successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error creating account.']);
    }

    $stmt->close();
    $conn->close();
}
?>