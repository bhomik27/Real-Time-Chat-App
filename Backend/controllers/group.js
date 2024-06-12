const Group = require('../models/groups');
const UserGroup = require('../models/usergroups');
const User = require('../models/users');
const { Op } = require('sequelize');

const createGroup = async (req, res) => {
    try {
        const adminIds = [req.user.id]; // Include the creator's ID in the adminIds array
        const group = await Group.create({
            groupName: req.body.group_name,
            groupDescription: req.body.group_description,
            adminIds: adminIds // Assign the adminIds when creating the group
        });

        const users = req.body.users;
        for (let user of users) {
            await UserGroup.create({ groupId: group.id, userId: user });
        }

        res.status(200).json({ message: "Successfully created group" });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Failed to create group" });
    }
};
// const createGroup = async (req, res) => {
//     try {
//         const adminIds = [req.user.id]; // Include the creator's ID in the adminIds array
//         const groupDescription = req.body.group_description;

//         // Ensure groupDescription is a string
//         if (typeof groupDescription !== 'string') {
//             return res.status(400).json({ message: "Group description must be a string" });
//         }

//         const group = await Group.create({
//             groupName: req.body.group_name,
//             groupDescription: groupDescription,
//             adminIds: adminIds // Assign the adminIds when creating the group
//         });

//         const users = req.body.users;
//         for (let user of users) {
//             await UserGroup.create({ groupId: group.id, userId: user });
//         }

//         res.status(200).json({ message: "Successfully created group" });
//     } catch (error) {
//         console.error("Error creating group:", error);
//         res.status(500).json({ message: "Failed to create group" });
//     }
// };

// const createGroup = async (req, res) => {
//     const { groupName, groupDescription, adminId, members } = req.body;
//     try {
//         const group = await Group.create({
//             groupName,
//             groupDescription,
//             adminId,
//         });

//         if (members && members.length > 0) {
//             await group.addUsers(members);
//         }

//         res.status(201).json({ message: 'Group created successfully', group });
//     } catch (error) {
//         console.error('Error creating group:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };



const getAllGroups = async (req, res) => {
    try {
        const userGroups = await UserGroup.findAll({ where: { userId: req.user.id } });

        const groupPromises = userGroups.map(async (userGroup) => {
            const group = await Group.findByPk(userGroup.groupId);
            if (group) {
                return {
                    id: group.id,
                    name: group.groupName,
                    description: group.groupDescription
                };
            }
        });

        const groups = await Promise.all(groupPromises);
        const filteredGroups = groups.filter(group => group !== undefined);

        res.status(200).json({ groups: filteredGroups });
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ message: "Failed to fetch groups" });
    }
};

// const getGroupDetails = async (req, res) => {
//     const groupId = req.params.groupId;
//     try {
//         const group = await Group.findOne({
//             where: { id: groupId },
//             include: [
//                 { model: User, through: UserGroup, as: 'Users', attributes: ['id', 'name'] } // Adjust the alias to match your association
//             ]
//         });

//         if (!group) {
//             return res.status(404).json({ message: 'Group not found' });
//         }

//         const groupDetails = {
//             groupName: group.groupName,
//             groupDescription: group.groupDescription,
//             adminIds: group.adminIds,
//             createdAt: group.createdAt,
//             members: group.Users.map(member => ({ id: member.id, name: member.name })) // Access the Users association using the adjusted alias
//         };

