<?php
/**
 * Bible Reading Functions - Optimized Version
 * 
 * This file contains the core functions for the Bible reading gamification system.
 * It works with bible-reading-helpers.php to reduce code duplication.
 */

// Include helper functions
require_once('bible-reading-helpers.php');

/**
 * Register REST API endpoints for the Bible reading system
 */
function register_bible_reading_api_endpoints() {
    $endpoints = [
        // Reading progress
        ['route' => 'reading-progress', 'methods' => 'GET', 'callback' => 'get_reading_progress'],
        ['route' => 'reading-progress', 'methods' => 'POST', 'callback' => 'update_reading_progress'],
        
        // Achievements
        ['route' => 'check-achievements', 'methods' => 'POST', 'callback' => 'check_for_new_achievements'],
        
        // Streaks
        ['route' => 'reading-streak', 'methods' => 'GET', 'callback' => 'get_reading_streak'],
        ['route' => 'reading-streak', 'methods' => 'POST', 'callback' => 'update_reading_streak'],
        
        // Points & Leveling
        ['route' => 'reading-points', 'methods' => 'GET', 'callback' => 'get_reading_points'],
        ['route' => 'reading-points', 'methods' => 'POST', 'callback' => 'update_reading_points'],
        
        // Daily spin
        ['route' => 'daily-spin', 'methods' => 'GET', 'callback' => 'get_daily_spin_status'],
        ['route' => 'daily-spin', 'methods' => 'POST', 'callback' => 'perform_daily_spin'],
        
        // Reading plan
        ['route' => 'reading-plan', 'methods' => 'GET', 'callback' => 'get_reading_plan'],
        ['route' => 'reading-plan', 'methods' => 'POST', 'callback' => 'update_reading_plan'],
        
        // Mystery boxes
        ['route' => 'open-mystery-box', 'methods' => 'POST', 'callback' => 'open_mystery_box'],
        
        // Subscription
        ['route' => 'subscription', 'methods' => 'GET', 'callback' => 'get_user_subscription']
    ];
    
    // Define which endpoints require premium subscription
    $premium_endpoints = [
        'daily-spin' => true,
        'open-mystery-box' => true
    ];
    
    foreach ($endpoints as $endpoint) {
        $route = $endpoint['route'];
        $permission_func = isset($premium_endpoints[$route]) ? 
                         'bible_reading_premium_permission_check' : 
                         'bible_reading_permission_check';
        
        register_rest_route('revelationary/v1', '/' . $route, [
            'methods' => $endpoint['methods'],
            'callback' => $endpoint['callback'],
            'permission_callback' => $permission_func
        ]);
    }
    
    // Add subscription management endpoint
    register_rest_route('revelationary/v1', '/update-subscription', [
        'methods' => 'POST',
        'callback' => 'update_user_subscription',
        'permission_callback' => 'bible_reading_permission_check'
    ]);
}

/**
 * Check for new achievements
 */
function check_for_new_achievements($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to check achievements', ['status' => 401]);
    }
    
    $progress = get_user_meta($user_id, 'bible_reading_progress', true);
    if (!$progress) {
        return rest_ensure_response([
            'success' => true,
            'new_achievements' => []
        ]);
    }
    
    $new_achievements = [];
    $books_data = get_bible_books_data();
    
    // Check for book completion achievements
    foreach ($books_data as $book => $data) {
        // Skip books without specific achievements
        if (!isset($data['achievement'])) {
            continue;
        }
        
        $testament = $data['testament'];
        if (isset($progress[$testament][$book])) {
            $book_data = $progress[$testament][$book];
            
            // Check if book is complete
            if ($book_data['total_chapters'] > 0 && 
                count($book_data['completed_chapters']) === $book_data['total_chapters']) {
                
                // Book is complete, award achievement
                $achievement = $data['achievement'];
                $achievement['description'] = "Completed the book of {$book}";
                
                if (add_achievement($user_id, $achievement)) {
                    $new_achievements[] = $achievement;
                }
            }
        }
    }
    
    // Check testament completion
    $old_testament_complete = check_testament_completion($user_id, 'old_testament', $progress, $new_achievements);
    $new_testament_complete = check_testament_completion($user_id, 'new_testament', $progress, $new_achievements);
    
    // Check for entire Bible completion
    if ($old_testament_complete && $new_testament_complete) {
        $special_achievements = get_special_achievements();
        $achievement = $special_achievements['testament_completion']['full_bible'];
        
        if (add_achievement($user_id, $achievement)) {
            $new_achievements[] = $achievement;
        }
    }
    
    return rest_ensure_response([
        'success' => true,
        'new_achievements' => $new_achievements
    ]);
}

