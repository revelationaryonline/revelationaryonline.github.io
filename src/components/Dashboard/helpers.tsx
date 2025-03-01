import React, { useRef, useState, useEffect } from 'react';
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { booksArr } from "../../utils/constants";

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
export const capitalise = (str: string) => {
  if(!str) return;
  const res = str.split("");
  res[0] = res[0].toUpperCase();
  return res.join("");
};

// check Book Title for Numbers (Words to Integers)
export const checkNumbers = (arr: any[]) => {
  
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
export const handleMouseHover = (e: any, setHover: (arg0: any) => void, setIsShown: (arg0: boolean) => void) => {
  setHover(e);
  setIsShown(true);
};

// SearchBar
export const handleSearch = async (e: { keyCode: number; target: { value: string; }; }, setData: any, setVerse: any, searchTerm: (arg0: any) => void, setBookmark: (arg0: { book: any; chapter: any; verse: any; }) => void) => {
  if (e.keyCode === 13) {
    const str = e.target.value.split(" ");
    let m;
    let ver: string | any[] = [];

    if (str.length >= 1 && !str.join(" ").includes('"')) {
      // work on array manipulation to map and filter original search term and
      const lwrCase = booksArr.map((book: string, index: any) => {
        return book.toLowerCase();
      });
      // matches with capital letters and lower case

      const matchBook =
        (await booksArr.includes(str[0])) || lwrCase.includes(str[0]);
      const matchBookWithNumbers = await checkNumbers(str);
      const regex = new RegExp("[0-9]*:[0-9]*", "gm");

      // match book level first
      if (matchBook) {
        console.log("match book: " + matchBook);
        while ((m = regex.exec(str.join(" "))) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          // look for the chapter:verse numbers (seeparated by a colon ":" ie. 12:27)
          // eslint-disable-next-line
          m.forEach((match, groupIndex) => {
            ver = match.split(":");
            // return the verse as an array of the two digits (chapter and verse)
            return ver;
          });
        }
        if (ver.length > 1 && !str.join(" ").includes('"')) {
          setBookmark({
            book: str[0], 
            chapter: ver[0],
            verse: ver[1]
          })
          fetchVerse(str[0], ver[0], ver[1], setData, setVerse);
        } else {
          fetchVerse(str[0], 1, "", setData, setVerse);
        }

        if (str.join(" ").includes('"')) {
          searchTerm(str.join(" "));
        }
      } else if (matchBookWithNumbers) {
        //search again but this time with the transformed book title
        // from 1 kings to firstKings so it matches the database
        while ((m = regex.exec(str.join(" "))) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          // The result can be accessed through the `m`-variable.
          // eslint-disable-next-line
          m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            ver = match.split(":");
            return ver;
          });
        }
        if (ver.length > 1) {
          fetchVerse(matchBookWithNumbers, ver[0], ver[1], setData, setVerse);
          setBookmark({
            book: matchBookWithNumbers, 
            chapter: ver[0], 
            verse: ver[1]
          })
        } else {
          fetchVerse(matchBookWithNumbers, 1, "", setData, setVerse);
          setBookmark({
            book: matchBookWithNumbers, 
            chapter: 1,
            verse: ""
          })
        }
      } else {
        fetchVerse(str[0], 1, "", setData, setVerse);
        setBookmark({
          book: str[0], 
          chapter: 1,
          verse: ""})
      }
    }
  }
};

/* DATA DRIVEN */

// fetch Verse
export const fetchVerse = async (book: string, chapter: number, verse: string, setData: (arg0: any) => void, setVerse: (arg0: any) => void) => {
  try {
    await fetch(
      `https://kjvapp.com/api/${book + "/"}${chapter}/${verse !== "" ? Number(verse) : ""
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
export const fetchCount = async (book: any, setCount: (arg0: any) => void) => {
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
export const FadeOutSection = (children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => {
  // add y scroll position to reload when y == 0 (top of page)
  const [isVisible, setVisible] = React.useState(true);
  const domRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {

    if (isVisible === true) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => setVisible(entry.isIntersecting));
      }, { threshold: 0.1 });
      if (domRef.current) {
        observer.observe(domRef.current);
      }
      return () => {
        if (domRef.current) {
          observer.unobserve(domRef.current);
        }
      };
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
export const FadeInSection = (children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => {
  // add y scroll position to reload when y == 0 (top of page)
  const [isVisible, setVisible] = useState(true);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry =>
        setVisible(entry.isIntersecting)
      );
    });
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
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