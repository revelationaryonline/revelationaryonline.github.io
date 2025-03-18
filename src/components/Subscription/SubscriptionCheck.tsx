import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface SubscriptionCheckProps {
  children: React.ReactNode;
  feature?: 'comments' | 'notes' | 'highlights' | 'all';
}

/**
 * Component that checks if a user has access to a premium feature.
 * If they don't, it displays a subscription prompt instead of the children.
 */
const SubscriptionCheck: React.FC<SubscriptionCheckProps> = ({ children, feature = 'all' }) => {
  const { subscription, canUseComments } = useSubscription();
  
  // Determine if the user has access to the feature
  const hasAccess = feature === 'comments' 
    ? canUseComments 
    : subscription.isActive;

  // If they have access, render the children
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // Otherwise, show a subscription prompt
  return (
    <Paper 
      elevation={0}
      sx={{
        padding: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h6" gutterBottom>
        This feature requires a subscription
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Subscribe to unlock all premium features including {feature === 'all' ? 'unlimited access' : feature}.
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Button
          component={RouterLink}
          to="/subscribe"
          variant="contained"
          color="primary"
          size="large"
        >
          Subscribe Now
        </Button>
      </Box>
    </Paper>
  );
};

export default SubscriptionCheck;