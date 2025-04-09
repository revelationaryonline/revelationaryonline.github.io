import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { HighlightAlt } from "@mui/icons-material";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const HighlightColorSelect = ({ loggedIn } : { loggedIn: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedColor, setSelectedColor] = useState("#ffeb3b"); // Default color (yellow)
  
  // Color options (you can change these)
  const colorOptions = [
    { label: "Yellow", value: "#ffff00" },
    { label: "Red", value: "#f44336" },
    { label: "Blue", value: "#2196f3" },
    { label: "Green", value: "#4caf50" },
    { label: "Purple", value: "#9c27b0" },
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Set the CSS variable for the highlight color
    document.documentElement.style.setProperty("--highlight-color", color);
    setAnchorEl(null);
  };

  interface ColorOption {
    label: string;
    value: string;
  }

  interface HighlightColorSelectProps {
    loggedIn: boolean;
  }

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Highlight Color">
        <span>
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
          {/* <ColorLensIcon /> */}
          <BorderColorIcon
            sx={{
              width: "22px",
              height: "22px",
              marginTop: "2px",
            }}
            fontSize={"small"}
          />
        </IconButton>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        
      >
        {colorOptions.map((color) => (
          <MenuItem
            key={color.value}
            onClick={() => handleColorSelect(color.value)}
            dense
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : '#212121"',
              color: (theme) =>
                theme.palette.mode === "light" ? "#212121" : '#FFFFFF"',
              "&:hover": {
                // backgroundColor: color.value,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              },
            }}
          >
            <ListItemIcon>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: color.value,
                  backgroundBlendMode: "normal",
                }}
              />
            </ListItemIcon>
            <ListItemText
              disableTypography
              sx={{
                fontSize: "14px",
              }}
              primary={color.label}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default HighlightColorSelect;
