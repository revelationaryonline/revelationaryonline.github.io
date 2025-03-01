import React from "react";
import { Link, SvgIcon, useTheme } from "@mui/material";

const GraphicTextEffect = ({
  text = "STATES",
  width = 1200,
  height = 400,
  fontSize = 240,
  id = "svg-text"
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const computedFontSize = fontSize || width * 0.15; // 15% of width

  return (
    <Link href="#">
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      id={id}
      className={theme && isDarkMode ? "light-svg" : "dark-svg"}
      style={{ background: "transparent", overflow: "visible" }}
    >
      <defs>
        <filter id="money">
          {/* Morphology to expand the text for shadowing */}
          <feMorphology
            in="SourceGraphic"
            operator="dilate"
            radius="2"
            result="expand"
          />
          
          {/* Creating layered shadows with increasing offsets */}
          {[...Array(7)].map((_, i) => (
            <feOffset
              key={i}
              in="expand"
              dx={i + 1}
              dy={i + 1}
              result={`shadow_${i + 1}`}
            />
          ))}
          
          {/* Merge all shadow layers */}
          <feMerge result="shadow">
            <feMergeNode in="expand" />
            {[...Array(7)].map((_, i) => (
              <feMergeNode key={i} in={`shadow_${i + 1}`} />
            ))}
          </feMerge>

          {/* Apply color for the shadow */}
          <feFlood floodColor={isDarkMode ? "#ebe7e0" : "#ebe7e0"} />
          <feComposite in2="shadow" operator="in" result="shadow" />

          {/* Morphology for the border around the shadow */}
          <feMorphology in="shadow" operator="dilate" radius="1" result="border" />
          <feFlood floodColor={isDarkMode ? "#35322a" : "#35322a"} result="border_color" />
          <feComposite in2="border" operator="in" result="border" />

          {/* Creating further shadows around the border */}
          {[...Array(11)].map((_, i) => (
            <feOffset
              key={i}
              in="border"
              dx={i + 1}
              dy={i + 1}
              result={`secondShadow_${i + 1}`}
            />
          ))}
          
          {/* Merge all second-layer shadows */}
          <feMerge result="secondShadow">
            <feMergeNode in="border" />
            {[...Array(11)].map((_, i) => (
              <feMergeNode key={i} in={`secondShadow_${i + 1}`} />
            ))}
          </feMerge>

          {/* Stripes Image */}
          <feImage
            x="0"
            y="0"
            width={width}
            height={height}
            xlinkHref="https://s3-us-west-2.amazonaws.com/s.cdpn.io/78779/stripes.svg"
          />
          
          {/* Combine the shadows and stripes */}
          <feComposite in2="secondShadow" operator="in" result="secondShadow" />

          {/* Final merge of all effects */}
          <feMerge>
            <feMergeNode in="secondShadow" />
            <feMergeNode in="border" />
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The text element */}
      <text
        dominantBaseline="middle"
        textAnchor="middle"
        x="48.5%"
        y="50%"
        fontSize={computedFontSize}
        style={{
          fill: isDarkMode ? "#ebe7e0" : "#35322a",
          filter: "url(#money)",
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontWeight: 900
        }}
      >
        {text}
      </text>
    </svg>
    </Link>
  );
};


export default GraphicTextEffect;