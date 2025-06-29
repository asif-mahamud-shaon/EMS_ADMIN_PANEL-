import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const bangladeshiData = {
  departments: [
    {
      name: 'Information Technology',
      description: 'Software development, system administration, and technical support'
    },
    {
      name: 'Human Resources',
      description: 'Employee management, recruitment, and organizational development'
    },
    {
      name: 'Finance & Accounts',
      description: 'Financial planning, accounting, and budget management'
    },
    {
      name: 'Marketing & Sales',
      description: 'Brand promotion, customer acquisition, and sales management'
    },
    {
      name: 'Operations',
      description: 'Daily business operations and process management'
    },
    {
      name: 'Customer Service',
      description: 'Customer support and relationship management'
    }
  ],
  
  designations: [
    // IT Department
    { name: 'Software Engineer', departmentName: 'Information Technology' },
    { name: 'Senior Software Engineer', departmentName: 'Information Technology' },
    { name: 'Technical Lead', departmentName: 'Information Technology' },
    { name: 'DevOps Engineer', departmentName: 'Information Technology' },
    { name: 'System Administrator', departmentName: 'Information Technology' },
    { name: 'UI/UX Designer', departmentName: 'Information Technology' },
    
    // HR Department
    { name: 'HR Manager', departmentName: 'Human Resources' },
    { name: 'HR Executive', departmentName: 'Human Resources' },
    { name: 'Recruitment Specialist', departmentName: 'Human Resources' },
    { name: 'Training Coordinator', departmentName: 'Human Resources' },
    
    // Finance Department
    { name: 'Finance Manager', departmentName: 'Finance & Accounts' },
    { name: 'Accountant', departmentName: 'Finance & Accounts' },
    { name: 'Financial Analyst', departmentName: 'Finance & Accounts' },
    { name: 'Accounts Payable Specialist', departmentName: 'Finance & Accounts' },
    
    // Marketing Department
    { name: 'Marketing Manager', departmentName: 'Marketing & Sales' },
    { name: 'Digital Marketing Specialist', departmentName: 'Marketing & Sales' },
    { name: 'Sales Executive', departmentName: 'Marketing & Sales' },
    { name: 'Brand Manager', departmentName: 'Marketing & Sales' },
    { name: 'Content Creator', departmentName: 'Marketing & Sales' },
    
    // Operations Department
    { name: 'Operations Manager', departmentName: 'Operations' },
    { name: 'Project Coordinator', departmentName: 'Operations' },
    { name: 'Quality Assurance Specialist', departmentName: 'Operations' },
    
    // Customer Service Department
    { name: 'Customer Service Manager', departmentName: 'Customer Service' },
    { name: 'Customer Support Representative', departmentName: 'Customer Service' },
    { name: 'Customer Success Specialist', departmentName: 'Customer Service' }
  ],
  
  employees: [
    {
      firstName: 'Rashid',
      lastName: 'Ahmed',
      email: 'rashid.ahmed@company.com',
      departmentName: 'Information Technology',
      designationName: 'Technical Lead',
      basicSalary: 85000,
      role: 'employee' as const,
      phone: '+880 1712-345678',
      nationalId: '1234567890',
      address: 'Dhanmondi, Dhaka',
      emergencyContact: '+880 1912-345678',
      bloodGroup: 'O+'
    },
    {
      firstName: 'Fatima',
      lastName: 'Khan',
      email: 'fatima.khan@company.com',
      departmentName: 'Human Resources',
      designationName: 'HR Manager',
      basicSalary: 75000,
      role: 'employee' as const,
      phone: '+880 1713-456789',
      nationalId: '2345678901',
      address: 'Gulshan, Dhaka',
      emergencyContact: '+880 1913-456789',
      bloodGroup: 'A+'
    },
    {
      firstName: 'Mohammad',
      lastName: 'Rahman',
      email: 'mohammad.rahman@company.com',
      departmentName: 'Finance & Accounts',
      designationName: 'Finance Manager',
      basicSalary: 80000,
      role: 'employee' as const,
      phone: '+880 1714-567890',
      nationalId: '3456789012',
      address: 'Banani, Dhaka',
      emergencyContact: '+880 1914-567890',
      bloodGroup: 'B+'
    },
    {
      firstName: 'Ayesha',
      lastName: 'Begum',
      email: 'ayesha.begum@company.com',
      departmentName: 'Marketing & Sales',
      designationName: 'Marketing Manager',
      basicSalary: 70000,
      role: 'employee' as const,
      phone: '+880 1715-678901',
      nationalId: '4567890123',
      address: 'Uttara, Dhaka',
      emergencyContact: '+880 1915-678901',
      bloodGroup: 'AB+'
    },
    {
      firstName: 'Karim',
      lastName: 'Uddin',
      email: 'karim.uddin@company.com',
      departmentName: 'Information Technology',
      designationName: 'Software Engineer',
      basicSalary: 55000,
      role: 'employee' as const,
      phone: '+880 1716-789012',
      nationalId: '5678901234',
      address: 'Mohammadpur, Dhaka',
      emergencyContact: '+880 1916-789012',
      bloodGroup: 'O-'
    },
    {
      firstName: 'Salma',
      lastName: 'Khatun',
      email: 'salma.khatun@company.com',
      departmentName: 'Customer Service',
      designationName: 'Customer Service Manager',
      basicSalary: 60000,
      role: 'employee' as const,
      phone: '+880 1717-890123',
      nationalId: '6789012345',
      address: 'Mirpur, Dhaka',
      emergencyContact: '+880 1917-890123',
      bloodGroup: 'A-'
    },
    {
      firstName: 'Abdul',
      lastName: 'Haque',
      email: 'abdul.haque@company.com',
      departmentName: 'Operations',
      designationName: 'Operations Manager',
      basicSalary: 72000,
      role: 'employee' as const,
      phone: '+880 1718-901234',
      nationalId: '7890123456',
      address: 'Tejgaon, Dhaka',
      emergencyContact: '+880 1918-901234',
      bloodGroup: 'B-'
    },
    {
      firstName: 'Nasreen',
      lastName: 'Sultana',
      email: 'nasreen.sultana@company.com',
      departmentName: 'Human Resources',
      designationName: 'HR Executive',
      basicSalary: 45000,
      role: 'employee' as const,
      phone: '+880 1719-012345',
      nationalId: '8901234567',
      address: 'Wari, Dhaka',
      emergencyContact: '+880 1919-012345',
      bloodGroup: 'AB-'
    },
    {
      firstName: 'Mizanur',
      lastName: 'Rahman',
      email: 'mizanur.rahman@company.com',
      departmentName: 'Information Technology',
      designationName: 'DevOps Engineer',
      basicSalary: 65000,
      role: 'employee' as const,
      phone: '+880 1720-123456',
      nationalId: '9012345678',
      address: 'Badda, Dhaka',
      emergencyContact: '+880 1920-123456',
      bloodGroup: 'O+'
    },
    {
      firstName: 'Ruma',
      lastName: 'Akter',
      email: 'ruma.akter@company.com',
      departmentName: 'Finance & Accounts',
      designationName: 'Accountant',
      basicSalary: 42000,
      role: 'employee' as const,
      phone: '+880 1721-234567',
      nationalId: '0123456789',
      address: 'Ramna, Dhaka',
      emergencyContact: '+880 1921-234567',
      bloodGroup: 'A+'
    },
    {
      firstName: 'Shahin',
      lastName: 'Alam',
      email: 'shahin.alam@company.com',
      departmentName: 'Marketing & Sales',
      designationName: 'Sales Executive',
      basicSalary: 38000,
      role: 'employee' as const,
      phone: '+880 1722-345678',
      nationalId: '1234509876',
      address: 'Khilgaon, Dhaka',
      emergencyContact: '+880 1922-345678',
      bloodGroup: 'B+'
    },
    {
      firstName: 'Taslima',
      lastName: 'Begum',
      email: 'taslima.begum@company.com',
      departmentName: 'Customer Service',
      designationName: 'Customer Support Representative',
      basicSalary: 32000,
      role: 'employee' as const,
      phone: '+880 1723-456789',
      nationalId: '2345609876',
      address: 'Shyamoli, Dhaka',
      emergencyContact: '+880 1923-456789',
      bloodGroup: 'AB+'
    },
    {
      firstName: 'Habibur',
      lastName: 'Rahman',
      email: 'habibur.rahman@company.com',
      departmentName: 'Information Technology',
      designationName: 'Senior Software Engineer',
      basicSalary: 68000,
      role: 'employee' as const,
      phone: '+880 1724-567890',
      nationalId: '3456709876',
      address: 'Lalmatia, Dhaka',
      emergencyContact: '+880 1924-567890',
      bloodGroup: 'O-'
    },
    {
      firstName: 'Shahina',
      lastName: 'Parveen',
      email: 'shahina.parveen@company.com',
      departmentName: 'Marketing & Sales',
      designationName: 'Digital Marketing Specialist',
      basicSalary: 48000,
      role: 'employee' as const,
      phone: '+880 1725-678901',
      nationalId: '4567809876',
      address: 'Jigatola, Dhaka',
      emergencyContact: '+880 1925-678901',
      bloodGroup: 'A-'
    },
    {
      firstName: 'Jakir',
      lastName: 'Hossain',
      email: 'jakir.hossain@company.com',
      departmentName: 'Operations',
      designationName: 'Quality Assurance Specialist',
      basicSalary: 52000,
      role: 'employee' as const,
      phone: '+880 1726-789012',
      nationalId: '5678909876',
      address: 'Malibagh, Dhaka',
      emergencyContact: '+880 1926-789012',
      bloodGroup: 'B-'
    },
    {
      firstName: 'Rashida',
      lastName: 'Khatun',
      email: 'rashida.khatun@company.com',
      departmentName: 'Finance & Accounts',
      designationName: 'Financial Analyst',
      basicSalary: 50000,
      role: 'employee' as const,
      phone: '+880 1727-890123',
      nationalId: '6789009876',
      address: 'Elephant Road, Dhaka',
      emergencyContact: '+880 1927-890123',
      bloodGroup: 'AB-'
    }
  ]
};

