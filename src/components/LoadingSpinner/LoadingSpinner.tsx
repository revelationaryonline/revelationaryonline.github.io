import React, { useState, useEffect } from 'react';
// Import static assets
// Using a string path for the image source instead of direct import
// This avoids TypeScript module declaration issues
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  // Get the current theme to determine if we're in dark mode
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // State for the animated dots
  const [dots, setDots] = useState('...');
  
  // Animation effect for the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        switch (prevDots) {
          case '.': return '..';
          case '..': return '...';
          case '...': return '.';
          default: return '.';
        }
      });
    }, 500); // Change dots every 500ms
    
    return () => clearInterval(interval);
  }, []);

  return (
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
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)' 
            : '#212121A0',
        zIndex: 9999,
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#212121' : 'rgba(255, 255, 255, 0.8)', // Transparent background to let the outer background show through
      }}>
        {/* Container for the image with blend mode effect */}
        <Paper
        elevation={3}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <img
            src={process.env.PUBLIC_URL + '/assets/loading.gif'}
            alt="Loading..."
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '500px',
              maxHeight: '500px',
              opacity:  isDarkMode ? 0.33 : 0.75, // Very transparent to make black nearly invisible
              filter: isDarkMode ? 'contrast(0.75) brightness(1)' :  'invert(1) contrast(1)', // Enhance the white parts
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
