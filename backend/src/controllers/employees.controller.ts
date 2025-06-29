import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.user.findMany({
      include: {
        department: true,
        designation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: true,
        designation: true,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      departmentId,
      designationId,
      basicSalary,
      dateJoined,
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const employee = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        departmentId: departmentId ? parseInt(departmentId) : null,
        designationId: designationId ? parseInt(designationId) : null,
        basicSalary: parseFloat(basicSalary) || 0,
        dateJoined: dateJoined ? new Date(dateJoined) : new Date(),
        role: 'employee',
        isActive: true,
      },
      include: {
        department: true,
        designation: true,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      departmentId,
      designationId,
      basicSalary,
      dateJoined,
      isActive,
    } = req.body;

    const employee = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        email,
        departmentId: departmentId ? parseInt(departmentId) : null,
        designationId: designationId ? parseInt(designationId) : null,
        basicSalary: parseFloat(basicSalary) || 0,
        dateJoined: dateJoined ? new Date(dateJoined) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        department: true,
        designation: true,
      },
    });

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Profile-specific endpoints
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      nationalId,
      emergencyContact,
      bloodGroup,
      avatar,
    } = req.body;

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        nationalId,
        emergencyContact,
        bloodGroup,
        avatar,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 