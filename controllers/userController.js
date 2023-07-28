const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authUtils = require('../utility/authUtils');
const authMiddleware = require('../middleware/authMiddleware');
const validator = require('validator');
const User = require('../models/User');

exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        authUtils.validateInput({ username, email, password });
        if (!validator.isEmail(email)) {
            throw new Error('Please provide a valid email format.');
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        console.log(password);
        if (!passwordRegex.test(password)) {
            throw new Error('Password should be at least 8 characters long and should contain at least one number and letter.');
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const conflict = existingUser.username === username ? 'username' : 'email';
            throw new Error(`There is already an account associated with that ${conflict}.`);
        }

        const hashedPassword = await new Promise((resolve, reject) => {
            authUtils.passwordHasher(password, (err, hashedPassword) => {
                if (err) {
                    reject(new Error("There was an error in password hashing."));
                } else {
                    resolve(hashedPassword);
                }
            });
        });

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        authUtils.createGroceryCollection(newUser);
        const accessTokens = authUtils.createTokens(newUser);
        authUtils.sendCookies(res, accessTokens);
        res.status(201).json({ message: 'Successfully created account.' });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // all messages should have "email or password" to mask information from hackers
        authUtils.validateInput({ email, password });
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email or password is incorrect.');
        }
        const passwordIsEqual = await bcrypt.compare(password, user.password);
        if (!passwordIsEqual) {
            throw new Error('Email or password is incorrect.');
        }
        const accessTokens = authUtils.createTokens(user);
        authUtils.sendCookies(res, accessTokens);
        res.status(201).json({ message: 'Successfully logged in.' });
    } catch (err) {
        next(err);
    }   
};

exports.logout = async (req, res, next) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully.' });
};

exports.changeUsername = async (req, res, next) => {
    const { userId, newUsername } = req.body;
    try {
        authUtils.validateInput({ userId, newUsername });
        const user = await User.findById(userId);
        user.username = newUsername;
        await user.save();
        res.status(200).json({ message: 'Username changed successfully' });
    } catch (err) {
        next(err);
    }
};

exports.changeEmail = async (req, res, next) => {
    const { userId, newEmail } = req.body;
    try {
        authUtils.validateInput({ newEmail });
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("No user found.");
        }
        if (!(user.email === newEmail)) {
            user.email = newEmail;
        } else {
            throw new Error("Newly provided email is the same as the old one.")
        }
        await user.save();
        res.status(200).json({ message: 'Email changed successfully' });
    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        authUtils.validateInput({ oldPassword, newPassword });
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('No user found.');
        }
        const isEqual = await bcrypt.compare(oldPassword, user.password);
        if (!isEqual) {
            throw new Error('Old password is incorrect.');
        }
        authUtils.passwordHasher(password, (err, hashedPassword) => {
            if (err) {
                throw new Error("There was an error in password hashing.");
            } else {
                user.password = hashedPassword;
            }
        });
        await user.save();
        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteAccount = async (req, res, next) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        logout();
        await user.remove();
        res.status(200).json({ message: 'User account deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.refreshTokens = async (req, res, next) => {
    console.log(req.body);
    const { refreshToken } = req.body;
    try {
        if (!refreshToken) {
            throw new Error('No refresh token provided.');
        }
        let decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const userId = decodedToken.userId;
        if (!userId) {
            throw new Error('No user id provided.');
        }
        if (!decodedToken || (decodedToken.userId !== userId)) {
            throw new Error('Invalid refresh token.');
        }
        const user = await User.findById(userId);
        const newTokens = authUtils.createTokens(user);
        authUtils.sendCookies(res, newTokens);
        res.status(200).json({ message: 'Successfully refreshed token.' });
    } catch (err) {
        next(err);
    }
};

exports.validateUser = (req, res) => {
    res.status(200).json({ message: 'Authentication was successful.' });
};