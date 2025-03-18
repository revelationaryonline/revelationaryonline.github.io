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
  Tooltip,
} from "@mui/material";
import { PhotoCamera, Save } from "@mui/icons-material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
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
import Footer from "../components/Footer/Footer";
import useHighlight from "../hooks/useHighlight";

const BIBLE_VERSIONS = [
  { value: "KJV", label: "King James Version" },
  { value: "NIV", label: "New International Version" },
  { value: "ESV", label: "English Standard Version" },
  { value: "NASB", label: "New American Standard Bible" },
];

function ProfileContent({
  loggedIn,
  user,
  setUser,
}: {
  loggedIn: boolean;
  user: any;
  setUser: any;
}) {
  // Add inside the component
  const { highlightedVerses } = useHighlight();
  const [comments, setComments] = useState<any[]>([]);
  
  // Function to delete a comment
  const deleteComment = async (commentId: number) => {
    try {
      // Verify user is logged in
      if (!Cookies.get("userId")) {
        alert("You need to be logged in to delete comments.");
        return;
      }

      // Show confirmation dialog
      if (!window.confirm("Are you sure you want to delete this comment?")) {
        return;
      }

      // Get admin credentials from environment variables
      const username = process.env.REACT_APP_WP_USERNAME;
      const password = process.env.REACT_APP_WP_APP_PASSWORD;
      
      // Create base64 encoded credentials for Basic Auth
      const credentials = btoa(`${username}:${password}`);
      
      // Use admin credentials to delete the comment
      const response = await fetch(
        `${process.env.REACT_APP_WP_API_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete comment:", errorText);
        alert("Failed to delete comment. Please try again later.");
        return;
      }

      // Remove the deleted comment from state
      setComments(comments.filter(c => c.id !== commentId));
      alert("Comment deleted successfully.");
      
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment.");
    }
  };

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
        console.log(currentUser);
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

  // Helper function to transform slug to verse reference
  const transformSlugToVerse = (slug: string) => {
    if (!slug) return "Unknown Verse";

    // Expected format: book-chapter-verse or similar
    const parts = slug.split("-");

    if (parts.length < 2) return slug; // Not a verse format

    // Extract book, chapter, and verse
    let book = parts[0];
    // Capitalize first letter of book
    book = book.charAt(0).toUpperCase() + book.slice(1);

    // Handle chapter and verse
    // For formats like genesis-11 (chapter only)
    if (parts.length === 2) {
      return `${book} ${parts[1]}:1`;
    }
    // For formats like genesis-1-1 (chapter and verse)
    else if (parts.length >= 3) {
      return `${book} ${parts[1]}:${parts[2]}`;
    }

    return slug;
  };

  // Add inside useEffect or as a separate function
  const fetchUserComments = async () => {
    try {
      const userId = Cookies.get("userId");
      if (userId && Cookies.get("wpToken")) {
        // Instead of filtering by author parameter, get all comments and filter client-side
        const response = await fetch(
          `${process.env.REACT_APP_WP_API_URL}/comments?_embed=true`,
          {
            headers: {
              Authorization: `JWT ${Cookies.get("wpToken")}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch comments:", await response.text());
          return;
        }

        const allComments = await response.json();

        console.log(allComments)

        // Filter comments by the current user
        const userComments = allComments
          .filter((comment: any) => {
            return comment.author === parseInt(userId);
          })
          .map((comment: any) => {
            // Add transformed verse reference if available
            if (comment.post) {
              const postSlug =
                comment._embedded?.post?.[0]?.slug || comment.post_name || "";
              comment.verseReference = transformSlugToVerse(postSlug);
            }
            return comment;
          });

        setComments(userComments);
      }
    } catch (error) {
      console.error("Failed to fetch user comments:", error);
    }
  };

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
        console.log(wpUser);
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
          preferred_bible_version: "KJV",
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

  // Call this in useEffect after loading WordPress preferences
  useEffect(() => {
    const userId = Cookies.get("userId");
    // Existing code...
    if (userId) {
      loadWordPressPreferences(parseInt(userId));
      fetchUserComments();
      setImageLoading(false);
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#212121" : "#FFFFFF",
            alignItems: "flex-start",
          }}
        >
          <Container maxWidth="md" sx={{ mt: 14, mb: 4 }}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#212121" : "#FFF",
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
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
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
                        display: "flex",
                      }}
                    >
                      <Box alignItems="flex-start">
                        <Box sx={{ position: "relative" }}>
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
                            color: (theme) =>
                              theme.palette.mode === "dark" ? "#A1A1A1" : "#000000",
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
                    {/* <Button
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
                  </Button> */}
                  </Box>
                </Grid>

                {/* Basic Info */}
                <Grid item xs={12} md={12}>
                  <TextField
                    disabled
                    fullWidth
                    value={user?.displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    sx={{
                      mb: 3,
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
                    fullWidth
                    value={user?.email}
                    disabled
                    sx={{
                      mb: 3,
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
                  {/* <TextField
                  fullWidth
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  multiline
                  rows={4}
                  sx={{
                    mb: 3,
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
                /> */}
                </Grid>

                {/* Study Preferences */}
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "text.primary" }}
                  >
                    Study Preferences
                  </Typography>
                  <Tooltip title="More versions soon !">
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Preferred Bible Version</InputLabel>
                      <Select
                        disabled
                        value={"KJV"}
                        label="Preferred Bible Version"
                        // onChange={(e) => setBibleVersion(e.target.value)}
                        sx={{
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        {BIBLE_VERSIONS.map((version) => (
                          <MenuItem key={version.value} value={version.value}>
                            {version.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Tooltip>
                </Grid>
                {/* Highlighted Verses Stats */}
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, mt: 3, color: "text.primary" }}
                  >
                    Your Highlights
                  </Typography>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BorderColorIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        You have highlighted{" "}
                        <strong>{highlightedVerses?.length || 0}</strong> verses
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>



                {/* User Comments */}
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, mt: 3, color: "text.primary" }}
                  >
                    Your Comments
                  </Typography>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#212121" : "#FFFFFF",
                      maxHeight: 300,
                      overflow: "auto",
                    }}
                  >
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <Box
                          key={comment.id}
                          sx={{
                            mb: 2,
                            pb: 2,
                            borderBottom: 1,
                            borderColor: "divider",
                            position: "relative",
                          }}
                        >
                          <IconButton
                            size="small"
                            aria-label="delete comment"
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              color: "text.secondary",
                            }}
                            onClick={() => deleteComment(comment.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold", pr: 4 }}
                          >
                            {new Date(comment.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  comment.content?.rendered ||
                                  comment.content ||
                                  "",
                              }}
                            />
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              mt: 1,
                              display: "block",
                            }}
                          >
                            On:{" "}
                            {comment._embedded?.up?.[0]?.title?.rendered ||
                              "Unknown Verse"}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        You haven't made any comments yet.
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Save Button */}
                <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                  {/* <Button
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
                </Button> */}
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
      <Footer />
    </>
  );
}

export default function Profile({
  loggedIn,
  user,
  setUser,
}: {
  loggedIn: boolean;
  user: any;
  setUser: any;
}) {
  return <ProfileContent loggedIn={loggedIn} user={user} setUser={setUser} />;
}
