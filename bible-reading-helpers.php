<?php
/**
 * Helper functions for Bible reading gamification system
 */

/**
 * Get a map of all Bible books with their chapter counts
 */
function get_bible_books_data() {
    static $books_data = null;
    
    if ($books_data === null) {
        $books_data = [
            // Old Testament
            'Genesis' => [
                'chapters' => 50, 
                'testament' => 'old_testament',
                'achievement' => [
                    'id' => 'genesis_explorer',
                    'name' => 'Genesis Explorer',
                    'icon' => 'book',
                    'rarity' => 'common'
                ]
            ],
            'Exodus' => [
                'chapters' => 40, 
                'testament' => 'old_testament',
                'achievement' => [
                    'id' => 'exodus_journey',
                    'name' => 'Exodus Journey',
                    'icon' => 'directions_walk',
                    'rarity' => 'common'
                ]
            ],
            'Leviticus' => ['chapters' => 27, 'testament' => 'old_testament'],
            'Numbers' => ['chapters' => 36, 'testament' => 'old_testament'],
            'Deuteronomy' => ['chapters' => 34, 'testament' => 'old_testament'],
            'Joshua' => ['chapters' => 24, 'testament' => 'old_testament'],
            'Judges' => ['chapters' => 21, 'testament' => 'old_testament'],
            'Ruth' => ['chapters' => 4, 'testament' => 'old_testament'],
            '1 Samuel' => ['chapters' => 31, 'testament' => 'old_testament'],
            '2 Samuel' => ['chapters' => 24, 'testament' => 'old_testament'],
            '1 Kings' => ['chapters' => 22, 'testament' => 'old_testament'],
            '2 Kings' => ['chapters' => 25, 'testament' => 'old_testament'],
            '1 Chronicles' => ['chapters' => 29, 'testament' => 'old_testament'],
            '2 Chronicles' => ['chapters' => 36, 'testament' => 'old_testament'],
            'Ezra' => ['chapters' => 10, 'testament' => 'old_testament'],
            'Nehemiah' => ['chapters' => 13, 'testament' => 'old_testament'],
            'Esther' => ['chapters' => 10, 'testament' => 'old_testament'],
            'Job' => ['chapters' => 42, 'testament' => 'old_testament'],
            'Psalms' => [
                'chapters' => 150, 
                'testament' => 'old_testament',
                'achievement' => [
                    'id' => 'psalm_singer',
                    'name' => 'Psalm Singer',
                    'icon' => 'music_note',
                    'rarity' => 'common'
                ]
            ],
            'Proverbs' => [
                'chapters' => 31, 
                'testament' => 'old_testament',
                'achievement' => [
                    'id' => 'wisdom_seeker',
                    'name' => 'Wisdom Seeker',
                    'icon' => 'lightbulb',
                    'rarity' => 'common'
                ]
            ],
            'Ecclesiastes' => ['chapters' => 12, 'testament' => 'old_testament'],
            'Song of Solomon' => ['chapters' => 8, 'testament' => 'old_testament'],
            'Isaiah' => ['chapters' => 66, 'testament' => 'old_testament'],
            'Jeremiah' => ['chapters' => 52, 'testament' => 'old_testament'],
            'Lamentations' => ['chapters' => 5, 'testament' => 'old_testament'],
            'Ezekiel' => ['chapters' => 48, 'testament' => 'old_testament'],
            'Daniel' => ['chapters' => 12, 'testament' => 'old_testament'],
            'Hosea' => ['chapters' => 14, 'testament' => 'old_testament'],
            'Joel' => ['chapters' => 3, 'testament' => 'old_testament'],
            'Amos' => ['chapters' => 9, 'testament' => 'old_testament'],
            'Obadiah' => ['chapters' => 1, 'testament' => 'old_testament'],
            'Jonah' => ['chapters' => 4, 'testament' => 'old_testament'],
            'Micah' => ['chapters' => 7, 'testament' => 'old_testament'],
            'Nahum' => ['chapters' => 3, 'testament' => 'old_testament'],
            'Habakkuk' => ['chapters' => 3, 'testament' => 'old_testament'],
            'Zephaniah' => ['chapters' => 3, 'testament' => 'old_testament'],
            'Haggai' => ['chapters' => 2, 'testament' => 'old_testament'],
            'Zechariah' => ['chapters' => 14, 'testament' => 'old_testament'],
            'Malachi' => ['chapters' => 4, 'testament' => 'old_testament'],
            
            // New Testament
            'Matthew' => [
                'chapters' => 28, 
                'testament' => 'new_testament',
                'achievement' => [
                    'id' => 'gospel_reader',
                    'name' => 'Gospel Reader',
                    'icon' => 'menu_book',
                    'rarity' => 'common'
                ]
            ],
            'Mark' => ['chapters' => 16, 'testament' => 'new_testament'],
            'Luke' => ['chapters' => 24, 'testament' => 'new_testament'],
            'John' => ['chapters' => 21, 'testament' => 'new_testament'],
            'Acts' => ['chapters' => 28, 'testament' => 'new_testament'],
            'Romans' => ['chapters' => 16, 'testament' => 'new_testament'],
            '1 Corinthians' => ['chapters' => 16, 'testament' => 'new_testament'],
            '2 Corinthians' => ['chapters' => 13, 'testament' => 'new_testament'],
            'Galatians' => ['chapters' => 6, 'testament' => 'new_testament'],
            'Ephesians' => ['chapters' => 6, 'testament' => 'new_testament'],
            'Philippians' => ['chapters' => 4, 'testament' => 'new_testament'],
            'Colossians' => ['chapters' => 4, 'testament' => 'new_testament'],
            '1 Thessalonians' => ['chapters' => 5, 'testament' => 'new_testament'],
            '2 Thessalonians' => ['chapters' => 3, 'testament' => 'new_testament'],
            '1 Timothy' => ['chapters' => 6, 'testament' => 'new_testament'],
            '2 Timothy' => ['chapters' => 4, 'testament' => 'new_testament'],
            'Titus' => ['chapters' => 3, 'testament' => 'new_testament'],
            'Philemon' => ['chapters' => 1, 'testament' => 'new_testament'],
            'Hebrews' => ['chapters' => 13, 'testament' => 'new_testament'],
            'James' => ['chapters' => 5, 'testament' => 'new_testament'],
            '1 Peter' => ['chapters' => 5, 'testament' => 'new_testament'],
            '2 Peter' => ['chapters' => 3, 'testament' => 'new_testament'],
            '1 John' => ['chapters' => 5, 'testament' => 'new_testament'],
            '2 John' => ['chapters' => 1, 'testament' => 'new_testament'],
            '3 John' => ['chapters' => 1, 'testament' => 'new_testament'],
            'Jude' => ['chapters' => 1, 'testament' => 'new_testament'],
            'Revelation' => [
                'chapters' => 22, 
                'testament' => 'new_testament',
                'achievement' => [
                    'id' => 'apocalypse_witness',
                    'name' => 'Apocalypse Witness',
                    'icon' => 'visibility',
                    'rarity' => 'rare',
                    'animation_type' => 'pulse'
                ]
            ]
        ];
    }
    
    return $books_data;
}

