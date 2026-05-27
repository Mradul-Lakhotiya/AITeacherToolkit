import { Router } from 'express';
import User from '../models/User';

const router = Router();

// In a real app, use bcrypt to hash passwords.
// For this simple MVP, we will store them as plain text/base64 or just as-is.

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully', email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please sign up instead.', code: 'USER_NOT_FOUND' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.', code: 'WRONG_PASSWORD' });
    }

    res.status(200).json({ message: 'Login successful', email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
