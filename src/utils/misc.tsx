import React, { useRef, useState, useEffect, ReactNode } from 'react';
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
export const capitalise = (str: string): string => {
  let res = str.split("");
  res[0] = res[0].toUpperCase();
  return res.join("");
};

// check Book Title for Numbers (Words to Integers)
export const checkNumbers = (arr: unknown[] | string[]): string => {
  let res = "";
  switch (true) {
    case (arr[0] as string).includes("first"):
      res = `first${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("First"):
      res = `first${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("1st"):
      res = `first${capitalise(arr[1] as string)}` as unknown as string;
      return res;
    case (arr[0] as string).includes("1"):
      res = `first${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as number).toString().includes("1"):
      res = `first${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string ).includes("second"):
      res = `second${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("Second"):
      res = `second${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("2nd"):
      res = `second${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("2"):
      res = `second${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as number).toString().includes("2"):
      res = `second${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("third"):
      res = `third${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("Third"):
      res = `third${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("3rd"):
      res = `third${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as string).includes("3"):
      res = `third${capitalise(arr[1] as string)}`;
      return res;
    case (arr[0] as number).toString().includes("3"):
      res = `third${capitalise(arr[1] as string)}`;
      return res;
    default:
      return (arr[0] as string | number).toString();
  }
};

/* EVENTs */

// Mouse
export const handleMouseHover = (
  e: React.MouseEvent,
  setHover: React.Dispatch<React.SetStateAction<React.MouseEvent | null>>,
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setHover(e);
  setIsShown(true);
};

const bookSources: { [key: string]: { [key: number]: number } } = {
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

export const fetchCount = (book: string): number | string => {

  if (!book) {
    console.log("Missing book or chapter:", book );
    return "";
  }

  // Trim spaces and make sure the format is correct
  const cleanBook = book.trim().replace(/\s+/g, "-");

  if (bookSources[cleanBook]) {
      return bookSources[cleanBook][1]
  }

  return "";
}

// SearchBar
export const handleSearch = async (
  e: React.KeyboardEvent<HTMLInputElement>,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  setVerse: React.Dispatch<React.SetStateAction<any[]>>,
  searchTerm: (term: string) => void,
  setCount: React.Dispatch<React.SetStateAction<number | string>>,
  setPage: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  setPage(1)
  if (e.keyCode === 13) {
    const term = (e.target as HTMLInputElement).value;
    if ((term.match(/"/g) || []).length >= 2) {
      searchTerm(term);
    } else {
      let str = term.split(" ");
      let m: RegExpExecArray | null;
      let ver: string[] = [];

      if (str.length >= 1 && !str.join(" ").includes('"')) {
        let lwrCase = booksArr.map((book) => book.toLowerCase());
        let matchBook = booksArr.includes(str[0]) || lwrCase.includes(str[0]);
        let matchBookWithNumbers = checkNumbers(str) as string;
        const regex = new RegExp("[0-9]*:[0-9]*", "gm");

        if (matchBook) {
          while ((m = regex.exec(str.join(" "))) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            m.forEach((match) => {
              ver = match.split(":");
              return ver;
            });
          }
          if (ver.length > 1 && !str.join(" ").includes('"')) {
            fetchVerse(str[0], ver[0], ver[1], setData, setVerse);
            setCount(fetchCount(str[0]))
            setPage(1)
          } else {
            fetchVerse(str[0], 1, "", setData, setVerse);
          }
        } else if (matchBookWithNumbers) {
          while ((m = regex.exec(str.join(" "))) !== null) {
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
            setCount(await fetchCount(matchBookWithNumbers))
            setPage(1)
          } else {
            fetchVerse(matchBookWithNumbers, 1, "", setData, setVerse);
            setCount(await fetchCount(matchBookWithNumbers))
            setPage(1)
          }
        } else {
          fetchVerse(str[0], 1, "", setData, setVerse);
          setCount(await fetchCount(matchBookWithNumbers))
          setPage(1)
        }
      }
    }
  }
};

/* DATA DRIVEN */

// fetch Verse
export const fetchVerse = async (
  book: string,
  chapter: string | number,
  verse: string | number,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  setVerse: React.Dispatch<React.SetStateAction<any[]>>
): Promise<void> => {

  try {
    await fetch(
      `https://kjvapp.com/api/${book + "/"}${chapter}/${verse !== "" ? Number(verse) : ""
      }`
    )
      .then((res) => res.json())
      .then(async (res) => {
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

/* UI */
// ANIMATION DRIVEN 
// Fade Out Section
export const FadeOutSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setVisible] = useState(true);
  const domRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isVisible === true) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => setVisible(entry.isIntersecting));
      }, {});
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
export const FadeInSection: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  )
}

export let mdTheme = createTheme({ palette: { mode: "dark" } });

const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
if (darkThemeMq.matches) {
  mdTheme = createTheme({ palette: { mode: "dark" } });
} else {
  mdTheme = createTheme({ palette: { mode: "light" } });
}