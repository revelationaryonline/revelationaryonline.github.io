import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTheme, ThemeProvider } from "@mui/material/styles";
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
  User,
} from "firebase/auth";
import { auth } from "../firebase"; // Import the initialized auth instance
import { mdTheme } from "../utils/misc";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormControlLabel from "@mui/material/FormControlLabel";

import logo from "../assets/logo512.png";

interface LoginPageProps {
  user: User | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ user }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOptedOut, setIsOptedOut] = useState(false); // Track if user opted out
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
      const authHeader =
        "Basic " +
        btoa(
          `${process.env.REACT_APP_WP_USERNAME}:${process.env.REACT_APP_WP_APP_PASSWORD}`
        );

      // Step 1: Check if the user already exists
      const checkUserResponse = await fetch(wpApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });

      const existingUsers = await checkUserResponse.json();

      if (existingUsers.length > 0) {
        console.log("User already exists in WordPress:", existingUsers);
        Cookies.set("userId", existingUsers[0].id); // Save user ID in cookies
        setTimeout(() => navigate("/"), 500);
        return;
      }

      // Step 2: If user doesn't exist, create a new subscriber
      const createUserResponse = await fetch(
        `${process.env.REACT_APP_WP_API_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            username: user.email?.split("@")[0], // Use email prefix as username
            email: user.email,
            roles: ["subscriber"],
            password: Math.random().toString(36).slice(-10), // Generate a secure password
          }),
        }
      );

      const wpData = await createUserResponse.json();
      if (createUserResponse.ok) {
        console.log("WordPress Subscription Success:", wpData);
        Cookies.set("userId", wpData.id); // Save user ID in cookies
      } else {
        console.error("WordPress Subscription Failed:", wpData);
      }

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during Google Sign-In:", error.message);
        setError(error.message);
      } else {
        console.error("Error during Google Sign-In:", error);
      }
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

      // Fetch the user ID from WordPress and save it in cookies
      const wpApiUrl = `${process.env.REACT_APP_WP_API_URL}/users?search=${user.email}`;
      const authHeader =
        "Basic " +
        btoa(
          `${process.env.REACT_APP_WP_USERNAME}:${process.env.REACT_APP_WP_APP_PASSWORD}`
        );
      const checkUserResponse = await fetch(wpApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });
      const existingUsers = await checkUserResponse.json();
      if (existingUsers.length > 0) {
        Cookies.set("userId", existingUsers[0].id); // Save user ID in cookies
      }

      // Step 2: If user doesn't exist, create a new subscriber
      const createUserResponse = await fetch(
        `${process.env.REACT_APP_WP_API_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            username: user.email?.split("@")[0], // Use email prefix as username
            email: user.email,
            roles: ["subscriber"],
            password: Math.random().toString(36).slice(-10), // Generate a secure password
          }),
        }
      );

      const wpData = await createUserResponse.json();
      if (createUserResponse.ok) {
        console.log("WordPress Subscription Success:", wpData);
        Cookies.set("userId", wpData.id); // Save user ID in cookies
      } else {
        console.error("WordPress Subscription Failed:", wpData);
      }

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error signing up:", error.message);
        setError(error.message);
      } else {
        console.error("Error signing up:", error);
      }
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

      // Fetch the user ID from WordPress and save it in cookies
      const wpApiUrl = `${process.env.REACT_APP_WP_API_URL}/users?search=${user.email}`;
      const authHeader =
        "Basic " +
        btoa(
          `${process.env.REACT_APP_WP_USERNAME}:${process.env.REACT_APP_WP_APP_PASSWORD}`
        );
      const checkUserResponse = await fetch(wpApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });
      const existingUsers = await checkUserResponse.json();
      if (existingUsers.length > 0) {
        Cookies.set("userId", existingUsers[0].id); // Save user ID in cookies
      }

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error logging in:", error.message);
        setError(error.message);
      } else {
        console.error("Error logging in:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      const token = Cookies.get("wpToken");
      // Ensure token exists
      if (token) {
        console.log("Token already exists in storage:", token);
      } else {
        console.log("No token found in storage.");
      }
    }
  }, [user]);

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
                alt="revelationary Logo"
                src={logo}
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: "7px",
                  marginBottom: 30,
                  marginRight: 10,
                  marginLeft: 10,
                  // @ts-ignore-next-line
                  filter: isDarkMode && "invert(1)",
                }}
              />
              <Typography
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
            <Typography
              sx={{ mb: 3, fontSize: "24px" }}
              component="h1"
              variant="h5"
              gutterBottom
            >
              {isSigningUp ? "Sign Up" : "Sign In"}
            </Typography>

            {isSigningUp && (
              <>
                <Typography>A Free account lets you:</Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Typography
                    sx={{
                      pt: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleIcon
                      fontSize="small"
                      color={isOptedOut ? "disabled" : "success"}
                      sx={{ mr: 1 }}
                    />
                    Add comments on every verse
                  </Typography>

                  <Typography
                    sx={{
                      pt: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleIcon
                      fontSize="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    Read our blog
                  </Typography>

                  <Typography
                    sx={{
                      pt: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleIcon
                      fontSize="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />
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
                "& .Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "black !important"
                      : "white !important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#ccc !important"
                        : "#FFF !important",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "black"
                        : "white !important",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                    WebkitTextFillColor: (theme) =>
                      theme.palette.mode === "light" ? "black" : "white",
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                },
                "& .MuiInputBase-input": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
                },
                "& .MuiInputBase-input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                  WebkitTextFillColor: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
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
                "& .Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "black !important"
                      : "white !important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#ccc !important"
                        : "#FFF !important",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "black"
                        : "white !important",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                    WebkitTextFillColor: (theme) =>
                      theme.palette.mode === "light" ? "black" : "white",
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                },
                "& .MuiInputBase-input": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
                },
                "& .MuiInputBase-input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                  WebkitTextFillColor: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
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
                  <Button variant="text" onClick={() => setIsSigningUp(false)}>
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <Button variant="text" onClick={() => setIsSigningUp(true)}>
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
