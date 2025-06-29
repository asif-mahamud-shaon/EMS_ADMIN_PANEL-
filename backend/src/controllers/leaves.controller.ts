import { Request, Response } from 'express';
import { PrismaClient, AttendanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeaves = async (req: Request, res: Response) => {
  try {
    const { status, userId, startDate, endDate } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = parseInt(userId as string);
    }

    if (startDate && endDate) {
      where.OR = [
        {
          startDate: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string)
          }
        },
        {
          endDate: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string)
          }
        }
      ];
    }

    const leaveRequests = await prisma.leave.findMany({
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
            }
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    });

    const formattedRequests = leaveRequests.map(leave => ({
      id: leave.id,
      employeeName: `${leave.user.firstName} ${leave.user.lastName}`,
      department: leave.user.department?.name || 'No Department',
      leaveType: getLeaveTypeLabel(leave.leaveType),
      startDate: leave.startDate.toISOString().split('T')[0],
      endDate: leave.endDate.toISOString().split('T')[0],
      reason: leave.reason || '',
      status: getLeaveStatusLabel(leave.status),
      appliedAt: leave.appliedAt.toISOString()
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: 'Cannot apply for past dates' });
    }

    // Check for overlapping leave requests
    const overlappingLeave = await prisma.leave.findFirst({
      where: {
        userId: parseInt(userId),
        status: {
          in: ['pending', 'approved']
        },
        OR: [
          {
            startDate: {
              lte: end
            },
            endDate: {
              gte: start
            }
          }
        ]
      }
    });

    if (overlappingLeave) {
      return res.status(400).json({ 
        message: 'You already have a leave request for overlapping dates' 
      });
    }

    const leave = await prisma.leave.create({
      data: {
        userId: parseInt(userId),
        leaveType,
        startDate: start,
        endDate: end,
        reason
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

    res.status(201).json(leave);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
    }

    // Check if leave request exists
    const existingLeave = await prisma.leave.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (existingLeave.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot update status of a leave request that is not pending' 
      });
    }

    const leave = await prisma.leave.update({
      where: { id: parseInt(id) },
      data: { status },
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

    // If approved, create attendance records for leave days
    if (status === 'approved') {
      await createLeaveAttendanceRecords(leave);
    }

    res.json(leave);
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLeaveStats = async (req: Request, res: Response) => {
  try {
    const { year } = req.query;
    
    const startDate = new Date(parseInt(year as string), 0, 1);
    const endDate = new Date(parseInt(year as string), 11, 31);

    const stats = await prisma.leave.groupBy({
      by: ['status'],
      where: {
        appliedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        status: true
      }
    });

    const formattedStats = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      formattedStats[stat.status] = stat._count.status;
    });

    // Total leaves applied
    const totalApplied = Object.values(formattedStats).reduce((sum, count) => sum + count, 0);

    res.json({
      ...formattedStats,
      total: totalApplied
    });
  } catch (error) {
    console.error('Error fetching leave stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper functions
function getLeaveTypeLabel(type: string): string {
  const typeMap: { [key: string]: string } = {
    'annual': 'Annual Leave',
    'sick': 'Sick Leave',
    'emergency': 'Emergency Leave',
    'unpaid': 'Unpaid Leave'
  };
  
  return typeMap[type] || type;
}

function getLeaveStatusLabel(status: string): string {
  const statusMap: { [key: string]: string } = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  
  return statusMap[status] || status;
}

async function createLeaveAttendanceRecords(leave: any) {
  try {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    
    const attendanceRecords = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Skip weekends (assuming Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Check if attendance record already exists
        const existingRecord = await prisma.attendance.findUnique({
          where: {
            userId_date: {
              userId: leave.userId,
              date: new Date(currentDate)
            }
          }
        });

        if (!existingRecord) {
          attendanceRecords.push({
            userId: leave.userId,
            date: new Date(currentDate),
            status: AttendanceStatus.leave
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (attendanceRecords.length > 0) {
      await prisma.attendance.createMany({
        data: attendanceRecords,
        skipDuplicates: true
      });
    }
  } catch (error) {
    console.error('Error creating leave attendance records:', error);
  }
} 