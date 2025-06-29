import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId, departmentId } = req.query;

    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    if (userId) {
      where.userId = parseInt(userId as string);
    }

    if (departmentId) {
      where.user = {
        departmentId: parseInt(departmentId as string)
      };
    }

    const attendanceRecords = await prisma.attendance.findMany({
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
      orderBy: [
        { date: 'desc' },
        { user: { firstName: 'asc' } }
      ]
    });

    const formattedRecords = attendanceRecords.map(record => {
      const workingHours = record.checkIn && record.checkOut 
        ? calculateWorkingHours(record.checkIn, record.checkOut)
        : '0h';

      return {
        id: record.id,
        employeeName: `${record.user.firstName} ${record.user.lastName}`,
        department: record.user.department?.name || 'No Department',
        date: record.date.toISOString().split('T')[0],
        checkIn: record.checkIn ? record.checkIn.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }) : '-',
        checkOut: record.checkOut ? record.checkOut.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }) : '-',
        status: getAttendanceStatusLabel(record.status),
        workingHours
      };
    });

    res.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createAttendance = async (req: Request, res: Response) => {
  try {
    const { userId, date, checkIn, checkOut, status } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if attendance record already exists for this user and date
    const existingRecord = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: new Date(date)
        }
      }
    });

    if (existingRecord) {
      return res.status(400).json({ 
        message: 'Attendance record already exists for this date' 
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: parseInt(userId),
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        status: status || 'present'
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

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, status } = req.body;

    // Check if attendance record exists
    const existingRecord = await prisma.attendance.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingRecord) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status: status || undefined
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

    res.json(attendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAttendanceStats = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    
    const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);

    const stats = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        status: true
      }
    });

    const formattedStats = {
      present: 0,
      absent: 0,
      leave: 0,
      half_day: 0
    };

    stats.forEach(stat => {
      formattedStats[stat.status] = stat._count.status;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper functions
function calculateWorkingHours(checkIn: Date, checkOut: Date): string {
  const diff = checkOut.getTime() - checkIn.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${hours}h`;
}

function getAttendanceStatusLabel(status: string): string {
  const statusMap: { [key: string]: string } = {
    'present': 'Present',
    'absent': 'Absent',
    'leave': 'Leave',
    'half_day': 'Half Day'
  };
  
  return statusMap[status] || status;
} 