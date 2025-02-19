import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import { AttachMoneyOutlined } from "@mui/icons-material";

const DonateButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Donate">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            marginRight: "5px",
            opacity: 0.75,
            "&.MuiIconButton-root:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              opacity: 1,
            },
          }}
        >
          <AttachMoneyOutlined fontSize={"small"} />
        </IconButton>
      </Tooltip>

      {/* Modal with iframe */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <iframe
            src="https://gofund.me/7e0c1f1f"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonateButton;