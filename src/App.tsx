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
import SubscribePage from "./pages/SubscribePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCanceledPage from "./pages/PaymentCanceledPage";
import { Box } from "@mui/material";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { TourProvider } from "./components/Tour";

// Import Firebase authentication
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Footer from "./components/Footer/Footer";

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [wpToken, setWpToken] = useState<string | null>(Cookies.get('wpToken') || null); // Try to load WP token from localStorage

  // Initialize Firebase Auth
  const auth = getAuth();

  // Check for the user's theme preference on initial load
  useEffect(() => {
    // First check if there's a saved preference in localStorage
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      // Use saved preference if available
      setDarkMode(savedTheme === 'true');
    } else {
      // If no saved preference, use dark mode by default instead of system preference
      setDarkMode(true);
      
      // Save the default preference
      localStorage.setItem('darkMode', 'true');
    }

    // Listen for changes in system theme preference (optional)
    const themeChangeListener = (e: MediaQueryListEvent) => {
      // Only change theme based on system if no explicit user preference is saved
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
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
        // console.log(user)
        setUser(user);
      } else {
        setLoggedIn(false);
        setUser(null);
        setWpToken(null); 
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
        main: "#FFFFFF", // Customize your primary color for dark mode
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
          <Header 
            isDarkMode={darkMode} 
            loggedIn={loggedIn} 
            toggleDarkMode={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              localStorage.setItem('darkMode', newMode.toString());
            }} 
          />
          <SubscriptionProvider>
            <Routes>
              <Route index path="/" element={<Dashboard user={user} loggedIn={loggedIn} wpToken={wpToken} setWpToken={setWpToken} />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/profile" element={<Profile user={user} setUser={setUser} loggedIn={loggedIn} />} />
              <Route path="/account" element={<Account user={user} setUser={setUser} loggedIn={loggedIn} />} />
              <Route path="/login" element={<LoginPage user={user}  />} />
              <Route path="/subscribe" element={<SubscribePage user={user} loggedIn={loggedIn} />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-canceled" element={<PaymentCanceledPage />} />
            </Routes>
            <TourProvider loggedIn={loggedIn} user={user} wpToken={wpToken} />
            <CookieConsent />
          </SubscriptionProvider>
        </div>
      </Box>
    </ThemeProvider>
  );
}
