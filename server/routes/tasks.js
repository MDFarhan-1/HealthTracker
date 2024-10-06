const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');

// Add a new task
router.post('/', async (req, res) => {
  const { userId, name } = req.body;
  const task = new Task({ name, user: userId });
  await task.save();

  const user = await User.findById(userId);
  user.tasks.push(task._id);
  await user.save();

  res.json(task);
});

// Mark task as completed
router.put('/:id/complete', async (req, res) => {
  const { userId } = req.body;
  const task = await Task.findById(req.params.id);
  if (task) {
    task.completed = true;
    task.completionCount += 1;
    await task.save();

    const user = await User.findById(userId);
    if (task.completionCount >= 7) {
      user.rewards += 1; // Add reward
      await user.save();
    }
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Get user tasks
router.get('/:userId', async (req, res) => {
  const userTasks = await Task.find({ user: req.params.userId });
  res.json(userTasks);
});

module.exports = router;
