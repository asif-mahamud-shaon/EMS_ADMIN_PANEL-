import { Router } from 'express';
import { 
  getEmployees, 
  getEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  getProfile,
  updateProfile
} from '../controllers/employees.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All employee routes require authentication
router.use(auth());

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Employee management routes
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router; 