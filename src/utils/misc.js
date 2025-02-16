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

export const fetchCount = async (book) => {

  switch (book) {
    case 'genesis':
      return 50;
    case 'exodus':
      return 40;
    case 'leviticus':
      return 27;
    case 'numbers':
      return 36;
    case 'deuteronomy':
      return 34;
    case 'joshua':
      return 24;
    case 'judges':
      return 21;
    case 'ruth':
      return 4;
    case '1 samuel':
      return 31;
    case '2 samuel':
      return 24;
    case '1 kings':
      return 22;
    case '2 kings':
      return 25;
    case '1 chronicles':
      return 29;
    case '2 chronicles':
      return 36;
    case 'ezra':
      return 10;
    case 'nehemiah':
      return 13;
    case 'esther':
      return 10;
    case 'job':
      return 42;
    case 'psalms':
      return 150;
    case 'proverbs':
      return 31;
    case 'ecclesiastes':
      return 12;
    case 'song of solomon':
      return 8;
    case 'isaiah':
      return 66;
    case 'jeremiah':
      return 52;
    case 'lamentations':
      return 5;
    case 'ezekiel':
      return 48;
    case 'daniel':
      return 12;
    case 'hosea':
      return 14;
    case 'joel':
      return 3;
    case 'amos':
      return 9;
    case 'obadiah':
      return 1;
    case 'jonah':
      return 4;
    case 'micah':
      return 7;
    case 'nahum':
      return 3;
    case 'habakkuk':
      return 3;
    case 'zephaniah':
      return 3;
    case 'haggai':
      return 2;
    case 'zechariah':
      return 14;
    case 'malachi':
      return 4;
    case 'matthew':
      return 28;
    case 'mark':
      return 16;
    case 'luke':
      return 24;
    case 'john':
      return 21;
    case 'acts':
      return 28;
    case 'romans':
      return 16;
    case '1 corinthians':
      return 16;
    case '2 corinthians':
      return 13;
    case 'galatians':
      return 6;
    case 'ephesians':
      return 6;
    case 'philippians':
      return 4;
    case 'colossians':
      return 4;
    case '1 thessalonians':
      return 5;
    case '2 thessalonians':
      return 3;
    case '1 timothy':
      return 6;
    case '2 timothy':
      return 4;
    case 'titus':
      return 3;
    case 'philemon':
      return 1;
    case 'hebrews':
      return 13;
    case 'james':
      return 5;
    case '1 peter':
      return 5;
    case '2 peter':
      return 3;
    case '1 john':
      return 5;
    case '2 john':
      return 1;
    case '3 john':
      return 1;
    case 'jude':
      return 1;
    case 'revelation':
      return 22;  
    default:
      break;
  }

}

// SearchBar
export const handleSearch = async (e, setData, setVerse, searchTerm, setBookmark, setCount, setPage) => {
  setPage(1)
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
            setCount(fetchCount(str[0]))
            setPage(1)
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
            setCount(fetchCount(matchBookWithNumbers))
            setPage(1)
          } else {
            fetchVerse(matchBookWithNumbers, 1, "", setData, setVerse);
            setBookmark({
              book: matchBookWithNumbers,
              chapter: 1,
              verse: "",
            });
            setCount(fetchCount(matchBookWithNumbers))
            setPage(1)
          }
        } else {
          fetchVerse(str[0], 1, "", setData, setVerse);
          setBookmark({
            book: str[0],
            chapter: 1,
            verse: "",
          });
          setCount(fetchCount(str[0]))
          setPage(1)
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

// // Fetch Count
// export const fetchCount = async (book, setCount) => {
//   try {
//     return await fetch(`https://kjvapp.com/api/${book}/chapters`)
//       .then((res) => res.json())
//       .then((res) => {
//         setCount(res[0].count);
//       });
//   } catch (e) {
//     console.log(e);
//   }
// };



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