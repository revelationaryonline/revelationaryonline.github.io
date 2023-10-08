import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Copyright } from "../Copyright/Copyright";
import TextField from "@mui/material/TextField";
import { SideBar } from "../SideBar/SideBar";
import Pagination from "@mui/material/Pagination";
import {
  handleMouseHover,
  handleSearch,
  fetchVerse,
  capitalise,
  mdTheme,
  fetchCount,
} from "../../utils/misc";

import MenuPanel from "../Menu/MenuPanel";
import Guide from "../Guide/Guide";
import TopToolbar from "../Toolbar/TopToolbar";

// TODO: automate this to be detected on system preferences
// const mdTheme = createTheme({ palette: { mode: "light" } });

function DashboardContent({ loggedIn }) {
  
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [contextMenu, setContextMenu] = useState(null);

  const [verse, setVerse] = useState([]);
  const [bookmark, setBookmark] = useState();
  const [result, setResult] = useState([]);
  const [columns, setColumns] = useState(result.length <= 1 ? 1 : 2);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [hover, setHover] = useState({});
  const [isShown, setIsShown] = useState(false);
  const [search, setSearch] = useState("");
  const [textSize, setTextSize] = useState(16);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(["search", "guide"]);
  const [highlighted, setHighlighted] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const [link, setLink] = useState()

  // hightlight verse helper box window
  const searchTerm = async (term, setState) => {
    if (term !== "") {
      function sanitizeString(str) {
        str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
        return str.trim();
      }
      try {
        await fetch(
          `https://fuzzy-houndstooth-worm.cyclic.cloud/api/search?text=${sanitizeString(
            term
          )}`
        )
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res.length >= 1 && res[0].text) {
              setData(res);
              setResult(res);
              console.log(res);
              setVerse([]);
              setLoading(false)
            } else {
              console.log(res[0]);
            }
          });
      } catch (e) {
        // setResult(e);
        console.log(e);
      }
    } else {
      // do nothing
    }
  };

 const checkSearch = (str) => {
  str = str.split('');
  if (str[str.length -1] === '"') {
    console.log('true')
    return true
  }
  return false
 }


  const handleChange = (event, value, v) => {
    setPage(value);
    fetchVerse(v[0].book, value, "", setData, setVerse, setBookmark);
    setSearch(v[0].book);
  };

  useEffect(() => {
    if (search === "" && count >= 0) {
      fetchVerse("genesis", 1, "", setData, setVerse);
      setPage(1);
      setCount(-1);
      if (verse[0]?.book && count === 0) {
        fetchCount(verse[0].book, setCount).then((res) => console.log(res));
        setPage(verse[0].chapter);
      }
    } else if (search.includes('"') && checkSearch(search) && loading) {
      console.log(`search term: + ${search}`);
      searchTerm(search);
      setCount(result.length -1);
    }
    if (verse[0]?.book && count !== 0 && search && !search.includes('"') && search.length > 2) {
      fetchCount(verse[0].book, setCount).then((res) => console.log(res));
      setPage(verse[0].chapter);
      setResult([]);
      setCount(-1);
    }
  }, [verse, visible, ]);

    
  // result causes a loop with search

  // verse, visible, count, search, result
  // checked box sidebar
  const [checked, setChecked] = useState([
    "comments",
    "search",
    "guide",
    "links",
  ]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    setVisible(newChecked);
  };

  const handleContextMenu = (event, verse) => {
    event.preventDefault();
    console.log(verse);
    event.target.style.textDecoration === "underline"
      ? (event.target.style.textDecoration = "none")
      : (event.target.style.textDecoration = "underline");
    selectedVerse.push(verse);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
    console.log(selectedVerse);
  };

  const handleColumns = (e) => {
    e === 1 && columns === 2 ? setColumns(1) : setColumns(2);
  };
  const handleFontSize = (e) => {
    setTextSize(textSize + e);
  };

  const handleViewBookmark = (e) => {
    alert(e);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideBar
          handleToggle={handleToggle}
          open={open}
          toggleDrawer={toggleDrawer}
          checked={checked}
        />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[300]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            marginTop: { xs: "0.5rem", sm: "1rem" },
          }}
        >
          <TopToolbar
            handleColumns={handleColumns}
            handleFontSize={handleFontSize}
            handleViewBookmark={handleViewBookmark}
          />
          {visible.includes("search") && (
            <TextField
              inputProps={{
                "aria-labelledby": "switch-list-label-search",
              }}
              label="Search"
              id="searchBar"
              sx={{
                width: "auto",
                display: "flex",
                mx: 3,
                marginTop: "-1rem",
              }}
              value={search}
              placeholder={`Search by book ie. john or first john, 1 john etc.`}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              onKeyDown={(e) => handleSearch(e, setData, setVerse, searchTerm, setBookmark)}
            />
          )}
          {/* Main bible text */}

          {/* ROUTES */}
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={checked.includes("guide") ? 8 : 12}
                lg={checked.includes("guide") ? 9 : 12}
              >
                <Paper
                  sx={{
                    px: { xs: 4, md: 8 },
                    py: 12,
                    display: "flex",
                    width: "auto",
                    position: "relative",
                    textAlign: "justify",
                    height: "auto",
                  }}
                  elevation={4}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    gridColumn={1}
                    className="verse__title"
                    sx={{
                      fontFamily: "EB Garamond",
                      fontWeight: 200,
                      fontSize: "1.85rem",
                      display: "flex",
                      position: "absolute",
                      marginBottom: "1rem",
                      marginTop: "-3.5rem",
                    }}
                  >
                    {verse.length >= 1 &&
                      capitalise(verse[0].book) +
                        " " +
                        verse[0].chapter +
                        ":" +
                        verse[verse.length - 1].verse}
                  </Typography>

                  <Typography
                    variant="p"
                    component="p"
                    gridColumn={3}
                    className="verse__container"
                    sx={{
                      fontFamily: "EB Garamond",
                      fontWeight: 200,
                      fontSize: `${textSize}px`,
                      display: "inline-block",
                      columns: verse.length === 1 ? 1 : columns,
                    }}
                  >
                    {verse.length >= 1
                      ? verse.map((v, index) => (
                          <span
                            onContextMenu={(e) => handleContextMenu(e, v)}
                            style={{ cursor: "context-menu" }}
                            key={index}
                            value={v}
                            className={`${
                              v.text === selectedVerse[0]?.text
                                ? "verse__selected"
                                : ""
                            }`}
                          >
                            <span className="verse__number">
                              {v.verse}&nbsp;
                            </span>
                            <span
                              className={`verse__text`}
                              value={v}
                              onMouseEnter={(e) =>
                                handleMouseHover(v, setHover, setIsShown)
                              }
                              // use mouse leave to reset context menu selection
                              // onMouseLeave={() => setIsShown(false)}
                            >
                              {v.text}&nbsp;
                            </span>
                            <MenuPanel
                              contextMenu={contextMenu}
                              setContextMenu={() => setContextMenu()}
                              selectedVerse={selectedVerse}
                              search={search}
                            />
                          </span>
                        ))
                      : result.map((home, index) => (
                          <span
                            onContextMenu={(e) => handleContextMenu(e, home)}
                            style={{ cursor: "context-menu" }}
                            key={index}
                            value={home}
                            className={`${
                              home.text === selectedVerse[0]?.text
                                ? "verse__selected"
                                : ""
                            }`}
                          >
                            <span className="result__number">
                              {capitalise(home.book) +
                                " " +
                                home.chapter +
                                ":" +
                                home.verse}
                              &nbsp;
                            </span>
                            <span
                              className={`verse__text`}
                              value={home}
                              onMouseEnter={(e) =>
                                handleMouseHover(home, setHover, setIsShown)
                              }
                              // use mouse leave to reset context menu selection
                              // onMouseLeave={() => setIsShown(false)}
                            >
                              {home.text}&nbsp;
                            </span>
                            <MenuPanel
                              contextMenu={contextMenu}
                              setContextMenu={() => setContextMenu()}
                              selectedVerse={selectedVerse}
                              search={search}
                            />
                            <br></br>
                            <br></br>
                            <br></br>
                          </span>
                        ))}
                  </Typography>

                  {verse.length > 1 && (
                    <Pagination
                      sx={{
                        position: "relative",
                        marginLeft: "12px",
                      }}
                      count={count}
                      page={page}
                      onChange={(e, value, v) => handleChange(e, value, verse)}
                    />
                  )}
                  {result.length >= 1 && (
                    <Grid item>
                      <Typography
                        item
                        sx={{
                          display: "block",
                          marginTop: "-3rem",
                          marginLeft: "-2rem",
                          width: "auto",
                          position: "absolute",
                        }}
                        className={`result__total ${verse ? "hide" : "show"}`}
                      >{`${result.length} results`}</Typography>
                    </Grid>
                  )}
                </Paper>
              </Grid>
              {/* Guide */}
              <Guide
                visible={visible}
                isShown={isShown}
                selectedVerse={selectedVerse}
                hover={hover}
              />
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard({ loggedIn }) {
  return <DashboardContent loggedIn={loggedIn} />;
}
