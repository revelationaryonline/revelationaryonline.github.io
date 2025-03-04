import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import Switch from "@mui/material/Switch";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Circle from "@mui/icons-material/Circle";
import PersonIcon from "@mui/icons-material/Person";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { 
  deleteUser, 
  onAuthStateChanged, 
  User, 
  reauthenticateWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebase";
import { mdTheme } from "../utils/misc";
import { Copyright } from "../components/Copyright/Copyright";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

function AccountContent({ loggedIn, user, setUser }: { loggedIn: boolean, user: any, setUser: any }) {
  const [checked, setChecked] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [userId, setUserId] = useState<number | null>(null);
  const userId = Cookies.get('userId')
  const [deleteStep, setDeleteStep] = useState<'initial' | 'verify' | 'export' | 'deleting'>('initial');
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [userDebugInfo, setUserDebugInfo] = useState<any>(null);
  const [isDebugLoading, setIsDebugLoading] = useState(false);
  const navigate = useNavigate();

  const showError = (message: string) => {
    setError(message);
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      // Change deleteStep to 'verify' at the beginning
      setDeleteStep('verify');
      
      const wpApiUrl = process.env.REACT_APP_WP_API_URL_CUSTOM;
      const wpUsername = process.env.REACT_APP_WP_USERNAME;
      const wpAppPassword = process.env.REACT_APP_WP_APP_PASSWORD;
      const deleteSecret = process.env.REACT_APP_WP_DELETE_SECRET;
      
      // Debug log
      console.log('Config check:', {
        wpApiUrl,
        wpUsername,
        hasAppPassword: !!wpAppPassword,
        hasDeleteSecret: !!deleteSecret
      });
      
      if (!wpApiUrl || !wpUsername || !wpAppPassword || !deleteSecret) {
        throw new Error(`WordPress configuration missing: ${JSON.stringify({
          hasApiUrl: !!wpApiUrl,
          hasUsername: !!wpUsername,
          hasAppPassword: !!wpAppPassword,
          hasDeleteSecret: !!deleteSecret
        })}`);
      }

      // Export user data for GDPR compliance (mock step)
      setDeleteStep('export');
      // Simulate data export time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set to deleting before actual delete happens
      setDeleteStep('deleting');

      // Delete WordPress account using the standard WordPress REST API to delete a user by ID
      // alert(userId)
      let response;
      if(userId) 
      response = await fetch(`https://revelationary.org/wp-json/wp/v2/users/${userId}?force=true&reassign=0`, {
        method: 'DELETE',
        credentials: 'omit', // Omit credentials to avoid CORS issues
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${wpUsername}:${wpAppPassword}`)}`,
          'Accept': 'application/json'
        }
      });

      // Parse the response
      let responseData;
      try {
        responseData = await response?.json();
      } catch (err) {
        console.error('Error parsing response:', err);
        responseData = { message: 'Failed to parse server response' };
      }
      
      console.log('Server response:', responseData);
      
      // Handle errors from WordPress deletion
      if (!response?.ok) {
        if (responseData && responseData.code) {
          // Custom error handling based on server response codes
          switch(responseData.code) {
            case 'invalid_delete_secret':
              throw new Error('Authentication error: Invalid deletion secret');
            case 'not_logged_in':
              throw new Error('Authentication error: You must be logged in to delete your account');
            case 'no_delete_permission':
              throw new Error('Permission error: You do not have permission to delete your account');
            case 'not_subscriber':
              throw new Error('Role error: Only subscribers can delete their accounts');
            case 'deletion_failed':
              throw new Error('Server error: Failed to delete your account');
            default:
              throw new Error(responseData.message || `Error: ${response?.status}`);
          }
        }
        
        throw new Error(`Request failed with status ${response?.status}`);
      }

      console.log('WordPress user deletion successful:', responseData);

      // Step 2: Delete Firebase account if WordPress deletion succeeded
      try {
        await deleteUser(user);
        console.log('Firebase user deleted successfully');
      } catch (firebaseError: any) {
        console.log('Firebase deletion error:', firebaseError);
        
        if (firebaseError.code === 'auth/requires-recent-login') {
          console.log('Requiring reauthentication...');
          try {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(user, provider);
            await deleteUser(user);
            console.log('Firebase user deleted after reauthentication');
          } catch (reAuthError: any) {
            console.error('Reauthentication failed:', reAuthError);
            throw new Error('Failed to authenticate for account deletion. Please sign out and try again.');
          }
        } else {
          console.error('Unknown Firebase error:', firebaseError);
          throw firebaseError;
        }
      }

      // Step 3: Clear cookies and redirect
      const cookies = Cookies.get();
      for (const cookie in cookies) {
        Cookies.remove(cookie);
      }

      setUser(null);
      navigate('/');
      setSnackbar({
        open: true,
        message: 'Your account has been successfully deleted.',
        severity: 'success'
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      showError(error.message || 'Failed to delete account');
      setDeleteStep('initial');
    } finally {
      setIsDeleting(false);
      setOpenDialog(false); // Close dialog after completion or error
    }
  };

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleDelete = async () => {
    setOpenDialog(true);
  };

  const checkUserPermissions = async () => {
    setIsDebugLoading(true);
    setError(null);
    
    try {
      const wpApiUrl = process.env.REACT_APP_WP_API_URL_CUSTOM;
      const wpUsername = process.env.REACT_APP_WP_USERNAME;
      const wpAppPassword = process.env.REACT_APP_WP_APP_PASSWORD;
      
      if (!wpApiUrl || !wpUsername || !wpAppPassword) {
        throw new Error('Missing WordPress configuration');
      }
      
      console.log('Fetching user debug info from:', `${wpApiUrl}/user-debug?user_id=${userId}`);
      console.log('User ID:', `${JSON.stringify(userId)}`);
      console.log('User Info:', `${JSON.stringify(user)}`);
      
      const response = await fetch(`${wpApiUrl}/user-debug?user_id=${userId}`, {
        method: 'GET',
        credentials: 'omit',
        headers: {
          'Authorization': `Basic ${btoa(`${wpUsername}:${wpAppPassword}`)}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage = `Error: HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the default error message
        }
        throw new Error(`API Error: ${errorMessage}`);
      }
      
      const data = await response.json();
      setUserDebugInfo(data);
      console.log('User debug info:', data);
      
      // Show a snackbar with permission status
      setSnackbar({
        open: true,
        message: data.has_delete_self 
          ? 'You have permission to delete your account' 
          : 'You do not have permission to delete your account',
        severity: data.has_delete_self ? 'info' : 'error'
      });
      
    } catch (error: any) {
      console.error('Error fetching user debug info:', error);
      setUserDebugInfo({ error: error.message || 'Failed to fetch user data' });
      showError(error.message || 'Failed to fetch user permissions');
    } finally {
      setIsDebugLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    // Check permissions when component mounts    
    checkUserPermissions();
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", marginTop: "15px", fontFamily: "Quicksand" }}>
        <CssBaseline />
        {/* sidebar */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[300]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    px: 8,
                    py: 8,
                    display: "flex",
                    width: "100%",
                    position: "relative",
                    height: "auto",
                    fontFamily: "Quicksand",
                  }}
                  elevation={4}
                >
                  <Grid container spacing={3} sx={{ textAlign: "left" }}>
                    <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                      {/* user api */}
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: "auto",
                          maxHeight: 360,
                          bgcolor: "background.transparent",
                          marginTop: "1rem",
                          float: "left",
                        }}
                      >
                        <ListItem alignItems="flex-start">
                          {(
                            <img
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 5,
                                marginBottom: 5,
                              }}
                              alt={user?.displayName || "User"}
                              src={`${user?.photoURL}`}
                            />
                          ) 
                          // : 
                          // (
                          //   <Avatar>
                          //     <PersonIcon />
                          //   </Avatar>
                          // )
                          }
                          <div style={{ borderRadius: 0 }}>
                            <Typography
                              sx={{
                                marginLeft: 2,
                                mt: 1,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "white",
                              }}
                            >
                              {user && user.displayName}
                            </Typography>
                            <Typography
                              sx={{
                                marginLeft: 2,
                                mt: -1,
                                fontSize: "0.65rem",
                                fontWeight: 400,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Circle
                                sx={{ width: 10 }}
                                htmlColor={"#02b548"}
                              />
                              &nbsp;Active
                            </Typography>
                          </div>
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                      {/* <Typography
                        sx={{
                          display: "block",
                          textAlign: "right",
                          width: "auto",
                        }}
                        component="span"
                        color="text.primary"
                      >
                        SUBSCRIPTIONS
                      </Typography> */}
                      <List
                        sx={{
                          marginTop: "1rem",
                          width: "100%",
                          maxWidth: "80%",
                          bgcolor: "background.transparent",
                          float: "right",
                        }}
                        subheader={
                          <ListSubheader sx={{ background: "none" }}>
                            Settings
                          </ListSubheader>
                        }
                      >
                        <ListItem>
                          <ListItemIcon>{/* <CommentIcon /> */}</ListItemIcon>
                          <ListItemText
                            id="switch-list-label-comments"
                            primary="Auto Renew"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("comments")}
                            checked={checked.indexOf("comments") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-comments",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>{/* <SearchIcon /> */}</ListItemIcon>
                          <ListItemText
                            id="switch-list-label-search"
                            primary="Pause Membership"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("search")}
                            checked={checked.indexOf("search") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-search",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            {/* <HelpCenterIcon /> */}
                          </ListItemIcon>
                          <ListItemText
                            id="switch-list-label-guide"
                            primary="Freemium"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("guide")}
                            checked={checked.indexOf("guide") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-guide",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            {/* <InsertLinkIcon /> */}
                          </ListItemIcon>
                          <ListItemText
                            id="switch-list-label-links"
                            primary="Public Account"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("links")}
                            checked={checked.indexOf("links") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-links",
                            }}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Recent Orders */}
              <Grid item xs={12} md={12}>
                <Paper
                  onClick={handleDelete}
                  sx={{ 
                    p: 2, 
                    display: "flex", 
                    flexDirection: "column", 
                    backgroundColor: "#BB0000",
                    cursor: "pointer",
                    '&:hover': {
                      backgroundColor: "#990000"
                    }
                  }}
                  elevation={4}
                >
                  DELETE ACCOUNT
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>User Permission Debug</Typography>
                  {isDebugLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} sx={{ mr: 2 }} />
                      <Typography>Loading user information...</Typography>
                    </Box>
                  ) : userDebugInfo?.error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {userDebugInfo.error}
                    </Alert>
                  ) : userDebugInfo ? (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>User Information</Typography>
                            <Typography><strong>User ID:</strong> {userDebugInfo.ID}</Typography>
                            <Typography><strong>Username:</strong> {userDebugInfo.user_login}</Typography>
                            <Typography><strong>Display Name:</strong> {userDebugInfo.display_name}</Typography>
                            <Typography><strong>Roles:</strong> {userDebugInfo.roles?.join(', ') || 'None'}</Typography>
                            <Typography sx={{ mt: 1 }}>
                              <strong>Can Delete Self:</strong>{' '}
                              {userDebugInfo.has_delete_self ? (
                                <Chip size="small" label="Yes" color="success" />
                              ) : (
                                <Chip size="small" label="No" color="error" />
                              )}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Capabilities</Typography>
                            {userDebugInfo.capabilities && typeof userDebugInfo.capabilities === 'object' ? (
                              <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                                <List dense>
                                  {Object.keys(userDebugInfo.capabilities)
                                    .filter(cap => userDebugInfo.capabilities[cap] === true)
                                    .map(cap => (
                                      <ListItem key={cap} disablePadding>
                                        <ListItemIcon sx={{ minWidth: '35px' }}>
                                          <CheckCircleOutline fontSize="small" color="success" />
                                        </ListItemIcon>
                                        <ListItemText primary={cap} />
                                      </ListItem>
                                    ))}
                                </List>
                              </Box>
                            ) : (
                              <Typography>No capabilities found</Typography>
                            )}
                          </Paper>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={checkUserPermissions}
                          startIcon={<RefreshIcon />}
                        >
                          Refresh Debug Info
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography>No user information available</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !isDeleting && setOpenDialog(false)}
      >
        <DialogTitle sx={{ color: '#BB0000' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={
                deleteStep === 'initial' ? 0 :
                deleteStep === 'verify' ? 25 :
                deleteStep === 'export' ? 50 :
                deleteStep === 'deleting' ? 75 : 100
              } 
            />
          </Box>
          {deleteStep === 'initial' && (
            <>
              <DialogContentText>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogContentText>
            </>
          )}
          {deleteStep === 'verify' && (
            <DialogContentText>
              Verifying WordPress credentials...
            </DialogContentText>
          )}
          {deleteStep === 'export' && (
            <DialogContentText>
              Exporting your data for GDPR compliance...
            </DialogContentText>
          )}
          {deleteStep === 'deleting' && (
            <DialogContentText>
              Deleting your account...
            </DialogContentText>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            disabled={isDeleting}
            sx={{
              backgroundColor: '#BB0000',
              '&:hover': {
                backgroundColor: '#990000'
              }
            }}
          >
            {isDeleting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              deleteStep === 'initial' ? "Delete Account" :
              deleteStep === 'verify' ? "Verify & Continue" :
              deleteStep === 'export' ? "Exporting..." :
              "Deleting..."
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default function Account({ loggedIn, user, setUser }: { loggedIn: boolean, user: any, setUser: any }) {
  return <AccountContent loggedIn={loggedIn} user={user} setUser={setUser} />;
}