// Generate sample attendance data for the last 30 days
const generateAttendanceData = (employees: any[]) => {
  const attendanceData = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    for (const employee of employees) {
      // 85% attendance rate
      if (Math.random() > 0.15) {
        const checkIn = new Date(date);
        checkIn.setHours(9 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60)); // 9-11 AM
        
        const checkOut = new Date(checkIn);
        checkOut.setHours(checkIn.getHours() + 8 + Math.floor(Math.random() * 2)); // 8-10 hours later
        
        attendanceData.push({
          userId: employee.id,
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          checkIn,
          checkOut,
          status: 'present' as const,
        });
      }
    }
  }
  
  return attendanceData;
};

// Generate sample leave requests
const generateLeaveData = (employees: any[]) => {
  const leaveTypes = ['annual', 'sick', 'emergency', 'unpaid'] as const;
  const statuses = ['pending', 'approved', 'rejected'] as const;
  const leaveData = [];
  
  for (const employee of employees) {
    // Each employee has 1-3 leave requests
    const numLeaves = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numLeaves; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90)); // Next 90 days
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1 + Math.floor(Math.random() * 5)); // 1-5 days
      
      leaveData.push({
        userId: employee.id,
        leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
        startDate,
        endDate,
        reason: 'Personal reasons',
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
  }
  
  return leaveData;
};

