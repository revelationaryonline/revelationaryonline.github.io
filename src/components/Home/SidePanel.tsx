import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

interface Archive {
  title: string;
  url: string;
}

interface Social {
  icon: React.ElementType;
  name: string;
}

interface SidePanelProps {
  archives: Archive[];
  description: string;
  social: Social[];
  title: string;
}

function SidePanel(props: SidePanelProps) {
  const { archives, description, social, title } = props;

  return (
    <Grid item xs={12} md={12} my={8}>
      <Paper elevation={0} sx={{ p: 0, bgcolor: "transparent" }}>
        <Typography
          sx={{
            display: "flex",
            mt: 1,
            fontSize: "1rem",
            textDecoration: "none",
            color: "#a1a1a1",
          }}
          variant="h6"
          gutterBottom
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.25,
            mt: 0,
            fontSize: "0.85rem",
            color: "#a1a1a1",
            textAlign: "justify",
          }}
          display={"flex"}
        >
          {description}
        </Typography>
      </Paper>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          mt: 3,
          fontSize: "1rem",
          textDecoration: "none",
          color: "#a1a1a1",
        }}
      >
        Contact
      </Typography>
      {/* {archives.map((archive) => (
        <Link
          display="block"
          variant="body1"
          href={archive.url}
          key={archive.title}
        >
          {archive.title}
        </Link>
      ))} */}
      {/* <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Social
            </Typography> */}
      {/* {social.map((network) => (
                <Link
                    display="block"
                    variant="body1"
                    href="#"
                    key={network.name}
                    sx={{ mb: 0.5 }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <network.icon />
                        <span>{network.name}</span>
                    </Stack>
                </Link>
            ))} */}
      <Link
        href="https://www.paypal.com/donate/?hosted_button_id=TZNQ4G8SPBAK6"
        sx={{
          display: "flex",
          mt: 3,
          fontSize: "1rem",
          textDecoration: "none",
          color: "#a1a1a1",
        }}
      >
        <p>Donate</p>
      </Link>
    </Grid>
  );
}

SidePanel.propTypes = {
  archives: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  description: PropTypes.string.isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default SidePanel;
