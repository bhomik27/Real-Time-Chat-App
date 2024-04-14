const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const sequelize = require('./Backend/util/database');



const userRoutes = require('./Backend/routes/user');
const chatRoutes = require('./Backend/routes/chat');



//models
const User = require('./Backend/models/user');
const Chat = require('./Backend/models/chat');



//Relation between tables
User.hasMany(Chat)
Chat.belongsTo(User)



const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);


sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => console.log(err));
