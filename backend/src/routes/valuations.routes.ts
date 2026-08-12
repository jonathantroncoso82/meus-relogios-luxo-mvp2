import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getValuations,
  getValuationById,
  createValuation,
  updateValuation,
  deleteValuation
} from '../controllers/valuations.controller';

const router = Router();

router.get('/valuations', authMiddleware, getValuations);
router.get('/valuations/:id', authMiddleware, getValuationById);
router.post('/valuations', authMiddleware, createValuation);
router.put('/valuations/:id', authMiddleware, updateValuation);
router.delete('/valuations/:id', authMiddleware, deleteValuation);

export default router;
