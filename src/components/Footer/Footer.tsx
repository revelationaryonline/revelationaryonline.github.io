import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Link as MuiLink,
  Grid,
  useTheme,
} from "@mui/material";
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
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFF" : "#212121", // Light background
        py: 4,
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        mt: "1px",
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
              <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: -1.25
              }}>
                <img
                  src={logo}
                  alt="revelationary"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginTop: "7px",
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
                    marginTop: "3.5px",
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
          <Box width={'100%'}>
          <Typography variant="body2" sx={{ ml: 1.5, mt: 1, position: 'absolute', color: "grey.600", textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
            info@revelationary.org
          </Typography>
          </Box>
          </Grid>
          <Grid container alignItems={{ xs: "center", sm: "right" }} justifyContent={{ xs: "center", sm: "flex-end" }} sx={{ mt: 3 }}>
          {/* Center Section - Navigation Links */}
          <Grid item sx={{ 
            display: "flex", 
            gap: 4 }}>
            <MuiLink
              href="https://revelationary.org/"
              underline="none"
              sx={{
                color: "#A1A1A1",
                fontWeight: 500,
                fontSize: { xs: "15px", sm: "18px" },
                "&:hover": {
                  textDecoration: "underline",
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#FFF",
                },
              }}
            >
              Home
            </MuiLink>
            <MuiLink
              href="https://revelationary.org/about"
              underline="none"
              sx={{
                color: "#A1A1A1",
                fontWeight: 500,
                fontSize: { xs: "15px", sm: "18px" },
                "&:hover": {
                  textDecoration: "underline",
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#FFF",
                },
              }}
            >
              About
            </MuiLink>
            <MuiLink
              href="https://revelationary.org/resources"
              underline="none"
              sx={{
                color: "#A1A1A1",
                fontWeight: 500,
                fontSize: { xs: "15px", sm: "18px" },
                "&:hover": {
                  textDecoration: "underline",
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#FFF",
                },
              }}
            >
              Resources
            </MuiLink>
            <MuiLink
              href="https://revelationary.org/contact"
              underline="none"
              sx={{
                color: "#A1A1A1",
                fontWeight: 500,
                fontSize: { xs: "15px", sm: "18px" },
                "&:hover": {
                  textDecoration: "underline",
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#212121" : "#FFF",
                },
              }}
            >
              Contact
            </MuiLink>
          </Grid>
        </Grid>

        {/* Divider Line */}
        <Box
          sx={{ borderBottom: "1px solid", borderColor: "grey.300", my: 3 }}
        />

        {/* Bottom Section - Copyright & Social Icons */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography component="div" variant="body2" sx={{ color: "grey.600", fontSize: { xs: "12px", sm: "14px" } }}>
            © {new Date().getFullYear()} Revelationary Ltd. All rights reserved.<br></br>
            167-169 Great Portland Street 5th Floor London W1W 5PF <hr style={{ border: "none", color: "transparent", backgroundColor: "transparent"}} /> Company
            Number 16288234
          </Typography>
          <Box>
            <IconButton
              href={"https://www.facebook.com/revelationary.online/"}
              target="_blank"
              sx={{ color: "#A1A1A1",
                mt: 2,
                "&:hover": { color: (theme) =>
                theme.palette.mode === "light" ? "#212121" : "#FFF", } }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href={"https://www.instagram.com/revelationary.online/"}
              target="_blank"
              sx={{ 
                color: "#A1A1A1",
                mt: 2,
                "&:hover": { color: (theme) =>
                theme.palette.mode === "light" ? "#212121" : "#FFF", } }}
            >
              <Instagram />
            </IconButton>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
