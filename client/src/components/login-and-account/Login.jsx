import React, { useState } from "react";
import axiosInstance from '../../axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus } from '../../features/AuthSlice';
import CookieWarningWindow from "../utility/CookieWarningWindow";
import ReverseAuthProtector from "../utility/ReverseAuthProtector";
import '../../App.css';

const Login = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [username, setUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_URL}/user/signup`, { 
                username,
                email: signupEmail, 
                password: signupPassword,
            });
            dispatch(setLoginStatus(true));
            setSuccessMessage('Succesfully created account.');
        } catch (err) {
            dispatch(setLoginStatus(false));
            if (err.response) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage('An error occurred.');
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/user/login`, { 
                email: loginEmail,
                password: loginPassword,
            });
            dispatch(setLoginStatus(true));
            setSuccessMessage('Succesfully logged into account.');
        } catch (err) {
            dispatch(setLoginStatus(false));
            if (err.response) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage('An error occurred.');
            }
        }
    };

    return (
        <div className="login">
            <CookieWarningWindow/>
            <form onSubmit={handleLogin}>
                <section>
                    <label>Email</label>
                    <input 
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        type="text" 
                        placeholder="email" 
                        name="email" 
                        required
                    />
                </section>

                <section>
                    <label>Password</label>
                    <input 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        type="password" 
                        placeholder="password" 
                        name="password" 
                        required
                    />
                </section>

                <section>
                    <button type="submit">Log In</button>
                </section>
            </form>
            <form className="register" onSubmit={handleSignUp}>
                <section>
                    <label>Name</label>
                    <input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        type="text" 
                        placeholder="name" 
                        name="name" 
                        required
                    />
                </section>
                
                <section>
                    <label>Email</label>
                    <input 
                        value={signupEmail} 
                        onChange={(e) => setSignupEmail(e.target.value)} 
                        type="text" 
                        placeholder="email" 
                        name="email" 
                        required
                    />
                </section>
                
                <section>
                    <label>Password</label>
                    <input 
                        value={signupPassword} 
                        onChange={(e) => setSignupPassword(e.target.value)} 
                        type="password" 
                        placeholder="password" 
                        name="password" 
                        required
                    />
                </section>
                
                <section>
                    <button type="submit">Sign Up</button>
                </section>
            </form>

            <span style={{color: "green"}}>{successMessage && <div className="successMessage">{successMessage}</div>}</span>
            <span style={{color: "red"}}>{errorMessage && <div className="errorMessage">{errorMessage}</div>}</span>
            {isLoggedIn 
                ? 
                <span style={{color:"green"}}>You are logged in</span>
                : 
                <span style={{color:"red"}}>You are logged out</span>
            }
        </div>
    );
};

export default ReverseAuthProtector(Login);