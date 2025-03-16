import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

interface SubscriptionPromptDialogProps {
  open: boolean;
  onClose: () => void;
  feature?: 'comments' | 'notes' | 'highlights' | 'all';
}

/**
 * A dialog that prompts users to subscribe when they try to access premium features.
 */
const SubscriptionPromptDialog: React.FC<SubscriptionPromptDialogProps> = ({ 
  open, 
  onClose, 
  feature = 'comments' 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          py: 2
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
          <LockIcon sx={{ color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#FFFFFF' }} fontSize="large" />
        </Box>
        <Typography variant="h5" component="div" fontWeight="500">
          Premium Feature
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" align="center" gutterBottom sx={{ mt: 2 }}>
          {feature === 'comments' 
            ? 'Commenting is a premium feature available to our subscribers.' 
            : `${feature} is a premium feature available to our subscribers.`}
        </Typography>
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
          Subscribe for £1.99 a month to unlock all premium features including {feature === 'all' ? 'unlimited access' : feature}.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            color: (theme) => theme.palette.mode === 'light' ? '#212121' : '#FFFFFF', minWidth: '120px'          
          }}
        >
          Continue with Free
        </Button>
        <Button
          component={RouterLink}
          to="/subscribe"
          variant="contained"
          color="primary"
          sx={{ minWidth: '120px' }}
          onClick={onClose}
        >
          Subscribe Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionPromptDialog;