/**
 * Helper to check testament completion
 */
function check_testament_completion($user_id, $testament, $progress, &$new_achievements) {
    if (empty($progress[$testament])) {
        return false;
    }
    
    $testament_books = $testament === 'old_testament' ? 
                      get_old_testament_books() : 
                      get_new_testament_books();
    
    $completed_books = 0;
    foreach ($testament_books as $book) {
        if (isset($progress[$testament][$book]) && 
            $progress[$testament][$book]['total_chapters'] > 0 && 
            count($progress[$testament][$book]['completed_chapters']) === $progress[$testament][$book]['total_chapters']) {
            $completed_books++;
        }
    }
    
    if ($completed_books === count($testament_books)) {
        $special_achievements = get_special_achievements();
        $achievement = $special_achievements['testament_completion'][$testament];
        
        if (add_achievement($user_id, $achievement)) {
            $new_achievements[] = $achievement;
        }
        
        return true;
    }
    
    return false;
}

/**
 * Get daily spin status
 */
function get_daily_spin_status($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to check daily spin status', ['status' => 401]);
    }
    
    $rewards = get_user_meta($user_id, 'bible_reading_rewards', true);
    
    if (!$rewards) {
        $rewards = [
            'daily_spin_available' => true,
            'last_spin_date' => null,
            'spin_history' => [],
            'available_rewards' => [],
            'mystery_boxes' => 0
        ];
    }
    
    // Check if daily spin is available
    $today = date('Y-m-d');
    $last_spin_date = $rewards['last_spin_date'] ? date('Y-m-d', strtotime($rewards['last_spin_date'])) : null;
    
    $is_available = !$last_spin_date || $last_spin_date !== $today;
    $rewards['daily_spin_available'] = $is_available;
    
    // Check for heavenly spin tokens
    $has_tokens = false;
    if (isset($rewards['rewards'])) {
        foreach ($rewards['rewards'] as $reward) {
            if ($reward['id'] === 'heavenly_spin_token' && $reward['quantity'] > 0) {
                $has_tokens = true;
                break;
            }
        }
    }
    
    return rest_ensure_response([
        'daily_spin_available' => $is_available,
        'has_heavenly_spin_tokens' => $has_tokens,
        'last_spin' => $last_spin_date,
        'mystery_boxes' => $rewards['mystery_boxes'] ?? 0
    ]);
}

/**
 * Perform a daily spin
 */
