import React from 'react';
import { NavLink } from "react-router-dom";

const LoginHeader = () => {
    return (
      <header className="h-28 bg-headergreen flex justify-between border-b-2 border-borderheadergreen">
        <div className="flex whitespace-nowrap items-center font-indieflower text-4xl text-white">
            Grocery Mania
        </div>
        <div className="flex gap-2 mr-2 justify-end items-end whitespace-nowrap">
            <NavLink to="/login" className="header-link">Login</NavLink>
            <NavLink to="/signup" className="header-link">Register</NavLink>
        </div>
      </header> 
    )
  }
  
  export default LoginHeader;