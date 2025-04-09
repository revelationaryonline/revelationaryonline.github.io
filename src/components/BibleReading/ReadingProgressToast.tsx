import React, { useState, useEffect, useRef } from 'react';
import { 
  Snackbar, 
  Button, 
  Alert, 
  Box, 
  Typography, 
  LinearProgress,
  Fade,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { getBibleBookChapters } from '../../utils/bibleUtils';
import { markChapterAsRead, getReadingProgress, getReadingStreak } from '../../services/readingService';
import Cookies from 'js-cookie';

interface ReadingProgressToastProps {
  // These props should be available in Dashboard.tsx
  book: string;
  chapter: number;
  wpToken: string;
  // Add this prop to determine if the change came from pagination or search
  isPaginationChange?: boolean;
  // Optional callback for when a chapter is marked as read
  onChapterMarkedAsRead?: (book: string, chapter: number) => void;
  user?: any;
}

const ReadingProgressToast: React.FC<ReadingProgressToastProps> = ({ 
  book = "", 
  chapter, 
  wpToken,
  isPaginationChange = false,
  user,
  onChapterMarkedAsRead
}) => {
  // If book is empty, use a default book for progress display
  const effectiveBook = book === "" ? "genesis" : book;
  // Start with toast closed, we'll open it only on navigation
  const [open, setOpen] = useState(false);
  // Track if we're showing the previous page's completion prompt
  const [showingPreviousPagePrompt, setShowingPreviousPagePrompt] = useState(false);
  const [showChapterComplete, setShowChapterComplete] = useState(false);
  const [showBookComplete, setShowBookComplete] = useState(false);
  const [chaptersRead, setChaptersRead] = useState<Record<string, number[]>>({});
  // Reading streak state
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // Flag to track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Track previous chapters read to prevent progress bar flashing
  const previousChaptersReadRef = useRef<Record<string, number[]>>({});
  
  // Fetch initial reading progress when component mounts or wpToken changes
  const [apiAvailable, setApiAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Maintain a cached state of reading progress to avoid flickering between page changes
  const [cachedProgressData, setCachedProgressData] = useState<Record<string, number[]>>({});
  
  // Track previous book/chapter to detect pagination changes
  const prevBookRef = useRef('');
  const prevChapterRef = useRef(0);
  
  // Get the total chapters in the current book - ensure book is lowercase AND properly trimmed
  const normalizedBook = effectiveBook.toLowerCase().trim();
  const totalChapters = getBibleBookChapters(normalizedBook);
  
  // For empty book/search, calculate overall Bible reading progress
  const [totalBibleProgress, setTotalBibleProgress] = useState(0);
  const [totalBibleChaptersRead, setTotalBibleChaptersRead] = useState(0);
  const [totalBibleChapters, setTotalBibleChapters] = useState(1189); // Total chapters in the Bible
  
  // Calculate total progress when chaptersRead changes
  useEffect(() => {
    if (Object.keys(chaptersRead).length > 0) {
      let totalRead = 0;
      Object.values(chaptersRead).forEach(chapters => {
        totalRead += chapters.length;
      });
      setTotalBibleChaptersRead(totalRead);
      setTotalBibleProgress(Math.min((totalRead / totalBibleChapters) * 100, 100));
    }
  }, [chaptersRead, totalBibleChapters]);

  // Calculate completion percentage - use book-specific or overall depending on if book is empty
  // Get chapters read for the current book, accounting for whitespace issues
  const getChaptersReadForBook = (bookName: string, progressData: Record<string, number[]>) => {
    if (!bookName || !progressData) return 0;
    const trimmedName = bookName.trim();
    
    // Try direct lookup
    if (progressData[trimmedName]?.length) {
      return progressData[trimmedName].length;
    }
    
    // Try case-insensitive lookup
    const bookKeys = Object.keys(progressData);
    for (const key of bookKeys) {
      if (key.toLowerCase().trim() === trimmedName) {
        return progressData[key].length;
      }
    }
    
    return 0;
  };
  
  // Get chapters read count for the current book
  const chaptersReadCount = getChaptersReadForBook(normalizedBook, chaptersRead) || 
                            getChaptersReadForBook(normalizedBook, previousChaptersReadRef.current) || 0;
  
  // Enhanced calculation to prevent flickering to 0
  const completionPercentage = book === "" ? 
    totalBibleProgress :
    chaptersReadCount > 0 ? 
      Math.min((chaptersReadCount / totalChapters) * 100, 100) : 0;
  
  // Check if the current chapter is already marked as read - using normalized book name
  // This function handles both direct and capitalized book names
  const checkIfChapterRead = () => {
    if (!chaptersRead || !chapter) return false;
    
    // Try with normalized book name (lowercase)
    if (chaptersRead[normalizedBook]?.includes(chapter)) return true;
    
    // Also check with capitalized first letter (Genesis vs genesis)
    const capitalizedBook = normalizedBook.charAt(0).toUpperCase() + normalizedBook.slice(1);
    if (chaptersRead[capitalizedBook]?.includes(chapter)) return true;
    
    // Try with all variations of whitespace
    const allBookKeys = Object.keys(chaptersRead);
    for (const key of allBookKeys) {
      if (key.toLowerCase().trim() === normalizedBook && chaptersRead[key]?.includes(chapter)) {
        return true;
      }
    }
    
    return false;
  };
  
  const isChapterRead = checkIfChapterRead();
  
  // Store reading progress in localStorage as a backup cache
  useEffect(() => {
    // Only store when we have non-empty data
    if (Object.keys(chaptersRead).length > 0) {
      try {
        localStorage.setItem('readingProgressCache', JSON.stringify(chaptersRead));
        
      } catch (e) {
        console.error('Failed to save reading progress to localStorage:', e);
      }
    }
  }, [chaptersRead]);
  
  // Initialize from localStorage cache on component mount
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem('readingProgressCache');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Object.keys(parsedData).length > 0) {
          // console.log('Initializing from localStorage cache:', Object.keys(parsedData));
          setCachedProgressData(parsedData);
          setChaptersRead(parsedData);
        }
      }
    } catch (e) {
      console.error('Failed to load reading progress from localStorage:', e);
    }
  }, []);

  
  // Fetch reading streak data
  const fetchReadingStreak = async () => {
    try {
      if (!wpToken || !user) return;
      
      const streakData = await getReadingStreak(wpToken, user);
      if (streakData) {
        setCurrentStreak(streakData.current_streak);
      }
    } catch (error) {
      console.error('Error fetching reading streak:', error);
    }
  };
  
  // Load reading streak when component mounts
  useEffect(() => {
    fetchReadingStreak();
  }, [wpToken, user]);
  
  useEffect(() => {
    // On first mount, set initial load flag
    return () => {
      setIsInitialLoad(false);
    };
  }, []);

  useEffect(() => {
    if (wpToken && user) {
      // Only show loading indicator on initial load, not during navigation
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        console.log('Navigation change: skipping loading indicator');
      }

      // 1. CRITICAL: Preserve existing data during API calls
      // This ensures the progress bar doesn't reset during data fetching
      
      // First, check if we have current non-empty state
      if (Object.keys(chaptersRead).length > 0) {
        // If we already have data, save it as the source of truth
        previousChaptersReadRef.current = {...chaptersRead};
      } 
      // Next, try cached data if state is empty
      else if (Object.keys(cachedProgressData).length > 0) {
        setChaptersRead({...cachedProgressData});
        previousChaptersReadRef.current = {...cachedProgressData};
      } 
      // Finally, try localStorage as a last resort
      else {
        try {
          const cachedData = localStorage.getItem('readingProgressCache');
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (Object.keys(parsedData).length > 0) {
              setChaptersRead({...parsedData});
              previousChaptersReadRef.current = {...parsedData};
            }
          }
        } catch (e) {
          console.error('Failed to use localStorage fallback:', e);
        }
      }
      
      getReadingProgress(Cookies.get("wpToken") || "", user)
        .then((progressData) => {
          // Normalize book names to lowercase
          const normalizedProgressData: Record<string, number[]> = {};
          
          // Convert all book keys to lowercase and merge any duplicate entries
          Object.entries(progressData).forEach(([bookName, chapters]) => {
            // Skip empty book names or null/undefined entries
            if (!bookName) return;
            
            const lowercaseBookName = bookName.toLowerCase();
            
            // Initialize array if needed
            if (!normalizedProgressData[lowercaseBookName]) {
              normalizedProgressData[lowercaseBookName] = [];
            }
            
            // Add chapters (ensure they're numbers)
            const chaptersToAdd = (chapters as any[]).map(ch => {
              return typeof ch === 'number' ? ch : parseInt(ch, 10);
            }).filter(ch => !isNaN(ch)); // Filter out any NaN values
            
            // Add new chapters and remove duplicates
            normalizedProgressData[lowercaseBookName] = [
              ...normalizedProgressData[lowercaseBookName],
              ...chaptersToAdd
            ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
            
            // Sort chapters numerically
            normalizedProgressData[lowercaseBookName].sort((a, b) => a - b);
          });
          
          // CRITICAL: Check if the new data has actual content before replacing current state
          // This prevents the progress bar from resetting if we get empty data from the API
          if (Object.keys(normalizedProgressData).length > 0) {
            setChaptersRead(normalizedProgressData);
            // Update cached data
            setCachedProgressData(normalizedProgressData);
            previousChaptersReadRef.current = normalizedProgressData;
          } else if (Object.keys(previousChaptersReadRef.current).length > 0) {
            // If API returned empty data but we have previous data, keep using that
            setChaptersRead(previousChaptersReadRef.current);
          }
          
          setApiAvailable(true);
          
          // Check if current chapter is marked as read - using normalized book name
          const normalizedCurrentBook = effectiveBook.toLowerCase();
          const currentBookProgress = normalizedProgressData[normalizedCurrentBook] || [];
          
          // Only show the completion animation briefly when loading an already-read chapter
          if (currentBookProgress.includes(chapter)) {
            setShowChapterComplete(true);
            // Reset after a short delay
            setTimeout(() => {
              setShowChapterComplete(false);
            }, 1500);
          }
        })
        .catch(err => {
          console.error('Error fetching reading progress:', err);
          setApiAvailable(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [book, chapter, user, wpToken]);
  
  // Detect pagination changes to show the toast
  useEffect(() => {
    const isPageChange = book && 
                        chapter && 
                        (prevBookRef.current !== book || prevChapterRef.current !== chapter) &&
                        prevBookRef.current !== ''; // Ignore first load
    
    if (isPageChange) {
      
      // Reset chapter complete animation when changing pages
      setShowChapterComplete(false);
      setShowBookComplete(false);
      
      // Check if the previous chapter was read already
      const prevBookNormalized = prevBookRef.current.toLowerCase().trim();
      const prevChapterRead = chaptersRead[prevBookNormalized]?.includes(prevChapterRef.current) || false;
      
      // Only show the toast if the previous chapter was NOT marked as read
      if (!prevChapterRead && prevBookRef.current && prevChapterRef.current) {
        // Store previous page info for the toast
        setShowingPreviousPagePrompt(true);
        setOpen(true);
      } else {
        setShowingPreviousPagePrompt(false);
        setOpen(false);
      }
      
      // 2. CRITICAL: Ensure state consistency during page navigation
      // This prevents the progress bar from flickering or resetting during navigation
      
      // First try cached data which should be most up-to-date
      if (Object.keys(cachedProgressData).length > 0) {
        setChaptersRead({...cachedProgressData});
      }
      // If we somehow don't have cached data but do have previous data, use that
      else if (Object.keys(previousChaptersReadRef.current).length > 0) {
        setChaptersRead({...previousChaptersReadRef.current});
      }
    }
    
    // In debug mode, always show the toast
    // if (debugMode) {
      setOpen(true);
    // }
    // Normal behavior - show toast only on pagination for unread chapters when API is available
    // else if (isPageChange && isPaginationChange && !isChapterRead && apiAvailable) {
    //   setOpen(true);
    // }
    
    // Update refs
    prevBookRef.current = book;
    prevChapterRef.current = chapter;
  }, [book, chapter, isChapterRead, isPaginationChange, apiAvailable, cachedProgressData, chaptersRead]);
  
  const handleClose = () => {
    setOpen(false);
  };
  

  const handleMarkAsRead = async () => {
    // If we're showing a prompt for the previous page, mark that one instead of current page
    const bookToUse = showingPreviousPagePrompt ? prevBookRef.current : (effectiveBook || book);
    const chapterToUse = showingPreviousPagePrompt ? prevChapterRef.current : chapter;
    
    if ((!bookToUse) || !chapterToUse || !apiAvailable) return;
    
    const normalizedBookKey = bookToUse.toLowerCase().trim();
    
    // Store current state before API call to maintain consistency
    previousChaptersReadRef.current = {...chaptersRead};
    
    try {
      // Call API with normalized book name to ensure case consistency
      const success = await markChapterAsRead(normalizedBookKey, chapter, wpToken, user);
      
      if (success) {
        // Update local state with normalized book key for consistency
        setChaptersRead(prev => {
          const bookChapters = prev[normalizedBookKey] || [];
          
          if (!bookChapters.includes(chapter)) {
            const updatedState = {
              ...prev,
              [normalizedBookKey]: [...bookChapters, chapter].sort((a, b) => a - b) // Keep chapters sorted
            };
            
            // CRITICAL: Update cached state immediately to ensure UI consistency
            setCachedProgressData({...updatedState});
            
            // Also update localStorage for persistence across page reloads
            localStorage.setItem('readingProgressCache', JSON.stringify(updatedState));
            
            return updatedState;
          }
          return prev;
        });
        
        // Call the optional callback for parent components
        if (onChapterMarkedAsRead) {
          onChapterMarkedAsRead(normalizedBookKey, chapter);
        }
        
        // Refresh streak data after marking chapter as read
        fetchReadingStreak();
        
        // Make a direct API call to update the streak after a small delay to ensure reading history is updated
        // We're adding a small timeout to allow the first API call to complete and update reading history
        setTimeout(async () => {
          try {
            const streakApiUrl = `${process.env.REACT_APP_WP_API_URL?.includes('/wp/v2') 
              ? process.env.REACT_APP_WP_API_URL.replace('/wp/v2', '') 
              : process.env.REACT_APP_WP_API_URL?.includes('/wp-json') 
                ? process.env.REACT_APP_WP_API_URL.split('/wp-json')[0] + '/wp-json'
                : process.env.REACT_APP_WP_API_URL}/revelationary/v1/reading-streak`;
                
            const streakResponse = await fetch(streakApiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${user?.email || ''}:${wpToken}`)}`
              },
              body: JSON.stringify({
                date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
              })
            });
            
            // Check the response
            if (streakResponse.ok) {
              const streakData = await streakResponse.json();
              console.log('Streak update response:', streakData);
              
              // Refresh streak data after successful update
              fetchReadingStreak();
            } else {
              const errorData = await streakResponse.json();
              console.error('Streak update failed:', errorData);
            }
          } catch (streakError) {
            console.error('Error updating reading streak:', streakError);
          }
        }, 1000); // 1 second delay
        
        // Show chapter completion animation with timeout
        setShowChapterComplete(true);
        setTimeout(() => {
          setShowChapterComplete(false);
        }, 2000);
        
        // Check if this completes the book - use normalized book name
        const updatedChaptersInBook = [...(chaptersRead[normalizedBookKey] || []), chapter];
        if (updatedChaptersInBook.length === totalChapters) {
          // Show book completion animation
          setTimeout(() => {
            setShowBookComplete(true);
            setTimeout(() => {
              setShowBookComplete(false);
            }, 3000);
          }, 500);
        }
      } else {
        console.warn('API call to mark chapter as read was unsuccessful');
      }
    } catch (error) {
      console.error('Error marking chapter as read:', error);
    }
  };
  
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ 
          mt: 7,
         }} // Add margin to avoid overlap with header
      >
        <Alert 
          severity="info" 
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              width: '100%'
            }, 
            '& .MuiAlert-colorInfo': {
              mt: 2,
              backgroundColor: '#212121',
              color: '#FFFFFF'
            }
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" sx={{ color: '#FFFFFF', mr: 2, mt: 2, position: 'absolute' }} />
            </IconButton>
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1">
                {showingPreviousPagePrompt ?
                  `Would you like to mark ${prevBookRef.current} ${prevChapterRef.current} as read?` :
                  (book === "" ? 
                    `Your Bible reading progress` : 
                    `Mark ${effectiveBook} ${chapter} as read to track your progress`)}
              </Typography>
            </Box>
              {currentStreak > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WhatshotIcon color="error" fontSize="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {currentStreak} day streak
                  </Typography>
                </Box>
              )}
            
            <LinearProgress 
              variant={isLoading ? "indeterminate" : "determinate"} 
              value={completionPercentage} 
              sx={{ mb: 1, mr: 1 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">
                {chaptersReadCount} of {totalChapters} chapters read
              </Typography>
              <Button 
                color="primary" 
                size="small" 
                variant="contained"
                onClick={handleMarkAsRead}
                startIcon={<DoneIcon />}
                sx={{
                  mr: 1,
                  mt: 5,
                  mb: 1
                }}
              >
                Mark as Read
              </Button>
            </Box>
          </Box>
        </Alert>
      </Snackbar>
      
      {/* Chapter completion animation */}
      <Fade in={showChapterComplete}>
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 3,
            borderRadius: 2,
            bgcolor: 'secondary.main',
            color: 'black',
            // boxShadow: '0px 0px 20px rgba(255, 215, 0, 0.7)',
          }}
        >
          <DoneIcon sx={{ fontSize: 52, mb: 1 }} />
          <Typography variant="h6">
            Chapter Complete!
          </Typography>
        </Box>
      </Fade>
      
      {/* Book completion animation */}
      <Fade in={showBookComplete}>
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 4,
            borderRadius: 2,
            bgcolor: 'gold',
            color: 'black',
            boxShadow: '0px 0px 20px rgba(255, 215, 0, 0.7)',
          }}
        >
          <EmojiEventsIcon sx={{ 
            fontSize: 80, 
            mb: 1, 
            color: 'goldenrod'
          }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Congratulations!
          </Typography>
          <Typography variant="h6">
            You completed the Book of {book}!
          </Typography>
        </Box>
      </Fade>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </>
  );
};

export default ReadingProgressToast;
