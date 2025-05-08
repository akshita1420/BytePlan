const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { ...req.body, password: '[REDACTED]' });
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();
    console.log('User created successfully:', { id: user._id, email: user.email });

    // Create token for immediate sign in
    const token = jwt.sign(
      { userId: user._id },
      'your_jwt_secret', // Replace with actual secret in production
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message
    });
  }
});

// Sign In Route
router.post('/signin', async (req, res) => {
  try {
    console.log('Signin request received:', { ...req.body, password: '[REDACTED]' });
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      'your_jwt_secret', // Replace with actual secret in production
      { expiresIn: '1h' }
    );

    // Send response with user data (excluding password) and token
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    console.log('User signed in successfully:', { id: user._id, email: user.email });
    res.json({
      token,
      user: userData,
      message: 'Sign in successful'
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message
    });
  }
});

module.exports = router; 