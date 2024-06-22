// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// require('dotenv').config();

// const sequelize = require('./Backend/util/database');

// const userRoutes = require('./Backend/routes/user');
// const chatRoutes = require('./Backend/routes/chat');
// const groupRoutes = require('./Backend/routes/group');

// // Models
// const User = require('./Backend/models/users');
// const Chat = require('./Backend/models/chats');
// const Group = require('./Backend/models/groups');
// const userGroup = require('./Backend/models/usergroups');


// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Enable CORS for all routes
// app.use(cors());

// // Routes
// app.use('/user', userRoutes);
// app.use('/chat', chatRoutes);
// app.use('/group', groupRoutes);



// app.use((req, res) => {
//     console.log('URL', req.url);

//     res.sendFile(path.join(__dirname, `./Front-end/${req.url}`));
// })


// // Define relationships between tables
// User.hasMany(Chat);
// Chat.belongsTo(User);

// Group.hasMany(Chat);
// Chat.belongsTo(Group);

// Group.belongsToMany(User, { through: userGroup });
// User.belongsToMany(Group, { through: userGroup });



// // Sync Sequelize with the database
// sequelize.sync()
//     .then(() => {
//         app.listen(3000, () => {
//             console.log('Server is running on port 3000');
//         });
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const sequelize = require('./Backend/util/database');
const file = require('express-fileupload');
require('dotenv').config();
const { Op } = require('sequelize');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://127.0.0.1:5500'],
        methods: ["GET", "POST"],
        credentials: true
    },
});

// Models
const User = require('./Backend/models/users');
const Chat = require('./Backend/models/chats');
const Group = require('./Backend/models/groups');
const UserGroup = require('./Backend/models/usergroups');
const File = require('./Backend/models/files');
const ArchivedChat = require('./Backend/models/archivedChats');

// Routes
const userRoutes = require('./Backend/routes/user');
const chatRoutes = require('./Backend/routes/chat');
const groupRoutes = require('./Backend/routes/group');
const fileRoutes = require('./Backend/routes/files');

// Middleware
app.use(file());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true
};
app.use(cors(corsOptions));

// Serve static files from the Front-end directory
app.use(express.static(path.join(__dirname, 'Front-end')));

// Use routes
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);
app.use('/file', fileRoutes);

// Sequelize associations
User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.hasMany(File);
File.belongsTo(User);

Group.hasMany(File);
File.belongsTo(Group);

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });

// Synchronize Sequelize models and start server
sequelize.sync()
    .then(() => {
        server.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Socket.io events
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`User joined group: ${groupId}`);
    });

    socket.on('leaveGroup', (groupId) => {
        socket.leave(groupId);
        console.log(`User left group: ${groupId}`);
    });

    socket.on('sendMessage', async ({ groupId, userId, message }) => {
        try {
            const chat = await Chat.create({ message, groupId, UserId: userId });
            io.to(groupId).emit('newMessage', chat);
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    });

    socket.on('sendFile', (file) => {
        io.to(file.groupId).emit('newFile', file);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Function to archive old messages
const archiveOldMessages = async () => {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        // Find all messages older than one day
        const oldMessages = await Chat.findAll({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo
                }
            }
        });

        // Move messages to ArchivedChat table
        const archivedMessages = oldMessages.map(message => message.toJSON());
        await ArchivedChat.bulkCreate(archivedMessages);

        // Delete old messages from Chat table
        await Chat.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo
                }
            }
        });

        console.log('Old messages archived and deleted successfully');
    } catch (error) {
        console.error('Error archiving old messages:', error);
    }
};


// Endpoint to manually trigger archiving
app.get('/archive-messages', async (req, res) => {
    try {
        await archiveOldMessages();
        res.status(200).send('Old messages archived successfully');
    } catch (error) {
        res.status(500).send('Error archiving old messages');
    }
});

// Cron job to archive old messages
cron.schedule('0 2 * * *', async () => {
    await archiveOldMessages();
});
