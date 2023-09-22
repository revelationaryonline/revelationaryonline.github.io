import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const Guide = ({ visible, isShown, selectedVerse, hover }) => {
  return (
    <>
      {visible.includes("guide") && (
        <Grid item xs={12} md={4} lg={3} gap={1}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "auto",
            }}
            elevation={4}
          >
            <Card
              sx={{
                minWidth: "auto",
                background: "transparent",
                border: "none",
                boxShadow: "none",
                minHeight: "fit-content",
              }}
            >
              <CardContent>
                {!isShown && (
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    No Selection
                  </Typography>
                )}
                {isShown && (
                  <>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Verse Selection
                      <br />
                      <br />
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontWeight: 200,
                        fontSize: "1rem",
                        display: "inline-block",
                        columns: 1,
                      }}
                    >
                      {selectedVerse.length > 0
                        ? `"${selectedVerse[0].text}"`
                        : `"${hover && hover.text}"`}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      <br />
                      {hover &&
                        hover.book + " " + hover.chapter + ":" + hover.verse}
                    </Typography>
                  </>
                )}
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default Guide;
