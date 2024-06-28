import { Router } from 'express';
import mongoose from 'mongoose';
import Project from '../models/project';

const router = Router();

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newProject = new Project({ name, description });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Error fetching project' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.id),
      { name, description },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
