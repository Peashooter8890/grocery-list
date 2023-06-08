import React, { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState('');
    // const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* <label for="username">User name</label> */}
            <label>User name</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="user name" name="username" id="username" />
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;