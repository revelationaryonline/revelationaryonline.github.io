import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import { Blog } from "./pages/Blog";
import LoginPage from "./pages/LoginPage";
import { Box } from "@mui/material";
import CookieConsent from "./components/CookieConsent/CookieConsent";

// Import Firebase authentication
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [wpToken, setWpToken] = useState<string | null>(Cookies.get('wpToken') || null); // Try to load WP token from localStorage

  // Initialize Firebase Auth
  const auth = getAuth();

  // Check for the user's theme preference on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);

    // Listen for changes in theme preference
    const themeChangeListener = (e: MediaQueryListEvent) => {
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
      } else {
        setLoggedIn(false);
        setUser(null);
        setWpToken(null);
        // Cookies.remove('wpToken')
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  // Define light and dark themes using MUI's createTheme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#A1A1A1", // Customize your primary color
      },
      common: {
        white: "#ffffff",
        black: "#212121",
      },
      secondary: {  
        main: "#A1A1A1", // Customize your secondary color
      },
      warning: { 
        main: "#FF0000",
      },
      background: {
        default: "#ffffff", // Light mode background
        paper: "#FFFFFF", // Light paper background
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9", // Customize your primary color for dark mode
      },
      common: {
        white: "#ffffff",
        black: "#212121",
      },
      secondary: {  
        main: "#A1A1A1", // Customize your secondary color
      },
      warning: { 
        main: "#FF0000",
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
              <Route index path="/" element={<Dashboard user={user} loggedIn={loggedIn} wpToken={wpToken} setWpToken={setWpToken} />} />
              
              <Route path="/blog" element={<Blog />} />
              <Route path="/profile" element={<Profile />} />
              
              <Route path="/settings" element={<Account loggedIn={loggedIn} />} />
              <Route path="/account" element={<Account loggedIn={loggedIn} />} />
              <Route path="/login" element={<LoginPage user={user} />} />
            </Routes>
            <CookieConsent />
        </div>
      </Box>
    </ThemeProvider>
  );
}
