import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.use(auth());

router.get('/stats', getDashboardStats);

export default router; 