import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface LoadingWrapperProps {
  children: React.ReactNode;
  minimumLoadingTime?: number; // Minimum time to show the loading spinner in ms
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ 
  children, 
  minimumLoadingTime = 600  // Default minimum loading time of 600ms
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Track if component is still mounted
    let isMounted = true;
    
    // When location changes, set loading to true
    let loadingTimer: NodeJS.Timeout;
    let minimumLoadingTimer: NodeJS.Timeout;
    
    const startLoading = () => {
      // Only set state if still mounted
      if (isMounted) {
        setIsLoading(true);
      }
      
      // Set a minimum loading time to avoid flash of loading spinner for quick navigations
      minimumLoadingTimer = setTimeout(() => {
        // After minimum time has passed, hide the loading spinner
        if (isMounted) {
          setIsLoading(false);
        }
      }, minimumLoadingTime);
    };
    
    // Add small delay before showing loader to avoid flashing on fast navigations
    const showLoaderDelay = setTimeout(() => {
      startLoading();
    }, 50); // Small delay to avoid showing loader for very fast navigations
    
    // Cleanup timers on unmount or when location changes again
    return () => {
      isMounted = false;
      clearTimeout(showLoaderDelay);
      clearTimeout(loadingTimer);
      clearTimeout(minimumLoadingTimer);
    };
  }, [location.pathname, minimumLoadingTime]);
  
  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      {children}
    </>
  );
};

export default LoadingWrapper;
