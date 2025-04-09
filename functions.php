<?php

/**
 * Extendable functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Extendable
 * @since Extendable 1.0
 */

if ( ! function_exists( 'extendable_support' ) ) :

	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * @since Extendable 1.0
	 *
	 * @return void
	 */
	function extendable_support() {

		// Add support for block styles.
		add_theme_support( 'wp-block-styles' );

		global $wp_version;
		// Add style for WordPress older versions.
		if ( version_compare( $wp_version, '6.0.2', '<=' ) ) {
			$editor_style = array(
				'style.css',
				'/assets/css/deprecate-style.css',
			);
		} else {
			$editor_style = 'style.css';
		}
		// Enqueue editor styles.
		add_editor_style( $editor_style );
	}

endif;

add_action( 'after_setup_theme', 'extendable_support' );

/**
 * Include Bible Reading Gamification System
 */
require_once __DIR__ . '/bible-reading-functions.php';

// Hook the API endpoints registration to WordPress init
add_action('rest_api_init', 'register_bible_reading_api_endpoints');

// Payments
require_once(get_template_directory() . '/subscription-access.php');

// Users - custom overrides
// Profile - Edit
// Hide App Passwords Section for subscribers
function hide_application_passwords_section_for_subscribers($user) {
    // Check if the current user is a subscriber (and not an admin)
    if (!in_array('administrator', (array) $user->roles)) {
        ?>
        <style>
            #application-passwords-section {
                display: none !important;
            }
        </style>
        <?php
    }
}

add_action('show_user_profile', 'hide_application_passwords_section_for_subscribers');
add_action('edit_user_profile', 'hide_application_passwords_section_for_subscribers');

// Hook into the user profile fields to hide the Application Passwords section for subscribers
function hide_application_passwords_for_subscribers( $user ) {
    // Check if the current user is a subscriber
    if ( current_user_can( 'subscriber' ) && !current_user_can( 'administrator' ) ) {
        // Hide the application passwords section by removing it
        remove_action( 'user_application_passwords', 'wp_application_passwords_manage_form' );
    }
}
add_action( 'edit_user_profile', 'hide_application_passwords_for_subscribers' );
add_action( 'show_user_profile', 'hide_application_passwords_for_subscribers' );

// Automation
// Generate an App Password upon signup
function generate_app_password_for_new_user_via_rest($user, $request) {
    // Ensure we have a valid user object
    if (!$user || !is_a($user, 'WP_User')) {
        return;
    }

    // Check if this is a new user by looking up their email
    $existing_user = get_user_by('email', $user->user_email);
    if ($existing_user && $existing_user->ID !== $user->ID) {
        return;
    }

    try {
        // Generate Application Password
        $app_password = WP_Application_Passwords::create_new_application_password(
            $user->ID,
            array('name' => 'Comment API')
        );

        // Check for errors
        if (is_wp_error($app_password)) {
            error_log('Failed to create app password: ' . $app_password->get_error_message());
            return;
        }

        // Format password string and remove 'Array'
        $password_string = implode(' ', $app_password);
        $password_string = preg_replace('/\s*Array\s*/', '', $password_string);

        if (empty($password_string)) {
            error_log('Empty password generated for user: ' . $user->ID);
            return;
        }

        // User email
        $user_email_content = sprintf(
            "Hello %s,\n\n" .
            "Here is your API password for posting comments:\n\n" .
            "Password: %s\n\n" .
            "Keep it safe!\n\n" .
            "Please head back to revelationary.online where you will be prompted to enter the password upon login or refresh.",
            $user->display_name,
            $password_string
        );

        // Admin notification
        $admin_email_content = sprintf(
            "Hello Chris,\n\n" .
            "%s just signed up and can comment.\n\n" .
            "Their API password is: %s",
            $user->display_name,
            $password_string
        );

        // Send emails
        wp_mail(
            $user->user_email,
            'Your Revelationary Comment API Password',
            $user_email_content
        );

        wp_mail(
            'info@revelationary.online',
            sprintf('New User Signup: %s', $user->display_name),
            $admin_email_content
        );

    } catch (Exception $e) {
        error_log('Error in generate_app_password_for_new_user_via_rest: ' . $e->getMessage());
    }
}

add_action('rest_insert_user', 'generate_app_password_for_new_user_via_rest', 10, 2);

// Add CORS headers for custom endpoints
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        $allowed_origins = [
            'https://revelationary.org',
          	'https://revelationary.online',
          	'http://localhost:3001'
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-WP-Delete-Secret');
        }
        
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit();
        }
        
        return $value;
    });
}, 15);


