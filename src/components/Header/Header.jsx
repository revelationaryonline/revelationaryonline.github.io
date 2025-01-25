import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Icon, listClasses } from "@mui/material";
import {
  AcUnitRounded,
  ArrowBack,
  Backspace,
  BackspaceOutlined,
  Circle,
  LogoutOutlined,
  MenuBookOutlined,
  NotificationsActiveOutlined,
  NotificationsOffOutlined,
  PersonOutline,
  SettingsOutlined,
} from "@mui/icons-material";

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
            <Tooltip title="Open menu">
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
              sx={{ mt: "45px", backgroundColor: "#212121AA" }}
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
                  style={{ backgroundColor: "#212121", padding: 0, margin: 0 }}
                >
                  <MenuItem sx={{ paddingY: 2 }}>
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
                    <div>
                      <Typography
                        sx={{
                          marginLeft: 2,
                          marginTop: 1,
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
                          marginTop: -1,
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
                      variant="body1"
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
                  <MenuItem sx={{ paddingY: 0 }} dense>
                    <MenuItem
                      sx={{ paddingY: 0 }}
                      onClick={handleCloseUserMenu}
                    >
                      <BackspaceOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/blog">Blog</Link>
                    </MenuItem>
                  </MenuItem>
                  <MenuItem
                    sx={{ paddingY: 1, borderBottom: "1px solid #333" }}
                    dense
                  >
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                    >
                      <NotificationsOffOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/settings">Pause Notifications</Link>
                    </MenuItem>
                  </MenuItem>
                  <MenuItem sx={{ paddingY: 1 }} dense>
                    <MenuItem
                      sx={{ paddingY: 0 }}
                      onClick={handleCloseUserMenu}
                    >
                      <PersonOutline fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/profile">Profile</Link>
                    </MenuItem>
                  </MenuItem>
                  <MenuItem sx={{ paddingY: 0 }} dense>
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                    >
                      <SettingsOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/settings">Account Settings</Link>
                    </MenuItem>
                  </MenuItem>
                  <MenuItem dense>
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                    >
                      <NotificationsActiveOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/notifications">Notification Settings</Link>
                    </MenuItem>
                  </MenuItem>
                  <MenuItem
                    dense
                    sx={{ borderBottom: "1px solid #333", paddingBottom: 2 }}
                  >
                    <MenuItem
                      sx={{ paddingY: 1 }}
                      onClick={handleCloseUserMenu}
                    >
                      <MenuBookOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <Link to="/">KJV Bible</Link>
                    </MenuItem>
                  </MenuItem>
                  <MenuItem dense>
                    <MenuItem
                      sx={{ paddingY: 1, color: "#888" }}
                      onClick={() => {
                        auth.signOut();
                        handleCloseUserMenu();
                        navigate("/login");
                      }}
                    >
                      <LogoutOutlined fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp; Sign out
                    </MenuItem>
                  </MenuItem>
                </div>
              ) : (
                <MenuItem sx={{ paddingY: 1 }} onClick={handleCloseUserMenu}>
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
