import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import Cookies from 'js-cookie';
import { User } from 'firebase/auth';
import { useTheme } from '@mui/material/styles';

interface DashboardTourProps {
  user: User | null;
  wpToken: string | null;
}

const DashboardTour: React.FC<DashboardTourProps> = ({ user, wpToken }) => {
  const theme = useTheme();
  const [run, setRun] = useState(false);
  const [steps] = useState<Step[]>([
    {
      target: '.MuiToolbar-root',
      content: 'Welcome to the Revelationary! This is where you can access all core features of the Bible Study Tool for free.',
      disableBeacon: true,
      placement: 'left',
      title: 'Welcome'
    },
    {
      target: 'input[placeholder*="Search by book"]',
      content: 'Search for Bible verses by book, chapter, or verse. Try john 3:16 , psalms 1: , or a keyword in quotes like "light" .',
      placement: 'top',
      title: 'Search Bar'
    },
    {
      target: '.verse__container',
      content: 'Bible verses appear here. If you subscribe, You can leave comments on each verse. If you sign up by email, you can highlight verses by selecting the text.',
      placement: 'top',
      title: 'Bible Verses'
    },
    {
      target: '.MuiDrawer-root, .MuiDrawer-paper, .MuiSvgIcon-fontSizeMedium',
      content: 'Access additional tools and features from the sidebar menu.',
      placement: 'right',
      title: 'Sidebar'
    },
    {
      target: '.MuiSvgIcon-fontSizeMedium',
      content: 'Use the menu to watch tutorials, access other features, and more.',
      placement: 'right',
      title: 'Toolbar Options'
    },
    {
      target: '.MuiIconButton-root .MuiAvatar-root',
      content: 'Click Login to get started.',
      placement: 'left',
      title: 'Login / Sign Up'
    }
  ]);

  useEffect(() => {
    // Check if the user has seen the tour before
    const checkTourStatus = () => {
      // Check for development mode reset parameter
      const urlParams = new URLSearchParams(window.location.search);
      const resetTour = urlParams.get('resetTour');

      // If resetTour is explicitly set to 'true', run the tour regardless
      if (resetTour === 'true') {
        setRun(true);
        return;
      }

      // Otherwise check cookies/localStorage
      if (user && user.uid) {
        // For logged-in users, check cookies or localStorage
        const hasSeenTourCookie = Cookies.get(`dashboardTourCompleted_${user.uid}`);
        const hasSeenTourLocal = localStorage.getItem(`dashboardTourCompleted_${user.uid}`);
        
        // Only start the tour if both cookie and localStorage are missing
        if (!hasSeenTourCookie && !hasSeenTourLocal) {
          setRun(true);
        } else {
          setRun(false);
        }
      } else {
        // For anonymous users or when not logged in
        const hasSeenTourCookie = Cookies.get('dashboardTourCompleted');
        const hasSeenTourLocal = localStorage.getItem('dashboardTourCompleted');
        
        // Only start the tour if both cookie and localStorage are missing
        if (!hasSeenTourCookie && !hasSeenTourLocal) {
          setRun(true);
        } else {
          setRun(false);
        }
      }
    };

    // Add a slight delay to ensure cookies/localStorage are read properly
    setTimeout(checkTourStatus, 100);
  }, [user]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      
      // Save that the user has completed the tour
      if (user && user.uid) {
        // Save in cookie for logged-in users with a user ID
        Cookies.set(`dashboardTourCompleted_${user.uid}`, 'true', { expires: 365, path: '/' });
        localStorage.setItem(`dashboardTourCompleted_${user.uid}`, 'true');
      } else {
        // Save in cookie for anonymous users
        Cookies.set('dashboardTourCompleted', 'true', { expires: 365, path: '/' });
        localStorage.setItem('dashboardTourCompleted', 'true');
      }

      // Double-check that cookies were set properly
      console.log('Tour completed - cookie status:', user?.uid ? 
        Cookies.get(`dashboardTourCompleted_${user.uid}`) : 
        Cookies.get('dashboardTourCompleted'));
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          backgroundColor: theme.palette.mode === 'dark' ? '#1d1d1d' : '#ffffff',
          primaryColor: theme.palette.primary.main,
          textColor: theme.palette.text.primary,
          arrowColor: theme.palette.mode === 'dark' ? '#1d1d1d' : '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          backgroundColor: theme.palette.mode === 'dark' ? '#1d1d1d' : '#ffffff',
          color: theme.palette.text.primary,
          fontSize: '14px',
        },
        tooltipFooter: {
          marginTop: '14px',
        },
        // This styles the spotlight highlighting the element
        spotlight: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipTitle: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        },
        buttonNext: {
          backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#212121',
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#212121'
        },
        buttonBack: {
          color: '#A1A1A1',
        },
        buttonSkip: {
          color: theme.palette.text.secondary,
        },
      }}
    />
  );
};

export default DashboardTour;
