// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
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
import SignOutDialog from './modals/SignOutDialog';
import { UserAvatar } from "../UserAvatar/UserAvatar";
import Home from "@mui/icons-material/Home";
import Article from "@mui/icons-material/Article";
import Login from "@mui/icons-material/Login";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

import logo from "../../assets/logo512.png";

const drawerWidth = 240;

interface HeaderProps {
  window?: () => Window;
  loggedIn: boolean;
}

function Header(props: HeaderProps) {
  const { window, loggedIn } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', background: (theme) => theme.palette.mode === "light" ? "#FFF" : "#212121", height: "100%" }}>
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
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 1 }}>
        <MenuItem component={RouterLink} to="/">
          <Home sx={{ mr: 1 }} /> Home
        </MenuItem>
        <MenuItem component={RouterLink} to="/blog">
          <Article sx={{ mr: 1 }} /> Blog
        </MenuItem>
        {loggedIn ? (
          <>
            <MenuItem component={RouterLink} to="/profile">
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem component={RouterLink} to="/account">
              <Settings sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={() => setSignOutDialogOpen(true)}>
              <Logout sx={{ mr: 1 }} /> Sign Out
            </MenuItem>
          </>
        ) : (
          <MenuItem component={RouterLink} to="/login">
            <Login sx={{ mr: 1 }} /> Sign In
          </MenuItem>
        )}
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

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
                  mt:1.15,
                  ml: 0.5,
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
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: isDarkMode ? "#FFF" : "#212121",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <img
                  src={logo}
                  alt="revelationary"
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
                  // variant="p"
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
            </Link>

            <Box sx={{ flexGrow: 0, borderRadius: 0 }}>
              <Tooltip title={user && user.displayName}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <UserAvatar user={user} size={32} />
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
                {loggedIn ? (
                  <div
                    style={{
                      backgroundColor: "#212121",
                      padding: 0,
                      margin: 0,
                      borderRadius: 0,
                    }}
                  >
                    <MenuItem sx={{ paddingY: 2 }} disableTouchRipple>
                      <UserAvatar user={user} size={48} />
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
                    {/* <MenuItem sx={{ paddingY: 2 }} dense>
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
                    </MenuItem> */}
                    <MenuItem
                      component={RouterLink}
                      to="/blog"
                      sx={{ paddingY: 0, color: "#A1A1A1" }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <Book fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp;
                      Blog
                    </MenuItem>
                    {/* <MenuItem
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
                    </MenuItem> */}
                    <MenuItem
                      component={RouterLink}
                      to="/profile"
                      sx={{ paddingY: 0, color: '#A1A1A1' }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <PersonOutline fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp;
                      Profile
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/account"
                      sx={{ paddingY: 1, color: '#A1A1A1' }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <SettingsOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;
                      Account Settings
                    </MenuItem>
                    {/* <MenuItem
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
                    </MenuItem> */}
                    <MenuItem
                      component={RouterLink}
                      to="/"
                      sx={{ paddingY: 1, color: '#A1A1A1' }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <MenuBookOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;
                      KJV Bible
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      sx={{ paddingY: 1, color: "#888" }}
                      onClick={() => {
                        setSignOutDialogOpen(true);
                        handleCloseUserMenu();
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
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <SignOutDialog open={signOutDialogOpen} onClose={() => setSignOutDialogOpen(false)} onConfirm={() => {
        auth.signOut();
        setSignOutDialogOpen(false);
        navigate("/login");
      }} />
    </Box>
  );
}

export default Header;
