import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import emojiRegex from "emoji-regex";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { RefreshRounded, Sanitizer, SanitizerOutlined } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import CommentIcon from "@mui/icons-material/Comment";
import Comment from "./components/Comment"; // Import the new Comment component
import Tooltip from "@mui/material/Tooltip";

import { capitalise } from "../../utils/misc";

import logo from "../../assets/logo512.png";
import { User } from "firebase/auth";

const WP_API_URL = process.env.REACT_APP_WP_API_URL;
const PERSPECTIVE_API_URL = process.env.REACT_APP_PERSPECTIVE_API_URL;
const PERSPECTIVE_API_KEY = process.env.REACT_APP_PERSPECTIVE_API_KEY;

interface FloatingCommentFormProps {
  user: User | null;
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
  user,
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
  const [page, setPage] = useState(1); // Track the current page of comments
  const [loadingMore, setLoadingMore] = useState(false); // Track if more comments are being loaded
  const [hasMoreComments, setHasMoreComments] = useState(true); // Track if there are more comments to fetch
  const charLimit = 350;
  const [error, setError] = useState<string | null>(null);
  const [toxicityScores, setToxicityScores] = useState<Record<string, number> | null>(null);

  async function getPostIdBySlug(slug: string) {
    if (commentsMenu && selectedVerse && selectedVerse[0]) {
      const response = await fetch(`${WP_API_URL}/posts?slug=${slug}`);
      const data = await response.json();
      if (data.length > 0) {
        return data[0].id; // Return post ID
      } else {
        console.error("Post not found");
        return null;
      }
    }
  }


