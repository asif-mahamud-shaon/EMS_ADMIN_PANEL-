import { Router } from 'express';
import { 
  getAttendance, 
  createAttendance, 
  updateAttendance,
  getAttendanceStats 
} from '../controllers/attendance.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All attendance routes require authentication
router.use(auth());

router.get('/', getAttendance);
router.get('/stats', getAttendanceStats);
router.post('/', createAttendance);
router.put('/:id', updateAttendance);

export default router; 