import express, { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('profile.firstName').notEmpty().trim(),
  body('profile.lastName').notEmpty().trim(),
  body('location.coordinates').isArray({ min: 2, max: 2 })
], async (req: Request, res: Response) => {
  console.log('🔐 Registration attempt for:', req.body.email);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Registration validation failed:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array(),
        message: 'Please check your input data'
      });
    }

    const { email, password, profile, cycling, location } = req.body;

    console.log('✅ Registration validation passed for:', email);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Registration failed - user already exists:', email);
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'An account with this email address already exists. Please try logging in instead.'
      });
    }

    console.log('✅ Email is available, creating new user:', email);

    // Create new user
    const user = new User({
      email,
      password,
      profile,
      cycling: cycling || {},
      location
    });

    await user.save();
    console.log('✅ User created successfully in database:', email);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRE || '7d') } as SignOptions
    );

    console.log('✅ JWT token generated for user:', email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });

  } catch (error: any) {
    console.error('❌ Registration error for:', req.body.email, error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: 'Duplicate field error',
        message: `A user with this ${field} already exists`,
        field: field
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please check your input data',
        details: validationErrors
      });
    }

    res.status(500).json({ 
      error: 'Server error during registration',
      message: 'An unexpected error occurred. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: Request, res: Response) => {
  console.log('🔐 Login attempt for:', req.body.email);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Login validation failed:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array(),
        message: 'Please provide a valid email and password'
      });
    }

    const { email, password } = req.body;

    console.log('✅ Login validation passed for:', email);

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ Login failed - user not found:', email);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'No account found with this email address'
      });
    }

    console.log('✅ User found, checking password for:', email);

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Login failed - incorrect password for:', email);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Incorrect password. Please try again.'
      });
    }

    console.log('✅ Password verified for:', email);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRE || '7d') } as SignOptions
    );

    console.log('✅ JWT token generated for login:', email);

    // Remove password from response
    const userResponse = user.toJSON();

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error: any) {
    console.error('❌ Login error for:', req.body.email, error);
    
    // Handle specific errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user data',
        message: 'The provided user information is not valid'
      });
    }

    res.status(500).json({ 
      error: 'Server error during login',
      message: 'An unexpected error occurred. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  console.log('🔄 Token refresh attempt');
  
  try {
    const { token } = req.body;
    
    if (!token) {
      console.log('❌ Token refresh failed - no token provided');
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'A valid token is required to refresh authentication'
      });
    }

    console.log('✅ Token provided for refresh');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('✅ Token decoded successfully for user ID:', decoded.id);
    
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('❌ Token refresh failed - user not found for ID:', decoded.id);
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The user associated with this token no longer exists'
      });
    }

    console.log('✅ User found for token refresh:', user.email);

    const newToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRE || '7d') } as SignOptions
    );

    console.log('✅ New token generated for user:', user.email);

    res.json({ 
      token: newToken,
      message: 'Token refreshed successfully'
    });

  } catch (error: any) {
    console.error('❌ Token refresh error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is malformed or invalid'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    }

    res.status(401).json({ 
      error: 'Token refresh failed',
      message: 'Unable to refresh your authentication. Please log in again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
  console.log('👋 Logout request received');
  res.json({ 
    message: 'Logout successful',
    note: 'Please remove the token from client storage'
  });
});

export default router;
