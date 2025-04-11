import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { getAuth } from 'firebase/auth';
import { getStorageKeyFromEmail, verifyStripeSubscription } from '../services/stripe';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { refreshStatus } = useSubscription();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get the user email from Firebase auth when component mounts
  const auth = getAuth();
  const currentUser = auth.currentUser;
  useEffect(() => {
    
    if (currentUser && currentUser.email) {
      setUserEmail(currentUser.email);
      // Also store in localStorage as a fallback
      localStorage.setItem('userEmail', currentUser.email);
    } else {
      // Try to get from localStorage as fallback
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setUserEmail(storedEmail);
      } else {
        setError('Unable to identify user. Please try logging in again.');
      }
    }
  }, []);
  
  // Check Stripe payment status and set subscription data when page loads
  useEffect(() => {
    const verifyPayment = async () => {
      // Make sure we have the user email
      if (!userEmail) {
        console.warn('No user email available for subscription storage');
        setError('Unable to identify user. Please try logging in again.');
        return;
      }

      try {
        // Verify the subscription with Stripe using email
        const subscription = await verifyStripeSubscription(userEmail);
        
        // Save to localStorage using email-based key
        const storageKey = getStorageKeyFromEmail(userEmail);
        localStorage.setItem(storageKey, JSON.stringify(subscription));
        
        // Also save with old key for backward compatibility
        localStorage.setItem('user_subscription', JSON.stringify(subscription));
        
        console.log('Subscription activated for:', userEmail, subscription);
      } catch (error) {
        console.error('Error verifying payment:', error);
        setError('Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [refreshStatus, userEmail]);

  return (
    <Container maxWidth="md" sx={{ py: 8, mt: 5 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? '0 4px 20px rgba(0,0,0,0.1)' 
            : '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircleIcon 
            color="primary" 
            sx={{ 
              fontSize: 80, 
              mb: 2,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(0.95)', opacity: 0.8 },
                '70%': { transform: 'scale(1)', opacity: 1 },
                '100%': { transform: 'scale(0.95)', opacity: 0.8 },
              },
            }} 
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Thank you for subscribing to Revelationary Online.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom align="left">
            What's included in your subscription:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CommentIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Comments" 
                secondary="Share your insights and discuss scriptures with others" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BookmarkIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Premium Features" 
                secondary="Access to all current and future premium features" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Priority Support" 
                secondary="Get help quickly when you need it" 
              />
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button 
            component={RouterLink} 
            to="/account" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            View My Account
          </Button>
          <Button 
            component={RouterLink} 
            to="/" 
            variant="outlined" 
            size="large"
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccessPage;
