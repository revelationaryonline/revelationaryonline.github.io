import React, { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import BibleStudySignup from './BibleStudySignup';

interface ScrollTriggeredSignupProps {
  threshold?: number; // Trigger threshold between 0 and 1
  rootMargin?: string; // Root margin in format '0px 0px 0px 0px'
}

/**
 * A component that shows the BibleStudySignup when the user scrolls to a certain point on the page
 */
const ScrollTriggeredSignup: React.FC<ScrollTriggeredSignupProps> = ({ 
  threshold = 0.1, 
  rootMargin = '0px' 
}) => {
  const [showSignup, setShowSignup] = useState(false);
  const isSubscribed = localStorage.getItem('leadMagnetSubscribed') === 'true';
  const hasBeenShown = localStorage.getItem('leadMagnetShown') === 'true';

  // Effect to handle subscription status
  useEffect(() => {
    if (isSubscribed || hasBeenShown) {
      setShowSignup(false);
    }
  }, [isSubscribed, hasBeenShown]);

  // Use simple scroll event instead of Intersection Observer
  useEffect(() => {
    if (isSubscribed || hasBeenShown) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate how far down the page the user has scrolled (as a percentage)
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      
      // Show signup when user has scrolled past the threshold (e.g., 30% of the page)
      if (scrollPercentage > 0.3 && !showSignup) {
        setShowSignup(true);
        // Remove listener once triggered
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Call once to check initial position
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showSignup, isSubscribed, hasBeenShown]);
  
  // Only render the centered signup overlay when triggered
  // Function to close the signup popup
  const handleClose = () => {
    localStorage.setItem('leadMagnetShown', 'true');
    setShowSignup(false);
  };

  return (
    <>
      {showSignup && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1500,
            padding: 2,
          }}
          onClick={(e) => {
            // Close when clicking outside the signup form
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <Paper
            elevation={4}
            sx={{
              maxWidth: '550px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 2,
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.9)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1)'
                }
              }
            }}
          >
            <BibleStudySignup position="inline" />
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ScrollTriggeredSignup;