/**
 * Get a specific book's data
 */
function get_book_data($book) {
    $books_data = get_bible_books_data();
    return isset($books_data[$book]) ? $books_data[$book] : null;
}

/**
 * Get chapter count for a book
 */
function get_book_chapter_count($book) {
    $book_data = get_book_data($book);
    return $book_data ? $book_data['chapters'] : 0;
}

/**
 * Determine which testament a book belongs to
 */
function determine_testament($book) {
    $book_data = get_book_data($book);
    return $book_data ? $book_data['testament'] : null;
}

/**
 * Get Old Testament books
 */
function get_old_testament_books() {
    static $old_testament_books = null;
    
    if ($old_testament_books === null) {
        $old_testament_books = [];
        $books_data = get_bible_books_data();
        
        foreach ($books_data as $book => $data) {
            if ($data['testament'] === 'old_testament') {
                $old_testament_books[] = $book;
            }
        }
    }
    
    return $old_testament_books;
}

/**
 * Get New Testament books
 */
function get_new_testament_books() {
    static $new_testament_books = null;
    
    if ($new_testament_books === null) {
        $new_testament_books = [];
        $books_data = get_bible_books_data();
        
        foreach ($books_data as $book => $data) {
            if ($data['testament'] === 'new_testament') {
                $new_testament_books[] = $book;
            }
        }
    }
    
    return $new_testament_books;
}