function perform_daily_spin($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to perform a daily spin', ['status' => 401]);
    }
    
    $params = $request->get_params();
    $spin_type = isset($params['spin_type']) ? sanitize_text_field($params['spin_type']) : 'daily';
    
    $rewards = get_user_meta($user_id, 'bible_reading_rewards', true);
    
    if (!$rewards) {
        $rewards = [
            'daily_spin_available' => true,
            'last_spin_date' => null,
            'spin_history' => [],
            'available_rewards' => [],
            'mystery_boxes' => 0
        ];
    }
    
    // Validate spin eligibility
    $today = date('Y-m-d');
    $last_spin_date = $rewards['last_spin_date'] ? date('Y-m-d', strtotime($rewards['last_spin_date'])) : null;
    
    if ($spin_type === 'daily' && $last_spin_date === $today) {
        return new WP_Error(
            'spin_not_available', 
            'Daily spin already used today', 
            ['status' => 403]
        );
    }
    
    if ($spin_type === 'heavenly') {
        // Check for heavenly token and consume it
        $has_tokens = false;
        $token_index = -1;
        
        if (isset($rewards['rewards'])) {
            foreach ($rewards['rewards'] as $index => $reward) {
                if ($reward['id'] === 'heavenly_spin_token' && $reward['quantity'] > 0) {
                    $has_tokens = true;
                    $token_index = $index;
                    break;
                }
            }
        }
        
        if (!$has_tokens) {
            return new WP_Error(
                'no_heavenly_tokens', 
                'No heavenly spin tokens available', 
                ['status' => 403]
            );
        }
        
        // Use one token
        $rewards['rewards'][$token_index]['quantity']--;
    }
    
    // Get rewards and weights
    $possible_rewards = get_possible_rewards($spin_type === 'heavenly');
    
    // Calculate total weight
    $total_weight = array_sum(array_column($possible_rewards, 'weight'));
    
    // Pick a random reward based on weight
    $random = rand(1, $total_weight);
    $current_weight = 0;
    $chosen_reward = null;
    
    foreach ($possible_rewards as $reward) {
        $current_weight += $reward['weight'];
        if ($random <= $current_weight) {
            $chosen_reward = $reward;
            break;
        }
    }
    
    // Process the reward
    process_spin_reward($user_id, $chosen_reward);
    
    // Update spin status
    if ($spin_type === 'daily') {
        $rewards['last_spin_date'] = current_time('mysql');
    }
    
    // Add to spin history
    if (!isset($rewards['spin_history'])) {
        $rewards['spin_history'] = [];
    }
    
    $rewards['spin_history'][] = [
        'date' => current_time('mysql'),
        'type' => $spin_type,
        'reward' => $chosen_reward
    ];
    
    // Only keep the last 20 spins in history
    if (count($rewards['spin_history']) > 20) {
        array_shift($rewards['spin_history']);
    }
    
    // Update rewards in database
    update_user_meta($user_id, 'bible_reading_rewards', $rewards);
    
    return rest_ensure_response([
        'success' => true,
        'reward' => $chosen_reward,
        'spin_type' => $spin_type
    ]);
}

/**
 * Process a spin reward
 */
function process_spin_reward($user_id, $reward) {
    switch ($reward['id']) {
        case 'grace_token':
            // Add grace token
            $streak = get_user_meta($user_id, 'bible_reading_streak', true);
            if ($streak) {
                $streak['grace_tokens'] += $reward['value'];
                update_user_meta($user_id, 'bible_reading_streak', $streak);
            }
            break;
            
        case 'faith_points':
            // Add faith points
            $points = get_user_meta($user_id, 'bible_reading_points', true);
            if ($points) {
                $points['total_points'] += $reward['value'];
                check_level_up($user_id, $points);
                update_user_meta($user_id, 'bible_reading_points', $points);
            }
            break;
            
        case 'mystery_box':
            // Add mystery box
            $rewards = get_user_meta($user_id, 'bible_reading_rewards', true);
            if ($rewards) {
                if (!isset($rewards['mystery_boxes'])) {
                    $rewards['mystery_boxes'] = 0;
                }
                $rewards['mystery_boxes'] += $reward['value'];
                update_user_meta($user_id, 'bible_reading_rewards', $rewards);
            }
            break;
            
        case 'streak_booster':
            // Increase streak
            $streak = get_user_meta($user_id, 'bible_reading_streak', true);
            if ($streak) {
                $streak['current_streak'] += $reward['value'];
                
                // Update longest streak if current is higher
                if ($streak['current_streak'] > $streak['longest_streak']) {
                    $streak['longest_streak'] = $streak['current_streak'];
                }
                
                update_user_meta($user_id, 'bible_reading_streak', $streak);
                
                // Check for streak achievements
                check_streak_achievements($user_id, $streak['current_streak']);
            }
            break;
            
        // Scripture verse and encouragement don't need processing,
        // they're just displayed to the user
    }
    
    return true;
}

