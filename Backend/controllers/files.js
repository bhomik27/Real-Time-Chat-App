const File = require('../models/files');
const S3service = require('../services/S3services');

exports.CreateFile = async (req, res) => {
    try {
        const { groupId } = req.body;
        const uploadedFile = req.files.file; // Use a generic name instead of 'img'
        
        // Generate the filename with the original extension
        const filename = `File/${new Date().toISOString()}-${uploadedFile.name}`;
        const fileURl = await S3service.uploadToS3(uploadedFile.data, filename);
        
        const file = await File.create({ url: fileURl, userId: req.user.id, groupId: groupId });
        res.status(200).json({ fileURl, file, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

exports.getAllFiles = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const files = await File.findAll({ where: { groupId: groupId } });
        res.status(200).json({ files });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Fetching files failed' });
    }
};
