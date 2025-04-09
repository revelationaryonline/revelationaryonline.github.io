/**
 * Bible reading progress tracking services
 */

import Cookies from "js-cookie";

// Get the base API URL from environment
const WP_API_URL = process.env.REACT_APP_WP_API_URL;
// Ensure we have the correct base URL for custom endpoints
// Make sure we don't end up with duplicated wp-json in the path
const CUSTOM_API_BASE = WP_API_URL ? (
  WP_API_URL.includes('/wp/v2') 
    ? WP_API_URL.replace('/wp/v2', '') 
    : WP_API_URL.includes('/wp-json') 
      ? WP_API_URL.split('/wp-json')[0] + '/wp-json'
      : WP_API_URL
) : '';

// Helper function to get auth headers with proper format - matching comments system
export const getAuthHeaders = (user: any, wpToken?: string): Record<string, string> => {
  // Get token from provided param or directly from cookies as fallback
  const token = wpToken || Cookies.get('wpToken');
  
  // console.log("Auth inputs:", { 
  //   hasToken: !!token,
  //   tokenLength: token?.length,
  //   tokenSource: wpToken ? 'prop' : 'cookie',
  //   userEmail: user?.email,
  //   hasUser: !!user
  // });
  
  // If there's no token available, return headers without auth
  if (!token) {
    console.error('Missing token for authentication');
    return {
      'Content-Type': 'application/json'
    };
  }
  
  // Use Basic Auth format exactly like the comments system
  // If user is null, use a fallback username instead of empty string
  const email = user?.email;
  const authHeader = `Basic ${btoa(`${email}:${token}`)}`;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': authHeader
  };
};

/**
 * Clean up book capitalization in reading progress
 * This function will normalize capitalization by merging chapters
 * from differently cased versions of the same book (e.g., "Genesis" and "genesis")
 * @param wpToken WordPress authentication token
 * @param user User object
 * @returns Promise<boolean> indicating success or failure
 */
export const cleanupReadingProgressCapitalization = async (
  wpToken: string, 
  user: any
): Promise<boolean> => {
  // Get the base URL for the API endpoint
  const endpoint = `${CUSTOM_API_BASE}/revelationary/v1/reading-progress`;
  
  try {
    // First, get the current reading progress
    const progressData = await getReadingProgress(wpToken, user);
    // console.log('Current reading progress:', progressData);
    
    // Look for capitalization inconsistencies
    const bookNameMap: Record<string, string[]> = {};
    
    // Group books by lowercase name to find duplicates
    Object.keys(progressData).forEach(bookName => {
      const lowerName = bookName.toLowerCase();
      if (!bookNameMap[lowerName]) {
        bookNameMap[lowerName] = [];
      }
      bookNameMap[lowerName].push(bookName);
    });
    
    // Find books with multiple capitalizations
    const duplicatedBooks = Object.entries(bookNameMap)
      .filter(([_, variants]) => variants.length > 1)
      .map(([lowercaseName, variants]) => ({ 
        lowercaseName, 
        variants, 
        chapters: variants.flatMap(v => progressData[v] || [])
      }));
    
    // console.log('Found capitalization issues:', duplicatedBooks);
    
    if (duplicatedBooks.length === 0) {
      console.log('No capitalization issues found!');
      return true;
    }
    
    // For each book with multiple capitalizations, fix it
    for (const book of duplicatedBooks) {
      // Remove all variants except the lowercase one
      for (const variant of book.variants) {
        if (variant !== variant.toLowerCase()) {
          // Delete the capitalized variant
          const deleteResponse = await fetch(endpoint, {
            method: 'POST',
            headers: getAuthHeaders(user, wpToken),
            body: JSON.stringify({
              action: 'remove_book',
              book: variant
            })
          });
          
          const deleteResult = await deleteResponse.json();
          console.log(`Deleted variant '${variant}':`, deleteResult);
        }
      }
      
      // Update the lowercase variant to include all chapters
      const uniqueChapters = [...new Set(book.chapters)].sort((a, b) => a - b);
      
      // Add the merged chapters to the lowercase book name
      for (const chapter of uniqueChapters) {
        const addResponse = await fetch(endpoint, {
          method: 'POST',
          headers: getAuthHeaders(user, wpToken),
          body: JSON.stringify({
            action: 'mark_as_read',
            book: book.lowercaseName,
            chapter
          })
        });
        
        await addResponse.json();
      }
      
      console.log(`Fixed book '${book.lowercaseName}' with chapters:`, uniqueChapters);
    }
    
    return true;
  } catch (error) {
    console.error('Error cleaning up reading progress capitalization:', error);
    return false;
  }
};

/**
 * Mark a Bible chapter as read in the user's reading progress
 * @param book Bible book name
 * @param chapter Chapter number
 * @param wpToken WordPress authentication token
 * @returns Promise resolving to true if successful
 */
export const markChapterAsRead = async (
  book: string,
  chapter: number,
  wpToken: string,
  user: any
): Promise<boolean> => {
  try {
    // Using the existing endpoint from bible-reading-functions.php
    const response = await fetch(
      `${CUSTOM_API_BASE}/revelationary/v1/reading-progress`,
      {
        method: 'POST',
        headers: getAuthHeaders(user, wpToken),
        body: JSON.stringify({ 
          book, 
          chapter,
          action: 'mark_as_read' 
        })
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to mark chapter as read');
    }
    
    return true;
  } catch (error) {
    console.error('Error marking chapter as read:', error);
    return false;
  }
};

/**
 * Get user's Bible reading progress
 * @param wpToken WordPress authentication token
 * @param user User object
 * @returns Promise resolving to a record of books and chapters read
 */
export const getReadingProgress = async (
  wpToken: string,
  user: any
): Promise<Record<string, number[]>> => {
  try {
    const response = await fetch(
      `${CUSTOM_API_BASE}/revelationary/v1/reading-progress`,
      {
        method: 'GET',
        headers: getAuthHeaders(user, wpToken)
      }
    );
    
    if (!response.ok) throw new Error('Failed to get reading progress');
    
    const data = await response.json();
    return data.reading_progress || {};
  } catch (error) {
    console.error('Error getting reading progress:', error);
    return {};
  }
};

/**
 * Get user's reading streak information
 * @param wpToken WordPress authentication token
 * @param user User object
 * @returns Promise resolving to reading streak data
 */
export const getReadingStreak = async (
  wpToken: string,
  user: any
): Promise<{
  current_streak: number;
  longest_streak: number;
  last_30_days: Array<{date: string, completed: boolean, chapters_read: number}>;
  total_days_read: number;
  average_chapters_per_day: number;
}> => {
  try {
    const response = await fetch(
      `${CUSTOM_API_BASE}/revelationary/v1/reading-streak`,
      {
        method: 'GET',
        headers: getAuthHeaders(user, wpToken)
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch reading streak');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reading streak:', error);
    return {
      current_streak: 0,
      longest_streak: 0,
      last_30_days: [],
      total_days_read: 0,
      average_chapters_per_day: 0
    };
  }
};
