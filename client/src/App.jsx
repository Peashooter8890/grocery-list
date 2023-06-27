import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import GroceryList from './components/groceries/GroceryList';
import Login from './components/login-and-account/Login';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/grocery' element={<GroceryList/>} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;