import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import Switch from "@mui/material/Switch";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Circle from "@mui/icons-material/Circle";
import PersonIcon from "@mui/icons-material/Person";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase"; // Import your initialized Firebase auth instance
import { mdTheme } from "../utils/misc";
import { Copyright } from "../components/Copyright/Copyright";

function AccountContent({ loggedIn, user, setUser }: { loggedIn: boolean, user: any, setUser: any }) {
  // const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", marginTop: "15px", fontFamily: "Quicksand" }}>
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
              <Grid item xs={12}>
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
                      {/* user api */}
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: "auto",
                          maxHeight: 360,
                          bgcolor: "background.transparent",
                          marginTop: "1rem",
                          float: "left",
                        }}
                      >
                        <ListItem alignItems="flex-start">
                          {user && user?.photoURL ? (
                            <img
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 5,
                                marginBottom: 5,
                              }}
                              alt={user?.displayName || "User"}
                              src={user?.photoURL}
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
                              <Circle
                                sx={{ width: 10 }}
                                htmlColor={"#02b548"}
                              />
                              &nbsp;Active
                            </Typography>
                          </div>
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          display: "block",
                          textAlign: "right",
                          width: "auto",
                        }}
                        component="span"
                        color="text.primary"
                      >
                        SUBSCRIPTIONS
                      </Typography>
                      <List
                        sx={{
                          marginTop: "1rem",
                          width: "100%",
                          maxWidth: "80%",
                          bgcolor: "background.transparent",
                          float: "right",
                        }}
                        subheader={
                          <ListSubheader sx={{ background: "none" }}>
                            Saved Cards
                          </ListSubheader>
                        }
                      >
                        <ListItem>
                          <ListItemIcon>{/* <CommentIcon /> */}</ListItemIcon>
                          <ListItemText
                            id="switch-list-label-default-payment"
                            primary="MasterCard"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("default-payment")}
                            checked={checked.indexOf("default-payment") !== -1}
                            inputProps={{
                              "aria-labelledby":
                                "switch-list-label-default-payment",
                            }}
                          />
                        </ListItem>
                      </List>
                      <List
                        sx={{
                          marginTop: "1rem",
                          width: "100%",
                          maxWidth: "80%",
                          bgcolor: "background.transparent",
                          float: "right",
                        }}
                        subheader={
                          <ListSubheader sx={{ background: "none" }}>
                            Settings
                          </ListSubheader>
                        }
                      >
                        <ListItem>
                          <ListItemIcon>{/* <CommentIcon /> */}</ListItemIcon>
                          <ListItemText
                            id="switch-list-label-comments"
                            primary="Auto Renew"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("comments")}
                            checked={checked.indexOf("comments") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-comments",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>{/* <SearchIcon /> */}</ListItemIcon>
                          <ListItemText
                            id="switch-list-label-search"
                            primary="Pause Membership"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("search")}
                            checked={checked.indexOf("search") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-search",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            {/* <HelpCenterIcon /> */}
                          </ListItemIcon>
                          <ListItemText
                            id="switch-list-label-guide"
                            primary="Freemium"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("guide")}
                            checked={checked.indexOf("guide") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-guide",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            {/* <InsertLinkIcon /> */}
                          </ListItemIcon>
                          <ListItemText
                            id="switch-list-label-links"
                            primary="Public Account"
                          />
                          <Switch
                            edge="end"
                            color="default"
                            onChange={handleToggle("links")}
                            checked={checked.indexOf("links") !== -1}
                            inputProps={{
                              "aria-labelledby": "switch-list-label-links",
                            }}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Recent Orders */}
              <Grid item xs={12} md={12}>
                <Paper
                  sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  elevation={4}
                >
                  DELETE ACCOUNT
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Account({ loggedIn, user, setUser }: { loggedIn: boolean, user: any, setUser: any }) {
  return <AccountContent loggedIn={loggedIn} user={user} setUser={setUser} />;
}
