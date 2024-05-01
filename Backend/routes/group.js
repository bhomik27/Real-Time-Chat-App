const express = require('express');
const router = express.Router();

const groupController = require('../controllers/group');
const Userauthentication = require('../middleware/auth');

router.post('/creategroup', Userauthentication.authenticate, groupController.createGroup);

router.get('/getallgroups', Userauthentication.authenticate, groupController.getAllGroups);

module.exports = router;
