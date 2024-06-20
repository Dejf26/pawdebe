import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

const router = Router();

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

// Function to initialize users
export const initializeUsers = async () => {
  try {
    console.log('Initializing users...');
    
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      console.log('Users already exist in the database');
      return;
    }

    const usersToAdd = [
      { firstName: 'Admin', lastName: 'User', login: 'admin', password: 'admin123', role: 'admin' },
      { firstName: 'Devops', lastName: 'User', login: 'devops', password: 'devops123', role: 'devops' },
      { firstName: 'Developer', lastName: 'User', login: 'developer', password: 'developer123', role: 'developer' },
    ];

    const hashedUsers = await Promise.all(
      usersToAdd.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(hashedUsers);
    console.log('Users initialized successfully');
  } catch (error) {
    console.error('Error initializing users:', error);
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({ token, refreshToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token refresh endpoint
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = verifyToken(refreshToken) as CustomJwtPayload;
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newToken = generateToken(decoded.userId);
    res.json({ token: newToken });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
