const express = require('express');

const UserController = require('../controllers/user');
const Userauthentication = require('../middleware/auth');

const router = express.Router();


router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.get('/getallusers', Userauthentication.authenticate, UserController.getAllUsers);

router.get("/getAllLoggedinUsers", Userauthentication.authenticate, UserController.getAllLoggedinUsers);

router.post('/logout', Userauthentication.authenticate,  UserController.logout);

module.exports = router;
