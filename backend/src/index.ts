// index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import projectRoutes from './routes/projectRoutes';
import storyRoutes from './routes/storyRoutes';
import authRoutes, { initializeUsers } from './routes/authRoutes';
import activeProjectRoutes from './routes/activeProjectRoutes';
import userRoutes from './routes/userRoutes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/projects', projectRoutes);
app.use('/stories', storyRoutes);
app.use('/activeProject', activeProjectRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initializeUsers();
});
