import { Router } from 'express';
import { login, refreshToken, logout } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth(), logout);

export default router; 