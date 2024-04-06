const bcrypt = require('bcryptjs');
const User = require('../models/user');
const  sequelize = require('../util/database');



const signup = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existingUser = await User.findOne({ where: { email }, transaction: t });
        if (existingUser) {
            await t.rollback();
            return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.create({ name, email, password: hashedPassword }, { transaction: t });

        await t.commit();

        return res.status(201).json({
            message: 'User signed up successfully!',
            user: { name, email }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        await t.rollback();
        return res.status(500).json({ message: 'Error during signup process. Please try again later.' });
    }
};

module.exports = {
    signup
}