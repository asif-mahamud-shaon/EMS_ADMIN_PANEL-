import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get current date for calculations
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Get employee count
    const employeeCount = await prisma.user.count({
      where: { isActive: true }
    });

    // Get department count
    const departmentCount = await prisma.department.count();

    // Get leave types count (unique leave types)
    const leaveTypes = await prisma.leave.groupBy({
      by: ['leaveType']
    });

    // Get leave statistics for current year
    const leaveStats = await prisma.leave.groupBy({
      by: ['status'],
      where: {
        appliedAt: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31)
        }
      },
      _count: {
        status: true
      }
    });

    // Format leave statistics
    const formattedLeaveStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    leaveStats.forEach(stat => {
      formattedLeaveStats[stat.status] = stat._count.status;
      formattedLeaveStats.total += stat._count.status;
    });

    // Get attendance statistics for current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const attendanceStats = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _count: {
        status: true
      }
    });

    // Format attendance statistics
    const formattedAttendanceStats = {
      present: 0,
      absent: 0,
      leave: 0,
      half_day: 0
    };

    attendanceStats.forEach(stat => {
      formattedAttendanceStats[stat.status] = stat._count.status;
    });

    // Get recent leave requests (last 10)
    const recentLeaveRequests = await prisma.leave.findMany({
      take: 10,
      orderBy: {
        appliedAt: 'desc'
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

    const formattedRecentLeaves = recentLeaveRequests.map(leave => ({
      id: leave.id,
      employeeName: `${leave.user.firstName} ${leave.user.lastName}`,
      department: leave.user.department?.name || 'No Department',
      leaveType: leave.leaveType,
      startDate: leave.startDate.toISOString().split('T')[0],
      endDate: leave.endDate.toISOString().split('T')[0],
      status: leave.status,
      appliedAt: leave.appliedAt.toISOString()
    }));

    res.json({
      overview: {
        employeeCount,
        departmentCount,
        leaveTypeCount: leaveTypes.length
      },
      leaveStats: {
        applied: formattedLeaveStats.total,
        pending: formattedLeaveStats.pending,
        approved: formattedLeaveStats.approved,
        rejected: formattedLeaveStats.rejected
      },
      attendanceStats: formattedAttendanceStats,
      recentLeaveRequests: formattedRecentLeaves
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 