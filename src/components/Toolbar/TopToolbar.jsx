import React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ButtonGroup from "@mui/material/ButtonGroup";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import RefreshIcon from "@mui/icons-material/Refresh";
import AlertDialogSlide from "../Modal/Modal";

const TopToolbar = ({ handleColumns, handleFontSize, handleViewBookmark, handleHelp }) => {
  return (
    <Toolbar sx={{ marginBottom: 2 }}>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        {/* <Tooltip title="Bookmarks">
          <IconButton
            onClick={() =>
              handleViewBookmark(
                "this will be somekind of re-direct to a bookmarks modal / page"
              )
            }
          >
            <BookmarkIcon />
          </IconButton>
        </Tooltip> */}
        {/* <Tooltip title="All Links">
          <IconButton>
            <AccountTreeIcon />
          </IconButton>
        </Tooltip> */}
        <AlertDialogSlide />
        <Tooltip title="Columns">
          <IconButton onClick={() => handleColumns(1)}>
            <VerticalSplitIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Larger Text">
          <IconButton onClick={() => handleFontSize(1)}>
            <TextIncreaseIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Smaller Text">
          <IconButton onClick={() => handleFontSize(-1)}>
            <TextDecreaseIcon />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Stack">
          <IconButton onClick={() => handleFontSize(-1)}>
            <Stack />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Refresh">
          <IconButton
            onClick={() =>
              window.location.reload()
            }
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </Toolbar>
  );
};

export default TopToolbar;
