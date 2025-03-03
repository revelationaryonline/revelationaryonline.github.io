import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import Cookies from 'js-cookie';

interface SignOutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutDialog({ open, onClose, onConfirm }: SignOutDialogProps) {
  const [saveHighlightedVerses, setSaveHighlightedVerses] = React.useState(true);
  const [saveBookmark, setSaveBookmark] = React.useState(true);
  const [saveSession, setSaveSession] = React.useState(true);

  const handleSignOut = () => {
    if (!saveSession) {
      // Clear session cookies if not saving
      Cookies.remove('wpToken');
      Cookies.remove('userId');
    }
    
    if (!saveHighlightedVerses) {
      // Clear highlighted verses cookie
      Cookies.remove('highlightedVerses');
    }
    
    if (!saveBookmark) {
      // Clear bookmark cookie
      Cookies.remove('bookmark');
    }
    
    onConfirm();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.palette.mode === 'light' ? '#FFF' : '#000',
          color: (theme) => theme.palette.mode === 'light' ? '#000' : '#FFF',
          borderRadius: 0
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: 'cardo',
        fontWeight: 600,
        letterSpacing: '1.65px',
      }}>
        Just a sec...
      </DialogTitle>
      <DialogTitle sx={{ 
        mt: -1,
        fontWeight: 200,
      }}>
        Do you want to save anything on this device ?
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={saveHighlightedVerses}
                onChange={(e) => setSaveHighlightedVerses(e.target.checked)}
                sx={{
                  color: '#a1a1a1',
                  '&.Mui-checked': {
                    color: '#a1a1a1',
                  }
                }}
              />
            }
            label="Save highlighted verses"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={saveBookmark}
                onChange={(e) => setSaveBookmark(e.target.checked)}
                sx={{
                  color: '#a1a1a1',
                  '&.Mui-checked': {
                    color: '#a1a1a1',
                  }
                }}
              />
            }
            label="Save bookmark"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={saveSession}
                onChange={(e) => setSaveSession(e.target.checked)}
                sx={{
                  color: '#a1a1a1',
                  '&.Mui-checked': {
                    color: '#a1a1a1',
                  }
                }}
              />
            }
            label="Save session"
          />
        </Box>
        <Typography variant="body2" sx={{ color: '#a1a1a1', fontSize: '14px' }}>
          Note: If you don&apos;t save your session, you&apos;ll need to enter your Comments API password again on next login.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#a1a1a1',
            borderColor: (theme) => theme.palette.mode === 'light' ? '#212121' : '#a1a1a1',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'light' ? '#212121' : '#FFF',
              borderColor: (theme) => theme.palette.mode === 'light' ? '#212121' : '#FFF',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSignOut}
          variant="contained"
          sx={{
            backgroundColor: '#a1a1a1',
            color: '#FFF',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'light' ? '#212121' : '#FFF',
            }
          }}
        >
          Sign Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}
