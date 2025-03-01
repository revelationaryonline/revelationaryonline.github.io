import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Home/Header";
import MainFeaturedPost from "../components/Home/MainFeaturedPost";
import FeaturedPost from "../components/Home/FeaturedPost";
import Main from "../components/Home/Main";
import SidePanel from "../components/Home/SidePanel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import GraphicTextEffect from "../components/GraphicTextEffect/GraphicTextEffect";

const sections = [
  { title: "Technology", url: "#" },
  { title: "Design", url: "#" },
  { title: "Culture", url: "#" },
  { title: "Business", url: "#" },
  { title: "Politics", url: "#" },
  { title: "Fashion", url: "#" },
  { title: "Science", url: "#" },
  { title: "Health", url: "#" },
  { title: "Style", url: "#" },
  { title: "Travel", url: "#" },
];

const sidebar = {
  title: "About",
  description: "",
  archives: [{ title: "September 2023", url: "#" }],
  social: [
    { name: "GitHub", icon: GitHubIcon },
    { name: "Twitter", icon: TwitterIcon },
    { name: "Facebook", icon: FacebookIcon },
  ],
};

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

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `https://public-api.wordpress.com/rest/v1.1/sites/223816114/posts?number=50`
      );
      const result = await response.json();
      setLoading(false);
      if (result.posts) {
        // Sort posts by comment count (highest first)
        const sortedPosts = result.posts.sort(
          (a: Post, b: Post) => (b.comment_count || 0) - (a.comment_count || 0)
        );

        // Get the top 9 most commented posts
        setPosts(sortedPosts.slice(0, 9));
      }
    } catch (error) {
      setLoading(false);
      setError(error as Error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
  <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} />
        <main>
        <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{
              flex: 1,
              display: "flex",
              fontSize: '16px',
              mt: 2,
              mb: 2,
              ml: 1,
              textDecoration: "none",
              color: "#a1a1a1",
            }}
          >
            {/* {posts.length > 0 && posts.filter((item) => item.ID !== 38)[0].title} */}
          </Typography>
            <Box
            sx={{ border: '1px solid #a1a1a1'}}
            >
            <GraphicTextEffect id="svg-jesus" text="JESUS" />
            
            </Box>
            <Typography
            className="svg__sub-heading"
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{
              width: '100%',
              // flex: 1,
              // display: "flex",
              mt: {xs: -4, md:-10},
              mb: {xs: 8, md: 14},
              ml: 0,
              fontSize: "0.9rem",
              textDecoration: "none",
              color: "#a1a1a1",
            }}
          >IS KING</Typography>
            


          <MainFeaturedPost
            post={posts.length > 0 ? posts.filter((item) => item.ID !== 38)[0] : null}
          />
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{
              flex: 1,
              display: "flex",
              mt: 3,
              mb: 1,
              ml: 1,
              fontSize: "0.9rem",
              textDecoration: "none",
              color: "#a1a1a1",
            }}
          >
            Trending Verses:
          </Typography>
          <Grid container spacing={0} ml={1}>
            {/* Left Side - 75% width */}
            <Grid container xs={12} md={9} mt={0} ml={-2} spacing={2}>
              {posts &&
                posts.map((post) => (
                  <FeaturedPost key={post?.title} post={post} />
                ))}
            </Grid>

            {/* Right Side - 25% width */}
            <Grid item xs={12} md={3} justifyItems={"center"}>
              <Box sx={{ mt: 2, mx: 4 }}>
                <Main title="Further Reading" posts={posts} />
                <SidePanel
                  title={sidebar.title}
                  description={sidebar.description}
                  archives={sidebar.archives}
                  social={sidebar.social}
                />
              </Box>
            </Grid>
          </Grid>
          <Box my={10} />
        </main>
      </Container>
    </ThemeProvider>
  );
};