/**
 * Get reading plan
 */
function get_reading_plan($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to get reading plan', ['status' => 401]);
    }
    
    $plan = get_user_meta($user_id, 'bible_reading_plan', true);
    
    if (!$plan) {
        // Create default 5-year plan
        $plan = [
            'plan_type' => '5_year',
            'start_date' => current_time('mysql'),
            'current_year' => 1,
            'structure' => get_default_5_year_plan()
        ];
        
        update_user_meta($user_id, 'bible_reading_plan', $plan);
    }
    
    return rest_ensure_response($plan);
}

/**
 * Update reading plan
 */
function update_reading_plan($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to update reading plan', ['status' => 401]);
    }
    
    $params = $request->get_params();
    $plan_type = isset($params['plan_type']) ? sanitize_text_field($params['plan_type']) : '5_year';
    
    $plan = get_user_meta($user_id, 'bible_reading_plan', true);
    
    if (!$plan) {
        $plan = [
            'plan_type' => $plan_type,
            'start_date' => current_time('mysql'),
            'current_year' => 1
        ];
    } else {
        $plan['plan_type'] = $plan_type;
    }
    
    // Set plan structure based on type
    if ($plan_type === '5_year') {
        $plan['structure'] = get_default_5_year_plan();
    } else if ($plan_type === 'custom' && isset($params['structure'])) {
        $plan['structure'] = json_decode(wp_unslash($params['structure']), true);
    }
    
    update_user_meta($user_id, 'bible_reading_plan', $plan);
    
    return rest_ensure_response([
        'success' => true,
        'plan' => $plan
    ]);
}

/**
 * Open a mystery box
 */
function open_mystery_box($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to open mystery box', ['status' => 401]);
    }
    
    $rewards = get_user_meta($user_id, 'bible_reading_rewards', true);
    
    if (!$rewards || !isset($rewards['mystery_boxes']) || $rewards['mystery_boxes'] <= 0) {
        return new WP_Error(
            'no_mystery_boxes',
            'You have no mystery boxes to open',
            ['status' => 403]
        );
    }
    
    // Define possible mystery box rewards (better than regular spin rewards)
    $mystery_rewards = [
        // Heavenly Spin Token
        [
            'id' => 'heavenly_spin_token',
            'name' => 'Heavenly Spin Token',
            'description' => 'Use for an extra spin with better rewards',
            'value' => 1,
            'rarity' => 'epic',
            'weight' => 30
        ],
        // Super Grace Token
        [
            'id' => 'super_grace_token',
            'name' => 'Super Grace Token',
            'description' => 'Maintains your streak for 3 consecutive missed days',
            'value' => 1,
            'rarity' => 'legendary',
            'weight' => 10
        ],
        // Faith Points Boost
        [
            'id' => 'faith_points',
            'name' => 'Faith Points Boost',
            'description' => 'Major boost to your faith points',
            'value' => rand(100, 200),
            'rarity' => 'epic',
            'weight' => 30
        ],
        // Streak Mega Booster
        [
            'id' => 'streak_booster',
            'name' => 'Streak Mega Booster',
            'description' => 'Adds +3 to your current streak',
            'value' => 3,
            'rarity' => 'epic',
            'weight' => 20
        ],
        // Level Skip
        [
            'id' => 'level_skip',
            'name' => 'Level Skip',
            'description' => 'Instantly advance to the next level',
            'value' => 1,
            'rarity' => 'legendary',
            'weight' => 10
        ]
    ];
    
    // Calculate total weight
    $total_weight = array_sum(array_column($mystery_rewards, 'weight'));
    
    // Pick a random reward based on weight
    $random = rand(1, $total_weight);
    $current_weight = 0;
    $chosen_reward = null;
    
    foreach ($mystery_rewards as $reward) {
        $current_weight += $reward['weight'];
        if ($random <= $current_weight) {
            $chosen_reward = $reward;
            break;
        }
    }
    
    // Process the mystery reward
    process_mystery_reward($user_id, $chosen_reward);
    
    // Consume a mystery box
    $rewards['mystery_boxes']--;
    update_user_meta($user_id, 'bible_reading_rewards', $rewards);
    
    return rest_ensure_response([
        'success' => true,
        'reward' => $chosen_reward
    ]);
}