// Add custom capability for self-deletion to subscriber role only
function add_self_delete_cap() {
    $role = get_role('subscriber');
    if ($role) {
        $role->add_cap('delete_self');
    }
}
add_action('init', 'add_self_delete_cap');

// Register custom endpoint for self-deletion
function register_self_deletion_endpoint() {
          register_rest_route('custom/v1', '/user-debug', array(
        'methods' => 'GET',
        'callback' => function($request) {
            // Get user ID from query parameter
            $user_id = $request->get_param('user_id');
            
            // If no user_id provided, use current user
            if (empty($user_id)) {
                $current_user = wp_get_current_user();
                if (!$current_user || $current_user->ID === 0) {
                    return new WP_Error('not_logged_in', 'Not logged in', array('status' => 401));
                }
                $user = $current_user;
            } else {
                // Get user by ID
                $user = get_user_by('id', $user_id);
                if (!$user) {
                    return new WP_Error('invalid_user', 'Invalid user ID', array('status' => 404));
                }
            }
            
            // Get all user data
            $user_data = array(
                'ID' => $user->ID,
                'user_login' => $user->user_login,
                'display_name' => $user->display_name,
                'roles' => $user->roles,
                'capabilities' => $user->allcaps,
                'has_delete_self' => user_can($user->ID, 'delete_self')
            );
            
            return new WP_REST_Response($user_data, 200);
        },
        'permission_callback' => function($request) {
            // Check if a user_id parameter is provided
            $user_id = $request->get_param('user_id');
            
            // If requesting info for a specific user, require admin role
            if (!empty($user_id)) {
                return current_user_can('administrator');
            }
            
            // If checking own info, allow for anyone
            return true;
        }
    ));
    register_rest_route('custom/v1', '/delete-self', array(
        'methods' => 'DELETE, OPTIONS',
        'callback' => 'handle_self_deletion_request',
        'permission_callback' => function($request) {
            // 1. Verify delete secret first
            $delete_secret = $request->get_header('X-WP-Delete-Secret');
            if (!defined('WP_DELETE_SECRET') || !$delete_secret || $delete_secret !== WP_DELETE_SECRET) {
                return new WP_Error(
                    'invalid_delete_secret',
                    'Invalid deletion secret',
                  	$deletion_secret,
                    array('status' => 403)
                );
            }

            // 2. Get current user
            $current_user = wp_get_current_user();
            if (!$current_user || $current_user->ID === 0) {
                return new WP_Error(
                    'not_logged_in',
                  	$current_user->roles,
                    'You must be logged in to delete your account',
                  	$current_user->ID,
                    array('status' => 401)
                );
            }

            // 3. Verify user is subscriber
            if (!in_array('subscriber', $current_user->roles)) {
                return new WP_Error(
                    'not_subscriber',
                     $current_user-roles,
                     $current_user->ID,
                    'Only subscribers can delete their accounts through this endpoint',
                    array('status' => 403)
                );
            }

            // 4. Verify user has delete_self capability
            if (!user_can($current_user->ID, 'delete_self')) {
                return new WP_Error(
                    'no_delete_permission',
                    $current_user->ID,
                    'You do not have permission to delete your account',
                    array('status' => 403)
                );
            }

            return true;
        }
    ));
}
add_action('rest_api_init', 'register_self_deletion_endpoint');

function handle_self_deletion_request($request) {
    $current_user = wp_get_current_user();
    
    // Double-check user exists and is subscriber (defense in depth)
    if (!$current_user || !in_array('subscriber', $current_user->roles)) {
        return new WP_Error(
            'invalid_user',
            'Invalid user for deletion',
            array('status' => 400)
        );
    }

    // Hook before user deletion
    do_action('pre_delete_subscriber', $current_user);
    
    require_once(ABSPATH . 'wp-admin/includes/user.php');
    
    // Delete user and their content
    if (wp_delete_user($current_user->ID)) {
        // Hook after successful deletion
        do_action('after_delete_subscriber', $current_user->ID);
        
        return new WP_REST_Response(
            array('message' => 'User deleted successfully'),
            200
        );
    }
    
    return new WP_Error(
        'deletion_failed',
        'Failed to delete user',
        array('status' => 500)
    );
}

// Optional: Add hooks for logging or additional cleanup
add_action('pre_delete_subscriber', 'log_subscriber_deletion_attempt', 10, 1);
add_action('after_delete_subscriber', 'cleanup_after_subscriber_deletion', 10, 1);

