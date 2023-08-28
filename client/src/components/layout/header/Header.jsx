import React from 'react';
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import Icon from "../../svg/iconSVG"
import axiosInstance from '../../../axiosInstance';

const Header = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const logout = async () => {
    try {
        await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/logout`);
        window.location.reload();
    } catch (err) {
        console.error(err);
    }
  }

    return (
      <header className="h-14 md:h-28 bg-headergreen flex justify-between border-b-[1px] md:border-b-2 border-borderheadergreen">
        <div className="flex h-full items-center">
          <a href="/" className="flex whitespace-nowrap items-center font-indieflower ml-2 md:ml-6 text-2xl md:text-5xl text-white h-fit">
              <Icon />
              <span>Grocery Mania</span>
          </a>
        </div>

        {isLoggedIn 
          ? 
          <div className="flex gap-2 md:gap-6 mr-2 md:mr-6 justify-end items-end whitespace-nowrap">
            <button className="header-link" onClick={logout}>Logout</button>
          </div>
          : 
          <div className="flex gap-2 md:gap-6 mr-2 md:mr-6 justify-end items-end whitespace-nowrap">
              <NavLink to="/login" className="header-link">Login</NavLink>
              <NavLink to="/signup" className="header-link">Register</NavLink>
          </div>
        }
      </header> 
    )
  }
  
  export default Header;