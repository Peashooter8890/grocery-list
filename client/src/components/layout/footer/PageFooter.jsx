import React from 'react';
import { NavLink } from "react-router-dom";

const PageFooter = () => {
  return (
    <footer className="h-14 flex bg-headergreen justify-end items-center border-t-2 border-borderheadergreen">
      <div className="flex gap-2 mr-2">
        <NavLink to="/privacy" className="header-link">Privacy</NavLink>
        <NavLink to="/terms" className="header-link">Terms</NavLink>
      </div>
    </footer>
  );
};

export default PageFooter;