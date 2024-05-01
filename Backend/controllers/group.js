const Group = require('../models/groups')
const UserGroup = require('../models/usergroups')

const createGroup = async (req, res) => {
    try {
        console.log("Creating group...");
        const group = await Group.create({ groupName: req.body.group_name });
        const users = req.body.users;
        console.log("Users:", users);
        for (let user of users) {
            console.log("Adding user:", user);
            await UserGroup.create({ groupId: group.id, userId: user }); // Use user.id instead of req.user.id
        }
        console.log("Group created successfully.");
        res.status(200).json({ message: "Successfully created group" });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Failed to create group" });
    }
};



const getAllGroups=async(req,res)=>{
    try {
        var groupNames=[]
        // console.log(req.user.id)
        const groupIds=await UserGroup.findAll({where:{userId:req.user.id}})
        for (let i = 0; i < groupIds.length; i++) {
            const groupId = groupIds[i];
            // console.log(groupId.dataValues.groupId)
            const groupName=await Group.findOne({where:{id:groupId.dataValues.groupId}})
            // console.log(groupName.dataValues.groupName)
            groupNames.push(groupName.dataValues.groupName)
        }
        console.log(groupNames)
        res.status(200).json({groupNames,groupIds})
        
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    createGroup,
    getAllGroups
}