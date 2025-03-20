import React from 'react';
import { User } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import { DashboardTour } from './index';

interface TourProviderProps {
  loggedIn: boolean;
  user: User | null;
  wpToken: string | null;
}

/**
 * TourProvider component that decides which tour to show based on current route
 */
const TourProvider: React.FC<TourProviderProps> = ({ 
  loggedIn, 
  user, 
  wpToken 
}) => {
  const location = useLocation();
  
  // Only show dashboard tour if we're on the dashboard page
  // Adjust the path check based on your routing structure
  const isOnDashboard = location.pathname === '/' || 
                        location.pathname === '/#/' || 
                        location.pathname === '';
  
  return (
    <>
      {isOnDashboard && (
        <DashboardTour user={user} wpToken={wpToken} />
      )}
      {/* Add more tour components for other pages as needed */}
    </>
  );
};

export default TourProvider;
