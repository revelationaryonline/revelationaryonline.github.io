import React, { useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
      <IconButton
        onClick={toggleFullscreen}
        sx={{
          opacity: 0.75,
          "&.MuiIconButton-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.00)",
            opacity: 1,
          },
        }}
      >
        {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

export default FullscreenButton;