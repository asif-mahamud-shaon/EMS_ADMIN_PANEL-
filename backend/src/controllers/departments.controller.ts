import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const departmentsWithEmployeeCount = departments.map(dept => ({
      ...dept,
      employeeCount: dept._count.users
    }));

    res.json(departmentsWithEmployeeCount);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description, managerId } = req.body;

    // Check if department name already exists
    const existingDepartment = await prisma.department.findUnique({
      where: { name }
    });

    if (existingDepartment) {
      return res.status(400).json({ message: 'Department name already exists' });
    }

    // If managerId is provided, check if the user exists and is not already managing another department
    if (managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: managerId },
        include: {
          managedDepartment: true
        }
      });

      if (!manager) {
        return res.status(400).json({ message: 'Manager not found' });
      }

      if (manager.managedDepartment) {
        return res.status(400).json({ message: 'User is already managing another department' });
      }
    }

    const department = await prisma.department.create({
      data: {
        name,
        description,
        managerId: managerId ? parseInt(managerId) : null
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, managerId } = req.body;

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if new name conflicts with existing departments (excluding current one)
    if (name && name !== existingDepartment.name) {
      const nameConflict = await prisma.department.findFirst({
        where: {
          name,
          NOT: { id: parseInt(id) }
        }
      });

      if (nameConflict) {
        return res.status(400).json({ message: 'Department name already exists' });
      }
    }

    // If managerId is provided, check if the user exists and is not already managing another department
    if (managerId && managerId !== existingDepartment.managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: managerId },
        include: {
          managedDepartment: true
        }
      });

      if (!manager) {
        return res.status(400).json({ message: 'Manager not found' });
      }

      if (manager.managedDepartment && manager.managedDepartment.id !== parseInt(id)) {
        return res.status(400).json({ message: 'User is already managing another department' });
      }
    }

    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        managerId: managerId ? parseInt(managerId) : null
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            users: true,
            designations: true
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has employees or designations
    if (department._count.users > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with employees. Please reassign employees first.' 
      });
    }

    if (department._count.designations > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with designations. Please remove designations first.' 
      });
    }

    await prisma.department.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 