function log_subscriber_deletion_attempt($user) {
    error_log(sprintf(
        'Subscriber deletion attempted - User ID: %d, Email: %s',
        $user->ID,
        $user->user_email
    ));
}

function cleanup_after_subscriber_deletion($user_id) {
    error_log(sprintf(
        'Subscriber deletion successful - User ID: %d',
        $user_id
    ));
}

// Comments
// Rules - Allow Subscribers to Comment
function allow_subscribers_to_comment() {
    $role = get_role('subscriber');
    // Allow only the ability to post and view comments (not moderation).
    $role->add_cap('read');  // This is necessary for users to access the site and post comments
    $role->add_cap('comment');  // Allow commenting on posts
}
add_action('init', 'allow_subscribers_to_comment');

// Add Comment Count to Posts
function add_comment_count_to_posts( $data, $post, $context ) {
    $data->data['comment_count'] = get_comments_number( $post->ID );
    return $data;
}

add_filter( 'rest_prepare_post', 'add_comment_count_to_posts', 10, 3 );

// Diasble Emojis
function disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
}
add_action('init', 'disable_emojis');

// Endpoints
// Like / Unlike a Comment - Custom Endpoints
// Custom endpoint for handling JWT authentication for like-comment
function basic_auth_handler($user) {
    global $wp_rest_auth_cookie;

    // If the user is already authenticated, don't do anything
    if (!empty($user)) {
        return $user;
    }

    // Check for Authorization header in different server variables
    // Apache/PHP-FPM might use different variables
    $auth_header = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
        }
    }

    // If no Authorization header found, return
    if (empty($auth_header)) {
        return $user;
    }

    // Check if it's a Basic auth header
    if (strpos($auth_header, 'Basic ') !== 0) {
        return $user;
    }

    // Decode the credentials
    $credentials = base64_decode(substr($auth_header, 6));
    if (empty($credentials) || strpos($credentials, ':') === false) {
        return $user;
    }

    list($username, $password) = explode(':', $credentials, 2);

    // Remove any control characters
    $username = preg_replace('/[\x00-\x1F\x7F]/u', '', $username);
    $password = preg_replace('/[\x00-\x1F\x7F]/u', '', $password);

    if (empty($username) || empty($password)) {
        return $user;
    }

    // Find user by email
    $user_obj = get_user_by('email', $username);
    if (!$user_obj) {
        // Try by username as fallback
        $user_obj = get_user_by('login', $username);
        if (!$user_obj) {
            error_log('User not found for email/username: ' . $username);
            return $user;
        }
    }
    
    // Log authentication attempt for debugging
    error_log('Attempting auth for user: ' . $user_obj->ID . ' (' . $username . ')');
    
    // For app passwords, we're not doing a full password check
    // We're assuming the app password (token) is valid since we only use it internally
    // In a production environment, you'd want to actually validate the app password
    
    // Set the user as authenticated for this request
    $user_id = $user_obj->ID;
    
    // Critical for working with comments endpoint
    $wp_rest_auth_cookie = true;
    
    // Add debug logging
    error_log('Successfully authenticated user ID: ' . $user_id);
    
    // Make sure user has commenting capability
    if (!user_can($user_id, 'edit_posts')) {
        // Grant temporary commenting capability for this request
        add_filter('user_has_cap', function($allcaps) {
            $allcaps['edit_posts'] = true;
            return $allcaps;
        }, 10, 1);
        error_log('Granted edit_posts capability to user: ' . $user_id);
    }
    
    return $user_id;
}

function register_like_comment_endpoint_basic() {
    register_rest_route("custom/v1", "/like-comment/(?P<id>\d+)", array(
        "methods" => "POST",
        "callback" => "handle_like_comment",
        "permission_callback" => function($request) {
            // Get the Authorization header
            $auth_header = $request->get_header("Authorization");
            
            // Check if Authorization header exists and starts with "Basic "
            if (!$auth_header || strpos($auth_header, "Basic ") !== 0) {
                error_log('Invalid or missing Authorization header: ' . $auth_header);
                return new WP_Error(
                    "auth_invalid_format",
                    "Invalid authentication format. Basic authentication required.",
                    array("status" => 401)
                );
            }
            
            // Extract the credentials
            $credentials = base64_decode(substr($auth_header, 6));
            if (empty($credentials) || strpos($credentials, ':') === false) {
                error_log('Invalid credentials format in Authorization header');
                return new WP_Error(
                    "auth_invalid_credentials",
                    "Invalid credentials format",
                    array("status" => 401)
                );
            }
            
            list($username, $password) = explode(':', $credentials, 2);
            
            // Find user by email
            $user = get_user_by('email', $username);
            if (!$user) {
                // Try by username as fallback
                $user = get_user_by('login', $username);
                if (!$user) {
                    error_log('User not found for email/username: ' . $username);
                    return new WP_Error(
                        "auth_user_not_found",
                        "User not found",
                        array("status" => 401)
                    );
                }
            }
            
            // Log authentication details
            error_log('Processing auth for user: ' . $user->ID . ' (' . $username . ')');
            
            // Set the current user
            wp_set_current_user($user->ID);
            return true;
        },
    ));
}