//         res.status(200).json(groupDetails);
//     } catch (error) {
//         console.error('Error fetching group details:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
const getGroupDetails = async (req, res) => {
    const groupId = req.params.groupId;
    try {
        const group = await Group.findOne({
            where: { id: groupId },
            include: [
                { model: User, through: UserGroup, as: 'Users', attributes: ['id', 'name'] }
            ]
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Fetch admin names
        let adminNames = "No admins assigned";
        if (group.adminIds && group.adminIds.length > 0) {
            const admins = await User.findAll({
                where: { id: group.adminIds },
                attributes: ['name']
            });
            adminNames = admins.map(admin => admin.name).join(', ') || adminNames;
        }

        const groupDetails = {
            groupName: group.groupName,
            groupDescription: group.groupDescription,
            adminNames: adminNames, // Use admin names
            createdAt: group.createdAt,
            members: group.Users.map(member => ({ id: member.id, name: member.name }))
        };

        res.status(200).json(groupDetails);
    } catch (error) {
        console.error('Error fetching group details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};






const showMembersOfGroup = async (req, res) => {
    try {
        console.log("Fetching members of group...");
        const groupId = req.params.groupId;
        console.log("Requested groupId:", groupId);
        const members = await UserGroup.findAll({
            where: { groupId: groupId },
            include: User
        });

        if (!members || members.length === 0) {
            console.log("No members found for this group.");
            return res.status(404).json({ message: "No members found for this group" });
        }

        const memberDetails = members.map(member => ({
            userId: member.User.id,
            name: member.User.name
        }));

        console.log("Members found:", memberDetails);
        res.status(200).json(memberDetails);
    } catch (error) {
        console.error("Error fetching members of group:", error);
        res.status(500).json({ message: "Failed to fetch members of group" });
    }
};

const addToGroup = async (req, res) => {
    try {
        console.log("Adding user to group...");
        const groupId = req.params.groupId;
        const userId = req.body.user_id;
        console.log("Group Id:", groupId);
        console.log("User Id:", userId);

        const existingMember = await UserGroup.findOne({ where: { groupId: groupId, userId: userId } });
        if (existingMember) {
            console.log("User is already a member of this group.");
            return res.status(400).json({ message: "User is already a member of this group" });
        }

        await UserGroup.create({ groupId: groupId, userId: userId });

        console.log("User added to group successfully.");
        res.status(200).json({ message: "User added to group successfully" });
    } catch (error) {
        console.error("Error adding user to group:", error);
        res.status(500).json({ message: "Failed to add user to group" });
    }
};

const removeFromGroup = async (req, res) => {
    try {
        const { groupId, memberId } = req.params;
        console.log("Removing user from group...");
        console.log("Group Id:", groupId);
        console.log("Member Id:", memberId);

        // Check if the group exists
        const group = await Group.findByPk(groupId);
        if (!group) {
            console.log("Group not found.");
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the member exists in the group
        const memberInGroup = await UserGroup.findOne({ where: { groupId: groupId, userId: memberId } });
        if (!memberInGroup) {
            console.log("User is not a member of this group.");
            return res.status(404).json({ message: "User is not a member of this group" });
        }

        // Remove the member from the group
        const deletedRows = await UserGroup.destroy({ where: { groupId: groupId, userId: memberId } });
        console.log("Deleted Rows:", deletedRows);
        console.log("User removed from group successfully.");
        res.status(200).json({ message: "User removed from group successfully" });
    } catch (error) {
        console.error("Error removing user from group:", error);
        res.status(500).json({ message: "Failed to remove user from group" });
    }
};

const makeAdmin = async (req, res) => {
    try {
        console.log("Making user admin of group...");
        const groupId = req.params.groupId;
        const userId = req.body.user_id; // Ensure the backend retrieves user_id
        console.log("Group Id:", groupId);
        console.log("User Id:", userId);

        const group = await Group.findByPk(groupId);
        if (!group) {
            console.log("Group not found.");
            return res.status(404).json({ message: "Group not found" });
        }

        let adminIds = group.adminIds || [];
        if (!adminIds.includes(userId)) {
            adminIds.push(userId);
            group.adminIds = adminIds;
            await group.save();
            console.log("User is now admin of the group.");
            res.status(200).json({ message: "User is now admin of the group" });
        } else {
            console.log("User is already an admin of the group.");
            res.status(400).json({ message: "User is already an admin of the group" });
        }
    } catch (error) {
        console.error("Error making user admin of group:", error);
        res.status(500).json({ message: "Failed to make user admin of group" });
    }
};

const changeGroupName = async (req, res) => {
    try {
        console.log("Changing group name...");
        const groupId = req.params.groupId;
        const newName = req.body.new_name;
        console.log("Group Id:", groupId);
        console.log("New Name:", newName);

        const updatedRows = await Group.update({ groupName: newName }, { where: { id: groupId } });

        if (updatedRows[0] === 0) {
            console.log("Group not found.");
            return res.status(404).json({ message: "Group not found" });
        }

        console.log("Group name changed successfully.");
        res.status(200).json({ message: "Group name changed successfully" });
    } catch (error) {
        console.error("Error changing group name:", error);
        res.status(500).json({ message: "Failed to change group name" });
    }
};

const deleteGroup = async (req, res) => {
    try {
        console.log("Deleting group...");
        const groupId = req.params.groupId;
        console.log("Group Id:", groupId);

        const deletedRows = await Group.destroy({ where: { id: groupId } });

        if (deletedRows === 0) {
            console.log("Group not found.");
            return res.status(404).json({ message: "Group not found" });
        }

        console.log("Group deleted successfully.");
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Failed to delete group" });
    }
};

const changeGroupDescription = async (req, res) => {
    try {
        console.log("Changing group description...");
        const groupId = req.params.groupId;
        const newDescription = req.body.new_description;
        console.log("Group Id:", groupId);
        console.log("New Description:", newDescription);

        const updatedRows = await Group.update({ groupDescription: newDescription }, { where: { id: groupId } });

        if (updatedRows[0] === 0) {
            console.log("Group not found.");
            return res.status(404).json({ message: "Group not found" });
        }

        console.log("Group description changed successfully.");
        res.status(200).json({ message: "Group description changed successfully" });
    } catch (error) {
        console.error("Error changing group description:", error);
        res.status(500).json({ message: "Failed to change group description" });
    }
};

const searchUsersByUsername = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm.toLowerCase(); // Assuming the search term is sent as a query parameter
        const users = await User.findAll({ where: { name: { [Op.like]: `%${searchTerm}%` } } }); // Change 'username' to 'name'
        res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Failed to search users" });
    }
};

module.exports = {
    createGroup,
    getAllGroups,
    getGroupDetails,
    showMembersOfGroup,
    addToGroup,
    removeFromGroup,
    makeAdmin,
    changeGroupName,
    deleteGroup,
    changeGroupDescription,
    searchUsersByUsername
};