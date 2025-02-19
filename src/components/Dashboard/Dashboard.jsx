import React, { useState, useEffect, useMemo } from "react";
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
import useHighlight from "../../hooks/useHighlight";
import MenuPanel from "../Menu/MenuPanel";
import Guide from "../Guide/Guide";
import TopToolbar from "../Toolbar/TopToolbar";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { MenuItem } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import VideoModal from "../VideoModal/VideoModal";

// TODO: automate this to be detected on system preferences
// const mdTheme = createTheme({ palette: { mode: "light" } });

function DashboardContent({ loggedIn }) {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [contextMenu, setContextMenu] = useState(null);

  const [verse, setVerse] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const [result, setResult] = useState([]);
  const [columns, setColumns] = useState(result.length <= 1 ? 2 : 2);
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
  const [loading, setLoading] = useState(true);
  const [searchPage, setSearchPage] = useState(1); // Pagination for search results
  const [resultsPerPage, setResultsPerPage] = useState(25); // Number of results per page
  const [clearSearch, setClearSearch] = useState(false);
  const [focused, setFocused] = useState(false);

  const { highlightedVerses, toggleHighlight } = useHighlight();

  // hightlight verse helper box window
  const searchTerm = async (term, setState) => {
    if (term !== "") {
      setLoading(true); // Show loading state
      function sanitizeString(str) {
        str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
        return str.trim();
      }
      try {
        await fetch(
          `https://kjvapp.com/api/search?text=${sanitizeString(term)}`
        )
          .then((res) => res.json())
          .then((res) => {
            // console.log(res);
            if (res.length >= 1 && res[0].text) {
              setData(res);
              setResult(res);
              // console.log(res);
              setVerse([]);
              setLoading(false);
            } else {
              // console.log(res[0]);
              setLoading(false);
            }
          });
      } catch (e) {
        // setResult(e);
        console.log(e);
        setLoading(false);
      } finally {
        setLoading(false); // Hide loading state
      }
    } else {
      // do nothing
      // setResult([]); // Clear results if search term is empty,
      setLoading(false); // Hide loading state
    }
  };

  const checkSearch = (str) => {
    str = str.split("");
    if (str[str.length - 1] === '"') {
      return true;
    }
    return false;
  };

  const handleChange = (event, value, v) => {
    setPage(1);
    setPage(value);
    fetchVerse(v[0].book, value, "", setData, setVerse);
    setSearch(v[0].book);
  };

  useEffect(() => {
    if (loading) {
      if (search === "" && count >= 0) {
        fetchVerse("genesis", 1, "", setData, setVerse);
        setPage(1);
        setCount(-1);
        if (verse[0]?.book && count === -1) {
          // fetchCount(verse[0].book, setCount).then((res) => console.log(res));
          setPage(verse[0].chapter);
          setClearSearch(false);
        }
      } else if (
        search.includes('"') &&
        checkSearch(search) &&
        loading &&
        count === -1
      ) {
        // console.log(`search term: + ${search}`);
        searchTerm(search);
        setCount(result.length - 1);
        setColumns(1);
        setClearSearch(false);
      }
      if (
        verse[0]?.book &&
        count !== 0 &&
        search &&
        !search.includes('"') &&
        search.length > 2
      ) {
        // fetchCount(verse[0].book, setCount).then((res) => console.log(res));
        setPage(verse[0].chapter);
        setResult([]);
        setCount(-1);
        setClearSearch(false);
      }
      setLoading(false);
    }
  }, [visible, result, search, verse, count, loading, page]);

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
    event.target.style.textDecoration === "underline"
      ? (event.target.style.textDecoration = "none")
      : (event.target.style.textDecoration = "underline");
      setSelectedVerse((prev) => [...prev, verse]);
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
  };

  const handleColumns = (e) => {
    e === 1 && columns === 2 ? setColumns(1) : setColumns(2);
  };
  const handleFontSize = (e) => {
    setTextSize(textSize + e);
  };

  // Clear search bar and results
  const handleClearSearch = () => {
    setSearch("");
    setResult([]);
  };

  const handleViewBookmark = (e) => {
    alert(e);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Handle pagination change for search results
  const handleSearchPageChange = (event, value) => {
    setSearchPage(value);
  };

  // Handle results per page change
  const handleResultsPerPageChange = (event) => {
    setResultsPerPage(event.target.value);
    setSearchPage(1); // Reset to first page
  };

  const handleVerseSelect = (verse) => {
    // Check if the verse is already selected
    if (selectedVerse.includes(verse)) {
      // If it is, remove it from the selection
      setSelectedVerse((prev) =>
        prev.includes(verse) ? prev.filter((v) => v !== verse) : [...prev, verse]
      );    } else {
      // If it's not, add it to the selection
      setSelectedVerse([...selectedVerse, verse]);
    }
  };

  const handleClose = () => {
    setContextMenu(null);
    // selectedVerse.length = 0;
  };

  const handleHighlight = (e) => {
    e.preventDefault();
    
    // Loop through all selected verses and toggle highlight for each
    selectedVerse.forEach((verse) => {
      toggleHighlight(verse.id);  // Toggle highlight for each selected verse
      console.log('Selected Verse ID: ', verse.id);
    });
    
    handleClose();  // Close the context menu
  };

  // Memoized search results for pagination
  const paginatedResults = useMemo(() => {
    const startIndex = (searchPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return result.slice(startIndex, endIndex);
  }, [result, searchPage, resultsPerPage]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", marginTop: 5.35 }}>
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
                ? theme.palette.grey[100]
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
                marginTop: "-0.5rem",
                WebkitBoxShadow: "none !important",
                // Target the fieldset to change the border color
                "& .Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "black !important"
                      : "white !important",
                  WebkitBoxShadow: "none !important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#ccc !important"
                        : "#FFF !important", // Light/dark border
                    WebkitBoxShadow: "none !important",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "black"
                        : "white !important",
                    WebkitBoxShadow: "none !important",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #212121AA inset", // Change to match background
                    WebkitTextFillColor: (theme) =>
                      theme.palette.mode === "light" ? "black" : "white", // Ensure text remains visible
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                },
                // Optional: If you also want to modify the color inside the input
                "& .MuiInputBase-input": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
                },
                "& .MuiInputBase-input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #212121AA inset", // Change to match background
                  WebkitTextFillColor: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white", // Ensure text remains visible
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
              InputProps={{
                startAdornment: focused ? (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ opacity: 0.55 }} />
                  </InputAdornment>
                ) : null,
              }}
              value={search}
              placeholder={`Search by book ie. john or first john, 1 john etc.`}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              onKeyDown={(e) =>
                handleSearch(
                  e,
                  setData,
                  setVerse,
                  searchTerm,
                  setBookmark,
                  setCount,
                  setPage
                )
              }
            />
          )}
          {/* Main bible text */}
          {/* <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GQI72THyO5I?si=UAMHuW2JJNNV4NE-&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
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
                    {verse.length > 0 &&
                      verse[0]?.book &&
                      verse[0]?.chapter && (
                        <VideoModal
                          currentBook={verse[0].book}
                          currentChapter={verse[0].chapter}
                        />
                      )}
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
                    {verse.length === 0 && result && (
                      <Grid
                        item
                        display={"flex"}
                        sx={{ marginBottom: "1rem", marginTop: "-2rem" }}
                      >
                        <Typography
                          item
                          sx={{
                            fontSize: "1.2rem", // Jack 12.09
                            marginRight: "9px",
                            display: "block",
                            width: "auto",
                          }}
                          className={`result__total ${verse ? "hide" : "show"}`}
                        >
                          {`${result.length}`}&nbsp;
                          <span style={{ fontSize: "0.9rem" }}>results</span>
                        </Typography>
                        <Select
                          value={resultsPerPage}
                          onChange={handleResultsPerPageChange}
                          sx={{
                            ml: 2,
                            padding: 0,
                            height: "2rem",
                            marginTop: "-0.3rem",
                            marginLeft: "3rem",
                          }}
                        >
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                        </Select>
                        <Typography
                          item
                          sx={{
                            display: "block",
                            marginTop: "0.20rem", // Mum 20.12
                            marginLeft: "1.2rem",
                            width: "auto",
                            fontSize: "0.7rem",
                          }}
                          className={`result__total ${verse ? "hide" : "show"}`}
                        >{`per Page`}</Typography>
                      </Grid>
                    )}
                    {verse.length >= 1
                      ? verse.map((v, index) => (
                        // console.log(v.id),
                        // console.log(highlightedVerses.includes(
                        //   v.id.toString()
                        // )),
                          <span
                            onContextMenu={(e) => handleContextMenu(e, v)}
                            onClick={() => handleVerseSelect(v)}  // Trigger handleVerseSelect on click
                            style={{
                              cursor: "context-menu",
                            }}
                            key={index}
                            value={v}
                            className={`${
                              v.text === selectedVerse[0]?.text
                                ? "verse__selected"
                                : ""
                            } ${highlightedVerses.includes(
                              v.id.toString()
                            )
                              ? "highlight"
                              : "transparent"}`}
                          >
                            <span className="verse__number">
                              {v.verse}&nbsp;
                            </span>
                            <span
                              className={`verse__text`}
                              value={v}
                              style={{
                                backgroundColor: selectedVerse.includes(v) ? "lightblue" : "transparent",  // Feedback for selection
                              }}
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
                              highlightedVerses={highlightedVerses}
                              toggleHighlight={toggleHighlight}
                              handleHighlight={handleHighlight}
                              handleClose={handleClose}
                              search={search}
                            />
                          </span>
                        ))
                      : result &&
                        paginatedResults.map((home, index) => (
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
                    <>
                      <Pagination
                        sx={{
                          position: "fixed",
                          marginLeft: "-50px",
                          marginTop: "83px", // 83 Samantha
                          width: "min-content",
                          opacity: 0.75,
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.grey[100]
                              : theme.palette.grey[900],
                        }}
                        count={fetchCount(verse[0].book)}
                        page={page}
                        onChange={(e, value, v) =>
                          handleChange(e, value, verse)
                        }
                      />
                    </>
                  )}
                  {search &&
                    result.length === 0 &&
                    verse.length === 0 &&
                    !loading && (
                      <Typography
                        item
                        sx={{
                          display: "block",
                          marginTop: "-3rem",
                          marginLeft: "-2rem",
                          width: "auto",
                          position: "absolute",
                        }}
                      >
                        No results found.
                      </Typography>
                    )}
                  {verse.length === 0 && result && (
                    <Grid item>
                      <Pagination
                        sx={{
                          position: "absolute",
                          marginTop: "0rem",
                          marginLeft: "1rem",
                        }}
                        count={Math.ceil(result.length / resultsPerPage)}
                        page={searchPage}
                        onChange={handleSearchPageChange}
                      />
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard({ loggedIn }) {
  return <DashboardContent loggedIn={loggedIn} />;
}
