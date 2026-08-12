import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getRelogios,
  getRelogioById,
  createRelogio,
  updateRelogio,
  deleteRelogio
} from '../controllers/relogios.controller';

const router = Router();

router.get('/relogios', authMiddleware, getRelogios);
router.get('/relogios/:id', authMiddleware, getRelogioById);
router.post('/relogios', authMiddleware, createRelogio);
router.put('/relogios/:id', authMiddleware, updateRelogio);
router.delete('/relogios/:id', authMiddleware, deleteRelogio);

export default router;
