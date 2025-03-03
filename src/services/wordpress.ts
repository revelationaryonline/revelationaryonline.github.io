import Cookies from 'js-cookie';
import { WordPressUser, StudyNote } from '../types';

// Update to use environment variables for API URLs
const WP_API_URL = process.env.REACT_APP_WP_API_URL;
const CUSTOM_API_URL = process.env.REACT_APP_WP_API_URL_CUSTOM;

const getAuthHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  'Authorization': token ? `Bearer ${token}` : `Basic ${btoa(`${process.env.REACT_APP_WP_USERNAME}:${process.env.REACT_APP_WP_APP_PASSWORD}`)}`,
});

export const createOrGetWordPressUser = async (email: string, username?: string): Promise<WordPressUser> => {
  try {
    // First check if user exists
    const checkResponse = await fetch(`${WP_API_URL}/users?search=${email}`, {
      headers: getAuthHeaders(),
    });
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      const userId = existingUsers[0].id;
      Cookies.set('userId', userId.toString());
      return existingUsers[0];
    }

    // Create new user if doesn't exist
    const createResponse = await fetch(`${WP_API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        username: username || email.split('@')[0],
        email,
        roles: ['subscriber'],
        password: Math.random().toString(36).slice(-10),
      }),
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create WordPress user');
    }

    const newUser = await createResponse.json();
    Cookies.set('userId', newUser.id.toString());
    return newUser;
  } catch (error) {
    console.error('WordPress user operation failed:', error);
    throw error;
  }
};

export const saveStudyNote = async (note: Omit<StudyNote, 'id'>): Promise<StudyNote> => {
  const userId = Cookies.get('userId');
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${CUSTOM_API_URL}/study-notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...note,
        status: 'publish',
        author: parseInt(userId),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save study note');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to save study note:', error);
    throw error;
  }
};

export const getUserStudyNotes = async (): Promise<StudyNote[]> => {
  const userId = Cookies.get('userId');
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(
      `${CUSTOM_API_URL}/study-notes?author=${userId}&per_page=100`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch study notes');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch study notes:', error);
    throw error;
  }
};

// Add support for custom endpoints
export const fetchBibleVerses = async (reference: string) => {
  try {
    const response = await fetch(
      `${CUSTOM_API_URL}/bible-verses?reference=${encodeURIComponent(reference)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Bible verses');
    }
    
    return response.json();
  } catch (error) {
    console.error('Failed to fetch Bible verses:', error);
    throw error;
  }
};

export const fetchBlogPosts = async (page = 1) => {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?page=${page}&per_page=10`
    );
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

export const fetchBlogPost = async (slug: string) => {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?slug=${slug}`
    );
    const [post] = await response.json();
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

export const updateWordPressProfile = async (userId: number, data: Partial<WordPressUser>): Promise<WordPressUser> => {
  const token = Cookies.get('wpToken');
  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${WP_API_URL}/users/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update WordPress profile');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to update WordPress profile:', error);
    throw error;
  }
};

export const updateWordPressUserMeta = async (userId: number, meta: Record<string, any>): Promise<WordPressUser> => {
  const token = Cookies.get('wpToken');
  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${WP_API_URL}/users/${userId}/meta`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(meta),
    });

    if (!response.ok) {
      throw new Error('Failed to update WordPress user meta');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to update WordPress user meta:', error);
    throw error;
  }
};

export const getWordPressProfile = async (userId: number): Promise<WordPressUser> => {
  const token = Cookies.get('wpToken');
  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${WP_API_URL}/users/${userId}`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch WordPress profile');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch WordPress profile:', error);
    throw error;
  }
};
