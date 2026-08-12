import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getManutencoes,
  getManutencaoById,
  createManutencao,
  updateManutencao,
  deleteManutencao
} from '../controllers/manutencoes.controller';

const router = Router();

router.get('/manutencoes', authMiddleware, getManutencoes);
router.get('/manutencoes/:id', authMiddleware, getManutencaoById);
router.post('/manutencoes', authMiddleware, createManutencao);
router.put('/manutencoes/:id', authMiddleware, updateManutencao);
router.delete('/manutencoes/:id', authMiddleware, deleteManutencao);

export default router;
