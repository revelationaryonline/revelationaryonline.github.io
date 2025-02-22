import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase"; // Import the initialized auth instance
import { mdTheme } from "../utils/misc";

import logo from "../assets/logo512.png";

const LoginPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
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
      //   alert("Sign-up successful!");
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
          <Box
            sx={{
              mt: 5,
              filter: (theme) => theme.palette.mode === "dark" && "invert(1)",
            }}
          >
            <img
              style={{
                marginTop: "1rem",
                marginBottom: "1.5rem",
                width: "50%",
              }}
              src={logo}
            ></img>
          </Box>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <Typography component="h1" variant="h5" gutterBottom>
              {isSigningUp ? "Sign Up" : "Sign In"}
            </Typography>

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
                sx={{ mt: 1, mb: 2 }}
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
                  Don’t have an account?{" "}
                  <Button variant="text" onClick={() => setIsSigningUp(true)}>
                    Sign Up Now
                  </Button>
                </>
              )}
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
