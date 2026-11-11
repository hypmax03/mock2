const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const newTask = await Task.create({
      title,
      description,
      status: status || 'Pending',
    });

    // 201 means "Created successfully"
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create task', error: error.message });
  }
});

// 3. PUT /api/tasks/:id - Update an existing task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // { new: true } returns the updated document instead of the old one
    // { runValidators: true } ensures status matches 'Pending' or 'Completed'
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update task', error: error.message });
  }
});

// 4. DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete task', error: error.message });
  }
});

module.exports = router;

