import React, { createContext, useState } from "react";

export const NavbarContext = createContext({});

const NavbarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hideAllBars, setHideAllBars] = useState(false);

  return (
    <NavbarContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen(!isOpen),
        openSidebar: () => setIsOpen(true),
        closeSidebar: () => setIsOpen(false),
        close: setIsOpen,
        hideAllBars,
        setHideAllBars,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export default NavbarProvider;
