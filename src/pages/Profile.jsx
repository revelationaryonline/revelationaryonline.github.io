import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Copyright } from "../components/Copyright/Copyright";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const mdTheme = createTheme({ palette: { mode: "dark" } });

function ProfileContent(route) {
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
                      <Typography
                        sx={{
                          display: "block",
                          textAlign: "left",
                          width: "auto",
                        }}
                        component="span"
                        variant="p"
                        color="text.primary"
                      >
                        USER PROFILE
                      </Typography>
                      {/* user api */}
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          display: "block",
                          textAlign: "right",
                          width: "auto",
                        }}
                        component="span"
                        variant="p"
                        color="text.primary"
                      >
                        NEWS FEED
                      </Typography>
                      {/* Proxima Nova, Gill Sans, Europa, I */}
                      {/* TC Avant Garde Gothic, Myriad Pro, Futura PT,  */}
                      {/* Museo Sans, Recta and Helvetica */}
                      <List
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
                      </List>
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
