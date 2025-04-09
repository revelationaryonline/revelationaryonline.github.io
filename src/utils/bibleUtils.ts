/**
 * Bible book information and utility functions
 */

// Map of Bible books to their chapter counts
const BIBLE_BOOKS_CHAPTERS: Record<string, number> = {
  // Old Testament
  'genesis': 50,
  'exodus': 40,
  'leviticus': 27,
  'numbers': 36,
  'deuteronomy': 34,
  'joshua': 24,
  'judges': 21,
  'ruth': 4,
  '1samuel': 31,
  '2samuel': 24,
  '1kings': 22,
  '2kings': 25,
  '1chronicles': 29,
  '2chronicles': 36,
  'ezra': 10,
  'nehemiah': 13,
  'esther': 10,
  'job': 42,
  'psalms': 150,
  'proverbs': 31,
  'ecclesiastes': 12,
  'songofsolomon': 8,
  'isaiah': 66,
  'jeremiah': 52,
  'lamentations': 5,
  'ezekiel': 48,
  'daniel': 12,
  'hosea': 14,
  'joel': 3,
  'amos': 9,
  'obadiah': 1,
  'jonah': 4,
  'micah': 7,
  'nahum': 3,
  'habakkuk': 3,
  'zephaniah': 3,
  'haggai': 2,
  'zechariah': 14,
  'malachi': 4,
  // New Testament
  'matthew': 28,
  'mark': 16,
  'luke': 24,
  'john': 21,
  'acts': 28,
  'romans': 16,
  '1corinthians': 16,
  '2corinthians': 13,
  'galatians': 6,
  'ephesians': 6,
  'philippians': 4,
  'colossians': 4,
  '1thessalonians': 5,
  '2thessalonians': 3,
  '1timothy': 6,
  '2timothy': 4,
  'titus': 3,
  'philemon': 1,
  'hebrews': 13,
  'james': 5,
  '1peter': 5,
  '2peter': 3,
  '1john': 5,
  '2john': 1,
  '3john': 1,
  'jude': 1,
  'revelation': 22
};

/**
 * Get the number of chapters for a Bible book
 * @param book Bible book name (case insensitive, with or without spaces)
 * @returns Number of chapters in the book, or 0 if book not found
 */
export const getBibleBookChapters = (book: string): number => {
  // Normalize book name: lowercase, remove spaces
  const normalizedBook = book.toLowerCase().replace(/\s+/g, '');
  
  // Try exact match
  if (BIBLE_BOOKS_CHAPTERS[normalizedBook]) {
    return BIBLE_BOOKS_CHAPTERS[normalizedBook];
  }
  
  // Handle common variations
  const bookVariations: Record<string, string> = {
    'psalm': 'psalms',
    'song': 'songofsolomon',
    'songs': 'songofsolomon',
    'song of songs': 'songofsolomon',
    '1sam': '1samuel',
    '2sam': '2samuel',
    '1kgs': '1kings',
    '2kgs': '2kings',
    '1chr': '1chronicles',
    '2chr': '2chronicles',
    '1cor': '1corinthians',
    '2cor': '2corinthians',
    '1thess': '1thessalonians',
    '2thess': '2thessalonians',
    '1tim': '1timothy',
    '2tim': '2timothy',
    '1pet': '1peter',
    '2pet': '2peter',
    '1jn': '1john',
    '2jn': '2john',
    '3jn': '3john',
    'rev': 'revelation'
  };
  
  const standardizedBook = bookVariations[normalizedBook];
  if (standardizedBook && BIBLE_BOOKS_CHAPTERS[standardizedBook]) {
    return BIBLE_BOOKS_CHAPTERS[standardizedBook];
  }
  
  // If all else fails, return 0
  return 0;
};

/**
 * Determine if all chapters in a book have been read
 * @param book Bible book name
 * @param chaptersRead Array of chapter numbers that have been read
 * @returns Boolean indicating if book is complete
 */
export const isBookComplete = (book: string, chaptersRead: number[]): boolean => {
  const totalChapters = getBibleBookChapters(book);
  if (totalChapters === 0) return false;
  
  // Check if all chapters from 1 to totalChapters are in chaptersRead
  for (let i = 1; i <= totalChapters; i++) {
    if (!chaptersRead.includes(i)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Calculate reading progress percentage for a book
 * @param book Bible book name
 * @param chaptersRead Array of chapter numbers that have been read
 * @returns Percentage of book completed (0-100)
 */
export const getBookProgress = (book: string, chaptersRead: number[]): number => {
  const totalChapters = getBibleBookChapters(book);
  if (totalChapters === 0) return 0;
  
  return (chaptersRead.length / totalChapters) * 100;
};
