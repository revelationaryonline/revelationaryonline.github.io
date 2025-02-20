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

export const fetchCount = (book) => {

  const bookSources = {
    genesis: {
      1: 50
    },
    exodus: {
      1: 40
    },
    leviticus: {
      1: 27
    },
    numbers: {
        1: 36
    },
    deuteronomy: {
        1: 34
    },
    joshua: {
        1: 24
    },
    judges: {
        1: 21
    },
    ruth: {
        1: 4
    },
    firstSamuel: {
        1: 31
    },
    secondSamuel: {
        1: 24
    },
    firstKings: {
        1: 22
    },
    secondKings: {
        1: 25
    },
    firstChronicles: {
        1: 29
    },
    secondChronicles: {
        1: 36
    },
    ezra: {
        1: 10
    },
    nehemiah: {
        1: 13
    },
    esther: {
        1: 10
    },
    job: {
        1: 42
    },
    psalms: {
        1: 150
    },
    proverbs: {
        1: 31
    },
    ecclesiastes: {
        1: 12
    },
    songOfSolomon: {
        1: 8
    },
    isaiah: {
        1: 66
    },
    jeremiah: {
        1: 52
    },
    lamentations: {
        1: 5
    },
    ezekiel: {
        1: 48
    },
    daniel: {
        1: 12
    },
    hosea: {
        1: 14
    },
    joel: {
        1: 3
    },
    amos: {
        1: 9
    },
    obadiah: {
        1: 1
    },
    jonah: {
        1: 4
    },
    micah: {
        1: 7
    },
    nahum: {
        1: 3
    },
    habakkuk: {
        1: 3
    },
    zephaniah: {
        1: 3
    },
    haggai: {
        1: 2
    },
    zechariah: {
        1: 14
    },
    malachi: {
        1: 4
    },
    matthew: {
        1: 28
    },
    mark: {
        1: 16
    },
    luke: {
        1: 24
    },
    john: {
        1: 21
    },
    acts: {
        1: 28
    },
    romans: {
        1: 16
    },
    firstCorinthians: {
        1: 16
    },
    secondCorinthians: {
        1: 13
    },
    galatians: {
        1: 6
    },
    ephesians: {
        1: 6
    },
    philippians: {
        1: 4
    },
    colossians: {
        1: 4
    },
    firstThessalonians: {
        1: 5
    },
    secondThessalonians: {
        1: 3
    },
    firstTimothy: {
        1: 6
    },
    secondTimothy: {
        1: 4
    },
    titus: {
        1: 3
    },
    philemon: {
        1: 1
    },
    hebrews: {
        1: 13
    },
    james: {
        1: 5
    },
    firstPeter: {
        1: 5
    },
    secondPeter: {
        1: 3
    },
    firstJohn: {
        1: 5
    },
    secondJohn: {
        1: 1
    },
    thirdJohn: {
        1: 1
    },
    jude: {
        1: 1
    },
    revelation: {
        1: 22
    }
  };

  if (!book) {
    console.log("Missing book or chapter:", book );
    return "";
  }

  // Trim spaces and make sure the format is correct
  const cleanBook = book.trim().replace(/\s+/g, "-").toLowerCase();
  // const cleanChapter = chapter.toString().trim();

  if (bookSources[cleanBook]) {
      return bookSources[cleanBook][1]
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