/**
 * Get total Bible chapters
 */
function get_total_bible_chapters() {
    $books_data = get_bible_books_data();
    $total = 0;
    
    foreach ($books_data as $book => $data) {
        $total += $data['chapters'];
    }
    
    return $total;
}

/**
 * Get special achievement definitions
 */
function get_special_achievements() {
    return [
        'testament_completion' => [
            'old_testament' => [
                'id' => 'ancient_chronicles_scholar',
                'name' => 'Ancient Chronicles Scholar',
                'description' => 'Completed the entire Old Testament',
                'icon' => 'auto_stories',
                'rarity' => 'epic',
                'animation_type' => 'golden_glow'
            ],
            'new_testament' => [
                'id' => 'apostolic_witness',
                'name' => 'Apostolic Witness',
                'description' => 'Completed the entire New Testament',
                'icon' => 'church',
                'rarity' => 'epic',
                'animation_type' => 'golden_glow'
            ],
            'full_bible' => [
                'id' => 'complete_revelation',
                'name' => 'Complete Revelation',
                'description' => 'Completed reading the entire Bible',
                'icon' => 'brightness_7',
                'rarity' => 'legendary',
                'animation_type' => 'heavenly_rays'
            ]
        ],
        'streak' => [
            7 => [
                'id' => 'week_faithful',
                'name' => 'Week Faithful',
                'description' => 'Maintained a 7-day reading streak',
                'icon' => 'today',
                'rarity' => 'common'
            ],
            30 => [
                'id' => 'month_dedicated',
                'name' => 'Month Dedicated',
                'description' => 'Maintained a 30-day reading streak',
                'icon' => 'calendar_month',
                'rarity' => 'rare',
                'animation_type' => 'pulse'
            ],
            100 => [
                'id' => 'century_devotion',
                'name' => 'Century Devotion',
                'description' => 'Maintained a 100-day reading streak',
                'icon' => 'diamond',
                'rarity' => 'epic',
                'animation_type' => 'golden_glow'
            ],
            365 => [
                'id' => 'year_immersed',
                'name' => 'Year Immersed',
                'description' => 'Maintained a 365-day reading streak',
                'icon' => 'stars',
                'rarity' => 'legendary',
                'animation_type' => 'heavenly_rays'
            ]
        ],
        'special' => [
            'midnight_watchman' => [
                'id' => 'midnight_watchman',
                'name' => 'Midnight Watchman',
                'description' => 'Read scripture at 3 AM',
                'icon' => 'nightlight',
                'rarity' => 'rare',
                'animation_type' => 'pulse'
            ]
        ]
    ];
}

/**
 * Get possible rewards for daily spin
 */
