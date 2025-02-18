import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import { Blog } from "./pages/Blog";
import { Footer } from './components/Footer/Footer';
import LoginPage from "./pages/LoginPage";
import { Box } from "@mui/material";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <div className="App">
        <Header loggedIn={loggedIn} />
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile loggedIn={loggedIn} />} />
          <Route path="/account" element={<Account loggedIn={loggedIn} />} />
          <Route path="/blog" element={<Blog loggedIn={loggedIn} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        {/* <Footer
          title="revelationary"
          description="A Bible Reading Web Application"
        /> */}
      </div>
      </Box>
    </ThemeProvider>
  );
}
