import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Header({ sections }: { sections: { title: string, url: string }[] }) {

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "#a1a1a1", mt: 7 }}>
        {/* <Button size="small">Subscribe</Button> */}
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ 
            flex: 1,
            display: "flex",
            mt: 2,
            fontSize: "1rem",
            textDecoration: "none",
            color: "#a1a1a1",
           }}
        >.online/blog</Typography>
        {/* <IconButton>
          <SearchIcon
            fontSize="small"
            sx={{
              color: (theme) =>
                theme.palette.mode === "light" ? "#212121" : "#FFFFFF",
            }}
          />
        </IconButton> */}
        {/* <Button variant="outlined" size="small" color={'success'}>
          Sign up
        </Button> */}
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}
      >
        {sections.map((section: { title: string, url: string }) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{
              p: 1,
              flexShrink: 0,
                  display: "flex",
                  mt: 0,
                  mb: 0,
                  textDecoration: "none",
                  color: "#a1a1a1",
            }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
