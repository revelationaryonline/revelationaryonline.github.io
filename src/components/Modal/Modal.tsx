// @ts-nocheck
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
import { Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
        <IconButton onClick={handleClickOpen} sx={{
          opacity: 0.75,
          '&.MuiIconButton-root:hover':{
            backgroundColor: 'rgba(0, 0, 0, 0.00)',
            opacity:1
          }
        }}>
          <LiveHelp fontSize="small"/>
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
            background: (theme) => theme.palette.mode === "light" ? 'FFF' : '#212121',
          }}
          elevation={8}
        >
          <Box padding={2} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <LiveHelp padding={2} fontSize="large"/>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle fontSize={17} position={'absolute'} mt={-2}>{"Help - How to use the Search Bar"}</DialogTitle>
          <DialogActions mt={-10}>
          </DialogActions>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="span" sx={{ display: 'block'}} gutterBottom marginBottom={2}>
                The search bar uses it&apos;s own shortcuts to search biblical text.
                This is intended for ease of use and faster searches.
              </Typography>
              
              {/* Antonia 17 */}
              <Typography fontSize={17} variant="span" sx={{ display: 'block'}} color="white" gutterBottom>
                Searching for keywords or Phrases
              </Typography>
              <Typography variant="span" sx={{ display: 'block'}} gutterBottom marginBottom={2}>
                To search for a keyword or phrase just type your text in
                double quotation marks and press enter. 
                For example: 
                <span style={{
                  display: 'block'
                }}>
                <code>&quot;light&quot;</code></span>
                Will search the entire Bible for any references to the word light.
              </Typography>
              <Typography fontSize={17} variant="span" sx={{ display: 'block'}} color="white" gutterBottom>
                Searching for Chapters
              </Typography>
              <Typography variant="span" sx={{ display: 'block'}} gutterBottom marginBottom={2}>
                To search for a chapter just type a : after the
                chapter number. So, First John Chapter three would be: 
                <span style={{
                  display: 'block'
                }}>
                <code>1 John 3:</code></span>
                or
                <span style={{
                  display: 'block'
                }}>
                <code>first John 3:</code></span>
                 Then press return
              </Typography>
              <Typography fontSize={17} variant="span" sx={{ display: 'block'}} color="white" gutterBottom>
                Searching for Verses
              </Typography>
              <Typography variant="span" sx={{ display: 'block'}} gutterBottom marginBottom={2}>
                To search for a verse just type the book name, the chapter
                number then a : followed by a verse. For example: 
                <span style={{
                  display: 'block'
                }}><code>John 3:16</code></span>
                Then press return
              </Typography>
            </DialogContentText>
          </DialogContent>
        </Paper>
      </Dialog>
    </React.Fragment>
  );
}
