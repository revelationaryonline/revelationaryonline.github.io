import { useState, useEffect } from 'react';
import { Snackbar, Button, Link } from '@mui/material';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = Cookies.get('cookieConsent');
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie consent for 1 year
    Cookies.set('cookieConsent', 'true', { expires: 365 });
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          bgcolor: 'background.paper',
          color: 'text.primary',
          maxWidth: '600px',
          borderRadius: 2,
          p: 1,
          boxShadow: (theme) => 
            theme.palette.mode === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }
      }}
      message={
        <span>
          This website uses cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies. 
          <Link href="https://revelationary.org/privacy-policy/" target="_blank" color="text.primary" sx={{ ml: 1 }}>
            Learn more
          </Link>
        </span>
      }
      action={
        <Button 
          color="success" 
          size="small" 
          onClick={handleAccept}
          sx={{ 
            fontWeight: 'bold',
            minWidth: '100px'
          }}
        >
          Accept
        </Button>
      }
    />
  );
}
