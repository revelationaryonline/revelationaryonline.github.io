import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Cookies from "js-cookie";
import { User } from "firebase/auth";

interface CommentProps {
  comment: any;
  user: User | null;
}

const Comment: React.FC<CommentProps> = ({ comment, user }) => {
  const [likes, setLikes] = useState(comment.likes || 0);
  const [liked, setLiked] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);
  const userId = Cookies.get("userId");
  const wpToken = Cookies.get("wpToken"); // Get the authentication token from cookies

  useEffect(() => {
    if (user) {
      setCredentials(btoa(`${user?.email || ""}:${wpToken}`));
    }
  }, [user, wpToken]);

  const handleLike = async () => {
    const action = liked ? "unlike" : "like";
    try {
      // Log auth details for debugging
      console.log("Auth token type:", typeof wpToken);
      console.log("Auth token length:", wpToken ? wpToken.length : 0);
      console.log("User email:", user?.email);

      const response = await fetch(
        `${process.env.REACT_APP_WP_API_URL_CUSTOM}/like-comment/${comment?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${user?.email || ""}:${wpToken}`)}`,
          },
          body: JSON.stringify({ action }),
        }
      );
      const data = await response.json();
      setLikes(data.likes);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const likedUsers = comment?.liked_users ? Object.values(comment.liked_users) : [];

  useEffect(() => {
    // Check if the user has already liked the comment
    if (userId && likedUsers.includes(parseInt(userId))) {
      setLiked(true);
    }
  }, [comment.likes]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        mb: 0,
      }}
    >
      <Avatar
        alt={comment.author_name}
        src={comment.author_avatar_urls?.[48]}
        sx={{ mr: 1, width: "24px", height: "24px", borderRadius: "0px" }}
      />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "black" }}>
          {comment.author_name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            px: 2,
            mt: -1.85,
            lineHeight: 1.1,
            fontSize: "14px",
            color: "black",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            textAlign: "justify",
            fontFamily: "'Alegreya Sans', sans-serif", // Use Alegreya Sans font
            // Add styles for links in comments
            '& a': {
              color: '#a1a1a1',
              textDecoration: 'underline',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: 'black',
              }
            }
          }}
          dangerouslySetInnerHTML={{ __html: comment?.content?.rendered }}
        />
        <Box sx={{ display: "flex", alignItems: "center", mt: -4 }}>
          <IconButton
            size="small"
            onClick={handleLike}
            color={liked || likedUsers.includes(parseInt(userId ? userId : '0')) ? "warning" : "secondary"}
            TouchRippleProps={{
              classes: { rippleVisible: "MuiTouchRipple-warning" },
            }}
            // disabled={liked}
          >
            <FavoriteIcon
              sx={{ 
                color: liked || likedUsers.includes(parseInt(userId ? userId : '0')) ? "warning" : "secondary", 
                width: "18px" 
              }}
              fontSize="small"
            />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              ml: 0,
              mt: "-1.75px",
              color: "#777",
              fontSize: "14px",
              fontWeight: 800,
              lineHeight: 'normal', // Adjust line height
              verticalAlign: 'baseline', // Adjust vertical alignment
              fontFamily: "'Alegreya Sans', sans-serif",
            }}
          >
            {likes}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Comment;
