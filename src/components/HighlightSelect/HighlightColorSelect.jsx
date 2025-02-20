import React, { useState } from "react";
import { Tooltip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { HighlightAlt } from "@mui/icons-material";

const HighlightColorSelect = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffeb3b"); // Default color (yellow)

  // Color options (you can change these)
  const colorOptions = [
    { label: "Yellow", value: "#ffeb3baa" },
    { label: "Red", value: "#f44336aa" },
    { label: "Blue", value: "#2196f3aa" },
    { label: "Green", value: "#4caf50aa" },
    { label: "Purple", value: "#9c27b0aa" },
  ];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Set the CSS variable for the highlight color
    document.documentElement.style.setProperty("--highlight-color", color);
    setAnchorEl(null);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Highlight Color" fontSize="small">
        <IconButton
          onClick={openMenu}
          sx={{
            opacity: 0.75,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.00)",
              opacity: 1,
            },
          }}
        >
          <ColorLensIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        dense
      >
        {colorOptions.map((color) => (
          <MenuItem
            key={color.value}
            onClick={() => handleColorSelect(color.value)}
            sx={{
              backgroundColor: "#212121",
              backgroundColor: (theme) => theme.palette.mode === "light" ? '#FFFFFF' : '#212121"',
              color: (theme) => theme.palette.mode === "light" ? '#212121' : '#FFFFFF"',
              "&:hover": {
                backgroundColor: color.value,
              },
            }}
          >
            <ListItemIcon>
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: color.value,
                }}
              />
            </ListItemIcon>
            <ListItemText primary={color.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default HighlightColorSelect;