// CardSample.js file

import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ImageIcon from "@mui/icons-material/Image";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

function FeatureCards() {
  const Item = styled(Paper)(({ theme }) => ({
    // theme integration
    // backgroundColor: theme.palette.mode === "light" ? "#1A2027" : "#e1e1e1",
    // color: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    backgroundColor: "#fff",
    height: "27.5rem",
    padding: theme.spacing(1),
    padding: 8,
    textAlign: "center",
    color: "black",
  }));

  return (
    <>
      <Grid container spacing={4} padding={4}>
        <Grid item xs={12} md={4} sx={{ padding: "1rem" }}>
          <Item elevation={8}>
            <Typography
              sx={{ fontSize: 16, padding: "1rem" }}
              color="text.secondary"
              gutterBottom
            >
              Features a live verse selection tool to help you analyse each
              verse individually and save notes
            </Typography>
            <Card
              sx={{
                minWidth: "80%",
                background: "#e1e1e1",
                marginTop: "3rem",
                mx: "1rem",
                padding: "1rem",
              }}
              elevation={3}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 15, marginTop: "1rem", marginBottom: "1rem" }}
                  color="#212121"
                  gutterBottom
                >
                  Save Verses
                </Typography>
                <Tooltip title="Save Verse" disableRipple>
                  <IconButton>
                    <BookmarkIcon />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          </Item>
        </Grid>
        <Grid item xs={12} md={4} sx={{ padding: "1rem" }}>
          <Item elevation={8}>
            <Typography
              sx={{ fontSize: 16, padding: "1rem" }}
              color="text.secondary"
              gutterBottom
            >
              Verses can also be "linked" to show new correlations between
              scripture
            </Typography>
            <Card
              sx={{
                minWidth: "80%",
                background: "#e1e1e1",
                marginTop: "3rem",
                mx: "1rem",
                padding: "1rem",
              }}
              elevation={3}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 15, marginTop: "1rem", marginBottom: "1rem" }}
                  color="#212121"
                  gutterBottom
                >
                  Link Verses
                </Typography>
                <Tooltip title="Link Verses" disableRipple>
                  <IconButton>
                    <AccountTreeIcon />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          </Item>
        </Grid>
        <Grid item xs={12} md={4} sx={{ padding: "1rem" }}>
          <Item elevation={8}>
            <Typography
              sx={{ fontSize: 16, padding: "1rem" }}
              color="text.secondary"
              gutterBottom
            >
              Attach media and items to your saved verses and relate scripture
              to real world examples of prophecy
            </Typography>
            <Card
              sx={{
                minWidth: "80%",
                background: "#e1e1e1",
                marginTop: "3rem",
                mx: "1rem",
                padding: "1rem",
              }}
              elevation={3}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 15, marginTop: "1rem", marginBottom: "1rem" }}
                  color="#212121"
                  gutterBottom
                >
                  Attach Content
                </Typography>
                <Tooltip title="Attach Media">
                  <IconButton disableRipple>
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Videos">
                  <IconButton disableRipple>
                    <OndemandVideoIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Images">
                  <IconButton disableRipple>
                    <ImageIcon />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          </Item>
        </Grid>
      </Grid>
    </>
  );
}

export default FeatureCards;
