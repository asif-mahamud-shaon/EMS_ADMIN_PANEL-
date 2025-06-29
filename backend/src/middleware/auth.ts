import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const auth = (requiredRole?: 'admin' | 'employee') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;
      
      // First, try to get token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log('Found token in Authorization header');
      }
      
      // If no token in header, try to get from cookies
      if (!token) {
        token = req.cookies.accessToken;
        if (token) {
          console.log('Found token in cookies');
        } else {
          console.log('No token found in cookies or header. Available cookies:', Object.keys(req.cookies));
        }
      }
      
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: `Forbidden - ${requiredRole} access required` });
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log('Token expired for user');
        return res.status(401).json({ message: 'Token expired' });
      }
      console.log('Invalid token error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}; 