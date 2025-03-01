import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

interface WPLoginModalProps {
  user: any;
  wpToken: any;
  setToken: (token: string | null) => void;
}

const WPLoginModal: React.FC<WPLoginModalProps> = ({ user, wpToken, setToken }) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get('wpToken');
    if (user && !token) {
      setOpen(true); // Open modal if user is logged in but has no WP token
    } else {
      setOpen(false); // Close modal if token is present
    }
  }, [user]);

  const handleLogin = async () => {
    if (!user || !password) return;

    try {
      const response = await fetch(`https://revelationary.org/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.email.split('@')[0], // Assuming WP uses email as username
          password: password,  
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        Cookies.set('wpToken', data.token, { expires: 7, path: '' }); // expires in 7 days
        setOpen(false); // Close modal on success
      } else {
        setError("Invalid password. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
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
        <Typography variant="h6">🔐 WordPress Login</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter your WordPress password to post comments.
        </Typography>

        <TextField
          type="password"
          label="WordPress Password"
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