  const checkPerspectiveAPI = async (comment: string): Promise<{ isValid: boolean; message?: string }> => {
    setError(null);
    setToxicityScores(null);

    if (!PERSPECTIVE_API_KEY || !PERSPECTIVE_API_URL) {
      setError("Comment moderation is currently unavailable. Please try again later.");
      return { isValid: false, message: "Moderation service unavailable" };
    }

    try {
      const body = {
        comment: { text: comment },
        languages: ["en"],
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          INSULT: {},
          PROFANITY: {},
          THREAT: {},
          IDENTITY_ATTACK: {},
        },
      };

      const response = await fetch(`${PERSPECTIVE_API_URL}?key=${PERSPECTIVE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store all toxicity scores
      const scores = {
        toxicity: data.attributeScores.TOXICITY.summaryScore.value,
        severeToxicity: data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
        insult: data.attributeScores.INSULT.summaryScore.value,
        profanity: data.attributeScores.PROFANITY.summaryScore.value,
        threat: data.attributeScores.THREAT?.summaryScore.value || 0,
        identityAttack: data.attributeScores.IDENTITY_ATTACK?.summaryScore.value || 0,
      };
      setToxicityScores(scores);

      // Check for various types of inappropriate content
      const violations = [];
      if (scores.toxicity > 0.7) violations.push("toxic language");
      if (scores.severeToxicity > 0.7) violations.push("severely toxic content");
      if (scores.insult > 0.7) violations.push("insulting content");
      if (scores.profanity > 0.7) violations.push("profanity");
      if (scores.threat > 0.7) violations.push("threatening content");
      if (scores.identityAttack > 0.7) violations.push("discriminatory content");

      if (violations.length > 0) {
        const message = `Your comment contains ${violations.join(", ")}. Please revise and try again.`;
        setError(message);
        return { isValid: false, message };
      }

      return { isValid: true };
    } catch (error) {
      console.error("Error checking content:", error);
      setError("Unable to verify comment content. Please try again.");
      return { isValid: false, message: "Error checking content" };
    }
  };

  async function removeEmojis(text: string) {
    return text.replace(emojiRegex(), "");
  }
  
  // Function to decode HTML entities in error messages
  const decodeHtmlEntities = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const wpToken = Cookies.get("wpToken");
    if (!wpToken) {
      setError("Please log in to post comments.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanComment = await removeEmojis(newComment);
      const { isValid, message } = await checkPerspectiveAPI(cleanComment);
      
      if (!isValid) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${WP_API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${user?.email || ""}:${wpToken}`)}`,
        },
        body: JSON.stringify({
          content: cleanComment,
          post: postID,
          post_slug: slug,
        }),
      });

      if (!response.ok) {
        // Try to get the error message from the response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // If response can't be parsed as JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setNewComment("");
      setCharCount(0);
      setError(null);
      if (postID !== null) {
        fetchComments(postID);
      }
      // We don't want to reset the comments menu position after posting
      // Removing: setCommentsMenu(null);
    } catch (error: unknown) {
      console.error("Error submitting comment:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to post comment. Please try again. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  const fetchComments = async (postId: number, page: number = 1) => {
    if (!postId || !WP_API_URL) {
      console.log("No post ID or API URL available, skipping fetchComments");
      return;
    }
    try {
      const response = await fetch(`${WP_API_URL}/comments?post=${postId}&page=${page}`);
      const data = await response.json();
      if (data.length === 0) {
        setHasMoreComments(false); // No more comments to fetch
      } else {
        if (page === 1) {
          setComments(data);
        } else {
          setComments((prevComments) => [...prevComments, ...data]);
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (commentsMenu) {
      const fetchPostAndComments = async () => {
        if (selectedVerse && selectedVerse[0]) {
          const newSlug = `${selectedVerse[0]?.book.trim()}-${
            selectedVerse[0]?.chapter
          }${selectedVerse[0]?.verse}`;
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
      // Only clear comments when the menu is deliberately closed
      // not when we're just refreshing the list after posting
      if (!loading) {
        setComments([]);
      }
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingMore) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1 && postID) {
      fetchComments(postID, page);
    }
  }, [page, postID]);

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
          maxWidth: "100%",
          padding: 2,
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <Box
          sx={{
            minWidth: {xs: '50vw', sm: 400},
            maxWidth: {xs: '100vw', sm: 450},
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
            <Typography sx={{ color: "#a1a1a1" }} variant="body2">
              {selectedVerse && selectedVerse[0] ? (
                <>
                  {selectedVerse[0]?.book &&
                    capitalise(selectedVerse[0]?.book) +
                      " " +
                      selectedVerse[0]?.chapter +
                      ":" +
                      selectedVerse[0]?.verse}
                </>
              ) : (
                "No verse selected"
              )}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: -2,
                fontStyle: "italic",
                color: "#a1a1a1",
                fontSize: "0.85rem",
                wordBreak: "break-word",
                width: "100%",
                textWrap: "wrap",
              }}
            >
              {selectedVerse[0]?.text}
            </Typography>
            <Tooltip
              title="Comments"
              sx={{
                opacity: 0.75,
                mb: 0,
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.00)",
                  opacity: 1,
                },
              }}
            >
              <IconButton
                disableRipple
                onClick={handleViewComments}
                size="small"
                color="primary"
              >
                <ChatIcon sx={{ mt: -1, color: "#FFF" }} fontSize="small" />
                <CommentIcon sx={{ color: "#FFF" }} fontSize="small" />
              </IconButton>
            </Tooltip>
            {/* Scrollable comments section */}
            <Box
              sx={{
                height: 300, // Fixed height instead of maxHeight to maintain container shape
                overflowY: "auto",
                overflowX: "scroll",
                padding: 1,
                border: "1px solid #ccc",
                borderRadius: 1,
                backgroundColor: "#f9f9f9",
              }}
              onScroll={handleScroll}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "150px", // Fixed height to maintain container shape
                    width: "100%"
                  }}
                >
                  <CircularProgress color={"success"} />
                </Box>
              ) : comments.length > 0 ? (
                comments.map((comment: any) => (
                  <Comment key={comment.id} comment={comment} user={user} />
                ))
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "150px",
                  }}
                >
<CircularProgress color={"success"} />
                </Box>
              )}
              {loadingMore && hasMoreComments && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    mb: 2, // Added bottom margin for consistent spacing
                  }}
                >
                  <CircularProgress color={"warning"} size={24} />
                </Box>
              )}
              {!hasMoreComments && comments.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    color: "#777",
                    fontSize: "14px",
                    fontWeight: 800,
                    lineHeight: "normal", // Adjust line height
                    verticalAlign: "baseline", // Adjust vertical alignment
                    fontFamily: "'Cardo', serif",
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    padding: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="black"
                    sx={{
                      mt: 1,
                      px: 2,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      overflow: "scroll",
                      fontSize: {xs: '12px', sm: '16px'},
                    }}
                  >
                    No more comments to load... Add yours ! or Why not head to our blog and see which verses are trending ? Just click the Menu in the Top Right corner of your screen
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 2,
                      color: "#777",
                      fontSize: "14px",
                      fontWeight: 800,
                      lineHeight: "normal", // Adjust line height
                      verticalAlign: "baseline", // Adjust vertical alignment
                      fontFamily: "'Cardo', serif",
                    }}
                  >
                    <img
                      src={logo}
                      alt="revelationary"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "0px",
                        marginRight: 10,
                        marginLeft: 10,
                        // filter: isDarkMode ? "invert(1)" : "none",
                      }}
                    ></img>
                    revelationary.online/#/blog
                  </Box>
                </Box>
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
                  left: "88%",
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
                    },
                  }}
                />
                {error && (
                  <Typography color="error" variant="body2" sx={{ 
                    display: 'block', 
                    width: '100%', 
                    mt: 1, 
                    mb: 1, 
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    overflowWrap: "break-word"
                  }}>
                    {/* Decode HTML entities in the error message */}
                    <div dangerouslySetInnerHTML={{ __html: error }} />
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color={
                    charCount >= charLimit - 10 && charCount <= charLimit
                      ? "red"
                      : "#A1A1A1"
                  }
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
                    },
                  }}
                  type="submit"
                  fullWidth
                  disabled={loading || charCount > charLimit}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                      Posting...
                    </Box>
                  ) : (
                    "Post Comment"
                  )}
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
