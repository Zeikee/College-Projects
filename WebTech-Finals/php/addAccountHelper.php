<?php
header('Content-Type: application/json');

if ($success) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Account added successfully!',
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to add account. Please try again.',
    ]);
}
?>
