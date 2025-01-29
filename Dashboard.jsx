import React, { useState, useEffect, useCallback, useMemo } from "react";
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
} from "../../utils/misc";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuPanel from "../Menu/MenuPanel";
import Guide from "../Guide/Guide";
import TopToolbar from "../Toolbar/TopToolbar";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

function DashboardContent() {
  const [open, setOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [verse, setVerse] = useState([]);
  const [result, setResult] = useState([]);
  const [columns, setColumns] = useState(result.length <= 1 ? 1 : 2);
  const [hover, setHover] = useState({});
  const [isShown, setIsShown] = useState(false);
  const [search, setSearch] = useState("");
  const [textSize, setTextSize] = useState(16);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(["comments", "search", "guide", "links"]);
  const [searchPage, setSearchPage] = useState(1); // Pagination for search results
  const resultsPerPage = 25; // Number of results per page

  const toggleDrawer = () => setOpen(!open);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Search term function
  const searchTerm = useCallback(async (term) => {
    if (term) {
      setLoading(true); // Show loading state
      try {
        const sanitizedTerm = term.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "").trim();
        const response = await fetch(`http://34.241.48.247:3000/api/search?text=${sanitizedTerm}`);
        const data = await response.json();
        if (data.length >= 1 && data[0].text) {
          setResult(data);
          setVerse([]);
        } else {
          setResult([]); // Clear results if no data is found
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false); // Hide loading state
      }
    } else {
      setResult([]); // Clear results if search term is empty
      setLoading(false); // Hide loading state
    }
  }, []);

  // Handle search input key down
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter" && (search.match(/"/g) || []).length >= 2) {
      handleSearch(event, setResult, setVerse, searchTerm, () => {});
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Handle pagination change for verses
  const handleVersePageChange = (event, value) => {
    setPage(value);
    fetchVerse(verse[0].book, value, "", setResult, setVerse);
    setSearch(verse[0].book);
  };

  // Handle pagination change for search results
  const handleSearchPageChange = (event, value) => {
    setSearchPage(value);
  };

  // Clear search bar and results
  const handleClearSearch = () => {
    setSearch("");
    setResult([]);
  };

  // Memoized search results for pagination
  const paginatedResults = useMemo(() => {
    const startIndex = (searchPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return result.slice(startIndex, endIndex);
  }, [result, searchPage]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideBar handleToggle={toggleDrawer} open={open} toggleDrawer={toggleDrawer} checked={checked} />
        <Box component="main" sx={{ backgroundColor: (theme) => theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[900], flexGrow: 1, height: "100vh", overflow: "auto", marginTop: { xs: "0.5rem", sm: "1rem" } }}>
          <TopToolbar handleColumns={setColumns} handleFontSize={setTextSize} />
          <Box sx={{ display: "flex", alignItems: "center", mx: 3, marginTop: "-1rem" }}>
            <TextField
              inputProps={{ "aria-labelledby": "switch-list-label-search" }}
              label="Search"
              id="searchBar"
              sx={{ width: "auto", flexGrow: 1 }}
              value={search}
              placeholder='Search by book ie. "john" or "first john", "1 john" etc.'
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <IconButton onClick={handleClearSearch} sx={{ ml: 1 }}>
                <ClearIcon />
              </IconButton>
            )}
          </Box>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={checked.includes("guide") ? 8 : 12} lg={checked.includes("guide") ? 9 : 12}>
                <Paper sx={{ px: { xs: 4, md: 8 }, py: 12, display: "flex", width: "auto", position: "relative", textAlign: "justify", height: "auto" }} elevation={4}>
                  <Typography variant="h5" component="div" gridColumn={1} className="verse__title" sx={{ fontFamily: "EB Garamond", fontWeight: 200, fontSize: "1.85rem", display: "flex", position: "absolute", marginBottom: "1rem", marginTop: "-3.5rem" }}>
                    {verse.length >= 1 && capitalise(verse[0].book) + " " + verse[0].chapter + ":" + verse[verse.length - 1].verse}
                  </Typography>
                  <Typography variant="p" component="p" gridColumn={3} className="verse__container" sx={{ fontFamily: "EB Garamond", fontWeight: 200, fontSize: `${textSize}px`, display: "inline-block", columns: verse.length === 1 ? 1 : columns }}>
                    {verse.length >= 1 ? verse.map((v, index) => (
                      <span onContextMenu={(e) => handleContextMenu(e, v)} style={{ cursor: "context-menu" }} key={index} value={v} className={`${v.text === selectedVerse[0]?.text ? "verse__selected" : ""}`}>
                        <span className="verse__number">{v.verse}&nbsp;</span>
                        <span className={`verse__text`} value={v} onMouseEnter={() => handleMouseHover(v, setHover, setIsShown)}>{v.text}&nbsp;</span>
                        <MenuPanel contextMenu={contextMenu} setContextMenu={() => setContextMenu()} selectedVerse={selectedVerse} search={search} />
                      </span>
                    )) : paginatedResults.map((home, index) => (
                      <span onContextMenu={(e) => handleContextMenu(e, home)} style={{ cursor: "context-menu" }} key={index} value={home} className={`${home.text === selectedVerse[0]?.text ? "verse__selected" : ""}`}>
                        <span className="result__number">{capitalise(home.book) + " " + home.chapter + ":" + home.verse}&nbsp;</span>
                        <span className={`verse__text`} value={home} onMouseEnter={() => handleMouseHover(home, setHover, setIsShown)}>{home.text}&nbsp;</span>
                        <MenuPanel contextMenu={contextMenu} setContextMenu={() => setContextMenu()} selectedVerse={selectedVerse} search={search} />
                        <br /><br /><br />
                      </span>
                    ))}
                  </Typography>
                  {verse.length > 1 && (
                    <Pagination sx={{ position: "relative", marginLeft: "12px" }} count={count} page={page} onChange={handleVersePageChange} />
                  )}
                  {result.length >= 1 && (
                    <Grid item>
                      <Typography item sx={{ display: "block", marginTop: "-3rem", marginLeft: "-2rem", width: "auto", position: "absolute" }} className={`result__total ${verse ? "hide" : "show"}`}>
                        {`${result.length} results`}
                      </Typography>
                      <Pagination
                        sx={{ position: "relative", marginTop: "1rem" }}
                        count={Math.ceil(result.length / resultsPerPage)}
                        page={searchPage}
                        onChange={handleSearchPageChange}
                      />
                    </Grid>
                  )}
                  {!search && (
                    <Typography item sx={{ display: "block", marginTop: "-3rem", marginLeft: "-2rem", width: "auto", position: "absolute" }}>
                      Start typing to search...
                    </Typography>
                  )}
                  {search && result.length === 0 && !loading && (
                    <Typography item sx={{ display: "block", marginTop: "-3rem", marginLeft: "-2rem", width: "auto", position: "absolute" }}>
                      No results found.
                    </Typography>
                  )}
                </Paper>
              </Grid>
              <Guide visible={visible} isShown={isShown} selectedVerse={selectedVerse} hover={hover} />
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
        {/* Loading Backdrop */}
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

export default function Dashboard() {
  return <DashboardContent />;
}