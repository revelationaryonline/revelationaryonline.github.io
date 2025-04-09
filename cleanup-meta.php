<?php
// cleanup-meta.php
require_once('wp-load.php');

// Get the user ID from request
$user_id = $_REQUEST['user_id'] ?? get_current_user_id();

// Get the book to remove
$book_to_remove = $_REQUEST['book'] ?? 'Genesis';

// Get current progress
$progress = get_user_meta($user_id, 'bible_reading_progress', true);

// Remove the specified book
if (isset($progress[$book_to_remove])) {
    unset($progress[$book_to_remove]);
    
    // Update the meta
    update_user_meta($user_id, 'bible_reading_progress', $progress);
    
    echo json_encode([
        'success' => true,
        'message' => "Removed '$book_to_remove' from reading progress",
        'updated_progress' => $progress
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => "Book '$book_to_remove' not found in reading progress",
        'current_progress' => $progress
    ]);
}
