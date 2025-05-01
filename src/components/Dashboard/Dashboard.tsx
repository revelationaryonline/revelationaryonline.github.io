import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import { SideBar } from "../SideBar/SideBar";
import TopToolbar from "../Toolbar/TopToolbar";
import MenuPanel from "../Menu/MenuPanel";
import Guide from "../Guide/Guide";
import FloatingCommentForm from "../forms/FloatingCommentForm";
import WPLoginModal from "../forms/WPLoginModal";
import {
  fetchVerse,
  fetchCount,
  checkNumbers,
  handleSearch,
  handleMouseHover,
  capitalise,
} from "../../utils/misc";
import useHighlight from "../../hooks/useHighlight";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { User } from "firebase/auth";
import MenuItem from "@mui/material/MenuItem";
import Alert from "../Alert/Alert";
import SubscriptionCheck from "../Subscription/SubscriptionCheck";
import { useSubscription } from "../../contexts/SubscriptionContext";
import SubscriptionPromptDialog from "../Subscription/SubscriptionPromptDialog";
import ReadingProgressToast from "../BibleReading/ReadingProgressToast";
import VideoModal from "../VideoModal/VideoModal";

interface DashboardContentProps {
  loggedIn: boolean;
  user: User | null;
  wpToken: string | null;
  setWpToken: (token: string | null) => void;
}

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  id: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  loggedIn,
  user,
  wpToken,
  setWpToken,
}) => {
  const [open, setOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [commentsMenu, setCommentsMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [verse, setVerse] = useState<Verse[]>([]);
  const [result, setResult] = useState<Verse[]>([]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [columns, setColumns] = useState(result.length <= 1 ? 2 : 2);
  // eslint-disable-next-line
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState<string | number>(0);
  const [hover, setHover] = useState<
    { text: string; book: string; chapter: number; verse: number } | undefined
  >(undefined);
  const [isShown, setIsShown] = useState(false);
  const [search, setSearch] = useState("");
  const [textSize, setTextSize] = useState(16);
  // eslint-disable-next-line
  const [error, setError] = useState("");
  const [visible, setVisible] = useState<string[]>(["search", "guide"]);
  const [selectedVerse, setSelectedVerse] = useState<Verse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchPage, setSearchPage] = useState(1); // Pagination for search results
  const [resultsPerPage, setResultsPerPage] = useState(25); // Number of results per page
  // eslint-disable-next-line
  const [clearSearch, setClearSearch] = useState(false);
  const [focused, setFocused] = useState(false);
  // eslint-disable-next-line
  const [comments, setComments] = useState<any[]>([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [slug, setSlug] = useState("");

  const { highlightedVerses, toggleHighlight } = useHighlight();

  function sanitizeString(str: string) {
    // eslint-disable-next-line
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
  }

  const searchTerm = async (term: string) => {
    if (term !== "") {
      setLoading(true); // Show loading state
      try {
        const response = await fetch(
          `https://kjvapp.com/api/search?text=${sanitizeString(term)}`
        );
        const res = await response.json();
        if (res.length >= 1 && res[0].text) {
          setData(res);
          setResult(res);
          setVerse([]);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      } finally {
        setLoading(false); // Hide loading state
      }
    } else {
      setLoading(false); // Hide loading state
    }
  };

  const checkSearch = (str: string | string[]) => {
    if (typeof str === "string") {
      str = str.split("");
    }
    if (str[str.length - 1] === '"') {
      return true;
    }
    return false;
  };

  const handleChange = (
    event: ChangeEvent<unknown>,
    value: number,
    v: { book: string }[]
  ) => {
    if (v && v.length > 0) {
      setPage(1);
      setPage(value);
      fetchVerse(v[0]?.book, value, "", setData, setVerse);
      setSearch(v[0]?.book);
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleCommentsClose = () => {
    setCommentsMenu(null);
    setComments([]); // Clear comments when the menu is closed
  };

  useEffect(() => {
    const savedToken = Cookies.get("wpToken"); // expires in 7 days

    if (savedToken && !wpToken) {
      setWpToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (wpToken) {
      Cookies.set("wpToken", wpToken, { expires: 7, path: "" }); // expires in 7 days
    }
  }, [wpToken]);

  useEffect(() => {
    if (commentsMenu) {
      setComments([]); // Clear comments when the menu is opened
    }
  }, [commentsMenu]);

  useEffect(() => {
    if (loading) {
      if (search === "" && typeof count === "number" && count >= 0) {
        fetchVerse("genesis", 1, "", setData, setVerse);
        setPage(1);
        setCount(-1);
        setSlug(
          `${
            selectedVerse[0] && "book" in selectedVerse[0]
              ? selectedVerse[0]?.book
              : "genesis"
          }-${
            selectedVerse[0] && selectedVerse[0]?.chapter
              ? selectedVerse[0]?.chapter
              : 1
          }${
            selectedVerse[0] && selectedVerse[0]?.verse
              ? selectedVerse[0]?.verse
              : 1
          }`
        );
        if (verse && verse.length > 0 && verse[0]?.book && count === -1) {
          setPage(verse[0].chapter);
          setClearSearch(false);
          setSlug(
            `${verse[0].book.trim()}-${verse[0].chapter}${
              selectedVerse[0]?.verse
            }`
          );
        }
      } else if (
        search.includes('"') &&
        checkSearch(search) &&
        loading &&
        count === -1
      ) {
        console.log(search);
        searchTerm(search);
        setCount(result.length - 1);
        setColumns(1);
        setClearSearch(false);
        if (verse && verse.length > 0) {
          setSlug(
            `${verse[0].book.trim()}-${verse[0].chapter}${
              selectedVerse[0]?.verse
            }`
          );
        }
      }
      if (
        verse &&
        verse.length > 0 &&
        verse[0]?.book &&
        count !== 0 &&
        search &&
        !search.includes('"') &&
        search.length > 2
      ) {
        const matchBookWithNumbers = checkNumbers(verse[0]?.book);
        setPage(verse[0].chapter);
        setResult([]);
        setCount(Number(matchBookWithNumbers.trim()));
        setClearSearch(false);
        setSlug(
          `${verse[0].book.trim()}-${verse[0].chapter}${
            selectedVerse[0]?.verse
          }`
        );
      }
      if (user === null || user === undefined) {
        if (wpToken) {
          setWpToken(null);
        }
      }
      setLoading(false);
    }
  }, [
    visible,
    result,
    search,
    verse,
    count,
    loading,
    page,
    loggedIn,
    selectedVerse,
    user,
    slug,
    commentsMenu,
  ]);

  const [checked, setChecked] = useState<string[]>([
    "comments",
    "search",
    "guide",
    "links",
  ]);

  const handleToggle = (value: string) => () => {
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

  const handleContextMenu = (event: React.MouseEvent, verse: any) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const handleColumns = (e: number) => {
    e === 1 && columns === 2 ? setColumns(1) : setColumns(2);
  };

  const handleFontSize = (e: number) => {
    setTextSize(textSize + e);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearchPage(value);
  };

  const handleResultsPerPageChange = (event: SelectChangeEvent<number>) => {
    setResultsPerPage(event.target.value as number);
    setSearchPage(1); // Reset to first page
  };

  const handleVerseSelect = (verse: Verse) => {
    if (selectedVerse.includes(verse) && contextMenu === null) {
      setSelectedVerse((prev) =>
        prev.includes(verse)
          ? prev.filter((v) => v !== verse)
          : [...prev, verse]
      );
    } else if (contextMenu === null) {
      setSelectedVerse([...selectedVerse, verse]);
    }
  };

  const handleHighlight = () => {
    selectedVerse.forEach((verse) => {
      toggleHighlight(verse.id);
    });
    handleClose();
  };

  const { subscription, canUseComments } = useSubscription();
  const [subscriptionPromptOpen, setSubscriptionPromptOpen] = useState(false);

  const handleCommentOpen = (event: React.MouseEvent, verse: Verse) => {
    if (!loggedIn) return;

    event.preventDefault();
    event.stopPropagation();

    // Check subscription status first
    if (!canUseComments) {
      // Show subscription prompt instead of comment form
      setSubscriptionPromptOpen(true);
      return;
    }

    // For subscribers, continue with opening the comment form
    setCommentsMenu(
      commentsMenu === null
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null
    );
    setCommentPosition({ x: event.clientX, y: event.clientY });
    setSlug(`${verse.book.trim()}-${verse.chapter}${verse.verse}`);
    setCommentOpen(true);
  };

  const paginatedResults = useMemo(() => {
    const startIndex = (searchPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return result.slice(startIndex, endIndex);
  }, [result, searchPage, resultsPerPage]);

  const paperRef = useRef<HTMLDivElement>(null);
  const [showPagination, setShowPagination] = useState(true);

  const handleScroll = () => {
    if (paperRef.current) {
      // Get Paper element's bottom position relative to viewport
      const paperBottom = paperRef.current.getBoundingClientRect().bottom;
      // Get viewport height
      const vh = window.innerHeight;
      // Calculate the threshold as a percentage of viewport height
      // 15% of viewport height from bottom
      const threshold = vh * 0.9;
      
      // If paperBottom is above viewport by more than the threshold
      // then hide pagination, otherwise show it
      setShowPagination(paperBottom > threshold);
    }
  };
  useEffect(() => {

    // Add scroll listener to window
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", mt: 5.75 }}>
        <CssBaseline />
        {/* Hide SideBar on mobile devices */}
        <Box sx={{ display: { xs: "none", sm: "flex" } }}>
          <SideBar
            handleToggle={handleToggle}
            open={open}
            toggleDrawer={toggleDrawer}
            checked={checked}
          />
        </Box>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#FFFFFF"
                : theme.palette.grey[900],
            flexGrow: 1,
            minHeight: "100vh",
            overflowX: "hidden",
            mt: { xs: "0.5rem", sm: "1rem" },
          }}
        >
          <TopToolbar
            handleColumns={handleColumns}
            handleFontSize={handleFontSize}
            verse={verse}
            page={page}
            fetchVerse={fetchVerse}
            setSearch={setSearch}
            setData={setData}
            setPage={setPage}
            setVerse={setVerse}
            loggedIn={loggedIn}
          />

          {visible.includes("search") && (
            <TextField
              inputProps={{
                "aria-labelledby": "switch-list-label-search",
                autoComplete: "new-password", // Alternative approach
                spellCheck: "false",
                autoCapitalize: "none",
              }}
              label="Search"
              id="searchBar"
              sx={{
                width: "auto",
                display: "flex",
                mx: 3,
                mt: "-0.98rem",
                WebkitBoxShadow: "none !important",
                "& .Mui-focused": {
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "black !important"
                      : "white !important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#ccc !important"
                        : "#FFF !important",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "black"
                        : "white !important",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                    WebkitTextFillColor: (theme) =>
                      theme.palette.mode === "light" ? "black" : "white",
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                },
                "& .MuiInputBase-input": {
                  color: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
                },
                "& .MuiInputBase-input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #212121AA inset",
                  WebkitTextFillColor: (theme) =>
                    theme.palette.mode === "light" ? "black" : "white",
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
              onChange={handleSearchChange}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                handleSearch(
                  e,
                  setData,
                  setVerse,
                  searchTerm,
                  setCount,
                  setPage
                )
              }
            />
          )}
          <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={checked.includes("guide") ? 8 : 12}
                lg={checked.includes("guide") ? 9 : 12}
              >
                <Paper
                  ref={paperRef}
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
                      mt: "-3.5rem",
                      width: "100%",
                    }}
                  >
                    {verse &&
                      verse.length >= 1 &&
                      capitalise(verse[0].book) +
                        " " +
                        verse[0].chapter +
                        ":" +
                        verse[verse.length - 1].verse}
                    {verse &&
                    verse.length > 0 &&
                    verse[0]?.book &&
                    verse[0]?.chapter && (
                        <VideoModal
                        currentBook={verse && verse[0].book}
                        currentChapter={verse && verse[0].chapter}
                      />
                    )}
                  </Typography>

                  <Typography
                    component="span"
                    gridColumn={3}
                    className="verse__container"
                    sx={{
                      fontFamily: "EB Garamond",
                      fontWeight: 200,
                      fontSize: `${textSize}px`,
                      display: "inline-block",
                      columns:
                        (verse && verse.length === 1) || isMobile ? 1 : columns,
                    }}
                  >
                    {verse && verse.length === 0 && result && (
                      <Grid
                        container
                        display={"flex"}
                        sx={{ marginBottom: "1rem", mt: "-2rem" }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.2rem",
                            marginRight: "9px",
                            display: "block",
                            width: "auto",
                          }}
                          className={`result__total ${verse ? "hide" : "show"}`}
                        >
                          {`${result.length}`}&nbsp;
                        </Typography>
                        <Select
                          value={resultsPerPage}
                          onChange={handleResultsPerPageChange}
                          sx={{
                            ml: 2,
                            padding: 0,
                            height: "2rem",
                            mt: "-0.3rem",
                            marginLeft: "3rem",
                          }}
                        >
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                        </Select>
                        <Typography
                          sx={{
                            display: "block",
                            mt: "0.20rem",
                            marginLeft: "1.2rem",
                            width: "auto",
                            fontSize: "0.7rem",
                          }}
                          className={`result__total ${verse ? "hide" : "show"}`}
                        ></Typography>
                      </Grid>
                    )}
                    {verse && verse.length >= 1
                      ? verse.map((v, index) => (
                          <span
                            key={index}
                            onContextMenu={(e) => handleContextMenu(e, v)}
                            onClick={() => handleVerseSelect(v)}
                            onKeyDown={(e) => {
                              if (e.key === "G" && e.metaKey) {
                                handleVerseSelect(v);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            style={{
                              cursor: "context-menu",
                            }}
                            className={`${
                              v.text === selectedVerse[0]?.text
                                ? "verse__selected"
                                : ""
                            } ${
                              highlightedVerses.includes(v.id.toString())
                                ? "highlight"
                                : "transparent"
                            }`}
                          >
                            <span className="verse__number">
                              {v.verse}&nbsp;
                            </span>
                            <span
                              className={`verse__text`}
                              style={{
                                backgroundColor: selectedVerse.includes(v)
                                  ? "rgba(173, 216, 230, 0.8)"
                                  : "transparent", // Feedback for selection
                              }}
                              onMouseEnter={(e) =>
                                handleMouseHover(e, setHover, setIsShown, {
                                  book: v.book,
                                  chapter: v.chapter,
                                  verse: v.verse,
                                })
                              }
                              // use mouse leave to reset context menu selection
                              // onMouseLeave={() => setIsShown(false)}
                            >
                              <span style={{ position: "relative", width: 1, }}>
                                {v.text === selectedVerse[0]?.text && (
                                  <Box sx={{
                                    position: "relative",
                                    width: 10,
                                    height: 10,
                                  }}>
                                    <Tooltip
                                      title={
                                        loggedIn
                                          ? "Add Comment"
                                          : "Sign In To Comment"
                                      }
                                      sx={{
                                      }}
                                      >
                                      <IconButton
                                        onClick={(e) =>
                                          handleCommentOpen(e, selectedVerse[0])
                                        }
                                        sx={{
                                          padding: 1,
                                          opacity: 1,
                                          mt: -10,
                                          ml: 1,
                                          position: "relative",
                                          background: (theme) =>
                                            theme.palette.mode === "light"
                                          ? "#a1a1a1"
                                          : "#a1a1a1",
                                          backgroundColor: "#a1a1a1",
                                          "&:hover": {
                                            background: "#b3b3b3", // A lighter shade of #a1a1a1
                                          },
                                        }}
                                      >
                                        {loggedIn ? (
                                          <CommentIcon fontSize="small" />
                                        ) : (
                                          <CommentsDisabledIcon fontSize="small" />
                                        )}
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                      title={
                                        
                                          highlightedVerses.includes(v.id.toString())
                                          ? "Remove Highlight"
                                          : "Highlight Verse"
                                      }
                                    >
                                      <IconButton
                                        onClick={() => handleHighlight()}
                                          sx={{
                                            padding: 1,
                                            opacity: 1,
                                            mt: -16,
                                            ml: 7,
                                            position: "relative",
                                            background: (theme) =>
                                              theme.palette.mode === "light"
                                                ? "#a1a1a1"
                                                : "#a1a1a1",
                                            "& .MuiIconButton-root": {  
                                              background: (theme) =>
                                                theme.palette.mode === "light"
                                                  ? "aA1a1a1"
                                                  : "#212121"
                                            },
                                            "&:hover": {
                                              background: "#b3b3b3", // A lighter shade of #a1a1a1
                                            },
                                          }}
                                      >
                                          <BorderColorIcon  fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                )}
                                {/* Favourite Verses Functionality */}
                                {/* {v.text === selectedVerse[0]?.text && (
                                <Tooltip
                                  title={loggedIn ? "Like" : "Sign In To Like"}
                                >
                                  <IconButton
                                    // onClick
                                    sx={{
                                      padding: 1,
                                      opacity: 1,
                                      mt: -10,
                                      ml: 2,
                                      position: "relative",
                                      background: (theme) =>
                                        theme.palette.mode === "light"
                                          ? "#a1a1a1"
                                          : "#a1a1a1",
                                      "& .MuiIconButton-root": {  
                                        background: (theme) =>
                                          theme.palette.mode === "light"
                                            ? "aA1a1a1"
                                            : "#212121"
                                      },
                                      "&:hover": {
                                        background: "#b3b3b3", // A lighter shade of #a1a1a1
                                      },
                                    }}
                                  >
                                    <FavoriteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )} */}
                              </span>
                              {v.text}&nbsp;
                            </span>

                            <MenuPanel
                              contextMenu={contextMenu}
                              setContextMenu={setContextMenu}
                              selectedVerse={selectedVerse}
                              setSelectedVerse={setSelectedVerse}
                              highlightedVerses={highlightedVerses}
                              toggleHighlight={toggleHighlight}
                              handleHighlight={handleHighlight}
                              handleClose={handleClose}
                              search={search}
                              loggedIn={loggedIn}
                            />
                          </span>
                        ))
                      : result &&
                        paginatedResults.map((home, index) => (
                          <span
                            onContextMenu={(e) => handleContextMenu(e, home)}
                            style={{ cursor: "context-menu" }}
                            key={index}
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
                              onMouseEnter={(e) =>
                                handleMouseHover(e, setHover, setIsShown, {
                                  book: home.book,
                                  chapter: home.chapter,
                                  verse: home.verse,
                                })
                              }
                            >
                              {home.text}&nbsp;
                            </span>
                            <MenuPanel
                              contextMenu={contextMenu}
                              setContextMenu={() => setContextMenu(null)}
                              selectedVerse={selectedVerse}
                              search={search}
                              highlightedVerses={undefined}
                              toggleHighlight={undefined}
                              handleHighlight={undefined}
                              handleClose={undefined}
                              setSelectedVerse={undefined}
                              loggedIn={undefined}
                            />
                            <br></br>
                            <br></br>
                            <br></br>
                          </span>
                        ))}
                  </Typography>

                  {verse && verse.length > 1 && showPagination && (
                      <Pagination
                        sx={{
                          opacity: 1,
                          position: "fixed",
                          marginLeft: "-64px",
                          pl: { xs: 3, sm: 1 },
                          mt: "83px", // 83 Samantha
                          width: "min-content",
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                              ? "#FFFFFF"
                              : '#212121',
                          "& .Mui-selected": {
                            opacity: 0.5,
                            backgroundColor: "rgb(0,0,0,0,0.04)",
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "#000000" // Black text color for light mode
                                : "#FFFFFF", // White text color for dark mode
                          },
                          "& .Mui-hover": {
                            opacity: 0.5,
                            backgroundColor: "rgb(0,0,0,0,0.04)",
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "#000000" // Black text color for light mode
                                : "#FFFFFF", // White text color for dark mode
                          },
                        }}
                        count={Number(fetchCount(verse && verse[0]?.book))}
                        page={page}
                        onChange={(e, value) => handleChange(e, value, verse)}
                      />
                  )}
                  {search &&
                    result &&
                    result.length === 0 &&
                    verse &&
                    verse.length === 0 &&
                    !loading && (
                      <Typography
                        sx={{
                          display: "block",
                          mt: "-3rem",
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
                          opacity: 1,
                          position: "fixed",
                          marginLeft: { xs: ".5rem", sm: "1rem" },
                          pr: { xs: 5, sm: 1 },
                          mt: "83px", // 83 Samantha
                          width: "min-content",
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                              ? "#FFFFFF"
                              : '#212121',
                          "& .Mui-selected": {
                            opacity: 0.5,
                            backgroundColor: "rgb(0,0,0,0,0.04)",
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "#000000" // Black text color for light mode
                                : "#FFFFFF", // White text color for dark mode
                          },
                          "& .Mui-hover": {
                            opacity: 0.5,
                            backgroundColor: "rgb(0,0,0,0,0.04)",
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "#000000" // Black text color for light mode
                                : "#FFFFFF", // White text color for dark mode
                          },
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
            {commentOpen && selectedVerse && (
              <SubscriptionCheck feature="comments">
                <FloatingCommentForm
                  user={user}
                  open={commentOpen}
                  commentsMenu={commentsMenu}
                  setOpen={setCommentOpen}
                  position={commentPosition}
                  loggedIn={loggedIn}
                  comments={comments}
                  setComments={setComments}
                  setCommentsMenu={setCommentsMenu}
                  slug={slug}
                  setSlug={setSlug}
                  selectedVerse={selectedVerse}
                  setSelectedVerse={setSelectedVerse}
                  handleClose={handleClose}
                />
              </SubscriptionCheck>
            )}
            <WPLoginModal user={user} wpToken={wpToken} setToken={setWpToken} />
            <SubscriptionPromptDialog
              open={subscriptionPromptOpen}
              onClose={() => setSubscriptionPromptOpen(false)}
              feature="comments"
            />
          </Container>
        </Box>

        {commentOpen && <Alert message={""} link="" />}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <SubscriptionCheck feature="progress">
          <ReadingProgressToast
            book={verse && verse.length > 1 && search ? verse[0]?.book : ""}
            chapter={page}
            wpToken={wpToken || Cookies.get('wpToken') || ''}
            isPaginationChange={verse && verse.length > 0 && !result}
            user={user}
          />
        </SubscriptionCheck>
      </Box>
    </>
  );
};

export default function Dashboard({
  loggedIn,
  user,
  wpToken,
  setWpToken,
}: {
  loggedIn: boolean;
  user: any;
  wpToken: string | null;
  setWpToken: (token: string | null) => void;
}) {
  return (
    <DashboardContent
      loggedIn={loggedIn}
      user={user}
      wpToken={wpToken}
      setWpToken={setWpToken}
    />
  );
}
