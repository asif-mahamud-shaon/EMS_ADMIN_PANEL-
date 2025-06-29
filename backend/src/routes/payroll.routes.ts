import { Router } from 'express';
import { 
  getPayrolls, 
  generatePayroll, 
  updatePayroll,
  getPayrollStats 
} from '../controllers/payroll.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All payroll routes require authentication
router.use(auth());

router.get('/', getPayrolls);
router.get('/stats', getPayrollStats);
router.post('/generate', generatePayroll);
router.put('/:id', updatePayroll);

export default router; 