import React from 'react';
import axiosInstance from '../../../axiosInstance';

const PageHeader = () => {
  const logout = async () => {
    try {
        await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/logout`);
        window.location.reload();
    } catch (err) {
        console.error(err);
    }
  }


  return (
    <header className="h-[12.5%] bg-sky-800 block">
      <button className="border-2" onClick={logout}>Logout</button>
    </header>
  );
};

export default PageHeader;