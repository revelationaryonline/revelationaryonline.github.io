import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import heroPost from "../../assets/hero-post.jpg"

const MainFeaturedPost = (props) => {
    const { post } = props;

    function extractContent(s) {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
    };

    return (
        <Paper
            sx={{
                position: 'relative',
                backgroundColor: 'grey.900',
                color: '#fff',
                mt: 2,
                mb: 6,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
                // backgroundImage: `url(${post && post?.post_thumbnail?.URL})`,
                backgroundImage: `url(${heroPost})`,
                opacity: 1,
                height: '100%',
                borderRadius: '15px',
            }}
            elevation={5}
        >
            {/* Increase the priority of the hero background image */}
            {<img style={{ display: 'none', borderRadius: '15px' }} src={post && post?.post_thumbnail?.URL} alt={'post'} />}
            <Box
                sx={{
                    position: 'absolute',
                    mt: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,.3)',
                    borderRadius: '15px'
                }}
            />
            <Grid container>
                <Grid item md={6}>
                    <Box
                        sx={{
                            position: 'relative',
                            p: { xs: 3, md: 6 },
                            pr: { md: 0 },
                        }}
                    >
                        <Typography component="p" variant="p" color="#a1a1a1" gutterBottom lineHeight={1.1}>
                           Featured Verse
                        </Typography>
                        <Typography component="h1" variant="h4" color="inherit" gutterBottom lineHeight={1.1}>
                            {post && post?.title}
                        </Typography>
                        <Typography variant="h5" color="inherit" paragraph lineHeight={1} fontSize={'1rem'}>
                            {post && extractContent(post?.excerpt)}
                        </Typography>
                        <Link variant="subtitle1" sx={{ fontSize: '15px'}} color="#a1a1a1" href={`${post && post?.URL}`}>
                            {'Continue Reading...'}
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

MainFeaturedPost.propTypes = {
    post: PropTypes.shape({
        // excerpt: PropTypes.string.isRequired,
        // image: PropTypes.string.isRequired,
        // imageText: PropTypes.string.isRequired,
        // linkText: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

export default MainFeaturedPost;