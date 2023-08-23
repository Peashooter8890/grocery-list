import React, { useState } from "react";
import axiosInstance from '../../axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus } from '../../features/AuthSlice';
import CookieWarningWindow from "../utility/CookieWarningWindow";
import ReverseAuthProtector from "../utility/ReverseAuthProtector";
import '../../App.css';
import { useNavigate, NavLink } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [username, setUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

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
        <div className="flex flex-col justify-between items-center bg-bodygreen">
            <CookieWarningWindow/>
            <form className="flex flex-col gap-1.5 items-center border-2 border-loginbordergreen bg-logingreen rounded-md w-96 h-[30rem]" onSubmit={handleLogin}>
                
                <h1 className="text-4xl mt-10">Log In</h1>

                <section className="flex flex-col items-left mt-7 w-[16.5rem]">
                    <label>Username or Email:</label>
                    <input 
                        className="h-8 rounded"
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        type="text" 
                        name="email" 
                        required
                    />
                </section>

                <section className="flex flex-col justify-right mt-3 w-[16.5rem]">
                    <div className="flex justify-between items-end">
                        <label>Password:</label>
                        <NavLink to="/forgotpassword" className="hover:underline text-xs">Forgot Password?</NavLink>
                    </div>
                    <input 
                        className="h-8 rounded"
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        type="password" 
                        name="password" 
                        required
                    />
                </section>

                <section className="flex justify-center w-[12.5rem] mt-6">
                    <button className="h-8 w-[8rem] border-[1px] border-gray-400 bg-[#83D66E] rounded-lg hover:bg-[#68D04E] text-black" type="submit">Log In</button>
                </section>
            </form>
           
            <button onClick={() => {navigate("/signup")}}>Need to create an account? Sign up!</button>

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