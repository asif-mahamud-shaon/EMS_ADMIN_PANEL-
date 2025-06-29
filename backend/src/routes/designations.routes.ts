import { Router } from 'express';
import { 
  getDesignations, 
  getDesignation, 
  createDesignation, 
  updateDesignation, 
  deleteDesignation 
} from '../controllers/designations.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All designation routes require authentication
router.use(auth());

router.get('/', getDesignations);
router.get('/:id', getDesignation);
router.post('/', createDesignation);
router.put('/:id', updateDesignation);
router.delete('/:id', deleteDesignation);

export default router; 