import React, { useState } from "react";
import axiosInstance from '../../axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus } from '../../features/AuthSlice';
import CookieWarningWindow from "../utility/CookieWarningWindow";
import ReverseAuthProtector from "../utility/ReverseAuthProtector";
import '../../App.css';
import { useNavigate, NavLink } from "react-router-dom";
import Pepper from "../svg/pepper";
import Grapes from "../svg/grapes";
import Apples from "../svg/apples";

const SignUp = () => {
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
            <form className="flex flex-col gap-1.5 items-center border-2 border-loginbordergreen bg-logingreen rounded-md w-72 md:w-96 h-[22rem] md:h-[34rem] z-10" onSubmit={handleSignUp}>
                <h1 className="text-2xl md:text-4xl mt-6 md:mt-12 cursor-default">Create Account</h1>
                <section className="flex flex-col items-left mt-4 md:mt-8 w-9/12 text-xs md:text-base">
                    <label>Username:</label>
                    <input 
                        className="h-5 md:h-8 rounded text-xs md:text-base p-1 md:p-2"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        type="text" 
                        placeholder="Username" 
                        name="name" 
                        required
                    />
                </section>
                
                <section className="flex flex-col justify-right mt-1 md:mt-3 w-9/12 text-xs md:text-base">
                    <label>Email:</label>
                    <input 
                        className="h-5 md:h-8 rounded text-xs md:text-base p-1 md:p-2"
                        value={signupEmail} 
                        onChange={(e) => setSignupEmail(e.target.value)} 
                        type="text" 
                        placeholder="Email" 
                        name="email" 
                        required
                    />
                </section>
                
                <section className="flex flex-col justify-right mt-1 md:mt-3 w-9/12 text-xs md:text-base">
                    <label>Password:</label>
                    <input 
                        className="h-5 md:h-8 rounded text-xs md:text-base p-1 md:p-2"
                        value={signupPassword} 
                        onChange={(e) => setSignupPassword(e.target.value)} 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        required
                    />
                </section>
                <section className="flex justify-center w-full mt-6 md:mt-8">
                    <button className="h-6 md:h-8 w-1/3 md:w-5/12 border-[1px] border-gray-400 bg-[#83D66E] rounded-lg hover:bg-[#68D04E] text-black text-xs md:text-base" type="submit">Sign Up</button>
                </section>

                <div className="flex flex-col items-center mt-5 md:mt-8 text-[0.6rem] md:text-sm text-center">
                    <p className="cursor-default">By registering an account<br></br>you agree to our <NavLink to="/signup" className="underline hover:no-underline">Terms of Service</NavLink><br></br>and <NavLink to="/signup" className="underline hover:no-underline">Privacy Notice.</NavLink></p>
                </div>
            </form>

            <div className="flex-[.5_.5_0%]"></div>

            {isLoggedIn 
                ? 
                <span className="cursor-default text-xs md:text-sm" style={{color:"green"}}>You are logged in</span>
                : 
                <span className="cursor-default text-xs md:text-sm" style={{color:"red"}}>You are logged out</span>
            }
            <span style={{color: "red"}}>{errorMessage && <div className="errorMessage">{errorMessage}</div>}</span>
        </div>
    );
};

export default ReverseAuthProtector(SignUp);



