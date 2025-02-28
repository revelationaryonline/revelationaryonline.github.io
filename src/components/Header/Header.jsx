import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import { onAuthStateChanged } from "firebase/auth"; // Import the auth state listener
import { auth } from "../../firebase"; // Import your initialized Firebase auth instance
import {
  Book,
  Circle,
  LogoutOutlined,
  MenuBookOutlined,
  NotificationsActiveOutlined,
  NotificationsOffOutlined,
  PersonOutline,
  SettingsOutlined,
} from "@mui/icons-material";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import { Divider } from "@mui/material";

import logo from "../../assets/logo512.png";

const drawerWidth = 240;

function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null); // State to manage the logged-in user
  const navigate = useNavigate();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const container =
    window !== undefined ? () => window().document.body : undefined;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if authenticated, or null if logged out
    });
    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        background: (theme) =>
          theme.palette.mode === "light" ? "#FFF" : "#212121",
        height: "100%",
      }}
    >
      <Typography
        variant="p"
        component="div"
        sx={{
          my: 5,
          flexGrow: 1,
          fontFamily: "cardo",
          fontWeight: 600,
          fontStyle: "bold",
          letterSpacing: "1.65px",
          color: (theme) =>
            theme.palette.mode === "light" ? "#212121" : "#FFF",
          background: (theme) =>
            theme.palette.mode === "light" ? "#FFF" : "#212121",
        }}
      >
        revelationary
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: "#212121" }}>
        <Toolbar
          sx={{
            background: (theme) =>
              theme.palette.mode === "light" ? "#FFF" : "#212121",
          }}
        >
          <Tooltip title="Menu" fontSize={"small"}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "block" }, mt: { xs: 0, sm: 0 }, 
              '&.MuiIconButton-root:hover':{
                backgroundColor: 'rgba(0, 0, 0, 0.00)',
                opacity:1
              }
            }}
            >
              <MenuIcon
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#a1a1a1" : "#FFF",
                }}
              />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box display={"flex"} flexDirection={"row"}>
              <img
                src={logo}
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: '7px',
                  marginRight: 10,
                  marginLeft: 10,
                  filter: isDarkMode ? "invert(1)" : "none",
                }}
              ></img>
              <Typography
                variant="p"
                component="div"
                sx={{
                  textAlign: { xs: "center", sm: "left" },
                  marginTop: '3.5px',
                  flexGrow: 1,
                  fontFamily: "cardo",
                  fontWeight: 600,
                  fontStyle: "bold",
                  letterSpacing: "1.65px",
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#FFF",
                }}
              >
                revelationary
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 0, borderRadius: 0 }}>
              <Tooltip title={user && user.displayName}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user && user.photoURL ? (
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      alt={user.displayName || "User"}
                      src={user.photoURL}
                    />
                  ) : (
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  // mt: "45px",
                  backgroundColor: "#212121AA",
                  borderRadius: 0,
                  "& ul": {
                    "&.MuiList-root": {
                      "&.MuiList-padding": {
                        "&.MuiMenu-list": {
                          background: "#212121 !important",
                          borderRadius: "0px",
                        },
                      },
                    },
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {user ? (
                  <div
                    style={{
                      backgroundColor: "#212121",
                      padding: 0,
                      margin: 0,
                      borderRadius: 0,
                    }}
                  >
                    <MenuItem sx={{ paddingY: 2 }} disableTouchRipple>
                      {user.photoURL ? (
                        // console.log(user.photoURL),
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
                        // console.log(user.photoURL),
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
                          {user.displayName}
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
                    </MenuItem>
                    <MenuItem sx={{ paddingY: 2 }} dense>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          color: "#d1d1d1",
                          alignItems: "center",
                          border: "1px solid #e1e1e1",
                          padding: 1,
                          borderRadius: "7px",
                          width: "100%",
                        }}
                      >
                        Status update
                        <span style={{ fontSize: 12 }}>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <Link to={"/profile"}>Update&nbsp;</Link>
                        </span>
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      sx={{ paddingY: 0 }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <Book fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/blog">Blog</Link>
                    </MenuItem>
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <NotificationsOffOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/settings">Pause Notifications</Link>
                    </MenuItem>
                    <MenuItem
                      sx={{ paddingY: 0 }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <PersonOutline fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/profile">Profile</Link>
                    </MenuItem>
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <SettingsOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/settings">Account Settings</Link>
                    </MenuItem>
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <NotificationsActiveOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/notifications">Notification Settings</Link>
                    </MenuItem>
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <MenuBookOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/">KJV Bible</Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      sx={{ paddingY: 1, color: "#888" }}
                      onClick={() => {
                        auth.signOut();
                        handleCloseUserMenu();
                        navigate("/login");
                      }}
                      dense
                    >
                      <LogoutOutlined fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp; Sign out
                    </MenuItem>
                  </div>
                ) : (
                  <MenuItem sx={{ paddingY: 1 }} onClick={handleCloseUserMenu}>
                    <Link to="/login">Login</Link>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Header;
