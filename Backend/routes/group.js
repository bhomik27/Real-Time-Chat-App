const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const Userauthentication = require('../middleware/auth');

// Create Group
router.post('/creategroup', Userauthentication.authenticate, groupController.createGroup);

// Get All Groups
router.get('/getallgroups', Userauthentication.authenticate, groupController.getAllGroups);

// Get group Details
router.get('/showGroupDetails/:groupId', Userauthentication.authenticate, groupController.getGroupDetails);

// Get group Members
router.get('/:groupId/members', Userauthentication.authenticate, groupController.showMembersOfGroup);

// Add Member to Group
router.post('/:groupId/add-member', Userauthentication.authenticate, groupController.addToGroup);


// Remove Member from Group
router.delete('/:groupId/remove-member/:memberId', Userauthentication.authenticate, groupController.removeFromGroup);

// Make Member Admin of Group
router.put('/:groupId/make-admin', Userauthentication.authenticate, groupController.makeAdmin);

// Change Group Name
router.put('/:groupId/change-name', Userauthentication.authenticate, groupController.changeGroupName);

// Delete Group
router.delete('/:groupId', Userauthentication.authenticate, groupController.deleteGroup);

// Search Users by Username
router.get('/searchUsersByUsername', Userauthentication.authenticate, groupController.searchUsersByUsername);

module.exports = router;
