import React from 'react';
import { User } from 'firebase/auth';
import DashboardTour from './DashboardTour';

interface DashboardTourWrapperProps {
  loggedIn: boolean;
  user: User | null;
  wpToken: string | null;
}

const DashboardTourWrapper: React.FC<DashboardTourWrapperProps> = ({ 
  loggedIn, 
  user, 
  wpToken 
}) => {
  return (
    <DashboardTour user={user} wpToken={wpToken} />
  );
};

export default DashboardTourWrapper;
