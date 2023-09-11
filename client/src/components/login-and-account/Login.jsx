import React, { useState } from "react";
import axiosInstance from '../../axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus } from '../../features/AuthSlice';
import CookieWarningWindow from "../utility/CookieWarningWindow";
import ReverseAuthProtector from "../utility/ReverseAuthProtector";
import { useNavigate, NavLink } from "react-router-dom";
import Pepper from "../svg/pepperSVG";
import Grapes from "../svg/grapesSVG";
import Apples from "../svg/applesSVG";

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
        <div className="flex flex-grow flex-col items-center bg-bodygreen h-full">
            <CookieWarningWindow/>
            <div className="absolute z-0 w-full h-full">
                <div className="absolute left-[15%]">
                    <Grapes />
                </div>
                <div className="absolute bottom-[25%] left-[10%]">
                    <Pepper />
                </div>
                <div className="absolute bottom-[20%] right-[8%] md:top-[25%] md:right-[8%]">
                    <Apples />
                </div>
            </div>
            <div className="flex flex-grow max-h-[6rem] md:max-h-48"></div>
            <form className="flex flex-col gap-1.5 items-center border-2 border-loginbordergreen bg-logingreen rounded-md w-72 md:w-96 h-[19rem] md:h-[28rem] z-10" onSubmit={handleLogin}>
                <h1 className="text-2xl md:text-4xl mt-6 md:mt-12 cursor-default">Log In</h1>
                <section className="flex flex-col items-left mt-4 md:mt-8 w-9/12 text-xs md:text-base">
                    <label>Username or Email:</label>
                    <input 
                        className="h-5 md:h-8 rounded text-xs md:text-base p-1 md:p-2"
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        type="text" 
                        name="email" 
                        required
                    />
                </section>

                <section className="flex flex-col justify-right mt-1 md:mt-3 w-9/12 text-xs md:text-base">
                    <div className="flex justify-between items-end">
                        <label>Password:</label>
                        <NavLink to="/forgotpassword" className="hover:underline text-[0.6rem] md:text-xs">Forgot Password?</NavLink>
                    </div>
                    <input 
                        className="h-5 md:h-8 rounded text-xs md:text-base p-1 md:p-2"
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        type="password" 
                        name="password" 
                        required
                    />
                </section>

                <section className="flex justify-center w-full mt-6 md:mt-8">
                    <button className="h-6 md:h-8 w-1/3 md:w-5/12 border-[1px] border-gray-400 bg-[#83D66E] rounded-lg hover:bg-[#68D04E] text-black text-xs md:text-base" type="submit">Log In</button>
                </section>

                <div className="flex flex-col items-center mt-5 md:mt-8 text-[0.6rem] md:text-sm">
                    <p className="cursor-default">Need to create an account?</p>
                    <NavLink to="/signup" className="underline hover:no-underline">Sign Up!</NavLink>
                </div>
            </form>

            <div className="flex-[.5_.5_0%]"></div>

            <span style={{color: "red"}}>{errorMessage && <div className="errorMessage">{errorMessage}</div>}</span>
        </div>
    );
};

export default ReverseAuthProtector(Login);