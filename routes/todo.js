const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const router = express.Router();

app.use(express.json()); // Add this to parse JSON requests

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
  const { title, userId } = req.body;

  if (!title || !userId) {
      return res.status(400).json({ error: 'Title and userId are required' });
  }

  try {
      const todo = await prisma.todo.create({ data: { title, userId } });
      res.json(todo);
  } catch (error) {
      console.error('Error creating todo:', error); // Log detailed error
      res.status(500).json({ error: 'Failed to create todo' });
  }
});

module.exports = router;
