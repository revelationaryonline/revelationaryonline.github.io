import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Slide,
  Dialog,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  useMediaQuery,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import { useTheme } from "@mui/material/styles";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import Cookies from "js-cookie";
import studyGuideImage from "../../assets/hero-post.jpg"; // Temporary - replace with study-guide-preview.jpg when available
import { CheckCircle, CheckCircleOutline } from "@mui/icons-material";
import { EventType } from "@testing-library/react";

const TEST_SITE_KEY = "6LcgGh0rAAAAAJ2LXuSIhbdhzv1636PLcKxGbni0"; // Replace with your actual site key
const DELAY = 1500;

interface BibleStudySignupProps {
  position?: "modal" | "inline" | "floating";
  onSignup?: (email: string, name: string) => void;
  delay?: number; // Delay in milliseconds before showing the modal
  forceOpen?: boolean; // For testing purposes
}

const BibleStudySignup: React.FC<BibleStudySignupProps> = ({
  position = "modal",
  onSignup,
  delay = 5000,
  forceOpen = false,
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optIn, setOptIn] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const [serverError, setServerError] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>("[empty]");
  const [captchaExpired, setCaptchaExpired] = useState(false);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCaptchaLoaded(true);
    }, DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Show modal after delay if it's a modal
  useEffect(() => {
    if (position === "modal" && !localStorage.getItem("leadMagnetShown")) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [position, delay, subscribed]);

  // For testing purposes
  useEffect(() => {
    if (forceOpen && position === "modal") {
      setOpen(true);
    }
  }, [forceOpen, position]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Remember that we've shown the lead magnet and mark as dismissed
    localStorage.setItem("leadMagnetShown", "true");

    // If user has subscribed, let's not show the popup again in the future
    if (subscribed) {
      localStorage.setItem("leadMagnetSubscribed", "true");
    }
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleNext = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setStep(2);
  };

  const validatePassword = (password: string) => {
    // Basic password validation: at least 8 characters
    return password.length >= 8;
  };

  const handleCaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
    if (value === null) {
      setCaptchaExpired(true);
    } else {
      setCaptchaExpired(false);
    }
  };

  const asyncScriptOnLoad = () => {
    console.log("reCAPTCHA script loaded");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Ensure reCAPTCHA is loaded
    if (!captchaValue || captchaValue === "[empty]") {
      alert("Please complete the CAPTCHA");
      return;
    }

    if (name.trim() === "") {
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordError("");

    setLoading(true);
    setServerError("");

    try {
      // Create a Firebase Authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Store in WordPress if available
      const WP_API_URL = process.env.REACT_APP_WP_API_URL?.replace(
        "/wp/v2",
        ""
      );

      if (WP_API_URL) {
        try {
          // Get JWT token first for WordPress authentication
          const tokenResponse = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: process.env.REACT_APP_WP_USERNAME,
              password: process.env.REACT_APP_WP_APP_PASSWORD,
            }),
          });

          const tokenData = await tokenResponse.json();

          if (!tokenResponse.ok) {
            console.error("Failed to get JWT token:", tokenData);
          } else {
            // Store the JWT token in cookies
            Cookies.set("wpToken", tokenData.token, {
              expires: 7,
              path: "/",
              secure: true,
              sameSite: "strict",
            });

            // Create WordPress user
            const createUserResponse = await fetch(
              `${WP_API_URL}/wp/v2/users`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenData.token}`,
                },
                body: JSON.stringify({
                  username:
                    email.split("@")[0] +
                    "_" +
                    Math.random().toString(36).substring(2, 6),
                  email: email,
                  first_name: name,
                  roles: ["subscriber"],
                  password: Math.random().toString(36).slice(-10),
                  meta: {
                    optin: optIn,
                    source: "bible-study-signup",
                    firebase_uid: user.uid,
                  },
                }),
              }
            );

            const wpData = await createUserResponse.json();
            if (createUserResponse.ok) {
              console.log("WordPress user created");
              Cookies.set("userId", wpData.id.toString());

              // Also store lead data if custom endpoint exists
              try {
                await fetch(`${WP_API_URL}/revelationary/v1/subscribe`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenData.token}`,
                  },
                  body: JSON.stringify({
                    email: email,
                    name: name,
                    optin: optIn,
                    source: "bible-study-signup",
                    firebaseUid: user.uid,
                  }),
                });
              } catch (subscribeError) {
                console.warn(
                  "Additional subscribe endpoint failed:",
                  subscribeError
                );
              }
            } else {
              console.error("Failed to create WordPress user:", wpData);
            }
          }
        } catch (wpError) {
          // Log but don't fail if WordPress integration fails
          console.warn(
            "WordPress integration failed, but Firebase account creation succeeded:",
            wpError
          );
        }
      }

      // Call the onSignup prop if provided
      if (onSignup) {
        onSignup(email, name);
      }

      // Mark as subscribed in local storage
      setSubscribed(true);
      localStorage.setItem("leadMagnetSubscribed", "true");

      // After 3 seconds, close the modal
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error("Error subscribing:", error);
      setServerError(
        error instanceof Error
          ? error.message
          : "Failed to subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (subscribed) {
      return (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <Typography variant="h5" gutterBottom>
            Thank you for subscribing!
          </Typography>
          <Typography variant="body1" paragraph>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (You can close this window now - just click anywhere outside of it)
          </Typography>
        </div>
      );
    }

    return (
      <>
        {step === 1 ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <SchoolIcon
                sx={{ color: "primary.main", marginRight: "0.5rem" }}
              />
              <Typography variant="h5" component="h2">
                Create a Free Account
              </Typography>
            </div>
            <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
              Unlock deeper understanding of scripture
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* 
              <div style={{ flex: 1, minWidth: isMobile ? '100%' : '45%' }}>
                <Typography variant="body2" paragraph>
                  Our Bible study guide includes:
                </Typography>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '1rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <CheckCircle sx={{ width: 20, height: 20 }} color="success" />
                    <Typography variant="body2" style={{ fontSize: 15, marginLeft: '0.5rem' }}>Daily devotionals</Typography>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <CheckCircle sx={{ width: 20, height: 20 }} color="success" />
                    <Typography variant="body2" style={{ fontSize: 15, marginLeft: '0.5rem' }}>Verse commentary</Typography>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <CheckCircle sx={{ width: 20, height: 20 }} color="success" />
                    <Typography variant="body2" style={{ fontSize: 15, marginLeft: '0.5rem' }}>Historical context</Typography>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <CheckCircle sx={{ width: 20, height: 20 }} color="success" />
                    <Typography variant="body2" style={{ fontSize: 15, marginLeft: '0.5rem' }}>Reflection questions</Typography>
                  </li>
                </ul>
                <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                  "This study guide transformed my daily devotional time!" - Sarah K.
                </Typography>
              </div> */}
              {!isMobile && (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={studyGuideImage}
                    alt="Bible Study Guide Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 180,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </div>
              )}
            </div>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              margin="normal"
              autoFocus
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              sx={{ mb: 2 }}
            >
              Subscribe
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              display="block"
            >
              We respect your privacy. Unsubscribe at any time.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Almost there!
            </Typography>
            <Typography variant="body1" paragraph>
              Please enter your name and create a password to access your free
              account
            </Typography>
            <TextField
              fullWidth
              label="Your Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Create Password (min 8 characters)"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={
                passwordError ||
                "Create a password to access your study guide later"
              }
              margin="normal"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  color="primary"
                />
              }
              label="Yes, I'd like to receive monthly news via email"
              sx={{ mb: 2 }}
            />
            {captchaLoaded && (
              <Box sx={{ my: 2 }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={TEST_SITE_KEY}
                  onChange={handleCaptchaChange}
                  asyncScriptOnLoad={asyncScriptOnLoad}
                />
              </Box>
            )}

            {serverError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {serverError}
              </Alert>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Create Account"}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setStep(1)}
              sx={{ mb: 1 }}
            >
              Back
            </Button>
          </>
        )}
      </>
    );
  };

  // For modal position
  if (position === "modal") {
    return (
      <Dialog
        open={open}
        onClose={loading ? undefined : handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: isDarkMode ? "#212121" : "#fff",
          },
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#a1a1a1",
            zIndex: 1,
          }}
        >
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, mt: 1 }}>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  // For inline position
  if (position === "inline") {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          bgcolor: isDarkMode
            ? "rgba(33, 33, 33, 0.9)"
            : "rgba(255, 255, 255, 0.9)",
        }}
      >
        {renderContent()}
      </Paper>
    );
  }

  // For floating position
  return (
    <Slide
      direction="down"
      in={
        (!localStorage.getItem("leadMagnetShown") &&
          !localStorage.getItem("leadMagnetSubscribed")) ||
        forceOpen
      }
    >
      <Paper
        elevation={4}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          p: 2,
          bgcolor: isDarkMode
            ? "rgba(33, 33, 33, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          boxShadow: 3,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 1200,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, mr: 2 }}
            ></Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleOpen}
            >
              Get Free Access
            </Button>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </Paper>
    </Slide>
  );
};

export default BibleStudySignup;
