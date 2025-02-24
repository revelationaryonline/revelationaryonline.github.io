import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Cookies from "js-cookie";
import IconButton from "@mui/material/IconButton";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd"; // New bookmark icon
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove"; // Remove bookmark icon
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; // Empty bookmark icon

function Bookmark({
  verse,
  page,
  fetchVerse,
  setSearch,
  setData,
  setVerse,
  setPage
}) {
  const [bookmark, setBookmark] = useState(null);

  useEffect(() => {
    // Load bookmark from cookies on component mount
    const savedBookmark = Cookies.get("bookmark");
    if (savedBookmark) {
      setBookmark(JSON.parse(savedBookmark));
    }
  }, []);

  // Handle adding/removing the bookmark
  const handleToggleBookmark = () => {
    if (bookmark) {
      // If there's a bookmark, remove it
      setBookmark(null);
      Cookies.remove("bookmark");
    } else if (verse.length > 0) {
      // If no bookmark, add one
      const newBookmark = { book: verse[0]?.book, chapter: page };
      setBookmark(newBookmark);
      Cookies.set("bookmark", JSON.stringify(newBookmark), { expires: 365 });
    }
  };

  const handleGoToBookmark = () => {
    if (bookmark) {
      fetchVerse(bookmark.book, bookmark.chapter, "", setData, setVerse);
      setSearch(bookmark.book);
      setPage(bookmark.chapter);
      setVerse(1);
    }
  };

  return (
    <Box display={"flex"}>
      {/* Toggle Bookmark Icon */}
      <Tooltip
        title={bookmark ? "Remove Bookmark" : "Add Bookmark"}
        fontSize={"small"}
      >
        <IconButton
          onClick={handleToggleBookmark}
          sx={{
            opacity: 0.75,
            "&.MuiIconButton-root:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.00)",
              opacity: 1,
            },
          }}
        >
          {bookmark ? (
            <BookmarkRemoveIcon fontSize={"small"} />
          ) : (
            <BookmarkAddIcon fontSize={"small"} />
          )}
        </IconButton>
      </Tooltip>
      {/* Go to Bookmark Section */}
      {bookmark && (
        <div style={{ marginTop: 6 }}>
          <button onClick={handleGoToBookmark}>
            Go to {bookmark.book} {bookmark.chapter}
          </button>
        </div>
      )}
    </Box>
  );
}

export default Bookmark;
