// Support JWT authentication for comments and likes
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

// Add filter to allow JWT token for authentication
add_filter('rest_authentication_errors', function($result) {
    // If a previous authentication check was applied, pass that result along
    if ($result !== null) {
        return $result;
    }
    
    // Check if it's a request to the comment endpoints
    $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    $is_comments_endpoint = strpos($request_uri, '/wp-json/wp/v2/comments') !== false || 
                           strpos($request_uri, '/wp-json/custom/v1/like-comment') !== false;
    
    if ($is_comments_endpoint) {
        $auth_header = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
        
        // Check for Bearer token
        if (strpos($auth_header, 'Bearer ') === 0) {
            $token = trim(substr($auth_header, 7));
            
            // Validate the token (simple validation in this example)
            // In a real implementation, you would verify the JWT signature
            if (!empty($token)) {
                // Find user by token
                global $wpdb;
                $user_id = $wpdb->get_var($wpdb->prepare(
                    "SELECT user_id FROM {$wpdb->prefix}usermeta WHERE meta_key = 'jwt_token' AND meta_value = %s",
                    $token
                ));
                
                if ($user_id) {
                    wp_set_current_user($user_id);
                    return true;
                }
            }
        }
    }
    
    return $result;
}, 10, 1);

// Function to add hooks for handling likes when comment is deleted
function delete_comment_likes_meta($comment_id) {
    delete_comment_meta($comment_id, 'likes');
    delete_comment_meta($comment_id, 'liked_users');
}

add_action('delete_comment', 'delete_comment_likes_meta');
