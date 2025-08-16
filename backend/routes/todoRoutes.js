const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
// Add new todo
router.post('/', async (req, res) => {
  const { text, dueDate } = req.body;
  const newTodo = new Todo({ text, dueDate });
  await newTodo.save();
  res.json(newTodo);
});

// Toggle completion
router.put('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Edit text or due date
router.put('/:id/edit', async (req, res) => {
  const { text, dueDate } = req.body;
  const todo = await Todo.findById(req.params.id);
  if (text !== undefined) todo.text = text;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  await todo.save();
  res.json(todo);
});

// Delete todo
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

module.exports = router;
