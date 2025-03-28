import React from "react";

const Heading = ({ text, className, children }) => {
  const baseStyle = {
    color: "#15803d", // green-700 equivalent
    textTransform: "uppercase",
    fontWeight: "800", // font-extrabold
    fontSize: "18px",
    // border: "0.2rem solid $primary-color",
    // padding: "1rem",
    // backgroundColor: "#99cc99",
  };

  // Merge base styles with className if provided
  const finalStyle = {
    ...baseStyle,
    ...(className && { className }), // Keep className compatibility
  };

  return <h3 style={finalStyle}>{text ? text : children}</h3>;
};

export default Heading;
