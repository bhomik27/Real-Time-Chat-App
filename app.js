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
require('dotenv').config();
const sequelize = require('./Backend/util/database');

const userRoutes = require('./Backend/routes/user');
const chatRoutes = require('./Backend/routes/chat');
const groupRoutes = require('./Backend/routes/group');
const User = require('./Backend/models/users');
const Chat = require('./Backend/models/chats');
const Group = require('./Backend/models/groups');
const UserGroup = require('./Backend/models/usergroups');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://127.0.0.1:5500'],
        methods: ["GET", "POST"],
        credentials: true
    },
});

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

User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });

sequelize.sync()
    .then(() => {
        server.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

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

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