function get_possible_rewards($customize_for_heavenly = false) {
    $rewards = [
        // Scripture verses
        [
            'id' => 'scripture_verse',
            'name' => 'Special Scripture Verse',
            'description' => 'A special verse for meditation',
            'value' => get_random_verse(),
            'rarity' => 'common',
            'weight' => 30
        ],
        // Grace Tokens
        [
            'id' => 'grace_token',
            'name' => 'Grace Token',
            'description' => 'Use to maintain streak when missing a day',
            'value' => 1,
            'rarity' => 'rare',
            'weight' => 10
        ],
        // Faith Points
        [
            'id' => 'faith_points',
            'name' => 'Faith Points',
            'description' => 'Extra points toward your next level',
            'value' => rand(20, 50),
            'rarity' => 'common',
            'weight' => 25
        ],
        // Mystery Box
        [
            'id' => 'mystery_box',
            'name' => 'Mystery Box',
            'description' => 'Contains a random special reward',
            'value' => 1,
            'rarity' => 'epic',
            'weight' => 5
        ],
        // Streak Booster
        [
            'id' => 'streak_booster',
            'name' => 'Streak Booster',
            'description' => 'Adds +1 to your current streak',
            'value' => 1,
            'rarity' => 'rare',
            'weight' => 10
        ],
        // Encouragement
        [
            'id' => 'encouragement',
            'name' => 'Word of Encouragement',
            'description' => 'A special message to inspire you',
            'value' => get_random_encouragement(),
            'rarity' => 'common',
            'weight' => 20
        ]
    ];
    
    // For heavenly spins, better odds of rare rewards
    if ($customize_for_heavenly) {
        foreach ($rewards as &$reward) {
            if ($reward['rarity'] === 'rare') {
                $reward['weight'] *= 2;
            } else if ($reward['rarity'] === 'epic') {
                $reward['weight'] *= 3;
            }
        }
    }
    
    return $rewards;
}

/**
 * Get a random Bible verse
 */
function get_random_verse() {
    $verses = [
        'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. - John 3:16',
        'I can do all things through Christ who strengthens me. - Philippians 4:13',
        'Trust in the LORD with all your heart and lean not on your own understanding. - Proverbs 3:5',
        'The LORD is my shepherd, I lack nothing. - Psalm 23:1',
        'Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go. - Joshua 1:9',
        'But seek first his kingdom and his righteousness, and all these things will be given to you as well. - Matthew 6:33',
        'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future. - Jeremiah 29:11',
        'And we know that in all things God works for the good of those who love him, who have been called according to his purpose. - Romans 8:28',
        'The LORD bless you and keep you; the LORD make his face shine on you and be gracious to you; the LORD turn his face toward you and give you peace. - Numbers 6:24-26',
        'Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God. - Philippians 4:6'
    ];
    
    return $verses[array_rand($verses)];
}

/**
 * Get a random encouragement message
 */
function get_random_encouragement() {
    $messages = [
        'You\'re doing great on your Bible reading journey!',
        'Keep going! Your dedication to God\'s Word is making a difference.',
        'Remember, even small steps in Scripture reading add up to big spiritual growth.',
        'You\'ve been consistent in your reading - that\'s something to celebrate!',
        'God\'s Word is alive and active in your life through your faithful reading.'
    ];
    
    return $messages[array_rand($messages)];
}

/**
 * Get default 5-year Bible reading plan structure
 */
function get_default_5_year_plan() {
    return [
        'year_1' => [
            'focus' => 'Foundations',
            'books' => ['Genesis', 'Psalms', 'Proverbs', 'Matthew', 'Mark', 'Luke', 'John']
        ],
        'year_2' => [
            'focus' => 'Historical',
            'books' => ['Exodus', 'Numbers', 'Joshua', 'Judges', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', 'Acts']
        ],
        'year_3' => [
            'focus' => 'Prophets and Pauline Epistles',
            'books' => ['Isaiah', 'Jeremiah', 'Ezekiel', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians']
        ],
        'year_4' => [
            'focus' => 'Wisdom and Minor Prophets',
            'books' => ['Job', 'Ecclesiastes', 'Song of Solomon', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews']
        ],
        'year_5' => [
            'focus' => 'Completion and Reflection',
            'books' => ['Leviticus', 'Deuteronomy', 'Ruth', 'Ezra', 'Nehemiah', 'Esther', '1 Chronicles', '2 Chronicles', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']
        ]
    ];
}

