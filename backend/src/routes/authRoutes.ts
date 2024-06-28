import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

const router = Router();

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

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

router.post('/login', async (req: Request, res: Response) => {
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

router.post('/refresh', async (req: Request, res: Response) => {
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

router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token) as CustomJwtPayload;
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
