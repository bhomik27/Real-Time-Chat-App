const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, process.env.JWT_SECRET);
};

const signup = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Name, email, phone, and password are required.' });
        }

        const existingUser = await User.findOne({ where: { email }, transaction: t });
        if (existingUser) {
            await t.rollback();
            return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Only create the user once
        const newUser = await User.create({ name, email, phone, password: hashedPassword }, { transaction: t });

        await t.commit();

        return res.status(201).json({
            message: 'User signed up successfully!',
            user: { name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        await t.rollback();
        return res.status(500).json({ message: 'Error during signup process. Please try again later.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        await User.update({isloggedin:true},{where:{id:user.id}})

        return res.status(200).json({
            message: 'Login successful!',
            token: generateAccessToken(user.id, user.name)
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error during login process. Please try again later.' });
    }
};

const getAllLoggedinUsers = async (req, res) => {
    try {
        console.log(req.user)
        const loggedinusers = await User.findAll({ where: { isloggedin: true } })
        res.status(200).json({ loggedinusers })
    } catch (error) {
        console.log(error)
    }
};



module.exports = {
    signup,
    login,
    getAllLoggedinUsers
};
