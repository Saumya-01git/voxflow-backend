import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDB, writeDB } from '../utils/db.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';
import { logger } from '../utils/logger.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const db = await readDB();
    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    await writeDB(db);

    logger.info(`New user registered: ${newUser.email} (${newUser.id})`);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    logger.error('Register error:', err.message);
    res.status(500).json({ success: false, error: 'Registration failed due to server error.' });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const db = await readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    logger.error('Login error:', err.message);
    res.status(500).json({ success: false, error: 'Login failed due to server error.' });
  }
}

/**
 * Get current user profile
 * GET /api/auth/me
 */
export async function getMe(req, res) {
  try {
    const db = await readDB();
    const user = db.users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
  }
}

/**
 * Update user password
 * PUT /api/auth/update-password
 */
export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long.'
      });
    }

    const db = await readDB();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const user = db.users[userIndex];
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    db.users[userIndex].passwordHash = newHash;
    db.users[userIndex].updatedAt = new Date().toISOString();
    await writeDB(db);

    logger.info(`Password successfully updated for user: ${user.email} (${user.id})`);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully!'
    });
  } catch (err) {
    logger.error('Update password error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update password.' });
  }
}
