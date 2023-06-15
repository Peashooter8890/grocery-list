import React, { useState } from "react";
import axiosInstance from './axiosInstance';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axiosInstance.post('/api/auth/login', { 
                email: username, 
                password 
            });
            // handle successful login, store tokens, redirect user etc.
        } catch (err) {
            // if error response is available, set error state to error message
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>User name</label>
            <input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                type="text" 
                placeholder="user name" 
                name="username" 
                id="username" 
            />
            <label>Password</label>
            <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="password" 
                name="password" 
                id="password" 
            />
            {error && <div className="error">{error}</div>}
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;