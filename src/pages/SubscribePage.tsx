import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  useTheme
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Navigate } from 'react-router-dom';
import { redirectToPaymentLink, SUBSCRIPTION_PLANS } from '../services/stripe';

interface SubscribePageProps {
  user: any | null;
  loggedIn: boolean;
}

const SubscribePage: React.FC<SubscribePageProps> = ({ user, loggedIn }) => {
  const theme = useTheme();
  
  // Redirect to login if not logged in
  if (!loggedIn) {
    return <Navigate to="/login?redirect=subscribe" replace />;
  }
  
  const handleSubscribe = (plan: 'MONTHLY' | 'YEARLY') => {
    if (!user?.email) {
      console.error('No user email found');
      return;
    }
    
    redirectToPaymentLink(plan, user.email);
  };
  
  const features = [
    'Unlimited Study Notes',
    'Advanced Search Features',
    'Personal Verse Highlights',
    'Commentary Access',
    'Ad-Free Experience'
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Choose Your Subscription Plan
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Unlock premium features to enhance your Bible study experience
        </Typography>
      </Box>
      
      <Grid container spacing={4} justifyContent="center">
        {/* Monthly Plan */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              {SUBSCRIPTION_PLANS.MONTHLY.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
              <Typography variant="h3" component="span">
                £{SUBSCRIPTION_PLANS.MONTHLY.amount}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                /{SUBSCRIPTION_PLANS.MONTHLY.interval}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {SUBSCRIPTION_PLANS.MONTHLY.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List sx={{ flexGrow: 1 }}>
              {features.map((feature) => (
                <ListItem key={feature} sx={{ p: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => handleSubscribe('MONTHLY')}
            >
              Subscribe Monthly
            </Button>
          </Paper>
        </Grid>
        
        {/* Yearly Plan */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              border: `2px solid ${theme.palette.primary.main}`,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {SUBSCRIPTION_PLANS.YEARLY.name}
              </Typography>
              
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -8, 
                  right: -16, 
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  transform: 'rotate(5deg)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                Best Value
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2, mt: -2.5 }}>
              <Typography variant="h3" component="span">
                £{SUBSCRIPTION_PLANS.YEARLY.amount}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                /{SUBSCRIPTION_PLANS.YEARLY.interval}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {SUBSCRIPTION_PLANS.YEARLY.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List sx={{ flexGrow: 1 }}>
              {features.map((feature) => (
                <ListItem key={feature} sx={{ p: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => handleSubscribe('YEARLY')}
            >
              Subscribe Yearly
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          By subscribing, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Have questions? <Link href="/contact">Contact us</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SubscribePage;
