const ms = require('ms');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const GroceryCollection = require('../models/GroceryCollection');

const createGroceryCollection = async (user) => {
    const newGroceryCollection = new GroceryCollection({
        userId: user._id,
        groceryLists: []
    });
    await newGroceryCollection.save();
}

const validateInput = (input) => {
    for (let [key, value] of Object.entries(input)) {
        if (!input.hasOwnProperty(key)) {
            throw new Error(`Missing input: ${key} is required.`);
        } else if (!value) {
            throw new Error(`Invalid input: ${key} is not valid.`);
        }
    }
}  

const sendCookies = (res, tokens) => {
    const accessTokenMaxAge = ms('15m');
    const refreshTokenMaxAge = ms('7d');
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, maxAge: accessTokenMaxAge });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, maxAge: refreshTokenMaxAge });
};

const createTokens = (user) => {
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
};

const passwordHasher = (plainTextPassword, callback) => {
    const saltRounds = 10;
    bcrypt.hash(plainTextPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
            callback(err);
        } else {
            callback(null, hashedPassword);
        }
    });
}

module.exports = {
    createGroceryCollection,
    validateInput,
    sendCookies,
    createTokens,
    passwordHasher
}