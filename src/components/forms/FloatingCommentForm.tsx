import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { TextField, Button, Typography, MenuItem, Box, IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { RefreshRounded } from "@mui/icons-material";
import ChatIcon from '@mui/icons-material/Chat';
import CommentIcon from '@mui/icons-material/Comment';
import Comment from "./compoenents/Comment"; // Import the new Comment component
import Tooltip from "@mui/material/Tooltip";


import { capitalise } from "../../utils/misc";

import emojiRegex from "emoji-regex";

interface FloatingCommentFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  position: { x: number; y: number };
  loggedIn: boolean;
  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;
  comments: any[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  commentsMenu: { mouseX: number; mouseY: number } | null;
  open: boolean;
  setCommentsMenu: React.Dispatch<
    React.SetStateAction<{ mouseX: number; mouseY: number } | null>
  >;
  selectedVerse: any[];
  setSelectedVerse: React.Dispatch<React.SetStateAction<any[]>>;
  handleClose: () => void;
}

const FloatingCommentForm: React.FC<FloatingCommentFormProps> = ({
  open,
  setOpen,
  position,
  loggedIn,
  slug,
  setSlug,
  comments,
  setComments,
  commentsMenu,
  setCommentsMenu,
  selectedVerse,
  setSelectedVerse,
  handleClose,
}) => {
  const [newComment, setNewComment] = useState("");
  const [cleanComment, setCleanComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuPosition, setMenuPosition] = useState(position); // Store last position
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [postID, setPostID] = useState<number | null>(null);
  const [charCount, setCharCount] = useState(0);
  const charLimit = 350;

  async function getPostIdBySlug(slug: string) {
    if (commentsMenu && selectedVerse && selectedVerse[0]) {
      const response = await fetch(
        `https://revelationary.org/wp-json/wp/v2/posts?slug=${slug}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return data[0].id; // Return post ID
      } else {
        console.error("Post not found");
        return null;
      }
    }
  }

  const checkPerspectiveAPI = async (comment: string) => {
    const API_KEY = process.env.REACT_APP_PERSPECTIVE_API_KEY;
    const url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
    const body = {
      comment: {
        text: comment,
      },
      languages: ["en"],
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        INSULT: {},
        PROFANITY: {},
        SPAM: {},
      },
    };

    const response = await fetch(`${url}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Analyze the response and check for toxicity levels or other inappropriate content
    if (data.attributeScores.TOXICITY.summaryScore.value > 0.7) {
      // If toxicity is above threshold, don't allow posting
      alert("Your comment contains inappropriate language.");
      return false;
    }

    return true;
  };

  async function removeEmojis(text: string) {
    return text.replace(emojiRegex(), '');
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const wpToken = Cookies.get("wpToken");
    if (!wpToken) {
      console.error("User is not authenticated. Token is missing.");
      return;
    }

    setLoading(true);
    
    try {
      const cleanComment = await removeEmojis(newComment);
      const isCommentValid = await checkPerspectiveAPI(cleanComment);
      if (!isCommentValid) {
        setLoading(false);
        return; // Exit if the comment is flagged as inappropriate
      }

      const response = await fetch(
        `${process.env.REACT_APP_WP_API_URL}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wpToken}`,
          },
          body: JSON.stringify({
            content: cleanComment,
            post: postID,
            post_slug: slug,
          }),
        }
      );

      if (response.ok) {
        setNewComment("");
        setCharCount(0);
        if (postID !== null) {
          fetchComments(postID);
        }
        setCommentsMenu(null);
        // setSelectedVerse([]);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: number) => {
    if (!postId) {
      console.log("No post ID available, skipping fetchComments");
      return;
    }
    try {
      const response = await fetch(
        `https://revelationary.org/wp-json/wp/v2/comments?post=${postId}`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (commentsMenu) {
      const fetchPostAndComments = async () => {
        if (selectedVerse && selectedVerse[0]) {
          const newSlug = `${selectedVerse[0]?.book.trim()}-${selectedVerse[0]?.chapter}${selectedVerse[0]?.verse}`;
          setSlug(newSlug);
  
          try {
            const postId = await getPostIdBySlug(newSlug);
            if (postId) {
              setPostID(postId);
              fetchComments(postId);
            }
          } catch (error) {
            console.error("Error fetching post ID:", error);
          }
        }
      };
  
      fetchPostAndComments();
    } else {
      setComments([]); // Clear comments when the menu is closed
    }
  }, [commentsMenu, selectedVerse]);
  
  useEffect(() => {
    if (commentsMenu && postID) {
      fetchComments(postID);
    }
  }, [commentsMenu, postID]);

  const handleViewComments = async () => {
    if (postID) {
      await fetchComments(postID);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - menuPosition.x, y: e.clientY - menuPosition.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setMenuPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]); // Only run when `dragging` changes

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= charLimit) {
      setNewComment(value);
      setCharCount(value.length);
    }
  };

  if (!open) return null;

  return (
    <Menu
      elevation={3}
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: (menuPosition && menuPosition.y) || 100,
        left: (menuPosition && menuPosition.x) || 20,
      }}
      sx={{
        "& ul": { padding: 0 },
      }}
    >
      <MenuItem
        disableRipple
        sx={{
          height: "auto",
          minWidth: 350,
          maxWidth: '100%',
          padding: 2,
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <Box
          sx={{
            minWidth: 400,
            maxWidth: 400,
            minHeight: '60vh',
            padding: 2,
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            "&:hover": { backgroundColor: "transparent" },
          }}
          onMouseDown={handleMouseDown}
        >
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="small"
            onClick={() => {
              setOpen(false);
              handleClose();
              setSelectedVerse([]);
              setCommentsMenu(null);
              setComments([]);
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* <Typography variant="subtitle2">Comments:</Typography> */}
            <Typography sx={{ color: '#a1a1a1' }} variant="body2">
              {selectedVerse && selectedVerse[0] ? ( <>{selectedVerse[0]?.book && capitalise(selectedVerse[0]?.book) + " " + selectedVerse[0]?.chapter + ":" + selectedVerse[0]?.verse}</>) : "No verse selected"}
            </Typography>
            <Typography variant="body2" sx={{ mb: -1, fontStyle: 'italic', color: "#a1a1a1", fontSize: "0.85rem", wordBreak: "break-word", width: "100%", textWrap: "wrap" }}>
              {selectedVerse[0]?.text}
            </Typography>
            <Tooltip
            title="Comments"
            sx={{
              opacity: 0.75,
              mb: -1,
              "&.MuiIconButton-root:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.00)",
                opacity: 1,
              },
            }}
          >
            <IconButton disableRipple onClick={handleViewComments} size="small" color="primary">
              <ChatIcon sx={{ mt: -1, color: '#FFF' }} fontSize="small" />
              <CommentIcon sx={{ color: '#FFF' }}  fontSize="small" />
            </IconButton>
          </Tooltip>
            {/* Scrollable comments section */}
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                overflowX: "scroll",
                padding: 1,
                border: "1px solid #ccc",
                borderRadius: 1,
                backgroundColor: "#f9f9f9",
              }}
            >
              {comments.length > 0 ? (
                comments.map((comment: any) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="black"
                  sx={{
                    mb: 1,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                    overflow: "scroll",
                  }}
                >
                  There are no comments on this verse yet... Be the first!
                </Typography>
              )}
            </Box>
                          {/* Refresh Icon Button */}
            <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={handleViewComments}
              size="small"
              color="primary"
              sx={{
                position: "absolute",
                left: '88%',
                bottom: 20,
              }}
              >
              <RefreshRounded fontSize="small" />
              </IconButton>  
              </Box>

            {/* Comment Input Section */}
            {loggedIn && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                  label="Add a comment"
                  value={newComment}
                  onChange={handleCommentChange}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{
                    WebkitBoxShadow: "none !important",
                    "& .Mui-focused": {
                      color: (theme) =>
                        theme.palette.mode === "light"
                          ? "black !important"
                          : "white !important",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: (theme) =>
                          theme.palette.mode === "light"
                            ? "#ccc !important"
                            : "#FFF !important",
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "black"
                            : "white !important",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                        WebkitTextFillColor: (theme) =>
                          theme.palette.mode === "light" ? "black" : "white",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: (theme) =>
                        theme.palette.mode === "light" ? "black" : "white",
                    },
                    "& .MuiInputBase-input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                      WebkitTextFillColor: (theme) =>
                        theme.palette.mode === "light" ? "black" : "white",
                      transition: "background-color 5000s ease-in-out 0s",
                    }
                  }}
                />
                <Typography
                  variant="body2"
                  color={charCount >= charLimit - 10 && charCount <= charLimit ? "red" : "#A1A1A1"}
                  sx={{ alignSelf: "flex-end" }}
                >
                  {charCount}/{charLimit}
                </Typography>
                <Button
                  onClick={handleCommentSubmit}
                  variant="contained"
                  size="small"
                  color="success"
                  sx={{
                    py: 1,
                    fontSize: "0.875rem",
                    backgroundColor: "#a1a1a1",
                    "&:hover": {
                      backgroundColor: "success",
                    }
                  }}
                  type="submit"
                  fullWidth
                  disabled={loading || charCount > charLimit}
                >
                  {loading ? "Posting..." : "Post Comment"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </MenuItem>
    </Menu>
  );
};

export default FloatingCommentForm;