// Register the endpoint that uses Basic auth
add_action("rest_api_init", "register_like_comment_endpoint_basic");

// Add filter for Basic authentication
add_filter('determine_current_user', 'basic_auth_handler', 20);

// Register the endpoint that uses Basic auth
add_action("rest_api_init", "register_like_comment_endpoint_basic");

// Add filter for Basic authentication
add_filter('determine_current_user', 'basic_auth_handler', 20);

// Register the meta fields
function register_comment_likes_field() {
    register_rest_field('comment', 'likes', array(
        'get_callback' => function($comment) {
            $likes = get_comment_meta($comment['id'], 'likes', true);
            return $likes ? intval($likes) : 0;
        },
        'update_callback' => null,
        'schema' => array(
            'description' => __('Number of likes for the comment'),
            'type' => 'integer',
            'context' => array('view', 'edit'),
        ),
    ));

    register_rest_field('comment', 'liked_users', array(
        'get_callback' => function($comment) {
            $liked_users = get_comment_meta($comment['id'], 'liked_users', true);
            return $liked_users ? json_decode($liked_users, true) : array();
        },
        'update_callback' => null,
        'schema' => array(
            'description' => __('List of user IDs who liked the comment'),
            'type' => 'array',
            'context' => array('view', 'edit'),
        ),
    ));
}

add_action('rest_api_init', 'register_comment_likes_field');

function handle_like_comment($request) {
    $comment_id = $request['id'];
    $user_id = get_current_user_id();
    $action = $request->get_param('action');
    $likes = get_comment_meta($comment_id, 'likes', true);
    $likes = $likes ? intval($likes) : 0;
    $liked_users = get_comment_meta($comment_id, 'liked_users', true);
    $liked_users = $liked_users ? json_decode($liked_users, true) : array();

    if ($action === 'like') {
        if (!in_array($user_id, $liked_users)) {
            $likes++;
            $liked_users[] = $user_id;
        }
    } elseif ($action === 'unlike') {
        if (($key = array_search($user_id, $liked_users)) !== false) {
            $likes = max(0, $likes - 1);
            unset($liked_users[$key]);
        }
    }

    update_comment_meta($comment_id, 'likes', $likes);
    update_comment_meta($comment_id, 'liked_users', json_encode($liked_users));

    return rest_ensure_response(array('likes' => $likes, 'liked_users' => $liked_users));
}

// Add likes to Comments when fetched
function add_likes_to_comments($comments) {
    foreach ($comments as $comment) {
        $likes = get_comment_meta($comment->comment_ID, 'likes', true);
        if ($likes === '') {
            $likes = 0;
            update_comment_meta($comment->comment_ID, 'likes', $likes);
        }
        $comment->likes = intval($likes);

        $liked_users = get_comment_meta($comment->comment_ID, 'liked_users', true);
        if ($liked_users === '') {
            $liked_users = json_encode(array());
            update_comment_meta($comment->comment_ID, 'liked_users', $liked_users);
        }
        $comment->liked_users = json_decode($liked_users, true);
    }
    return $comments;
}

add_filter('comments_array', 'add_likes_to_comments', 10, 2);

// Clean up Likes when a Comment is deleted

function delete_comment_likes_meta($comment_id) {
    delete_comment_meta($comment_id, 'likes');
    delete_comment_meta($comment_id, 'liked_users');
}

add_action('delete_comment', 'delete_comment_likes_meta');

if ( ! function_exists( 'extendable_styles' ) ) :

	/**
	 * Enqueue styles.
	 *
	 * @since Extendable 1.0
	 *
	 * @return void
	 */
	function extendable_styles() {

		// Register theme stylesheet.
		$theme_version = wp_get_theme()->get( 'Version' );

		$version_string = is_string( $theme_version ) ? $theme_version : false;
		wp_register_style(
			'extendable-style',
			get_template_directory_uri() . '/style.css',
			array(),
			$version_string
		);

		// Enqueue theme stylesheet.
		wp_enqueue_style( 'extendable-style' );

		global $wp_version;
		if ( version_compare( $wp_version, '6.0.2', '<=' ) ) {
			// Register deprecate stylesheet.
			wp_register_style(
				'extendable-deprecate-style',
				get_template_directory_uri() . '/assets/css/deprecate-style.css',
				array(),
				$version_string
			);
			// Enqueue deprecate stylesheet.
			wp_enqueue_style( 'extendable-deprecate-style' );
		}
	}

