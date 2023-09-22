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
import AnchorIcon from "@mui/icons-material/Anchor";

const TopToolbar = ({ handleColumns, handleFontSize, handleViewBookmark }) => {
  return (
    <Toolbar sx={{ marginBottom: 2 }}>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Tooltip title="Bookmarks">
          <IconButton
            onClick={() =>
              handleViewBookmark(
                "this will be somekind of re-direct to a bookmarks modal / page"
              )
            }
          >
            <BookmarkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="All Links">
          <IconButton>
            <AccountTreeIcon />
          </IconButton>
        </Tooltip>
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
        <Tooltip title="Anchor">
          <IconButton
            onClick={() =>
              handleViewBookmark(
                "this will be somekind of place saver that can jump to a specific saved section"
              )
            }
          >
            <AnchorIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </Toolbar>
  );
};

export default TopToolbar;
