// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
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
import SchoolIcon from '@mui/icons-material/School';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import HighlightIcon from "@mui/icons-material/Highlight";
import CommentIcon from "@mui/icons-material/Comment";
import PaymentIcon from '@mui/icons-material/Payment';
import GroupsIcon from '@mui/icons-material/Groups';
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
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import SignOutDialog from "./modals/SignOutDialog";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import Home from "@mui/icons-material/Home";
import Article from "@mui/icons-material/Article";
import Login from "@mui/icons-material/Login";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import logo from "../../assets/logo512.png";

const drawerWidth = 240;

interface HeaderProps {
  window?: () => Window;
  loggedIn: boolean;
  isDarkMode: boolean;
}

// Tutorial video interface
interface TutorialVideo {
  id: string;
  title: string;
  videoUrl: string;
}

function Header(props: HeaderProps) {
  const { window, loggedIn, isDarkMode } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const navigate = useNavigate();

  const theme = useTheme();
  
  // Tutorial videos data
  const tutorialVideos: Record<string, TutorialVideo> = {
    search: {
      id: "search",
      title: "Search Bar Tutorial",
      videoUrl: "https://www.youtube.com/embed/rWVsOgPyOXk"    
    },
    highlighting: {
      id: "highlighting",
      title: "Verse Highlighting Tutorial",
      videoUrl: "https://www.youtube.com/embed/uwCpuIvyo_o"
    },
    comments: {
      id: "comments",
      title: "Comments Tutorial",
      videoUrl: "https://www.youtube.com/embed/GMoU7B7v454"
    }
  };
  
  // Function to handle tutorial click
  const handleTutorialClick = (videoId: string) => {
    setSelectedVideo(videoId);
    setVideoModalOpen(true);
    // Don't close the drawer when showing video modal
  };

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
    <Box
      sx={{
        textAlign: "center",
        background: (theme) =>
          theme.palette.mode === "light" ? "#FFF" : "#212121",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ my: 5, ml: 4 }}>
        <img
          src={logo}
          alt="revelationary"
          style={{
            width: "20px",
            height: "20px",
            marginTop: "7px",
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
            marginTop: "3.5px",
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
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", p: 2, gap: 1 }}>
        <Accordion 
          disableGutters 
          elevation={0}
          sx={{ 
            background: 'transparent',
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="tutorials-content"
            id="tutorials-header"
            sx={{ 
              padding: 0,
              margin: 0,
              minHeight: '40px',
              '& .MuiAccordionSummary-content': {
                margin: '4px 0',
                alignItems: 'center'
              }
            }}
          >
            <Box display="flex" alignItems="center" sx={{ ml: 1, py: 0.5 }}>
              <SchoolIcon fontSize="small" sx={{ mr: 2 }} />
              <Typography variant="body1" sx={{ fontSize: '15px' }}>Tutorials</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0 0 0 16px' }}>
            <Box display="flex" flexDirection="column" gap={1}>
              <MenuItem onClick={() => handleTutorialClick('search')} sx={{ pl: 2, fontSize: '16px', color: '#A1A1A1' }}>
                <SearchIcon fontSize="small" sx={{ width: 20, height: 20, mr: 1, color: '#A1A1A1' }} /> 
                <Typography variant="body1" sx={{ fontSize: '15px' }}>Search</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleTutorialClick('highlighting')} sx={{ pl: 2, fontSize: '16px', color: '#A1A1A1' }}>
                <BorderColorIcon fontSize="small" sx={{ width: 18, height: 18, mt: -1, mr: 1, color: '#A1A1A1' }} /> 
                <Typography variant="body1" sx={{ fontSize: '15px' }}>Verse Highlighting</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleTutorialClick('comments')} sx={{ pl: 2, fontSize: '16px', color: '#A1A1A1' }}>
                <CommentIcon fontSize="small" sx={{ width: 20, height: 20, mr: 1, color: '#A1A1A1' }} /> 
                <Typography variant="body1" sx={{ fontSize: '15px' }}>Comments</Typography>
              </MenuItem>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion 
          disableGutters 
          elevation={0}
          sx={{ 
            background: 'transparent',
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="donate-content"
            id="donate-header"
            sx={{ 
              padding: 0,
              margin: 0,
              minHeight: '40px',
              '& .MuiAccordionSummary-content': {
                margin: '4px 0',
                alignItems: 'center'
              }
            }}
          >
            <Box display="flex" alignItems="center" sx={{ ml: 1, py: 0.5 }}>
              <VolunteerActivismIcon fontSize="small" sx={{ mr: 2 }} />
              <Typography variant="body1" sx={{ fontSize: '15px' }}>Donate</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0 0 0 16px' }}>
            <Box display="flex" flexDirection="column" gap={1}>
              <MenuItem component="a" href="https://www.paypal.com/donate/?hosted_button_id=TZNQ4G8SPBAK6" target="_blank" rel="noopener noreferrer" sx={{ pl: 2, fontSize: '16px', color: '#A1A1A1' }}>
                <PaymentIcon fontSize="small" sx={{ mt: 0.5, mr: 2, color: '#A1A1A1' }} /> 
                <Typography variant="body1" sx={{ fontSize: '15px' }}>PayPal</Typography>
              </MenuItem>
              <MenuItem component="a" href="https://gofundme.com/f/revelationary" target="_blank" rel="noopener noreferrer" sx={{ pl: 2, fontSize: '16px', color: '#A1A1A1' }}>
                <GroupsIcon sx={{ mt: -0.5, mr: 2, color: '#A1A1A1' }} />
                <Typography variant="body1" sx={{ fontSize: '15px' }}>Go Fund</Typography>
              </MenuItem>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* <Divider /> */}
        {/* <MenuItem component={RouterLink} to="/blog" onClick={handleDrawerToggle}>
          <Article sx={{ mr: 2 }} /> Blog
        </MenuItem> */}
        {/* Regular menu items here */}
      </Box>
      
      {/* Spacer to push sign in/out to the bottom */}
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Sign In/Out section at the bottom */}
      <Box sx={{ mb: 3 }}>
        {loggedIn ? (
          <>
            {/* <MenuItem component={RouterLink} to="/profile" onClick={handleDrawerToggle}>
              <Person sx={{ mr: 2 }} /> Profile
            </MenuItem>
            <MenuItem component={RouterLink} to="/account" onClick={handleDrawerToggle}>
              <Settings sx={{ mr: 2 }} /> Settings
            </MenuItem> */}
            <MenuItem onClick={() => {
              setSignOutDialogOpen(true);
              handleDrawerToggle();
            }}>
              <Logout fontSize="small" sx={{ mr: 2 }} /> 
              <Typography variant="body1" sx={{ fontSize: '15px' }}>Sign Out</Typography>
            </MenuItem>
          </>
        ) : (
          <MenuItem component={RouterLink} to="/login">
            <Login fontSize="small" sx={{ mr: 1 }} /> 
            <Typography variant="body1" sx={{ fontSize: '15px' }}>Sign In</Typography>
          </MenuItem>
        )}
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
              sx={{
                mr: 2,
                display: { sm: "block" },
                mt: { xs: 0, sm: 0 },
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.00)",
                  opacity: 1,
                },
              }}
            >
              <MenuIcon
                sx={{
                  mt: 1.15,
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
                    marginTop: "7px",
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
                    marginTop: "3.5px",
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
                  backgroundColor: "#212121AA", //transparent background overlay
                  borderRadius: 0,
                  "& ul": {
                    "&.MuiList-root": {
                      "&.MuiList-padding": {
                        "&.MuiMenu-list": {
                          background: (theme) =>
                            theme.palette.mode === "dark" ? "#212121" : "#FFF",
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
                            color: (theme) =>
                              theme.palette.mode === "light" ? "#212121" : "#FFF",
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
                            color: (theme) =>
                              theme.palette.mode === "light" ? "#212121" : "#FFF",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Circle sx={{ width: 10 }} htmlColor={"#02b548"} />
                          &nbsp;&nbsp;Active
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
                      &nbsp;&nbsp; Blog
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
                      sx={{ paddingY: 0, color: "#A1A1A1" }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <PersonOutline fontSize="small" sx={{ color: "#888" }} />
                      &nbsp;&nbsp; Profile
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/account"
                      sx={{ paddingY: 1, color: "#A1A1A1" }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <SettingsOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp; Account Settings
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
                      sx={{ paddingY: 1, color: "#A1A1A1" }}
                      onClick={handleCloseUserMenu}
                      dense
                    >
                      <MenuBookOutlined
                        fontSize="small"
                        sx={{ color: "#888" }}
                      />
                      &nbsp;&nbsp; KJV Bible
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
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <SignOutDialog
        open={signOutDialogOpen}
        onClose={() => setSignOutDialogOpen(false)}
        onConfirm={() => {
          auth.signOut();
          setSignOutDialogOpen(false);
          navigate("/login");
        }}
      />
      
      {/* Tutorial Video Modal */}
      <Dialog
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedVideo && (
            <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                src={tutorialVideos[selectedVideo]?.videoUrl}
                title={tutorialVideos[selectedVideo]?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Header;
