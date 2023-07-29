const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailValidator = require('validator');
const passwordValidator = require('password-validator');
const authUtils = require('../utility/authUtils');
const User = require('../models/User');

exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        authUtils.validateInput({ username, email, password });
        if (!emailValidator.isEmail(email)) {
            throw new Error('Please provide a valid email format.');
        }
        let schema = new passwordValidator();
        schema
        .is().min(8)
        .is().max(100)
        .has().letters()
        .has().digits()
        .has().not().spaces();

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const conflict = existingUser.username === username ? 'username' : 'email';
            throw new Error(`There is already an account associated with that ${conflict}.`);
        }

        let validationErrors = schema.validate(password, { list: true });
        if (validationErrors.length > 0) {
            let firstError = validationErrors[0];
            switch (firstError) {
                case 'min':
                    throw new Error('Your password should be at least 8 characters long.');
                case 'max':
                    throw new Error('Your password should not exceed 100 characters.');
                case 'uppercase':
                    throw new Error('Your password should contain at least one uppercase letter.');
                case 'lowercase':
                    throw new Error('Your password should contain at least one lowercase letter.');
                case 'digits':
                    throw new Error('Your password should contain at least one digit.');
                case 'spaces':
                    throw new Error('Your password should not contain spaces.');
                case 'oneOf':
                    throw new Error('Your password should not be one of the common passwords.');
                default:
                    throw new Error('Your password might have a character that\'s not allowed.');
            }
        };
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