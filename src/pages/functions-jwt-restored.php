<?php
/**
 * Support for JWT authentication for comments and likes
 */

// Register the endpoint for handling comment likes
function register_like_comment_endpoint() {
    register_rest_route('custom/v1', '/like-comment/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'handle_like_comment',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));
}
add_action('rest_api_init', 'register_like_comment_endpoint');

// Handle comment like/unlike actions
function handle_like_comment($request) {
    $comment_id = $request['id'];
    $user_id = get_current_user_id();
    
    // Ensure we have a valid user
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to like comments', array('status' => 401));
    }
    
    $action = $request->get_param('action');
    if (!$action) {
        $action = 'like'; // Default to like if not specified
    }
    
    // Get the current likes
    $liked_users = get_comment_meta($comment_id, 'liked_users', true);
    if (!$liked_users) {
        $liked_users = array();
    }
    
    if ($action === 'like') {
        // Add user to liked users if not already there
        if (!in_array($user_id, $liked_users)) {
            $liked_users[] = $user_id;
        }
    } elseif ($action === 'unlike') {
        // Remove user from liked users
        $key = array_search($user_id, $liked_users);
        if ($key !== false) {
            unset($liked_users[$key]);
        }
    }
    
    // Update liked users
    update_comment_meta($comment_id, 'liked_users', array_values($liked_users));
    
    // Update likes count
    $likes = count($liked_users);
    update_comment_meta($comment_id, 'likes', $likes);
    
    return array(
        'status' => 'success',
        'likes' => $likes,
        'liked_users' => $liked_users,
    );
}

// Cleanup likes metadata when comment is deleted
function delete_comment_likes_meta($comment_id) {
    delete_comment_meta($comment_id, 'likes');
    delete_comment_meta($comment_id, 'liked_users');
}
add_action('delete_comment', 'delete_comment_likes_meta');

/**
 * Support for JWT authentication in WordPress REST API
 * This assumes the JWT Authentication for WP REST API plugin is installed
 * https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
 */

// Add filter to authenticate users with JWT tokens for comments endpoints
add_filter('jwt_auth_token_before_dispatch', 'add_user_id_to_jwt_response', 10, 2);
function add_user_id_to_jwt_response($data, $user) {
    // Add the user ID to the JWT response data
    $data['user_id'] = $user->ID;
    return $data;
}

// Allow comments from authorized users with JWT tokens
add_filter('rest_allow_anonymous_comments', function($allow, $request) {
    $auth_header = $request->get_header('authorization');
    if ($auth_header && strpos($auth_header, 'JWT ') === 0) {
        // The JWT Authentication plugin should already have authenticated the user
        // If we get here and a user is logged in, we can assume the JWT token was valid
        return is_user_logged_in();
    }
    return $allow;
}, 10, 2);
