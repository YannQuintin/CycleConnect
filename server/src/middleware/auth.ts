import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log('🔐 Authentication middleware triggered for:', req.path);
  
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('❌ Authentication failed - no token provided for:', req.path);
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token in the Authorization header'
      });
    }

    console.log('✅ Token found, verifying...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('✅ Token decoded for user ID:', decoded.id);
    
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('❌ Authentication failed - user not found for ID:', decoded.id);
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'The user associated with this token no longer exists'
      });
    }

    console.log('✅ User authenticated successfully:', user.email);
    req.user = user;
    next();
  } catch (error: any) {
    console.error('❌ Authentication middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
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

    return res.status(403).json({ 
      error: 'Authentication failed',
      message: 'Unable to verify your authentication. Please log in again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log('🔓 Optional authentication middleware triggered for:', req.path);
  
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      console.log('✅ Token found, attempting optional authentication...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.id);
      if (user) {
        console.log('✅ Optional authentication successful for:', user.email);
        req.user = user;
      } else {
        console.log('⚠️ Optional authentication - user not found for ID:', decoded.id);
      }
    } else {
      console.log('ℹ️ No token provided for optional authentication');
    }
    
    next();
  } catch (error: any) {
    console.log('⚠️ Optional authentication failed, continuing without auth:', error.message);
    // For optional auth, we don't return errors, just continue without user
    next();
  }
};
