import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="#fff" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://revelationaryonline.github.io/">
        revelationary
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export function Footer(props) {
  const { description, title } = props;

  return (
    <Box component="footer" sx={{ bgcolor: "#212121", color: "#fff", py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h6"
          align="center"
          style={{ fontFamily: "condo", fontWeight: 600 }}
          gutterBottom
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          fontStyle={"italic"}
          align="center"
          color="#fff"
          component="p"
        >
          {description}
        </Typography>
        <Copyright />
      </Container>
    </Box>
  );
}

Footer.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Footer;