// Generate sample payroll data for the last 3 months
const generatePayrollData = (employees: any[]) => {
  const payrollData = [];
  const currentDate = new Date();
  
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const month = currentDate.getMonth() - monthOffset;
    const year = currentDate.getFullYear();
    
    for (const employee of employees) {
      const basicSalary = employee.basicSalary;
      const allowances = basicSalary * 0.1; // 10% allowances
      const deductions = basicSalary * 0.05; // 5% deductions
      const bonus = monthOffset === 0 ? basicSalary * 0.15 : 0; // Bonus for current month
      const overtime = Math.random() > 0.5 ? basicSalary * 0.05 : 0; // 50% chance of overtime
      const netSalary = basicSalary + allowances + bonus + overtime - deductions;
      
      payrollData.push({
        userId: employee.id,
        month: month <= 0 ? 12 + month : month,
        year: month <= 0 ? year - 1 : year,
        basicSalary,
        allowances,
        deductions,
        bonus,
        overtime,
        netSalary,
        notes: monthOffset === 0 ? 'Current month salary' : null,
      });
    }
  }
  
  return payrollData;
};

async function seedBangladeshiData() {
  try {
    console.log('🌱 Starting to seed comprehensive HRMS data...');

    // Create departments
    console.log('📁 Creating departments...');
    const createdDepartments = [];
    for (const dept of bangladeshiData.departments) {
      const department = await prisma.department.upsert({
        where: { name: dept.name },
        update: { description: dept.description },
        create: dept
      });
      createdDepartments.push(department);
      console.log(`✅ Created department: ${department.name}`);
    }

    // Create designations
    console.log('💼 Creating designations...');
    const createdDesignations = [];
    for (const desig of bangladeshiData.designations) {
      const department = await prisma.department.findUnique({
        where: { name: desig.departmentName }
      });
      
      if (department) {
        const designation = await prisma.designation.upsert({
          where: { 
            name_departmentId: { 
              name: desig.name, 
              departmentId: department.id 
            } 
          },
          update: {},
          create: {
            name: desig.name,
            departmentId: department.id
          }
        });
        createdDesignations.push(designation);
        console.log(`✅ Created designation: ${designation.name} in ${desig.departmentName}`);
      }
    }

    // Create employees
    console.log('👥 Creating employees...');
    const defaultPassword = await bcrypt.hash('password123', 10);
    const createdEmployees = [];
    
    for (const emp of bangladeshiData.employees) {
      const department = await prisma.department.findUnique({
        where: { name: emp.departmentName }
      });
      
      const designation = await prisma.designation.findFirst({
        where: { 
          name: emp.designationName,
          departmentId: department?.id
        }
      });

      if (department && designation) {
        const employee = await prisma.user.upsert({
          where: { email: emp.email },
          update: {
            firstName: emp.firstName,
            lastName: emp.lastName,
            departmentId: department.id,
            designationId: designation.id,
            basicSalary: emp.basicSalary,
            role: emp.role,
            phone: emp.phone,
            nationalId: emp.nationalId,
            address: emp.address,
            emergencyContact: emp.emergencyContact,
            bloodGroup: emp.bloodGroup,
          },
          create: {
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            passwordHash: defaultPassword,
            departmentId: department.id,
            designationId: designation.id,
            basicSalary: emp.basicSalary,
            role: emp.role,
            dateJoined: new Date(),
            isActive: true,
            phone: emp.phone,
            nationalId: emp.nationalId,
            address: emp.address,
            emergencyContact: emp.emergencyContact,
            bloodGroup: emp.bloodGroup,
          }
        });
        createdEmployees.push(employee);
        console.log(`✅ Created employee: ${employee.firstName} ${employee.lastName} (${emp.designationName})`);
      }
    }

    // Generate and create attendance data
    console.log('📅 Creating attendance records...');
    const attendanceData = generateAttendanceData(createdEmployees);
    for (const attendance of attendanceData) {
      await prisma.attendance.upsert({
        where: {
          userId_date: {
            userId: attendance.userId,
            date: attendance.date
          }
        },
        update: attendance,
        create: attendance
      });
    }
    console.log(`✅ Created ${attendanceData.length} attendance records`);

    // Generate and create leave data
    console.log('🏖️ Creating leave requests...');
    const leaveData = generateLeaveData(createdEmployees);
    let leaveCount = 0;
    for (const leave of leaveData) {
      try {
        await prisma.leave.create({ data: leave });
        leaveCount++;
      } catch (error) {
        // Skip duplicates
        console.log(`⚠️ Skipped duplicate leave request`);
      }
    }
    console.log(`✅ Created ${leaveCount} leave requests`);

    // Generate and create payroll data
    console.log('💰 Creating payroll records...');
    const payrollData = generatePayrollData(createdEmployees);
    for (const payroll of payrollData) {
      await prisma.payroll.upsert({
        where: {
          userId_month_year: {
            userId: payroll.userId,
            month: payroll.month,
            year: payroll.year
          }
        },
        update: payroll,
        create: payroll
      });
    }
    console.log(`✅ Created ${payrollData.length} payroll records`);

    console.log('🎉 Comprehensive HRMS data seeded successfully!');
    console.log('📋 Summary:');
    console.log(`   - ${bangladeshiData.departments.length} departments created`);
    console.log(`   - ${bangladeshiData.designations.length} designations created`);
    console.log(`   - ${bangladeshiData.employees.length} employees created`);
    console.log(`   - ${attendanceData.length} attendance records created`);
    console.log(`   - ${leaveCount} leave requests created`);
    console.log(`   - ${payrollData.length} payroll records created`);
    console.log('🔑 Default password for all employees: password123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedBangladeshiData()
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedBangladeshiData; 