import React from "react";
import { toSentenceCase } from "../../../../../utils/constants";

const Value = ({ text, className, valueWrap = true, hasTwoValueRows }) => {
  const baseStyle = {
    color: "black",
    border: "0.5px solid black",
    fontSize: "13px",
    textAlign: "center",
    whiteSpace: "nowrap",
    display: "flex",
    justifyContent: "center",
    height: "100%",
    padding: "4px 5px", // py-1 px-[5px]
    fontWeight: "600", // font-semibold
  };

  const conditionalStyles = {
    ...(valueWrap && { whiteSpace: "pre-wrap" }),
    ...(hasTwoValueRows && { height: "82px" }),
  };

  // Merge base styles with conditional styles
  const finalStyle = {
    ...baseStyle,
    ...conditionalStyles,
    ...(className && { className }), // Keep className compatibility if needed
  };

  return (
    <div
      style={{
        color: "black",
        border: "0.5px solid black",
        textAlign: "center",
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: "center",
        height: "100%",
        padding: "8px 5px", // py-1 px-[5px]
        fontWeight: "600", // font-semibold
      }}
    >
      <p
        style={{
          fontSize: "15px",
          textAlign: "center",
        }}
      >
        {typeof text === "string" ? toSentenceCase(text) : text}
      </p>
    </div>
  );
};

export default Value;
