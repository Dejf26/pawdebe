import express from 'express';
import Task from '../models/task';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('story assignedUser');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, description, priority, story, estimatedHours } = req.body;
  try {
    const newTask = new Task({ name, description, priority, story, estimatedHours });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, description, priority, story, status, estimatedHours, assignedUser } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (status === 'doing' && !task.startDate) {
      task.startDate = new Date();
    }

    if (status === 'done' && !task.endDate) {
      task.endDate = new Date();
    }

    task.name = name;
    task.description = description;
    task.priority = priority;
    task.story = story;
    task.status = status;
    task.estimatedHours = estimatedHours;
    task.assignedUser = assignedUser;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