/**
 * Process a mystery box reward
 */
function process_mystery_reward($user_id, $reward) {
    switch ($reward['id']) {
        case 'heavenly_spin_token':
            // Add heavenly spin token
            $rewards = get_user_meta($user_id, 'bible_reading_rewards', true);
            
            if (!isset($rewards['rewards'])) {
                $rewards['rewards'] = [];
            }
            
            $found = false;
            foreach ($rewards['rewards'] as &$existing) {
                if ($existing['id'] === 'heavenly_spin_token') {
                    $existing['quantity'] += $reward['value'];
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                $rewards['rewards'][] = [
                    'id' => 'heavenly_spin_token',
                    'name' => 'Heavenly Spin Token',
                    'quantity' => $reward['value']
                ];
            }
            
            update_user_meta($user_id, 'bible_reading_rewards', $rewards);
            break;
            
        case 'super_grace_token':
            // Add super grace token
            $rewards = get_user_meta($user_id, 'bible_reading_rewards', true);
            
            if (!isset($rewards['rewards'])) {
                $rewards['rewards'] = [];
            }
            
            $found = false;
            foreach ($rewards['rewards'] as &$existing) {
                if ($existing['id'] === 'super_grace_token') {
                    $existing['quantity'] += $reward['value'];
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                $rewards['rewards'][] = [
                    'id' => 'super_grace_token',
                    'name' => 'Super Grace Token',
                    'quantity' => $reward['value']
                ];
            }
            
            update_user_meta($user_id, 'bible_reading_rewards', $rewards);
            break;
            
        case 'faith_points':
            // Process same as regular faith points but larger amount
            process_spin_reward($user_id, $reward);
            break;
            
        case 'streak_booster':
            // Process same as regular streak booster but larger amount
            process_spin_reward($user_id, $reward);
            break;
            
        case 'level_skip':
            // Advance to next level
            $points = get_user_meta($user_id, 'bible_reading_points', true);
            if ($points) {
                $points['level']++;
                $points['points_to_next_level'] = calculate_points_to_level($points['level'] + 1);
                update_user_meta($user_id, 'bible_reading_points', $points);
                
                // Check for level achievements
                check_level_achievements($user_id, $points['level']);
            }
            break;
    }
    
    return true;
}

/**
 * Add a new achievement for a user
 */
function add_achievement($user_id, $achievement) {
    $achievements = get_user_meta($user_id, 'bible_reading_achievements', true);
    
    if (!$achievements) {
        $achievements = [
            'unlocked' => []
        ];
    }
    
    // Check if achievement already unlocked
    foreach ($achievements['unlocked'] as $unlocked) {
        if ($unlocked['id'] === $achievement['id']) {
            return false; // Already unlocked
        }
    }
    
    // Add the achievement with timestamp
    $achievement['unlocked_at'] = current_time('mysql');
    $achievements['unlocked'][] = $achievement;
    
    // Update achievements in database
    update_user_meta($user_id, 'bible_reading_achievements', $achievements);
    
    // Award faith points for achievement
    $points_value = 0;
    switch ($achievement['rarity']) {
        case 'common':
            $points_value = 50;
            break;
        case 'rare':
            $points_value = 100;
            break;
        case 'epic':
            $points_value = 250;
            break;
        case 'legendary':
            $points_value = 500;
            break;
        default:
            $points_value = 25;
    }
    
    // Update points
    $points = get_user_meta($user_id, 'bible_reading_points', true);
    if ($points) {
        $points['total_points'] += $points_value;
        check_level_up($user_id, $points);
        update_user_meta($user_id, 'bible_reading_points', $points);
    }
    
    return true;
}

/**
 * Check for streak achievements
 */
function check_streak_achievements($user_id, $streak) {
    $special_achievements = get_special_achievements();
    $streak_achievements = $special_achievements['streak'];
    
    foreach ($streak_achievements as $days => $achievement) {
        if ($streak >= $days) {
            add_achievement($user_id, $achievement);
        }
    }
}

/**
 * Check for level up
 */
function check_level_up($user_id, &$points) {
    if ($points['total_points'] >= $points['points_to_next_level']) {
        $points['level']++;
        $points['points_to_next_level'] = calculate_points_to_level($points['level'] + 1);
        
        // Check for level achievements
        check_level_achievements($user_id, $points['level']);
    }
}

/**
 * Check for level achievements
 */
function check_level_achievements($user_id, $level) {
    $level_achievements = [
        5 => [
            'id' => 'scripture_novice',
            'name' => 'Scripture Novice',
            'description' => 'Reached level 5',
            'icon' => 'school',
            'rarity' => 'common'
        ],
        10 => [
            'id' => 'word_apprentice',
            'name' => 'Word Apprentice',
            'description' => 'Reached level 10',
            'icon' => 'psychology',
            'rarity' => 'rare'
        ],
        25 => [
            'id' => 'bible_scholar',
            'name' => 'Bible Scholar',
            'description' => 'Reached level 25',
            'icon' => 'psychology_alt',
            'rarity' => 'epic'
        ],
        50 => [
            'id' => 'scripture_master',
            'name' => 'Scripture Master',
            'description' => 'Reached level 50',
            'icon' => 'workspace_premium',
            'rarity' => 'legendary'
        ]
    ];
    
    foreach ($level_achievements as $req_level => $achievement) {
        if ($level >= $req_level) {
            add_achievement($user_id, $achievement);
        }
    }
}

/**
 * Calculate points required for next level
 */
function calculate_points_to_level($level) {
    // Level curve formula: 100 * (level^1.5)
    return floor(100 * pow($level, 1.5));
}

/**
 * Basic permission check for Bible reading endpoints
 */
function bible_reading_permission_check() {
    return current_user_can('read');
}

/**
 * Premium permission check for Bible reading endpoints that require subscription
 */
function bible_reading_premium_permission_check() {
    if (!current_user_can('read')) {
        return false;
    }
    
    // Get the user ID
    $user_id = get_current_user_id();
    
    // Check if user has active subscription
    $has_subscription = get_user_meta($user_id, 'has_active_subscription', true);
    
    // For testing/development purposes, this can be overridden
    if (defined('BIBLE_READING_TEST_MODE') && BIBLE_READING_TEST_MODE) {
        return true;
    }
    
    return (bool) $has_subscription;
}

/**
 * Update user subscription status
 */
function update_user_subscription($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to update subscription', ['status' => 401]);
    }
    
    $params = $request->get_params();
    
    // Check if we have the required parameters
    if (!isset($params['is_active'])) {
        return new WP_Error('missing_parameters', 'Missing required parameters', ['status' => 400]);
    }
    
    $is_active = (bool) $params['is_active'];
    $subscription_id = isset($params['subscription_id']) ? sanitize_text_field($params['subscription_id']) : '';
    
    // Store subscription status
    update_user_meta($user_id, 'has_active_subscription', $is_active);
    
    // Store permanent subscription ID if provided
    if (!empty($subscription_id)) {
        update_user_meta($user_id, 'subscription_id', $subscription_id);
    }
    
    return rest_ensure_response([
        'success' => true,
        'subscription' => [
            'is_active' => $is_active,
            'subscription_id' => !empty($subscription_id) ? $subscription_id : get_user_meta($user_id, 'subscription_id', true)
        ]
    ]);
}

/**
 * Get user subscription status
 */
function get_user_subscription($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to get subscription status', ['status' => 401]);
    }
    
    $has_subscription = (bool) get_user_meta($user_id, 'has_active_subscription', true);
    $subscription_id = get_user_meta($user_id, 'subscription_id', true);
    
    return rest_ensure_response([
        'is_active' => $has_subscription,
        'subscription_id' => $subscription_id
    ]);
}
