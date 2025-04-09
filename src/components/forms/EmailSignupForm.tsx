import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  Stack,
  Avatar,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Email,
  CheckCircle,
  ErrorOutline,
  Close,
} from '@mui/icons-material';
import axios from 'axios';

interface EmailSignupFormProps {
  onScroll: boolean;
}

const EmailSignupForm: React.FC<EmailSignupFormProps> = ({ onScroll }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (onScroll) {
      // Delay showing the form slightly to avoid startling users
      const timer = setTimeout(() => {
        setShow(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onScroll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_WP_API_URL}/wp/v2/email-subscriptions`,
        {
          email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setEmail('');
        // Show success for 3 seconds then hide form
        setTimeout(() => {
          setSuccess(false);
          setShow(false);
        }, 3000);
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1300,
        width: '100%',
        maxWidth: 400,
        transition: 'all 0.3s ease-in-out',
        opacity: onScroll ? 1 : 0,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          backgroundColor: theme.palette.mode === 'light' 
            ? 'rgba(255,255,255,0.95)' 
            : 'rgba(0,0,0,0.95)',
          color: theme.palette.mode === 'light' 
            ? 'rgba(0,0,0,0.87)' 
            : 'rgba(255,255,255,0.87)',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Avatar sx={{ 
              bgcolor: theme.palette.mode === 'light' 
                ? '#FFF' 
                : '#212121',
              color: theme.palette.getContrastText(
                theme.palette.mode === 'light' 
                  ? '#FFF' 
                  : '#212121'
              )
            }}>
              <Email fontSize="small" sx={{ fontSize: 24 }} />
            </Avatar>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Stack>

          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{ 
              fontSize: '1rem',
              color: theme.palette.mode === 'light' 
                ? 'rgba(0,0,0,0.87)' 
                : 'rgba(255,255,255,0.87)',
            }}
          >
            Join Our Bible Study Community
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              mb: 2,
              px: 2,
              fontSize: '0.8rem',
              color: theme.palette.mode === 'light' 
                ? 'rgba(0,0,0,0.6)' 
                : 'rgba(255,255,255,0.6)',
            }}
          >
            Get daily Bible study insights and updates straight to your inbox.
          </Typography>

          <Divider sx={{ 
            my: 2,
            borderColor: theme.palette.mode === 'light' 
              ? 'rgba(0,0,0,0.12)' 
              : 'rgba(255,255,255,0.12)',
          }} />

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Your Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'light' 
                        ? 'rgba(0,0,0,0.23)' 
                        : 'rgba(255,255,255,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'light' 
                        ? 'rgba(0,0,0,0.23)' 
                        : 'rgba(255,255,255,0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || !email}
                startIcon={loading ? null : <Email />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'normal',
                  fontSize: '1rem',
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
            </Stack>
          </form>

          {success && (
            <Alert
              severity="success"
              icon={<CheckCircle sx={{ fontSize: 20 }} />}
              sx={{
                mt: 2,
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(76,175,80,0.12)' 
                  : 'rgba(76,175,80,0.12)',
                color: theme.palette.success.main,
              }}
            >
              Thank you for subscribing! Check your email to confirm.
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              icon={<ErrorOutline sx={{ fontSize: 20 }} />}
              sx={{
                mt: 2,
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(244,67,54,0.12)' 
                  : 'rgba(244,67,54,0.12)',
                color: theme.palette.error.main,
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default EmailSignupForm;
