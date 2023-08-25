import React from 'react';
import { NavLink } from "react-router-dom";
import Icon from "../../svg/icon"

const LoginHeader = () => {
    return (
      <header className="h-14 md:h-28 bg-headergreen flex justify-between border-b-2 border-borderheadergreen">
        <div className="flex whitespace-nowrap items-center font-indieflower ml-2 md:ml-6 text-2xl md:text-5xl text-white pointer-events-none">
            <Icon />
            <span>Grocery Mania</span>
        </div>
        <div className="flex gap-2 md:gap-6 mr-2 md:mr-6 justify-end items-end whitespace-nowrap">
            <NavLink to="/login" className="header-link">Login</NavLink>
            <NavLink to="/signup" className="header-link">Register</NavLink>
        </div>
      </header> 
    )
  }
  
  export default LoginHeader;