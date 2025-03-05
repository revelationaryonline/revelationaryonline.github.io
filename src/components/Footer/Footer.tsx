import React from "react";
import { Box, Container, Typography, IconButton, Link as MuiLink, Grid, useTheme } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../../assets/logo512.png";

const Footer = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: (theme) => theme.palette.mode === "light" ? "#FFF" : "#212121", // Light background
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Left Section - Logo + Name */}
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
          <Link
              to="/"
              style={{
                textDecoration: "none",
                color: isDarkMode ? "#FFF" : "#212121",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <img
                  src={logo}
                  alt="revelationary"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginTop: '7px',
                    marginRight: 10,
                    marginLeft: 10,
                    filter: isDarkMode ? "invert(1)" : "none",
                  }}
                ></img>
                <Typography
                  // variant="p"
                  component="div"
                  sx={{
                    textAlign: { xs: "center", sm: "left" },
                    marginTop: '3.5px',
                    flexGrow: 1,
                    fontFamily: "cardo",
                    fontWeight: 600,
                    fontStyle: "bold",
                    letterSpacing: "1.65px",
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#212121" : "#FFF",
                  }}
                >
                  revelationary
                </Typography>
              </Box>
            </Link>
          </Grid>

          {/* Center Section - Navigation Links */}
          <Grid item sx={{ display: "flex", gap: 4 }}>
            {["Home", "About", "Resources", "Contact"].map((text) => (
              <MuiLink
                key={text}
                href="#"
                underline="none"
                sx={{
                  color: "#1E40AF",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline", color: "#2563EB" },
                }}
              >
                {text}
              </MuiLink>
            ))}
          </Grid>
        </Grid>

        {/* Divider Line */}
        <Box sx={{ borderBottom: "1px solid", borderColor: "grey.300", my: 3 }} />

        {/* Bottom Section - Copyright & Social Icons */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ color: "grey.600" }}>
            © {new Date().getFullYear()} Revelationary. All rights reserved.
          </Typography>

          <Box>
            {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
              <IconButton key={index} sx={{ color: "#1E40AF", "&:hover": { color: "#2563EB" } }}>
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;