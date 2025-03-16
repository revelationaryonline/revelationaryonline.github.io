import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import SecurityIcon from '@mui/icons-material/Security';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Link as RouterLink } from 'react-router-dom';

const PaymentCanceledPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, mt: 5 }}>
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
          <CancelIcon 
            color="error" 
            sx={{ 
              fontSize: 80, 
              mb: 2,
            }} 
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Not Completed
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your subscription payment was not processed.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="body1" paragraph>
            Don't worry! This happens for various reasons and you can try again whenever you're ready.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Common reasons for payment issues:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CreditCardOffIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Card declined" 
                secondary="Your card may have been declined by your bank" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Security verification" 
                secondary="Additional security verification was not completed" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ErrorOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Connection issue" 
                secondary="There might have been a connection problem during checkout" 
              />
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom align="left">
            Frequently Asked Questions
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Will I be charged for the failed payment?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                No, you won't be charged for any payment that doesn't complete successfully. Any temporary authorization on your card should be released shortly.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Can I try a different payment method?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                Yes, you can try again with a different card or payment method. Our payment system accepts all major credit cards.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Who can I contact for help?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                If you continue to experience issues with payment, please contact our support team at info@revelationaryonline.com.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button 
            component={RouterLink} 
            to="/subscribe" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Try Again
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
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            startIcon={<HelpOutlineIcon />}
            component={RouterLink}
            to="https://revelationary.org/contact/"
            size="small"
          >
            Need help? Contact Support
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentCanceledPage;
