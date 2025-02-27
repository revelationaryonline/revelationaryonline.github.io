import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import { Blog } from "./pages/Blog";
import LoginPage from "./pages/LoginPage";
import { Box } from "@mui/material";

// Import Firebase authentication
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // State for storing the Firebase token
  const [wpToken, setWpToken] = useState(localStorage.getItem('wp_token') || null); // Try to load WP token from localStorage

  // Initialize Firebase Auth
  const auth = getAuth();

  // Check for the user's theme preference on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);

    // Listen for changes in theme preference
    const themeChangeListener = (e) => {
      setDarkMode(e.matches);
    };
    
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', themeChangeListener);
    
    return () => {
      // Clean up the event listener when the component unmounts
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener('change', themeChangeListener);
    };
  }, []);

  // Set up the auth state listener to update the loggedIn state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        setUser(user);
  
        try {
          // Retrieve the Firebase ID token
          const firebaseToken = await user.getIdToken();
          setToken(firebaseToken); // Store the Firebase token
          console.log("Firebase Token:", firebaseToken);
  
          // Exchange Firebase token for WordPress JWT
          // const wpToken = await getWPToken(firebaseToken);
          // console.log(wpToken);
          // if (wpToken) {
          //   setWpToken(wpToken); // Store the WP JWT token
          //   localStorage.setItem('wp_token', wpToken); // Store the WordPress token
          //   console.log("WordPress Token:", wpToken);
          // } else {
          //   console.error("Failed to get WordPress JWT");
          // }
        } catch (error) {
          console.error("Error retrieving tokens:", error);
        }
      } else {
        setLoggedIn(false);
        setUser(null);
        setWpToken(null);
        localStorage.removeItem('wp_token');
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  // Define light and dark themes using MUI's createTheme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2", // Customize your primary color
      },
      background: {
        default: "#ffffff", // Light mode background
        paper: "#f4f4f4", // Light paper background
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9", // Customize your primary color for dark mode
      },
      background: {
        default: "#121212", // Dark mode background
        paper: "#1d1d1d", // Dark paper background
      },
    },
  });

  // Choose theme based on darkMode state
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? 'white' : '#212121', minHeight: '100vh', }}>
        <div className="App">
          <Header loggedIn={loggedIn} />
          <Routes>
            <Route index path="/" element={<Dashboard user={user} loggedIn={loggedIn} wpToken={wpToken} setWpToken={() => setWpToken()} />} />
            <Route path="/profile" element={<Profile loggedIn={loggedIn} />} />
            <Route path="/account" element={<Account loggedIn={loggedIn} />} />
            <Route path="/blog" element={<Blog loggedIn={loggedIn} />} />
            <Route path="/login" element={<LoginPage user={user} />} />
          </Routes>
        </div>
      </Box>
    </ThemeProvider>
  );
}
