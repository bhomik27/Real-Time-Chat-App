const express = require('express');
const router = express.Router();

const authenticateUser = require('../middleware/auth');
const FileController = require('../controllers/files');

router.post('/createfile', authenticateUser.authenticate, FileController.CreateFile);
router.get('/getallfiles/:groupId', authenticateUser.authenticate, FileController.getAllFiles);

module.exports = router;
