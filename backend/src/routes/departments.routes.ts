import { Router } from 'express';
import { 
  getDepartments, 
  getDepartment, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../controllers/departments.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All department routes require authentication
router.use(auth());

router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router; 