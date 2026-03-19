const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // You'll need to install this
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Registration attempt for:', email);
        
        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is missing in environment variables');
            return res.status(500).json({ message: 'Internal Server Configuration Error' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT Sign Error (Register):', err.message);
                throw err;
            }
            res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
        });
    } catch (err) {
        console.error('Registration Catch Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is missing in environment variables');
            return res.status(500).json({ message: 'Internal Server Configuration Error' });
        }

        const user = await User.findOne({ email });
        console.log('User found in DB:', !!user);
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT Sign Error (Login):', err.message);
                throw err;
            }
            res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
        });
    } catch (err) {
        console.error('Login Catch Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
