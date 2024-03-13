import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { LiveHelp } from "@mui/icons-material";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Help">
        <IconButton onClick={handleClickOpen}>
          <LiveHelp />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Paper
          sx={{
            width: "auto",
            position: "relative",
            textAlign: "justify",
            height: "auto",
          }}
          elevation={8}
        >
          <DialogTitle>{"How to use the Search Bar"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="body2" gutterBottom>
                The search bar uses it's own shortcuts to search biblical text.
                This is intended for ease of use and faster searches.
              </Typography>
              <Typography variant="h6" gutterBottom>
                Searching for keywords or Phrases
              </Typography>
              <Typography variant="body2" gutterBottom>
                To search for a keyword or phrase just type your beginning
                double quotation mark " and enter the text you wish to search.
                When you type the second quotation the search will already
                begin. For example: 
                <pre><code>"light"</code></pre>
                There's no need to hit the return key ! To run a new search click
                the Anchor Icon to reset the search. Phrases are case sensitive.
              </Typography>
              <Typography variant="h6" gutterBottom>
                Searching for Chapters
              </Typography>
              <Typography variant="body2" gutterBottom>
                To search for a chapter just type a : after the book name and
                chapter number. So, Luke Chapter one would be: 
                <pre><code>Luke 1:</code></pre>
                 Then press return
              </Typography>
              <Typography variant="h6" gutterBottom>
                Searching for Verses
              </Typography>
              <Typography variant="body2" gutterBottom>
                To search for a verse just type the book name, the chapter
                number then a : followed by a verse. For example: 
                <pre><code>John 3:16</code></pre>
                Then press return.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </React.Fragment>
  );
}
