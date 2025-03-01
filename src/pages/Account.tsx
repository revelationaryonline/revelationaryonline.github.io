import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Copyright } from "../components/Copyright/Copyright";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import Switch from "@mui/material/Switch";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { mdTheme } from "../utils/misc";

function AccountContent({ loggedIn }: { loggedIn: boolean }) {
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
                        color="text.primary"
                      >
                        ACCOUNT
                      </Typography>
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
                                {" — Studying"}
                              </React.Fragment>
                            }
                          />
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
                        CARD PAYMENTS
                      </Typography>
                      {/* Proxima Nova, Gill Sans, Europa, I */}
                      {/* TC Avant Garde Gothic, Myriad Pro, Futura PT,  */}
                      {/* Museo Sans, Recta and Helvetica */}
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
                            // onChange={handleToggle("comments")}
                            // checked={checked.indexOf("comments") !== -1}
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
                            // onChange={handleToggle("comments")}
                            // checked={checked.indexOf("comments") !== -1}
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
                            // onChange={handleToggle("search")}
                            // checked={checked.indexOf("search") !== -1}
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
                            // onChange={handleToggle("guide")}
                            // checked={checked.indexOf("guide") !== -1}
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
                            // onChange={handleToggle("links")}
                            // checked={checked.indexOf("links") !== -1}
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
            <Copyright component={"symbol"} sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Account({ loggedIn }: { loggedIn: boolean }) {
  return <AccountContent loggedIn />;
}
