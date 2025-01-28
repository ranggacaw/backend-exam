const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const router = express.Router();

app.use(express.json()); // Add this to parse JSON requests
app.use(express.urlencoded({ extended: true }))

const prisma = new PrismaClient();

// Your routes go here


// Get Todos
router.get('/', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// Add Todo
router.post('/', async (req, res) => {
  const { title, content, userId } = req.body;
  console.log(req.body);
  

  if (!title || !userId || !content) {
      return res.status(400).json({ error: 'Title, Content and userId are required' });
  }

  try {
    const userInt = parseInt(userId);
    const todo = await prisma.todo.create({ data: { title, content, userId: userInt } });
    res.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error); // Log detailed error
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

module.exports = router;
