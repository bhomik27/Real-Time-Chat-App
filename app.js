const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors module
const sequelize = require('./Backend/util/database');

const userRoutes = require('./Backend/routes/user');
const User = require('./Backend/models/user');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
}));

// Routes
app.use('/user', userRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => console.log(err));