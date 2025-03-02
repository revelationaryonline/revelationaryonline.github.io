export interface WordPressUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  meta?: {
    bible_preferences?: string;
    study_notes?: string;
    favorite_verses?: string;
  };
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface StudyNote {
  id: number;
  post_type: 'study_note';
  post_title: string;
  post_content: string;
  post_author: number; // WordPress user ID
  meta: {
    verse_reference: string;
    tags: string[];
    bible_version: string;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  studyPreferences: {
    preferredBibleVersion: string;
    fontSize: number;
    theme: 'light' | 'dark';
  };
}
