const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.put('/changeUsername', userController.changeUsername);
router.put('/changeEmail', userController.changeEmail);
router.put('/changePassword', userController.changePassword);
router.delete('/deleteAccount', userController.deleteAccount);
router.post('/refreshTokens', userController.refreshTokens);
router.get('/validateUser', authMiddleware, userController.validateUser);

module.exports = router;