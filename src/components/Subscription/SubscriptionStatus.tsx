import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Paper, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { cancelSubscription } from '../../services/stripe';

/**
 * Component to display subscription status and management options.
 */
const SubscriptionStatus: React.FC = () => {
  const { subscription, refreshStatus } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCancelSubscription = async () => {
    if (!subscription.subscriptionId) return;
    
    setLoading(true);
    try {
      await cancelSubscription(subscription.subscriptionId);
      await refreshStatus();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        marginBottom: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#212121" : "#FFFFFF",
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>Subscription Status</Typography>
        {subscription.isActive && (
          <Chip 
            label="Active" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        )}
        {!subscription.isActive && (
          <Chip 
            label="Inactive" 
            color="error" 
            size="small" 
            variant="outlined"
          />
        )}
      </Box>

      {subscription.isActive ? (
        <>
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Plan:
            </Typography>
            <Typography variant="body1">
              {subscription.plan === 'yearly' ? 'Yearly Premium' : 'Monthly Premium'}
            </Typography>
          </Box>
          
          {subscription.expiresAt && (
            <Box sx={{ mb: 2, textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Renewal Date:
              </Typography>
              <Typography variant="body1">
                {formatDate(subscription.expiresAt)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 3, textAlign: 'left' }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => setOpenDialog(true)}
            >
              Cancel Subscription
            </Button>
          </Box>
          
          {/* Cancel Confirmation Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          >
            <DialogTitle>Cancel Subscription?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button sx={{ color: "#A1A1A1" }} onClick={() => setOpenDialog(false)}>
                Keep Subscription
              </Button>
              <Button 
                onClick={handleCancelSubscription} 
                color="error"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Yes, Cancel'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            You don't currently have an active subscription.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={RouterLink}
            to="/subscribe"
          >
            Subscribe Now
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default SubscriptionStatus;