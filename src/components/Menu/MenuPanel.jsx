import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCopy from "@mui/icons-material/ContentCopy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddLinkIcon from "@mui/icons-material/AddLink";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const MenuPanel = ({ contextMenu, setContextMenu, selectedVerse, search }) => {
  const handleClose = () => {
    setContextMenu(null);
    selectedVerse.length = 0;
  };
  // copy a verse
  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedVerse[0].text);
    await handleClose();
  };

  const handleHighlight = async () => {
    selectedVerse[0].text.style.fontWeight = 'bold'
    await handleClose();
  };

  return (
    <Menu
      elevation={0}
      open={contextMenu !== null && search === ""}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? {
              top: contextMenu?.mouseY,
              left: contextMenu?.mouseX,
            }
          : undefined
      }
    >
      <MenuList dense sx={{ width: 320, maxWidth: "100%" }}>
        <MenuItem onClick={() => handleCopy()}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘C
          </Typography>
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘S
          </Typography>
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AddLinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Link</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘L
          </Typography>
        </MenuItem> */}
        {/* <MenuItem onClick={() => handleHighlight()}>
          <ListItemIcon>
            <BorderColorIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Highlight</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘H
          </Typography>
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AttachFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Attach</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘A
          </Typography>
        </MenuItem> */}
        {/* <MenuItem onClick={() => handleShare()}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘O
          </Typography>
        </MenuItem> */}
      </MenuList>
    </Menu>
  );
};

export default MenuPanel;