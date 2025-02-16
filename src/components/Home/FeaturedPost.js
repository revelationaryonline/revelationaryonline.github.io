import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import moment from "moment"

const FeaturedPost = (props) => {
    const { post } = props;

    function extractContent(s) {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
    };

    return (
        <Grid item xs={12} md={6}>
            <CardActionArea component="a" href="#">
                <Card sx={{ display: 'flex', background: '#212121' }} elevation={3}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h5" color={'#FFF'}>
                            {post.title}
                        </Typography>
                        <Typography variant="subtitle1" color="#FFF">
                            {moment(post.date).format('DD-MM-YYYY')}
                        </Typography>
                        <Link variant="subtitle1" href={`${post && post?.URL}`} color={'#FFF'}>
                            {'Continue Reading...'}
                        </Link>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
                        image={post && post?.featured_image}
                        alt={'post'}
                    />
                </Card>
            </CardActionArea>
        </Grid>
    );
}

FeaturedPost.propTypes = {
    post: PropTypes.shape({
        date: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        imageLabel: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

export default FeaturedPost;