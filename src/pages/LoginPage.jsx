import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  useTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase"; // Import the initialized auth instance
import { mdTheme } from "../utils/misc";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormControlLabel from "@mui/material/FormControlLabel";

import logo from "../assets/logo512.png";

const WORDPRESS_SUBSCRIBE_API =
  "https://public-api.wordpress.com/rest/v1.1/sites/revelationaryonline.wordpress.com/subscribers/new";

const subscribeToWordPress = async (email) => {
  try {
    // Check if the user is already subscribed (if WordPress API supports it)
    const response = await fetch(WORDPRESS_SUBSCRIBE_API, {
      method: "GET", // Adjust if WordPress allows checking subscription status
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok && !data.subscribed) {
      // Assuming response tells you if the user is subscribed
      // Proceed with subscription if not already subscribed
      const subscribeResponse = await fetch(WORDPRESS_SUBSCRIBE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const subscribeData = await subscribeResponse.json();
      if (!subscribeResponse.ok) {
        throw new Error(
          subscribeData.message || "Failed to subscribe to WordPress"
        );
      }
      console.log("Successfully subscribed to WordPress:", subscribeData);
    }
  } catch (error) {
    console.error("Error subscribing to WordPress:", error.message);
  }
};

const LoginPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOptedOut, setIsOptedOut] = useState(false); // State to track if user opted out
  const navigate = useNavigate();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
  
      const wpApiUrl = `${process.env.REACT_APP_WP_API_URL}/users?search=${user.email}`;
      const authHeader = "Basic " + btoa(`${process.env.REACT_APP_WP_USERNAME}:${process.env.REACT_APP_WP_APP_PASSWORD}`);
  
      // Step 1: Check if the user already exists
      const checkUserResponse = await fetch(wpApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
      });
  
      const existingUsers = await checkUserResponse.json();
  
      if (existingUsers.length > 0) {
        console.log("User already exists in WordPress:", existingUsers);
        navigate("/"); // Redirect since they are already registered
        return;
      }
  
      // Step 2: If user doesn't exist, create a new subscriber
      const createUserResponse = await fetch(`${process.env.REACT_APP_WP_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify({
          username: user.email.split("@")[0], // Use email prefix as username
          email: user.email,
          roles: ["subscriber"],
          password: "SecurePass123!", // Ideally, generate a secure password
        }),
      });
  
      const wpData = await createUserResponse.json();
      if (createUserResponse.ok) {
        console.log("WordPress Subscription Success:", wpData);
      } else {
        console.error("WordPress Subscription Failed:", wpData);
      }
  
      navigate("/");
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
      setError(error.message);
    }
  };
  
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Signed up with:", user.email);
      if (!isOptedOut) {
        await subscribeToWordPress(user.email); // Subscribe to WordPress only if not opted out
      }
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Logged in as:", user.email);
      //   alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center" }}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              mt: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <Box display={"flex"} flexDirection={"row"}>
              <img
                src={logo}
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: "7px",
                  marginBottom: 30,
                  marginRight: 10,
                  marginLeft: 10,
                  filter: isDarkMode && "invert(1)",
                }}
              ></img>
              <Typography
                variant="p"
                component="div"
                sx={{
                  textAlign: { xs: "center", sm: "left" },
                  mt: "3.5px",
                  flexGrow: 1,
                  fontFamily: "cardo",
                  fontWeight: 600,
                  fontStyle: "bold",
                  letterSpacing: "1.65px",
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#FFF",
                }}
              >
                revelationary
              </Typography>
            </Box>
            <Typography sx={{ mb: 3, fontSize: '24px' }} component="h1" variant="h5" gutterBottom>
              {isSigningUp ? "Sign Up" : "Sign In"}
            </Typography>

            {isSigningUp && (
              <>
                <Typography>
                  A Free account lets you:
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      pt: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center", // This centers the icon and text vertically
                    }}
                  >
                    <CheckCircleIcon
                      fontSize="small"
                      color={isOptedOut ? "disabled" : "success"} // Change icon color based on opt-out status
                      sx={{ mr: 1 }}
                    />{" "}
                    {/* Add margin to the right of the icon */}
                    Add comments on every verse
                  </Typography>

                  <Typography
                    sx={{
                      pt: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center", // This centers the icon and text vertically
                    }}
                  >
                    <CheckCircleIcon
                      fontSize="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />{" "}
                    {/* Add margin to the right of the icon */}
                    Read our blog
                  </Typography>

                  <Typography
                    sx={{
                      pt: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center", // This centers the icon and text vertically
                    }}
                  >
                    <CheckCircleIcon
                      fontSize="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />{" "}
                    {/* Add margin to the right of the icon */}
                    Highlight Verses
                  </Typography>
                </Box>
              </>
            )}
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                WebkitBoxShadow: "none !important",
                // Target the fieldset to change the border color
                "& .Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "black !important"
                      : "white !important",
                  WebkitBoxShadow: "none !important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#ccc !important"
                        : "#FFF !important", // Light/dark border
                    WebkitBoxShadow: "none !important",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "black"
                        : "white !important",
                    WebkitBoxShadow: "none !important",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #212121AA inset", // Change to match background
                    WebkitTextFillColor: (theme) =>
                      theme.palette.mode === "light" ? "black" : "white", // Ensure text remains visible
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                },
                // Optional: If you also want to modify the color inside the input
                "& .MuiInputBase-input": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
                },
                "& .MuiInputBase-input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #212121AA inset", // Change to match background
                  WebkitTextFillColor: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white", // Ensure text remains visible
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                WebkitBoxShadow: "none !important",
                // Target the fieldset to change the border color
                "& .Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "black !important"
                      : "white !important",
                  WebkitBoxShadow: "none !important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#ccc !important"
                        : "#FFF !important", // Light/dark border
                    WebkitBoxShadow: "none !important",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "black"
                        : "white !important",
                    WebkitBoxShadow: "none !important",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #212121AA inset", // Change to match background
                    WebkitTextFillColor: (theme) =>
                      theme.palette.mode === "light" ? "black" : "white", // Ensure text remains visible
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                },
                // Optional: If you also want to modify the color inside the input
                "& .MuiInputBase-input": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
                },
                "& .MuiInputBase-input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #212121AA inset", // Change to match background
                  WebkitTextFillColor: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white", // Ensure text remains visible
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#a1a1a1",
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#FFF",
                },
              }}
              onClick={isSigningUp ? handleSignUp : handleLogin}
            >
              {isSigningUp ? "Sign Up" : "Sign In"}
            </Button>

            {!isSigningUp && (
              <Button
                type="button"
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                  mb: 2,
                  backgroundColor: "#transparent",
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#a1a1a1",
                  border: (theme) =>
                    theme.palette.mode === "light"
                      ? "1px solid #212121"
                      : "1px solid #a1a1a1",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light" ? "#212121" : "#FFF",
                    border: (theme) =>
                      theme.palette.mode !== "light"
                        ? "1px solid #212121"
                        : "1px solid #a1a1a1",
                  },
                }}
                onClick={handleGoogleSignIn}
              >
                Sign In with Google
              </Button>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              {isSigningUp ? (
                <>
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    onClick={() => setIsSigningUp(false)}
                    sx={{
                      backgroundColor: "#transparent",
                      color: (theme) =>
                        theme.palette.mode === "light" ? "#212121" : "#a1a1a1",
                      // border: (theme) =>
                      //   theme.palette.mode === "light"
                      //     ? "1px solid #212121"
                      //     : "1px solid #a1a1a1",
                    }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <Button
                    variant="text"
                    onClick={() => setIsSigningUp(true)}
                    sx={{
                      backgroundColor: "#transparent",
                      color: (theme) =>
                        theme.palette.mode === "light" ? "#212121" : "#a1a1a1",
                      // border: (theme) =>
                      //   theme.palette.mode === "light"
                      //     ? "1px solid #212121"
                      //     : "1px solid #a1a1a1",
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Typography>
            {isSigningUp && (
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  sx={{
                    display: "flex",
                    color: "#a1a1a1",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "14px",
                    },
                  }}
                  control={
                    <Checkbox
                      onChange={(e) => setIsOptedOut(e.target.checked)}
                      checked={isOptedOut}
                    />
                  }
                  label={`I don't want to post comments`}
                />
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
