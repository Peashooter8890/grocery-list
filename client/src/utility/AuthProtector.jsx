// withAuth.js
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthProtector = WrappedComponent => {
  const navigate = useNavigate();
  const RequireAuth = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      return <WrappedComponent {...props} />;
    }
  };
  return RequireAuth;
};

export default AuthProtector;