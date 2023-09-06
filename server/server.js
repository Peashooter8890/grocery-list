const express = require('express');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const InitiateMongoServer = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
app.use(logger('combined'));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
}));

const limiter = RateLimit({
    // the server will handle at maximum 300 requests per minute
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300,
});
app.use(limiter);

const user = require("./routes/user");
const groceryList = require("./routes/groceryList");
app.use("/user", user);
app.use("/groceryList", groceryList);

InitiateMongoServer();

app.use((err, req, res, next) => {
    // error handling middleware
    console.error(err.stack); 
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong in the server, and there is no message for it.";
    res.status(statusCode).json({ message });
});

app.listen(PORT, (req, res) => {
    console.log(`Server starting at PORT ${PORT}`);
});
  
module.exports = app;

app.use((err, res) => {
    // error handling middleware
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong in the server, and we don't have a message for it.";
    res.status(statusCode).json({ message });
});