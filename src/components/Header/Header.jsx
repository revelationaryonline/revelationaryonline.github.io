import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";
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

const drawerWidth = 240;

function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null); // State to manage the logged-in user
  const navigate = useNavigate();

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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" component="div" sx={{ my: 5 }}>
        revelationary
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: "#212121" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "cardo",
              fontWeight: 600,
              fontStyle: "bold",
              letterSpacing: "1.65px",
            }}
          >
            revelationary
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
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
              sx={{ mt: "45px" }}
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
                <>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link to="/profile">Profile</Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link to="/settings">Settings</Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      auth.signOut();
                      handleCloseUserMenu();
                      navigate('/login')
                    }}
                  >
                    Logout
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link to="/login">Login</Link>
                </MenuItem>
              )}
            </Menu>
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
            display: { xs: "block", sm: "none" },
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
