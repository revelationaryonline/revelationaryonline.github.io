import React from "react";
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
import CommentIcon from "@mui/icons-material/Comment";
import SearchIcon from "@mui/icons-material/Search";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import InsertLinkIcon from "@mui/icons-material/InsertLink";

import { drawerWidth } from "../../utils/constants";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    background: "#121212",
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
    <Drawer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: { xs: "0.5rem", sm: "1rem" },
        zIndex: 1,
      }}
      variant="permanent"
      open={open}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <Divider sx={{ my: 1 }} />
      </List>
      {/* Icon button tool tips in grid and search bar */}
      <List
        sx={{ width: "100%", maxWidth: 360 }}
        // subheader={<ListSubheader>Settings</ListSubheader>}
      >
        <ListItem>
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
        </ListItem>
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
            <HelpCenterIcon />
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
        <ListItem>
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
        </ListItem>
      </List>
      <Divider />
      <List component="nav">
        <Divider sx={{ my: 1, background: "#212121" }} />
      </List>
      <List></List>
    </Drawer>
  );
};
