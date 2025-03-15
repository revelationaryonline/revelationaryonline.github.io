// @ts-nocheck
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
// import DonateButton from "../DonateButton/DonateButton";
import FullscreenButton from "../FullScreenButton/FullScreenButton";
import HighlightColorSelect from "../HighlightSelect/HighlightColorSelect";
import ShortTextIcon from '@mui/icons-material/ShortText';
import BookmarksIcon from '@mui/icons-material/Bookmarks'; // FUTURE: multi-bookmarks?
import CommentBankOutlinedIcon from '@mui/icons-material/CommentBankOutlined';
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import ChatIcon from '@mui/icons-material/Chat';
import CommentIcon from '@mui/icons-material/Comment';

const TopToolbar = ({
  handleColumns,
  handleFontSize,
  verse,
  page,
  setSearch,
  fetchVerse,
  setData,
  setPage,
  setVerse,
  loggedIn
}) => {

  return (
    <Toolbar sx={{ mb: 2.3, mt: -0.075 }}>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined button group"
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <Box position={"relative"} display={"flex"}>
          {/* Help Modal */}
          <AlertDialogSlide />
          <Divider
            orientation="vertical"
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
              <TextIncreaseIcon/>
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
          <HighlightColorSelect loggedIn={loggedIn}/>
          {/* <Tooltip title="Highlighted Verses" fontSize={"small"}>
            <IconButton
              // onClick={() => handleFontSize(-1)}
              sx={{
                opacity: 0.75,
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.00)",
                  opacity: 1,
                },
              }}
            >
              <ShortTextIcon />
            </IconButton>
          </Tooltip> */}
          <Divider
            orientation="vertical"
            flexItem
            variant={"middle"}
          />
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
        </Tooltip> */}
        <BookmarkButton 
          verse={verse}
          page={page}
          setSearch={setSearch}
          fetchVerse={fetchVerse}
          setData={setData}
          setPage={setPage}
          setVerse={setVerse}
        />
    <Box sx={{ display: { xs: 'none', sm: 'block' } }} >
        <FullscreenButton />
    </Box>
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
          {/* <DonateButton /> */}
        </Box>
      </ButtonGroup>
    </Toolbar>
  );
};

export default TopToolbar;
