import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

interface Post {
    ID?: number;
    title?: string | undefined;
    comment_count?: number;
    excerpt?: string | undefined;
    URL?: string;
    post_thumbnail?: {
      URL: string;
    };
    date: string;
    description: string;
    image: string;
    imageLabel: string;
  } 

interface MainProps {
  posts?: Post[];
  title: string;
}

const Main: React.FC<MainProps> = (props) => {
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
    </Grid>
  );
};

Main.propTypes = {
// @ts-ignore-next-line
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.number,
      title: PropTypes.string,
      comment_count: PropTypes.number,
      excerpt: PropTypes.string,
      URL: PropTypes.string,
      post_thumbnail: PropTypes.shape({
        URL: PropTypes.string,
      }),
    })
  ),
  title: PropTypes.string.isRequired,
};

export default Main;