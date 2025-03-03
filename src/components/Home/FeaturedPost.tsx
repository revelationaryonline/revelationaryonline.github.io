import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import moment from "moment";
import { createTheme, responsiveFontSizes } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

interface Post {
  ID?: number;
  title?: { 
    rendered: string | undefined;
  },
  comment_count?: number;
  excerpt?: string;
  URL?: string;
  post_thumbnail?: {
    URL?: string;
  };
  date?: string;
  description?: string;
  image?: string;
  imageLabel?: string;
  link?: string;
} 

interface FeaturedPostProps {
  post: Post;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {

  return (
    <Grid item xs={12} md={4}>
      <CardActionArea component="a" href={'#'}>
        <Card
          sx={{
            // borderRadius: 45,
            backgroundColor: "transparent",
            display: "flex", // Keeps the rounded corners
            overflow: "hidden", // Ensures child elements don't overflow the rounded corners
            position: "relative", // Required for absolute positioning of the overlay
          }}
          elevation={3}
        >
          <CardContent
            sx={{
              flex: 1,
            }}
          >
            <Typography
              textAlign={"left"}
              mb={1}
              variant="h6"
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#999" : "#FFFFFF",
                fontSize: "20px",
              }}
            >
              • {post?.title?.rendered}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "max-content",
                px: "5px",
                ml: 0,
                mt: 2,
                fontSize: "12px",
                border: "1px solid #999",
              }}
              color="#999"
            >
              {post.comment_count}&nbsp;Comments
            </Typography>
            <Link
              href={post?.link}
              sx={{
                display: "flex",
                mt: 1,
                alignSelf: "right !important",
                fontSize: "12px",
                textDecoration: "none",
                color: "#a1a1a1",
                width: "max-content",
              }}
            >
              {/* <Typography
                variant="body2"
                right={0}
                justifySelf={"right"}
                color={"#FFF"}
              >
                {"Continue Reading..."}
              </Typography> */}
            </Link>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
};

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.shape({
      rendered: PropTypes.string.isRequired,
    }).isRequired,
    URL: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedPost;
