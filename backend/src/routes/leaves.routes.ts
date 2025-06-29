import { Router } from 'express';
import { 
  getLeaves, 
  createLeaveRequest, 
  updateLeaveStatus,
  getLeaveStats 
} from '../controllers/leaves.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All leave routes require authentication
router.use(auth());

router.get('/', getLeaves);
router.get('/stats', getLeaveStats);
router.post('/', createLeaveRequest);
router.put('/:id/status', updateLeaveStatus);

export default router; 