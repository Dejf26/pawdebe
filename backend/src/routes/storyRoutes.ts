// routes/storyRoutes.ts
import express from 'express';
import Story from '../models/story';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().populate('project owner');
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/storyRoutes.ts
router.post('/', async (req, res) => {
    const { name, description, priority, project, status, owner } = req.body;
    try {
      const newStory = new Story({ name, description, priority, project, status, owner });
      await newStory.save();
      res.status(201).json(newStory);
    } catch (error) {
      console.error('Error creating story:', error);  // Dodano logowanie błędów
      res.status(500).json({ message: 'Server error' });
    }
  });
  

router.put('/:id', async (req, res) => {
  const { name, description, priority, project, status, owner } = req.body;
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, { name, description, priority, project, status, owner }, { new: true });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
