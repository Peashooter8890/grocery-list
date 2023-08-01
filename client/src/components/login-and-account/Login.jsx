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
            await axiosInstance.post(`${process.env.REACT_APP_API_URL}/user/login`, { 
                email: loginEmail,
                password: loginPassword,
            });
            dispatch(setLoginStatus(true));
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
        <div className="flex flex-col justify-between items-center h-screen">
            <CookieWarningWindow/>
            <form className="flex flex-col gap-1.5 justify-center items-end border-2 border-gray-900 w-72 h-60" onSubmit={handleLogin}>
                <section className="gap-1.5 flex justify-right items-center pr-2">
                    <label>Email</label>
                    <input 
                        className="h-8 w-48"
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        type="text" 
                        placeholder="email" 
                        name="email" 
                        required
                    />
                </section>

                <section className="gap-1.5 flex justify-right items-center pr-2">
                    <label>Password</label>
                    <input 
                        className="h-8 w-48"
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        type="password" 
                        placeholder="password" 
                        name="password" 
                        required
                    />
                </section>

                <section className="w-[12.5rem]">
                    <button className="h-8 w-20 border-2 border-gray-200 bg-white hover:bg-gray-200 text-black" type="submit">Log In</button>
                </section>
            </form>
            <form className="flex flex-col gap-1.5 justify-center items-end border-2 border-gray-900 w-72 h-60" onSubmit={handleSignUp}>
                <section className="gap-1.5 flex justify-right items-center pr-2">
                    <label>Name</label>
                    <input 
                        className="h-8 w-48"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        type="text" 
                        placeholder="name" 
                        name="name" 
                        required
                    />
                </section>
                
                <section className="gap-1.5 flex justify-right items-center pr-2">
                    <label>Email</label>
                    <input 
                        className="h-8 w-48"
                        value={signupEmail} 
                        onChange={(e) => setSignupEmail(e.target.value)} 
                        type="text" 
                        placeholder="email" 
                        name="email" 
                        required
                    />
                </section>
                
                <section className="gap-1.5 flex justify-right items-center pr-2">
                    <label>Password</label>
                    <input 
                        className="h-8 w-48"
                        value={signupPassword} 
                        onChange={(e) => setSignupPassword(e.target.value)} 
                        type="password" 
                        placeholder="password" 
                        name="password" 
                        required
                    />
                </section>
                <section className="w-[12.5rem]">
                    <button className="h-8 w-20 border-2 border-gray-200 bg-white hover:bg-gray-200 text-black" type="submit">Sign Up</button>
                </section>
            </form>
            {isLoggedIn 
                ? 
                <span style={{color:"green"}}>You are logged in</span>
                : 
                <span style={{color:"red"}}>You are logged out</span>
            }
            <span style={{color: "red"}}>{errorMessage && <div className="errorMessage">{errorMessage}</div>}</span>
        </div>
    );
};

export default ReverseAuthProtector(Login);