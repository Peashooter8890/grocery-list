import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import GroceryCollection from './components/groceries/GroceryCollection';
import GroceryList from './components/groceries/GroceryList';
import Login from './components/login-and-account/Login';
import SignUp from './components/login-and-account/SignUp';
import { setLoginStatus, setLoadingStatus } from './features/AuthSlice';
import axiosInstance from './axiosInstance';

function App() {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); 
  const isLoading = useSelector(state => state.auth.isLoading);

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
      } finally {
        dispatch(setLoadingStatus(false));  // Add this
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter> 
      <Routes>
        <Route exact path="/" element={isLoggedIn ? <Navigate to="/groceryCollection" /> : <Navigate to="/login" />} />  c
        <Route path='/login' element={
          <Layout>
            <Login/>
          </Layout>
        }/>
        <Route path='/signup' element={
        <Layout>
          <SignUp/>
        </Layout>
        } />
        <Route path='/groceryCollection' element={
          <Layout>
            <GroceryCollection/>
          </Layout>
        }/>
        <Route path='/grocerylist/:id' element={
          <Layout>
            <GroceryList/>
          </Layout>
        }/>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;