const express = require('express');
const app = express();

// import secret environmental variables
require('dotenv').config({ path: './.env' });
const PORT = process.env.PORT || 4000;

// compression reduces size of http responses, improving performance.
const compression = require('compression');
// sets a bunch of http headers to protect against common hacking attacks
const helmet = require('helmet');
// allows us to limit number of requests per a given timeframe
const RateLimit = require('express-rate-limit');
// logs requests to console to help with development
const logger = require('morgan');
// enables CORS which helps us interact with APIs from different origins
const cors = require('cors');
// allows us to store JWT token cookies in users' browsers
const cookieParser = require('cookie-parser');
// mongoDB connection
const InitiateMongoServer = require("./db");

// make POST requests easier by allowing us to get data from req objects
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
app.use(logger('combined'));
app.use(cookieParser());
InitiateMongoServer();

// bunch of settings to hopefully avoid hellish CORS errors in the browser
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
};
app.use(cors(corsOptions));

const groceryList = require("./routes/groceryList");
app.use("/groceryList", groceryList);

// the server will handle at maximum 300 requests per minute
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300,
});
app.use(limiter);

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); 
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});

app.listen(PORT, (req, res) => {
    console.log(`Server starting at PORT ${PORT}`);
});
  
module.exports = app;