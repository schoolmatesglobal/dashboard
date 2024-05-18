import React, { useEffect, useState } from "react";

const useMyMediaQuery2 = () => {
  const [xs, setXs] = useState(false);
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(false);
  const [lg, setLg] = useState(false);
  const [xl, setXl] = useState(false);
  const [xxl, setXxl] = useState(false);

  useEffect(() => {
    const updateMediaQuery = () => {
      setXs(window.matchMedia("(max-width: 350px)").matches);
      setSm(
        window.matchMedia("(min-width: 351px) and (max-width: 540px)").matches
      );
      setMd(
        window.matchMedia("(min-width: 541px) and (max-width: 768px)").matches
      );
      setLg(
        window.matchMedia("(min-width: 769px) and (max-width: 1024px)").matches
      );
      setXl(
        window.matchMedia("(min-width: 1025px) and (max-width: 1280px)").matches
      );
      setXxl(window.matchMedia("(min-width: 1281px)").matches);
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

export default useMyMediaQuery2;
