import React, { useRef, useState, useEffect } from 'react';
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { booksArr } from "./constants";

/* 
*
*   HELPER FUNCTIONS 
*
*/

/* #FONTs */

// bullet point
export const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

// capitalise
export const capitalise = (str) => {
  let res = str.split("");
  res[0] = res[0].toUpperCase();
  return res.join("");
};

// check Book Title for Numbers (Words to Integers)
export const checkNumbers = (arr) => {
  let res = "";
  switch (true) {
    case arr[0].includes("first"):
      res = `first${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("First"):
      res = `first${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("1st"):
      res = `first${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("1"):
      res = `first${capitalise(arr[1])}`;
      return res;
    case arr[0].includes(1):
      res = `first${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("second"):
      res = `second${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("Second"):
      res = `second${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("2nd"):
      res = `second${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("2"):
      res = `second${capitalise(arr[1])}`;
      return res;
    case arr[0].includes(2):
      res = `second${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("third"):
      res = `third${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("Third"):
      res = `third${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("3rd"):
      res = `third${capitalise(arr[1])}`;
      return res;
    case arr[0].includes("3"):
      res = `third${capitalise(arr[1])}`;
      return res;
    case arr[0].includes(3):
      res = `third${capitalise(arr[1])}`;
      return res;
    default:
      return arr[0];
  }
};

/* EVENTs */

// Mouse
export const handleMouseHover = (e, setHover, setIsShown) => {
  setHover(e);
  setIsShown(true);
};

// SearchBar
export const handleSearch = async (e, setData, setVerse, searchTerm, setBookmark) => {
  if (e.keyCode === 13) {
    const term = e.target.value;
    if ((term.match(/"/g) || []).length >= 2) {
      searchTerm(term);
    } else {
      let str = term.split(" ");
      let m;
      let ver = [];

      if (str.length >= 1 && !str.join(" ").includes('"')) {
        let lwrCase = booksArr.map((book) => book.toLowerCase());
        let matchBook = booksArr.includes(str[0]) || lwrCase.includes(str[0]);
        let matchBookWithNumbers = checkNumbers(str);
        const regex = new RegExp("[0-9]*:[0-9]*", "gm");

        if (matchBook) {
          while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            m.forEach((match) => {
              ver = match.split(":");
              return ver;
            });
          }
          if (ver.length > 1 && !str.join(" ").includes('"')) {
            setBookmark({
              book: str[0],
              chapter: ver[0],
              verse: ver[1],
            });
            fetchVerse(str[0], ver[0], ver[1], setData, setVerse);
          } else {
            fetchVerse(str[0], 1, "", setData, setVerse);
          }
        } else if (matchBookWithNumbers) {
          while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            m.forEach((match) => {
              ver = match.split(":");
              return ver;
            });
          }
          if (ver.length > 1) {
            fetchVerse(matchBookWithNumbers, ver[0], ver[1], setData, setVerse);
            setBookmark({
              book: matchBookWithNumbers,
              chapter: ver[0],
              verse: ver[1],
            });
          } else {
            fetchVerse(matchBookWithNumbers, 1, "", setData, setVerse);
            setBookmark({
              book: matchBookWithNumbers,
              chapter: 1,
              verse: "",
            });
          }
        } else {
          fetchVerse(str[0], 1, "", setData, setVerse);
          setBookmark({
            book: str[0],
            chapter: 1,
            verse: "",
          });
        }
      }
    }
  }
};

/* DATA DRIVEN */

// fetch Verse
export const fetchVerse = async (book, chapter, verse, setData, setVerse) => {
  try {
    await fetch(
      `https://kjvapp.com/api/${book + "/"}${chapter}/${verse !== "" ? new Number(verse) : ""
      }`
    )
      .then((res) => res.json())
      .then(async (res) => {
        // console.log(res);
        if (res.length >= 1 && res[0].text) {
          setData(res);
          setVerse(res);
        } else {
          console.log(res[0]);
        }
      });
  } catch (e) {
    console.log(e);
  }
};

// Fetch Count
export const fetchCount = async (book, setCount) => {
  try {
    return await fetch(`https://kjvapp.com/api/${book}/chapters`)
      .then((res) => res.json())
      .then((res) => {
        setCount(res[0].count);
      });
  } catch (e) {
    console.log(e);
  }
};



/* UI */
// ANIMATION DRIVEN 
// Fade Out Section
export const FadeOutSection = (children) => {
  // add y scroll position to reload when y == 0 (top of page)
  const [isVisible, setVisible] = React.useState(true);
  const domRef = React.useRef();
  React.useEffect(() => {

    if (isVisible === true) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => setVisible(entry.isIntersecting));
      }, []);
      observer.observe(domRef.current);
      return () => observer.unobserve(domRef.current);
    }
  }, [isVisible]);
  return (
    <div
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
    >
      {children}
    </div>
  );
}

// Fade In Section
export const FadeInSection = (children) => {
  // add y scroll position to reload when y == 0 (top of page)
  const [isVisible, setVisible] = useState(true);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry =>
        setVisible(entry.isIntersecting)
      );
    });
    observer.observe(domRef.current);
    return () => observer.unobserve(domRef.current);
  }, []);

  return (
    <div
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
    >
      {children}
    </div>
  );

}

export let mdTheme = createTheme({ palette: { mode: "dark" } });

const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
if (darkThemeMq.matches) {
  // Theme set to dark.
  mdTheme = createTheme({ palette: { mode: "dark" } });
} else {
  // Theme set to light.
  mdTheme = createTheme({ palette: { mode: "light" } });
}