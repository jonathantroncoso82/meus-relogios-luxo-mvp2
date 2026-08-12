import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
} from '../controllers/watches.controller';

const router = Router();

router.get('/watches', authMiddleware, getWatches);
router.get('/watches/:id', authMiddleware, getWatchById);
router.post('/watches', authMiddleware, createWatch);
router.put('/watches/:id', authMiddleware, updateWatch);
router.delete('/watches/:id', authMiddleware, deleteWatch);

export default router;