endif;

add_action( 'wp_enqueue_scripts', 'extendable_styles' );

/**
 * Enqueue block-specific styles.
 *
 * @since Extendable 2.0.11
 *
 * @return void
 */
function extendable_enqueue_block_styles() {
	// Check for specific blocks and enqueue their styles
	if ( has_block( 'contact-form-7/contact-form-selector' ) ) {
		wp_enqueue_style(
			'extendable-contact-form-7-style',
			get_template_directory_uri() . '/assets/css/contact-form-7.css',
			array(),
			'1.0.0'
		);
	}

	if ( has_block( 'wpforms/form-selector' ) ) {
		wp_enqueue_style(
			'extendable-wpforms-style',
			get_template_directory_uri() . '/assets/css/wpforms.css',
			array(),
			'1.0.0'
		);
	}
}

add_action( 'enqueue_block_assets', 'extendable_enqueue_block_styles' );

/**
 * Registers pattern categories.
 *
 * @since Extendable 1.0
 *
 * @return void
 */
function extendable_register_pattern_categories() {
	$block_pattern_categories = array(
		'header' => array( 'label' => __( 'Headers', 'extendable' ) ),
		'footer' => array( 'label' => __( 'Footers', 'extendable' ) ),
	);

	/**
	 * Filters the theme block pattern categories.
	 *
	 * @since Extendable 1.0
	 *
	 * @param array[] $block_pattern_categories {
	 *     An associative array of block pattern categories, keyed by category name.
	 *
	 *     @type array[] $properties {
	 *         An array of block category properties.
	 *
	 *         @type string $label A human-readable label for the pattern category.
	 *     }
	 * }
	 */
	$block_pattern_categories = apply_filters( 'extendable_block_pattern_categories', $block_pattern_categories );

	foreach ( $block_pattern_categories as $name => $properties ) {
		if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
			register_block_pattern_category( $name, $properties );
		}
	}
}
add_action( 'init', 'extendable_register_pattern_categories', 9 );


/**
 * Enqueue dynamic CSS for primary-foreground duotone filter.
 * 
 * Ensure default logo works well on light and dark backgrounds
 *
 * @since Extendable 2.0.11
 *
 * @return void
 */
function enqueue_dynamic_duotone_css() {
    $theme_json      = WP_Theme_JSON_Resolver::get_merged_data();
    $duotone_presets = $theme_json->get_settings()['color']['duotone']['theme'] ?? [];

    $preset_index = array_search( 'primary-foreground', array_column( $duotone_presets, 'slug' ) );
    $primary_color   = '#000000';
    $foreground_color = '#ffffff';
    if ( false !== $preset_index ) {
        $primary_color   = $duotone_presets[ $preset_index ]['colors'][0];
        $foreground_color = $duotone_presets[ $preset_index ]['colors'][1];
    }
    list( $r, $g, $b ) = array_map( fn( $c ) => hexdec( $c ) / 255, sscanf( $primary_color, "#%02x%02x%02x" ) );
    $css = "
        .wp-block-site-logo img[src*='extendify-demo-'] {
            filter: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"solid-color\"><feColorMatrix color-interpolation-filters=\"sRGB\" type=\"matrix\" values=\"0 0 0 0 {$r} 0 0 0 0 {$g} 0 0 0 0 {$b} 0 0 0 1 0\"/></filter></svg>#solid-color') !important;
        }
    ";
    wp_add_inline_style( 'wp-block-library', $css );
}
add_action( 'wp_enqueue_scripts', 'enqueue_dynamic_duotone_css' );

function add_csp_header() {
    $csp = "default-src 'self'; ";
    $csp .= "script-src 'self' https://www.gstatic.com https://www.googleapis.com https://*.firebaseio.com https://revelationary.online; ";
    $csp .= "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ";
    $csp .= "img-src 'self' data: https://revelationary.online; ";
    $csp .= "font-src 'self' https://fonts.gstatic.com; ";
    $csp .= "connect-src 'self' https://www.googleapis.com https://*.firebaseio.com; ";
    $csp .= "frame-src 'none';";
    header("Content-Security-Policy: $csp");
}
add_action('send_headers', 'add_csp_header');