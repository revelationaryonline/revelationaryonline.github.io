import { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { capitalise } from "../../utils/misc";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const settings = [ "account", "dashboard"];
const drawerWidth = 240;
const navItems = ["About", "Contact", "Settings", "Privacy Policy"];

function Header(props) {
  
  const isAuthenticated = true
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const container = window !== undefined ? () => window().document.body : undefined;

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
      <Typography
        variant="h6"
        component="div"
        sx={{
          my: 5,
          flexGrow: 1,
          fontFamily: "cardo",
          fontWeight: 600,
          fontStyle: "bold",
          letterSpacing: "1.65px",
          lineHeight: "1.25px",
        }}
      >
        revelationary
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center", backgroundColor: '#212121' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
    
  return (
    <Box
      className="header__container"
      sx={{ display: "flex", backgroundColor: "#212121" }}
    >
      <CssBaseline />
      <AppBar
        className="Header__nav"
        component="nav"
        sx={{ background: "#212121" }}
      >
        <Toolbar
          className="Header__toolbar"
          sx={{ backgroundColor: "#212121" }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* home page if you are not logged in */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "condo",
              fontWeight: 600,
              fontStyle: "bold",
              letterSpacing: "1.65px",
              lineHeight: "1.25px",
              backgroundColor: "#212121",
            }}
          >
            revelationary
          </Typography>
          {isAuthenticated ? (
            <Box
              className="header__box"
              sx={{
                flexGrow: 0,
                marginRight: "0rem",
                backgroundColor: "#212121",
              }}
            >
              <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                  <PermIdentityIcon sx={{ color: "#FFFFFF" }} />
                </IconButton>
              </Tooltip>
              <Menu
                className="header__menu"
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
                {settings.map((setting) => (
                  <MenuItem
                    className="header__link"
                    sx={{ backgroundColor: "#FFF", color: '#212121', p: "5px" }}
                    key={setting}
                    onClick={handleCloseUserMenu}
                  >
                    <Link to={setting}>
                      <Typography textAlign="center">
                        {capitalise(setting)}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box
              className="header__box"
              sx={{ flexGrow: 0, marginRight: "1rem" }}
            >
              <Tooltip title="Login">
                <IconButton sx={{ p: 2 }}>
                  <PersonIcon sx={{ color: "#FFFFFF" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Register">
                <IconButton sx={{ p: 0 }}>
                  <PersonAddIcon sx={{ color: "#FFFFFF" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        className="header__secondary__nav"
        component="nav"
        sx={{ padding: 3 }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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
      <Box component="main">
        <Typography>
          {/* Alerts here Alerts here Alerts here Alerts here Alerts here Alerts */}
        </Typography>
      </Box>
    </Box>
  );
}

export default Header;
