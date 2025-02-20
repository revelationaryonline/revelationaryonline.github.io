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
import { Divider, Box } from "@mui/material";
import DonateButton from "../DonateButton/DonateButton";
import FullscreenButton from "../FullScreenButton/FullScreenButton";
import HighlightColorSelect from "../HighlightSelect/HighlightColorSelect";

const TopToolbar = ({
  handleColumns,
  handleFontSize,
  handleViewBookmark,
  handleHelp,
}) => {
  const handleAddComment = () => {
    console.log("Comment");
  };

  return (
    <Toolbar sx={{ marginBottom: 2 }}>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined button group"
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <Box position={"relative"} display={"flex"}>
          {/* Help Modal */}
          <AlertDialogSlide />
          <DonateButton />
          <Divider
            orientation="vertical"
            paddingX={"1rem"}
            flexItem
            variant={"middle"}
          />
          <Tooltip title="Columns" fontSize={"small"}>
            <IconButton
              onClick={() => handleColumns(1)}
              sx={{
                opacity: 0.75,
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.00)",
                  opacity: 1,
                },
              }}
            >
              <VerticalSplitIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Larger Text"
            fontSize={"small"}
            sx={{
              opacity: 0.75,
              "&.MuiIconButton-root:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.00)",
                opacity: 1,
              },
            }}
          >
            <IconButton onClick={() => handleFontSize(1)}>
              <TextIncreaseIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Smaller Text" fontSize={"small"}>
            <IconButton
              onClick={() => handleFontSize(-1)}
              sx={{
                opacity: 0.75,
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.00)",
                  opacity: 1,
                },
              }}
            >
              <TextDecreaseIcon />
            </IconButton>
          </Tooltip>
          <HighlightColorSelect />
          <Divider
            orientation="vertical"
            paddingX={"1rem"}
            flexItem
            variant={"middle"}
          />
          <FullscreenButton />
          {/* <Tooltip title="Comments">
          <IconButton onClick={() => handleAddComment()}
            sx={{
              opacity: 0.75,
              '&.MuiIconButton-root:hover':{
                backgroundColor: 'rgba(0, 0, 0, 0.00)',
                opacity:1
              }
            }}>
            <AccountTreeIcon fontSize={'small'}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Bookmarks">
          <IconButton onClick={() => handleViewBookmark()}
            sx={{
              opacity: 0.75,
              '&.MuiIconButton-root:hover':{
                backgroundColor: 'rgba(0, 0, 0, 0.00)',
                opacity:1
              }
            }}>
            <BookmarkIcon fontSize={'small'} />
          </IconButton>
        </Tooltip> */}
        </Box>
        <Box position={"relative"} display={"flex"}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={() => window.location.reload()}
              sx={{
                opacity: 0.75,
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.00)",
                  opacity: 1,
                },
              }}
            >
              <RefreshIcon fontSize={"medium"} />
            </IconButton>
          </Tooltip>
        </Box>
      </ButtonGroup>
    </Toolbar>
  );
};

export default TopToolbar;
