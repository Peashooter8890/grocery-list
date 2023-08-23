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
    <header className="h-28 bg-headergreen flex justify-between border-b-2 border-borderheadergreen">
      <div className="flex whitespace-nowrap items-center font-indieflower text-4xl text-white">
            Grocery Mania
        </div>
      <button className="border-2" onClick={logout}>Logout</button>
    </header>
  );
};

export default PageHeader;