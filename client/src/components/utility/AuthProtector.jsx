import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthProtector = WrappedComponent => {
  const RequireAuth = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoggedIn) {
        navigate("/login");
      }
    }, [isLoggedIn, navigate]);
    
    return <WrappedComponent {...props} />;
  };

  return RequireAuth;
};

export default AuthProtector;