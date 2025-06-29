import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDesignations = async (req: Request, res: Response) => {
  try {
    const designations = await prisma.designation.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true
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

    const designationsWithEmployeeCount = designations.map(designation => ({
      ...designation,
      employeeCount: designation._count.users
    }));

    res.json(designationsWithEmployeeCount);
  } catch (error) {
    console.error('Error fetching designations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDesignation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const designation = await prisma.designation.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isActive: true
          }
        }
      }
    });

    if (!designation) {
      return res.status(404).json({ message: 'Designation not found' });
    }

    res.json(designation);
  } catch (error) {
    console.error('Error fetching designation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createDesignation = async (req: Request, res: Response) => {
  try {
    const { name, description, departmentId } = req.body;

    // Validate department if provided
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(departmentId) }
      });

      if (!department) {
        return res.status(400).json({ message: 'Department not found' });
      }
    }

    // Check if designation name already exists in the same department
    const existingDesignation = await prisma.designation.findFirst({
      where: {
        name,
        departmentId: departmentId ? parseInt(departmentId) : null
      }
    });

    if (existingDesignation) {
      return res.status(400).json({ 
        message: 'Designation name already exists in this department' 
      });
    }

    const designation = await prisma.designation.create({
      data: {
        name,
        description,
        departmentId: departmentId ? parseInt(departmentId) : null
      },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json(designation);
  } catch (error) {
    console.error('Error creating designation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDesignation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, departmentId } = req.body;

    // Check if designation exists
    const existingDesignation = await prisma.designation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingDesignation) {
      return res.status(404).json({ message: 'Designation not found' });
    }

    // Validate department if provided
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(departmentId) }
      });

      if (!department) {
        return res.status(400).json({ message: 'Department not found' });
      }
    }

    // Check if new name conflicts with existing designations in the same department (excluding current one)
    if (name && (name !== existingDesignation.name || departmentId !== existingDesignation.departmentId)) {
      const nameConflict = await prisma.designation.findFirst({
        where: {
          name,
          departmentId: departmentId ? parseInt(departmentId) : null,
          NOT: { id: parseInt(id) }
        }
      });

      if (nameConflict) {
        return res.status(400).json({ 
          message: 'Designation name already exists in this department' 
        });
      }
    }

    const designation = await prisma.designation.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        departmentId: departmentId ? parseInt(departmentId) : null
      },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(designation);
  } catch (error) {
    console.error('Error updating designation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteDesignation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if designation exists
    const designation = await prisma.designation.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!designation) {
      return res.status(404).json({ message: 'Designation not found' });
    }

    // Check if designation has employees
    if (designation._count.users > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete designation with employees. Please reassign employees first.' 
      });
    }

    await prisma.designation.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Designation deleted successfully' });
  } catch (error) {
    console.error('Error deleting designation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 