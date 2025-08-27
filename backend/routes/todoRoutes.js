const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// Get todos for logged-in user
router.get('/', auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user });
  res.json(todos);
});

// Add new todo
// Add new todo
router.post('/', auth, async (req, res) => {
  const { text, dueDate } = req.body;
  // Validate dueDate is not in the past
  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    if (due < today) {
      return res.status(400).json({ msg: 'Cannot add task for past date' });
    }
  }
  const newTodo = new Todo({ text, dueDate, user: req.user });
  await newTodo.save();
  res.json(newTodo);
});

// Toggle completion
router.put('/:id', auth, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user });
  if (!todo) return res.status(404).json({ msg: 'Todo not found' });
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Edit text or due date
router.put('/:id/edit', auth, async (req, res) => {
  const { text, dueDate } = req.body;
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user });
  if (!todo) return res.status(404).json({ msg: 'Todo not found' });
  // Validate dueDate is not in the past
  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    if (due < today) {
      return res.status(400).json({ msg: 'Cannot set due date to a past date' });
    }
  }
  if (text !== undefined) todo.text = text;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  await todo.save();
  res.json(todo);
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!todo) return res.status(404).json({ msg: 'Todo not found' });
  res.json({ message: 'Todo deleted' });
});

module.exports = router;
