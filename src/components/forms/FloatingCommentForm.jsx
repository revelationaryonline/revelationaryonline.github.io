import { useEffect, useState } from "react";
import { TextField, Button, Typography, MenuItem, Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const FloatingCommentForm = ({
  open,
  setOpen,
  position,
  verse,
  loggedIn,
  fetchComments,
  slug,
  comments,
  setComments,
  commentsMenu,
  setCommentsMenu,
  setWpToken
}) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuPosition, setMenuPosition] = useState(position); // Store last position
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [postID, setPostID] = useState(0)

  async function getPostIdBySlug(slug) {
    const response = await fetch(`https://revelationary.org/wp-json/wp/v2/posts?slug=${slug}`);
    const data = await response.json();
    
    if (data.length > 0) {
        return data[0].id; // The first item in the array is the post
    } else {
        throw new Error("Post not found");
    }
}


  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    const wpToken = localStorage.getItem('wpToken'); 
    // if (!wpToken) {
    //   console.error("User is not authenticated. Token is missing.");
    //   return;
    // }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_WP_API_URL}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${wpToken}`,
          },
          body: JSON.stringify({
            content: newComment,
            post: postID,
            post_slug: slug,
            // status: "approve",
          }),
        }
      );
      console.log(wpToken)
      console.log(response)
      if (response.ok) {
        setNewComment("");
        fetchComments();
        console.log('posted')
        console.log(response)
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (commentsMenu) {
      setMenuPosition({ x: commentsMenu.mouseX, y: commentsMenu.mouseY });
    }
    const postId = getPostIdBySlug(slug).then((res) => setPostID(res));
    console.log(postId)
  }, [commentsMenu, slug]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - menuPosition.x, y: e.clientY - menuPosition.y });
  };

  const handleMouseMove = (e) => {
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

  if (!open) return null;

  return (
    <Menu
      elevation={3}
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: menuPosition.y,
        left: menuPosition.x,
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
          maxWidth: 400,
          padding: 2,
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <Box
          sx={{
            minWidth: 350,
            maxWidth: 400,
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
            onClick={() => setOpen(false)}
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
            <Typography variant="subtitle1">Comments:</Typography>

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
                comments.map((comment) => (
                  <Typography
                    key={comment.id}
                    variant="body2"
                    sx={{
                      color:'black',
                      mb: 1,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                  >
                    {comment.content.rendered}
                  </Typography>
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
                    overflow: 'scroll'
                  }}
                >
                  There are no comments on this verse yet... Be the first!
                </Typography>
              )}
            </Box>

            {/* Comment Input Section */}
            {loggedIn && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                  label="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
                <Button
                  onClick={handleCommentSubmit}
                  variant="contained"
                  size="small"
                  color="success"
                  sx={{
                    py: 1.5,
                    fontSize: "0.875rem",
                  }}
                  disabled={loading}
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
