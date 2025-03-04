import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import { PhotoCamera, Save } from "@mui/icons-material";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { auth } from "../firebase";
import {
  updateWordPressProfile,
  updateWordPressUserMeta,
  uploadProfileImage,
} from "../services/wordpress";
import Circle from "@mui/icons-material/Circle";
import { optimizeImage } from "../utils/imageUtils";
import { UserAvatar } from "../components/UserAvatar/UserAvatar";

const BIBLE_VERSIONS = [
  { value: "KJV", label: "King James Version" },
  { value: "NIV", label: "New International Version" },
  { value: "ESV", label: "English Standard Version" },
  { value: "NASB", label: "New American Standard Bible" },
];

function ProfileContent({ loggedIn, user, setUser }: { loggedIn: boolean, user: any, setUser: any }) {
  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile Fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  // const [bibleVersion, setBibleVersion] = useState("KJV");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser)
        setUser(currentUser);
        setDisplayName(currentUser?.displayName || "");
        setEmail(currentUser?.email || "");
        setPhotoURL(currentUser?.photoURL || "");

        // Load WordPress preferences
        const userId = Cookies.get("userId");
        if (userId) {
          loadWordPressPreferences(parseInt(userId));
          setImageLoading(false);
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const loadWordPressPreferences = async (userId: number) => {
    try {
      const wpUser = await fetch(
        `${process.env.REACT_APP_WP_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `JWT ${Cookies.get("wpToken")}`,
          },
        }
      ).then((res) => res.json());

      if (wpUser.meta) {
        // setBibleVersion(wpUser.meta.preferred_bible_version || "KJV");
        // setBio(wpUser.description || "");
        console.log(wpUser)
      }
    } catch (error) {
      console.error("Failed to load WordPress preferences:", error);
    } finally {
      setImageLoading(false);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update WordPress profile
      const userId = Cookies.get("userId");
      if (userId) {
        await updateWordPressProfile(parseInt(userId), {
          description: bio,
        });

        await updateWordPressUserMeta(parseInt(userId), {
          preferred_bible_version: "KJV"
        });
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
          alignItems: "flex-start",
        }}
      >
        <Container maxWidth="md" sx={{ mt: 14, mb: 4 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: "background.paper",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
                  : "0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.04), 0px 1px 18px 0px rgba(0,0,0,0.02)",
            }}
          >
            <Grid container spacing={4}>
              {/* Profile Header */}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mb: 3, flexDirection: "column", alignItems: "flex-start" }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 400,
                      maxHeight: 360,
                      bgcolor: "background.transparent",
                      marginTop: "0rem",
                      float: "left",
                      display: "flex"
                    }}
                  >
                    <Box alignItems="flex-start">
                      <Box sx={{ position: 'relative' }}>
                        <UserAvatar user={user} size={96} />
                      </Box>
                    </Box>
                      <div style={{ borderRadius: 0 }}>
                        <Typography
                          sx={{
                            marginLeft: 2,
                            mt: 1,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "white",
                          }}
                        >
                          {user?.displayName}
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: 2,
                            mt: -1,
                            fontSize: "0.65rem",
                            fontWeight: 400,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Circle sx={{ width: 10 }} htmlColor={"#02b548"} />
                          &nbsp;Active
                        </Typography>
                      </div>
                  </Box>
                  <Button
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      left: 110,
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#000",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "secondary.main",
                      },
                      boxShadow: 2,
                    }}
                  >
                    <PhotoCamera />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setImageLoading(true);
                            
                            // Validate file size
                            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                              throw new Error('Image size should be less than 5MB');
                            }

                            // Optimize image before upload
                            const optimizedFile = await optimizeImage(file, {
                              maxWidth: 400,
                              maxHeight: 400,
                              quality: 0.8
                            });

                            // Upload to WordPress and get permanent URL
                            const permanentUrl = await uploadProfileImage(optimizedFile);
                            setPhotoURL(permanentUrl);
                            
                            // Update Firebase profile immediately
                            if (user) {
                              await updateProfile(user, { photoURL: permanentUrl });
                            }
                          } catch (error) {
                            console.error('Failed to upload image:', error);
                            setMessage({
                              type: "error",
                              text: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
                            });
                          } finally {
                            setImageLoading(false);
                          }
                        }
                      }}
                    />
                  </Button>
                </Box>
              </Grid>

              {/* Basic Info */}
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  fullWidth
                  label="Display Name"
                  value={user?.displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  disabled
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-disabled": {
                        backgroundColor: "action.disabledBackground",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  multiline
                  rows={4}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Study Preferences */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>Study Preferences</Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Preferred Bible Version</InputLabel>
                  <Select
                    value={"KJV"}
                    label="Preferred Bible Version"
                    // onChange={(e) => setBibleVersion(e.target.value)}
                    sx={{
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      }
                    }}
                  >
                    {BIBLE_VERSIONS.map((version) => (
                      <MenuItem key={version.value} value={version.value}>
                        {version.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Save Button */}
              <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={<Save />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                      backgroundColor: "success.main",
                    },
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.type || "info"}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function Profile({ loggedIn, user, setUser }: { loggedIn: boolean, user: any, setUser: any }) {
  return <ProfileContent loggedIn={loggedIn} user={user} setUser={setUser} />;
}
