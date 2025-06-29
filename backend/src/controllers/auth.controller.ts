import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequest, TokenPayload } from '../types/auth';

const prisma = new PrismaClient();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, type }: LoginRequest = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Check if the user has the correct role
    if (user.role !== type) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

    // Set cookies
    res.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken, // Still sending tokens in response for non-cookie storage
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
    

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const payload: TokenPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
    

    res.cookie('accessToken', newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {

  res.clearCookie('accessToken', { 
    ...COOKIE_OPTIONS,
    maxAge: 0
  });
  res.clearCookie('refreshToken', { 
    ...COOKIE_OPTIONS,
    maxAge: 0
  });
  res.json({ message: 'Logged out successfully' });
}; 