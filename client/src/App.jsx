import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GroceryCollection from './components/groceries/GroceryCollection';
import Login from './components/login-and-account/Login';
import { setLoginStatus } from './features/AuthSlice';
import axiosInstance from './axiosInstance';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/validateUser`); 
        if (response.status === 200) {
          dispatch(setLoginStatus(true));
        } else {
          dispatch(setLoginStatus(false));
        }
      } catch (error) {
        dispatch(setLoginStatus(false));
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return (
    <BrowserRouter> 
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/grocery' element={<GroceryCollection/>} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;