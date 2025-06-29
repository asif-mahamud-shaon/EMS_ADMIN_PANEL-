import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'binti@hrms.com' }
    });

    if (adminExists) {
      console.log('Default admin account already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        email: 'binti@hrms.com',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        dateJoined: new Date(),
        basicSalary: 0
      }
    });

    console.log('Default admin account created successfully');
  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAdmin(); 