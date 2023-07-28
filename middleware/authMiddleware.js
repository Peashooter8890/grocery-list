const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.userId };
    next();
  } catch {
    try {
      req.body.refreshToken = req.cookies.refreshToken; 
      await userController.refreshTokens(req, res, next);
    } catch {
      res.status(401).json({ message: 'Unauthorized request. Despair' });
    }
  }
};