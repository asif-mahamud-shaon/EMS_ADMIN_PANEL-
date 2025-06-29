import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPayrolls = async (req: Request, res: Response) => {
  try {
    const { month, year, userId, departmentId } = req.query;

    const where: any = {};

    if (month && year) {
      where.month = parseInt(month as string);
      where.year = parseInt(year as string);
    }

    if (userId) {
      where.userId = parseInt(userId as string);
    }

    if (departmentId) {
      where.user = {
        departmentId: parseInt(departmentId as string)
      };
    }

    const payrollRecords = await prisma.payroll.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: {
              select: {
                name: true
              }
            },
            designation: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { user: { firstName: 'asc' } }
      ]
    });

    const formattedRecords = payrollRecords.map(record => ({
      id: record.id,
      employeeName: `${record.user.firstName} ${record.user.lastName}`,
      department: record.user.department?.name || 'No Department',
      designation: record.user.designation?.name || 'No Designation',
      basicSalary: parseFloat(record.basicSalary.toString()),
      allowances: parseFloat(record.allowances.toString()),
      deductions: parseFloat(record.deductions.toString()),
      bonus: parseFloat(record.bonus.toString()),
      overtime: parseFloat(record.overtime.toString()),
      netSalary: parseFloat(record.netSalary.toString()),
      month: `${record.year}-${record.month.toString().padStart(2, '0')}`,
      status: 'Approved', // Default status for generated payrolls
      notes: record.notes || ''
    }));

    res.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const generatePayroll = async (req: Request, res: Response) => {
  try {
    const { month, year, userIds } = req.body;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    // Get users to generate payroll for
    const where: any = { isActive: true };
    if (userIds && userIds.length > 0) {
      where.id = { in: userIds.map((id: string) => parseInt(id)) };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        basicSalary: true
      }
    });

    const payrollData = [];
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    for (const user of users) {
      // Check if payroll already exists
      const existingPayroll = await prisma.payroll.findUnique({
        where: {
          userId_month_year: {
            userId: user.id,
            month: monthInt,
            year: yearInt
          }
        }
      });

      if (existingPayroll) {
        continue; // Skip if already exists
      }

      const basicSalary = parseFloat(user.basicSalary.toString());
      const allowances = basicSalary * 0.1; // 10% allowances
      const deductions = basicSalary * 0.05; // 5% deductions
      const bonus = 0; // No bonus by default
      const overtime = 0; // No overtime by default
      const netSalary = basicSalary + allowances + bonus + overtime - deductions;

      payrollData.push({
        userId: user.id,
        month: monthInt,
        year: yearInt,
        basicSalary,
        allowances,
        deductions,
        bonus,
        overtime,
        netSalary
      });
    }

    if (payrollData.length === 0) {
      return res.status(400).json({ 
        message: 'No eligible users found or payroll already exists for this period' 
      });
    }

    await prisma.payroll.createMany({
      data: payrollData
    });

    res.status(201).json({ 
      message: `Payroll generated for ${payrollData.length} employees`,
      count: payrollData.length 
    });
  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePayroll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { basicSalary, allowances, deductions, bonus, overtime, notes } = req.body;

    // Check if payroll exists
    const existingPayroll = await prisma.payroll.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPayroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    // Calculate new net salary if any component is updated
    const newBasicSalary = basicSalary !== undefined ? parseFloat(basicSalary) : parseFloat(existingPayroll.basicSalary.toString());
    const newAllowances = allowances !== undefined ? parseFloat(allowances) : parseFloat(existingPayroll.allowances.toString());
    const newDeductions = deductions !== undefined ? parseFloat(deductions) : parseFloat(existingPayroll.deductions.toString());
    const newBonus = bonus !== undefined ? parseFloat(bonus) : parseFloat(existingPayroll.bonus.toString());
    const newOvertime = overtime !== undefined ? parseFloat(overtime) : parseFloat(existingPayroll.overtime.toString());
    
    const netSalary = newBasicSalary + newAllowances + newBonus + newOvertime - newDeductions;

    const payroll = await prisma.payroll.update({
      where: { id: parseInt(id) },
      data: {
        basicSalary: newBasicSalary,
        allowances: newAllowances,
        deductions: newDeductions,
        bonus: newBonus,
        overtime: newOvertime,
        netSalary,
        notes: notes !== undefined ? notes : undefined
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            department: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    res.json(payroll);
  } catch (error) {
    console.error('Error updating payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPayrollStats = async (req: Request, res: Response) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    const stats = await prisma.payroll.aggregate({
      where: {
        year: targetYear
      },
      _sum: {
        basicSalary: true,
        allowances: true,
        deductions: true,
        bonus: true,
        overtime: true,
        netSalary: true
      },
      _count: {
        id: true
      }
    });

    res.json({
      totalBasicSalary: parseFloat((stats._sum.basicSalary || 0).toString()),
      totalAllowances: parseFloat((stats._sum.allowances || 0).toString()),
      totalDeductions: parseFloat((stats._sum.deductions || 0).toString()),
      totalBonus: parseFloat((stats._sum.bonus || 0).toString()),
      totalOvertime: parseFloat((stats._sum.overtime || 0).toString()),
      totalNetSalary: parseFloat((stats._sum.netSalary || 0).toString()),
      totalRecords: stats._count.id
    });
  } catch (error) {
    console.error('Error fetching payroll stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 