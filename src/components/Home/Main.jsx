import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Markdown from "./Markdown";

function Main(props) {
  const { posts, title } = props;

  return (
    <Grid
      xs={12}
      md={12}
      sx={{
        "& .markdown": {
          py: 0,
        },
        color: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Typography
        sx={{
          display: "flex",
          mt: 1,
          alignSelf: "right !important",
          fontSize: "1rem",
          textDecoration: "none",
          color: "#a1a1a1",
          width: "max-content",
        }}
        variant="h6"
        gutterBottom
      >
        {title}
      </Typography>
      <Divider />
      {/* {posts.map((post) => (
                <Markdown className="markdown" key={post.id}>
                    {post}
                </Markdown>
            ))} */}
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;
