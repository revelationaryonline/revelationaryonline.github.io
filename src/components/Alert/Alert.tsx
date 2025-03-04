import { useState, useEffect } from 'react';
import { Snackbar, Button, Link } from '@mui/material';
import Cookies from 'js-cookie';

export default function Alert({message, link} : { message: string, link: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = Cookies.get('commentConsent');
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie consent for 1 year
    Cookies.set('commentConsent', 'true', { expires: 365 });
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
          Comments are moderated for review before being made public. This can take a little while but usually pretty quick !
          <Link href="https://revelationary.org/faq" target="_blank" color="text.primary" sx={{ ml: 1 }}>
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
          Dismiss
        </Button>
      }
    />
  );
}
