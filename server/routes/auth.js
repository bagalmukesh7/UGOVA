import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/mockDb.js';
import { generateToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, education, state, city, age, category } = req.body;

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      phone: phone || '',
      role: 'user',
      isVerified: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profile: {
        education: education || '',
        state: state || '',
        city: city || '',
        age: age || null,
        category: category || 'General',
      },
    };

    db.users.push(user);

    // Log activity
    db.activityLogs.push({
      id: uuidv4(),
      userId: user.id,
      action: 'REGISTER',
      details: `User ${email} registered`,
      timestamp: new Date().toISOString(),
    });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date().toISOString();

    // Log activity
    db.activityLogs.push({
      id: uuidv4(),
      userId: user.id,
      action: 'LOGIN',
      details: `User ${email} logged in`,
      timestamp: new Date().toISOString(),
    });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Google OAuth (mock)
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    let user = db.users.find(u => u.email === email);
    if (!user) {
      user = {
        id: uuidv4(),
        email,
        password: await bcrypt.hash(googleId || uuidv4(), 10),
        name: name || email.split('@')[0],
        phone: '',
        role: 'user',
        isVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profile: {
          education: '',
          state: '',
          city: '',
          age: null,
          category: 'General',
        },
      };
      db.users.push(user);

      db.activityLogs.push({
        id: uuidv4(),
        userId: user.id,
        action: 'GOOGLE_REGISTER',
        details: `User ${email} registered via Google`,
        timestamp: new Date().toISOString(),
      });
    } else {
      user.lastLogin = new Date().toISOString();
      db.activityLogs.push({
        id: uuidv4(),
        userId: user.id,
        action: 'GOOGLE_LOGIN',
        details: `User ${email} logged in via Google`,
        timestamp: new Date().toISOString(),
      });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Google login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

// Update profile
router.put('/profile', authenticate, (req, res) => {
  try {
    const { name, phone, education, state, city, age, category } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (education !== undefined) user.profile.education = education;
    if (state !== undefined) user.profile.state = state;
    if (city !== undefined) user.profile.city = city;
    if (age !== undefined) user.profile.age = age;
    if (category !== undefined) user.profile.category = category;

    db.activityLogs.push({
      id: uuidv4(),
      userId: user.id,
      action: 'PROFILE_UPDATE',
      details: `User ${user.email} updated profile`,
      timestamp: new Date().toISOString(),
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Profile updated', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

// Send OTP
router.post('/otp/send', authenticate, (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    db.otpStore.set(req.user.id, { otp, expiry, phone });

    // Mock: In production, send SMS
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Verify OTP
router.post('/otp/verify', authenticate, (req, res) => {
  try {
    const { otp } = req.body;
    const stored = db.otpStore.get(req.user.id);

    if (!stored) {
      return res.status(400).json({ message: 'No OTP found. Request new OTP.' });
    }

    if (Date.now() > stored.expiry) {
      db.otpStore.delete(req.user.id);
      return res.status(400).json({ message: 'OTP expired. Request new OTP.' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update phone
    req.user.phone = stored.phone;
    req.user.isVerified = true;
    db.otpStore.delete(req.user.id);

    db.activityLogs.push({
      id: uuidv4(),
      userId: req.user.id,
      action: 'PHONE_VERIFY',
      details: `Phone ${stored.phone} verified with OTP`,
      timestamp: new Date().toISOString(),
    });

    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

export default router;
