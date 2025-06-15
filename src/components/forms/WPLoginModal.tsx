import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useSubscription } from "../../contexts/SubscriptionContext";

const WP_API_URL = process.env.REACT_APP_WP_API_URL?.replace('/wp/v2', '');

interface WPLoginModalProps {
  user: any;
  wpToken: any;
  setToken: (token: string | null) => void;
}

const WPLoginModal: React.FC<WPLoginModalProps> = ({ user, wpToken, setToken }) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { subscription } = useSubscription();

  useEffect(() => {
    const token = Cookies.get('wpToken');
    if (user && !token) { // TODO: revisit this
      setOpen(true); // Open modal if user is logged in, has no WP token, and has an active subscription
    } else {
      setOpen(false); // Close modal if token is present or no active subscription
    }
  }, [user, wpToken, subscription]);

  const handleLogin = async () => {
    if (!user || !password || !WP_API_URL) return;

    try {
      // Use the App Password directly for comments
      setToken(password);  // Store the App Password
      Cookies.set('wpToken', password, { 
        expires: 7, 
        path: '/',
        secure: true,
        sameSite: 'strict'
      });
      setOpen(false);
    } catch (error) {
      console.error("Error setting comment password:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">🔐 API Password</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          We just sent a notification to your email. Please enter your API password to connect to our services. For £1.99 a month you can have reading streaks, post comments and more!
        </Typography>

        <TextField
          type="password"
          label="API Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button variant="contained" onClick={handleLogin} fullWidth>
          Login
        </Button>
      </Box>
    </Modal>
  );
};

export default WPLoginModal;