const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.put('/changePassword', userController.changePassword);
router.delete('/deleteAccount', userController.deleteAccount);
router.post('/refreshTokens', userController.refreshTokens);
router.put('/changeUserName', userController.changeUserName);
router.put('/changeEmail', userController.changeEmail);

module.exports = router;