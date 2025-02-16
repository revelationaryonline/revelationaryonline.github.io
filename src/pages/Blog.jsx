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
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
  description:
    "Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.",
  archives: [{ title: "September 2023", url: "#" }],
  social: [
    { name: "GitHub", icon: GitHubIcon },
    { name: "Twitter", icon: TwitterIcon },
    { name: "Facebook", icon: FacebookIcon },
  ],
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const Blog = () => {
  // const posts = [post1, post2, post3];

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    fetch(`https://public-api.wordpress.com/rest/v1.1/sites/223816114/posts`)
      .then((res) => res.json())
      .then(
        (result) => {
          setLoading(false);
          setPosts(result.posts);          
        },
        (error) => {
          setLoading(false);
          setError(error);
        }
      );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ background: '#212121'}}>
        <Header title="Blog" sections={sections} />
        <main>
          <MainFeaturedPost post={posts.length > 0 && posts.filter((item) => item.ID === 38)[0]} />
          <Grid container spacing={4}>
            {posts &&
              posts?.map((post) => (
                <FeaturedPost key={post?.title} post={post} />
              ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="Further Reading" posts={posts && posts} />
            <SidePanel
              title={sidebar.title}
              description={sidebar.content}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
    </ThemeProvider>
  );
};
