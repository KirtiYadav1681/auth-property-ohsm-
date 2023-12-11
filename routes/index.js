const express = require('express');
const router = express.Router();

// requiring middlewares
const {authenticateUser} = require('../middleware/authMiddleware'); 
const {googleAuthMiddleware,callbackMiddleware} = require('../middleware/googleAuthMiddleware');

// requiring controllers
const userController = require('../controllers/UserController');
const propertyController = require('../controllers/PropertyController');

// checking server
router.get('/', (req,res)=> res.end('Server is running successfully.'));

// authorization routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/send-reset-password-link',userController.sendResetPasswordLink);
router.post('/reset-password/:token', userController.resetPassword);

// property and inventory saving route
router.post('/save-property-with-inventory', authenticateUser, propertyController.addPropertyWithInventory);

// Google authentication routes
router.get('/auth/google', googleAuthMiddleware);
router.get('/auth/google/callback',callbackMiddleware, userController.callbackSuccess);

module.exports = router;