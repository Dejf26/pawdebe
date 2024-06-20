import { Router } from 'express';
import ActiveProject from '../models/activeProject';
import Project from '../models/project';

const router = Router();

// Set Active Project
router.post('/', async (req, res) => {
  const { id } = req.body;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let activeProject = await ActiveProject.findOne();
    if (activeProject) {
      activeProject.projectId = id;
      await activeProject.save();
    } else {
      activeProject = new ActiveProject({ projectId: id });
      await activeProject.save();
    }

    res.status(200).json(activeProject);
  } catch (error) {
    console.error('Error setting active project:', error);
    res.status(500).json({ error: 'Error setting active project' });
  }
});

// Get Active Project
router.get('/', async (req, res) => {
  try {
    const activeProject = await ActiveProject.findOne().populate('projectId');
    if (!activeProject) {
      return res.status(404).json({ error: 'No active project found' });
    }
    res.status(200).json(activeProject.projectId);
  } catch (error) {
    console.error('Error fetching active project:', error);
    res.status(500).json({ error: 'Error fetching active project' });
  }
});

export default router;
