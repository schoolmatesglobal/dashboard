import React, { useEffect, useState } from "react";

const useMyMediaQuery3 = () => {
  const [xs, setXs] = useState(false);
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(false);
  const [lg, setLg] = useState(false);
  const [xl, setXl] = useState(false);
  const [xxl, setXxl] = useState(false);

  useEffect(() => {
    const updateMediaQuery = () => {
      setXs(window.matchMedia("(min-width: 349px)").matches);
      setSm(window.matchMedia("(min-width: 540px)").matches);
      setMd(window.matchMedia("(min-width: 768px)").matches);
      setLg(window.matchMedia("(min-width: 1024px)").matches);
      setXl(window.matchMedia("(min-width: 1280px)").matches);
      setXxl(window.matchMedia("(min-width: 1536px)").matches);
    };

    updateMediaQuery(); // Initial check
    window.addEventListener("resize", updateMediaQuery); // Listen to resize events

    return () => {
      window.removeEventListener("resize", updateMediaQuery); // Clean up the listener
    };
  }, []);

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
  };
};

export default useMyMediaQuery;
