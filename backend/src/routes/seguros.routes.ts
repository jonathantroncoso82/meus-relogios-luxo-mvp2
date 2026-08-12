import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getSeguros,
  getSeguroById,
  createSeguro,
  updateSeguro,
  deleteSeguro
} from '../controllers/seguros.controller';

const router = Router();

router.get('/seguros', authMiddleware, getSeguros);
router.get('/seguros/:id', authMiddleware, getSeguroById);
router.post('/seguros', authMiddleware, createSeguro);
router.put('/seguros/:id', authMiddleware, updateSeguro);
router.delete('/seguros/:id', authMiddleware, deleteSeguro);

export default router;
