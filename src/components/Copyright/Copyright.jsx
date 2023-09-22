import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{
        fontSize: ".85rem",
      }}
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Revelationary
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
