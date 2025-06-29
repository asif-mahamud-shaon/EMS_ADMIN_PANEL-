import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import departmentsRoutes from './routes/departments.routes';
import employeesRoutes from './routes/employees.routes';
import designationsRoutes from './routes/designations.routes';
import attendanceRoutes from './routes/attendance.routes';
import leavesRoutes from './routes/leaves.routes';
import payrollRoutes from './routes/payroll.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS with credentials
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/designations', designationsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 