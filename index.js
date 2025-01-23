const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

admin.initializeApp({
    credential: admin.credential.cert(require(process.env.FIREBASE_CREDENTIALS)),
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});
