const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const sequelize = require('./Backend/util/database');

const userRoutes = require('./Backend/routes/user');
const chatRoutes = require('./Backend/routes/chat');
const groupRoutes = require('./Backend/routes/group');

// Models
const User = require('./Backend/models/users');
const Chat = require('./Backend/models/chats');
const Group = require('./Backend/models/groups');
const userGroups = require('./Backend/models/usergroups');


const app = express();

// Middleware
app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);


// Define relationships between tables
User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

Group.belongsToMany(User, { through: userGroups });
User.belongsToMany(Group, { through: userGroups });



// Sync Sequelize with the database
sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
