import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Copyright } from "../components/Copyright/Copyright";
import { Circle } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { onAuthStateChanged, User } from "firebase/auth"; // Import the auth state listener and User type
import { auth } from "../firebase"; // Import your initialized Firebase auth instance

const mdTheme = createTheme({ palette: { mode: "dark" } });

interface SocialLinks {
  linkedIn: string;
  gitHub: string;
}

function ProfileContent() {
  const [user, setUser] = useState<User | null>(null); // State to manage the logged-in user
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [highlightedVerses, setHighlightedVerses] = useState<string[]>([]);
  const [bookmark, setBookmark] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("This is a placeholder bio.");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    linkedIn: "https://www.linkedin.com",
    gitHub: "https://github.com",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const highlighted = Cookies.get("highlightedVerses")
      ? JSON.parse(Cookies.get("highlightedVerses") as string)
      : [];
    const bookmarkCookie = Cookies.get("bookmark");

    setHighlightedVerses(highlighted);
    setBookmark(bookmarkCookie || null);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if authenticated, or null if logged out
    });
    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box
        sx={{ display: "flex", marginTop: "3.5rem", fontFamily: "Quicksand" }}
      >
        <CssBaseline />
        {/* sidebar */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[300]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} marginTop={15}>
                <Paper
                  sx={{
                    px: 8,
                    py: 8,
                    display: "flex",
                    width: "100%",
                    position: "relative",
                    height: "auto",
                    fontFamily: "Quicksand",
                  }}
                  elevation={4}
                >
                  <Grid container spacing={3} sx={{ textAlign: "left" }}>
                    <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                          textAlign: "left",
                          marginTop: 0,
                          display: "flex",
                        }}
                      >
                        {user && user.photoURL ? (
                          <img
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 5,
                              marginBottom: 5,
                            }}
                            alt={user.displayName || "User"}
                            src={user.photoURL}
                          />
                        ) : (
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        )}
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
                            {user && user.displayName}
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
                          {/* <Typography
                        sx={{
                          display: "block",
                          textAlign: "right",
                          width: "auto",
                        }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        NEWS FEED
                      </Typography> */}
                          {/* Proxima Nova, Gill Sans, Europa, I */}
                          {/* TC Avant Garde Gothic, Myriad Pro, Futura PT,  */}
                          {/* Museo Sans, Recta and Helvetica */}
                          {/* <List
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          maxHeight: 360,
                          bgcolor: "background.transparent",
                          overflow: "scroll",
                          marginTop: "1rem",
                          float: "right",
                        }}
                      >
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Remy Sharp"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — I'll be in your neighborhood doing errands this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="John Dee"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="John Dee"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — I'll be in your neighborhood doing errands this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Travis Howard"
                              src="/static/images/avatar/2.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Travis Howard"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Wish I could come, but I'm out of town this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Hugh Tolkein"
                              src="/static/images/avatar/2.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Hugh Tolkein"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Wish I could come, but I'm out of town this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Cindy Baker"
                              src="/static/images/avatar/3.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Sarah Michelle"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Do you have Paris recommendations? Have you ever…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      </List> */}
                        </div>
                      </Grid>
                    </Grid>
                    {/* <Typography
                        sx={{
                          display: "block",
                          textAlign: "right",
                          width: "auto",
                        }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        NEWS FEED
                      </Typography> */}
                    {/* Proxima Nova, Gill Sans, Europa, I */}
                    {/* TC Avant Garde Gothic, Myriad Pro, Futura PT,  */}
                    {/* Museo Sans, Recta and Helvetica */}
                    {/* <List
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          maxHeight: 360,
                          bgcolor: "background.transparent",
                          overflow: "scroll",
                          marginTop: "1rem",
                          float: "right",
                        }}
                      >
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Remy Sharp"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — I'll be in your neighborhood doing errands this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="John Dee"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="John Dee"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — I'll be in your neighborhood doing errands this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Travis Howard"
                              src="/static/images/avatar/2.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Travis Howard"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Wish I could come, but I'm out of town this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Hugh Tolkein"
                              src="/static/images/avatar/2.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Hugh Tolkein"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Wish I could come, but I'm out of town this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Cindy Baker"
                              src="/static/images/avatar/3.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Sarah Michelle"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Do you have Paris recommendations? Have you ever…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      </List> */}
                    <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                      {/* <Typography
                        sx={{
                          display: "block",
                          textAlign: "right",
                          width: "auto",
                        }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        NEWS FEED
                      </Typography> */}
                      {/* Proxima Nova, Gill Sans, Europa, I */}
                      {/* TC Avant Garde Gothic, Myriad Pro, Futura PT,  */}
                      {/* Museo Sans, Recta and Helvetica */}
                      {/* <List
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          maxHeight: 360,
                          bgcolor: "background.transparent",
                          overflow: "scroll",
                          marginTop: "1rem",
                          float: "right",
                        }}
                      >
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Remy Sharp"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — I'll be in your neighborhood doing errands this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="John Dee"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="John Dee"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — I'll be in your neighborhood doing errands this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Travis Howard"
                              src="/static/images/avatar/2.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Travis Howard"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Wish I could come, but I'm out of town this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Hugh Tolkein"
                              src="/static/images/avatar/2.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Hugh Tolkein"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Wish I could come, but I'm out of town this…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Cindy Baker"
                              src="/static/images/avatar/3.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Sarah Michelle"
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Status
                                </Typography>
                                {
                                  " — Do you have Paris recommendations? Have you ever…"
                                }
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      </List> */}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper
                  sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  elevation={4}
                ></Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Profile() {
  return <ProfileContent />;
}
