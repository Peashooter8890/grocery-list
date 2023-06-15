const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createTokens = (user) => {
    const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const saltRounds = 10; // salt 10 rounds
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        const tokens = createTokens(newUser);
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, maxAge: 900000 });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, maxAge: 604800000 });
        res.status(201).json({ user: newUser, tokens });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('No user found with that email');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect');
        }
        const tokens = createTokens(user);
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, maxAge: 900000 });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, maxAge: 604800000 });
        res.status(200).json({ user, tokens });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.changePassword = async (req, res, next) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        const isEqual = await bcrypt.compare(oldPassword, user.password);
        if (!isEqual) {
            throw new Error('Old password is incorrect');
        }
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        next(err);
    }
};

exports.deleteAccount = async (req, res, next) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        await user.remove();
        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.refreshTokens = async (req, res, next) => {
    const { userId, refreshToken } = req.body;
    if (!refreshToken) {
        throw new Error('No refresh token provided');
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!decodedToken) {
            throw new Error('Invalid refresh token');
        }
        if (decodedToken.userId !== userId) {
            throw new Error('Invalid refresh token');
        }
    } catch (err) {
        next(err);
    }
    const user = await User.findById(userId);
    const newTokens = createTokens(user);
    res.cookie('accessToken', newTokens.accessToken, { httpOnly: true, secure: true, maxAge: '15m' });
    res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: true, maxAge: '7d' });
    res.status(200).json({ tokens: newTokens });
};

exports.changeUserName = async (req, res, next) => {
    const { userId, newName } = req.body;
    try {
        const user = await User.findById(userId);
        user.name = newName;
        await user.save();
        res.status(200).json({ message: 'Username changed successfully', user });
    } catch (err) {
        next(err);
    }
};

exports.changeEmail = async (req, res, next) => {
    const { userId, newEmail } = req.body;
    try {
        const user = await User.findById(userId);
        user.email = newEmail;
        await user.save();
        res.status(200).json({ message: 'Email changed successfully', user });
    } catch (err) {
        next(err);
    }
};