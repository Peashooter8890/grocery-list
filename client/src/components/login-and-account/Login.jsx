import React, { useState } from "react";
import axiosInstance from '../../axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus } from '../../actions/AuthActions';
import PopupWindow from "../utility/PopupWindow";

const Login = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [name, setName] = useState('');
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
            console.log(signupPassword);
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/user/signup`, { 
                name: name,
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
        <div>
            <PopupWindow 
                title="FRESHLY BAKED NON-SHADY COOKIES. They are here. NOW." 
                message="Our server baked some hot FRESHLY BAKED NON-SHADY COOKIES. Please enable our FRESHLY BAKED NON-SHADY COOKIES in your browser so that your browser can taste our FRESHLY BAKED NON-SHADY COOKIES. 
                If you do not give your browser our FRESHLY BAKED NON-SHADY COOKIES, it will come back with a bloody vengeance by ceasing to store your login information. If you value convenience over false assumptions 
                (such as the assumption that we are using shady cookies to enforce menace onto you, which we clearly aren't, because we don't know any buyers right now who would buy your personal information), please enable cookies so that we can spread our FRESHLY BAKED NON-SHADY COOKIES onto the world. Thank you."
            />
            <form onSubmit={handleLogin}>
                <label>Email</label>
                <input 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    type="text" 
                    placeholder="email" 
                    name="email" 
                    required
                />
                <label>Password</label>
                <input 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    type="password" 
                    placeholder="password" 
                    name="password" 
                    required
                />
                <button type="submit">Log In</button>
            </form>
            <form onSubmit={handleSignUp}>
                <label>Name</label>
                <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    type="text" 
                    placeholder="name" 
                    name="name" 
                    required
                />
                <input 
                    value={signupEmail} 
                    onChange={(e) => setSignupEmail(e.target.value)} 
                    type="text" 
                    placeholder="email" 
                    name="email" 
                    required
                />
                <label>Password</label>
                <input 
                    value={signupPassword} 
                    onChange={(e) => setSignupPassword(e.target.value)} 
                    type="password" 
                    placeholder="password" 
                    name="password" 
                    required
                />
                <button type="submit">Sign Up</button>
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

export default Login;