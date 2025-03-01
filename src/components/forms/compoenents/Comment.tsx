import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface CommentProps {
  comment: any;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
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
        sx={{ mr: 1, width: '24px', height: '24px', borderRadius: '0px' }}
      />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: "bold", color: 'black' }}>
          {comment.author_name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            px: 2,
            mt: -1,
            lineHeight: 1.1,
            fontSize: '14px',
            color: "black",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            textAlign: "justify",
          }}
          dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
        />
      </Box>
    </Box>
  );
};

export default Comment;