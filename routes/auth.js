const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');
const router = express.Router();

const prisma = new PrismaClient();
const SECRET_KEY = 'yoursecretkey';

// Register
router.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword },
        });

        // await admin.auth().createUser({ email, name, password });

        res.json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ 
            token, 
            user_id: user.id, 
            status: true,
            message: 'Login successful',
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

module.exports = router;
