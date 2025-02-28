import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useHighlight = () => {
  const [highlightedVerses, setHighlightedVerses] = useState([]);

  useEffect(() => {
    const savedHighlights = Cookies.get("highlightedVerses");
    // console.log("Saved cookie highlights:", savedHighlights);  // Debugging log to check cookie data
    
    if (savedHighlights) {
      // Parse and ensure all values are strings
      const parsedHighlights = JSON.parse(savedHighlights);
      setHighlightedVerses(parsedHighlights);
    }
  }, []);

  const toggleHighlight = (verseId) => {
    // Log the ID being toggled to ensure correctness
    // console.log("Toggling Highlight for verse ID:", verseId);
  
    setHighlightedVerses((prev) => {
      // Store the ID as a string to avoid precision loss
      const stringVerseId = String(verseId);
      
      const updated = prev.includes(stringVerseId)
        ? prev.filter((id) => id !== stringVerseId)  // Remove if already highlighted
        : [...prev, stringVerseId];  // Add if not highlighted
  
      // console.log("Updated highlightedVerses:", updated);  // Log the updated state
  
      // Save to cookie as an array of strings
      Cookies.set("highlightedVerses", JSON.stringify(updated), { expires: 365 });
  
      return updated;
    });
  };

  return { highlightedVerses, toggleHighlight };
};

export default useHighlight;