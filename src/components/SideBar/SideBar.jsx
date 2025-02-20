import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import CommentIcon from "@mui/icons-material/Comment";
import SearchIcon from "@mui/icons-material/Search";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import InsertLinkIcon from "@mui/icons-material/InsertLink";

import { drawerWidth } from "../../utils/constants";
import { mdTheme } from "../../utils/misc";
import { HighlightAlt, MouseOutlined, PolylineOutlined, ScreenSearchDesktopSharp } from "@mui/icons-material";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[900],
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export const SideBar = ({ handleToggle, open, toggleDrawer, checked }) => {
  return (
    <ThemeProvider theme={mdTheme}>
      <Drawer
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#fff" : theme.palette.grey[900],
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: { xs: "0.5rem", sm: "1rem" },
          zIndex: 1,
          "& .MuiDrawer-paper": {
            background: (theme) =>
              theme.palette.mode === "light"
                ? "#FFF !important"
                : "#212121 !important",
          },
        }}
        variant="permanent"
        open={open}
      >
        <Toolbar
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#FFF" : theme.palette.grey[900],
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
        <Tooltip title="Side Bar">
          <IconButton onClick={toggleDrawer} sx={{
                        "&.MuiIconButton-root:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.00)",
                          opacity: 1,
                        },
          }}>
            <ChevronLeftIcon />
          </IconButton>
          </Tooltip>
        </Toolbar>
        <Divider />
        <List component="nav">
          <Divider sx={{ my: 1 }} />
        </List>
        {/* Icon button tool tips in grid and search bar */}
        <List
          sx={{
            width: "100%",
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#FFF" : theme.palette.grey[900],
          }}
          // subheader={<ListSubheader>Settings</ListSubheader>}
        >
          <ListItem>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-search" primary="Search" />
            <Switch
              edge="end"
              onChange={handleToggle("search")}
              checked={checked.indexOf("search") !== -1}
              inputProps={{
                "aria-labelledby": "switch-list-label-search",
              }}
              color="default"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {/* <PolylineOutlined />- Save this for linked verses */}
              <HighlightAlt />
            </ListItemIcon>
            <ListItemText id="switch-list-label-guide" primary="Guide" />
            <Switch
              edge="end"
              onChange={handleToggle("guide")}
              checked={checked.indexOf("guide") !== -1}
              inputProps={{
                "aria-labelledby": "switch-list-label-guide",
              }}
              color="default"
            />
          </ListItem>
          {/* <ListItem>
          <ListItemIcon>
            <CommentIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-comments" primary="Comments" />
          <Switch
            edge="end"
            onChange={handleToggle("comments")}
            checked={checked.indexOf("comments") !== -1}
            inputProps={{
              "aria-labelledby": "switch-list-label-comments",
            }}
            color="default"
          />
        </ListItem> */}
          {/* <ListItem>
          <ListItemIcon>
            <InsertLinkIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-links" primary="Links" />
          <Switch
            edge="end"
            onChange={handleToggle("links")}
            checked={checked.indexOf("links") !== -1}
            inputProps={{
              "aria-labelledby": "switch-list-label-links",
            }}
            color="default"
          />
        </ListItem> */}
        </List>
        <Divider />
        <List component="nav">
          <Divider sx={{ my: 1 }} />
        </List>
        <List></List>
      </Drawer>
    </ThemeProvider>
  );
};
