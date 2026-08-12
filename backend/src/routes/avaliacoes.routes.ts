import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getAvaliacoes,
  getAvaliacaoById,
  createAvaliacao,
  updateAvaliacao,
  deleteAvaliacao
} from '../controllers/avaliacoes.controller';

const router = Router();

router.get('/avaliacoes', authMiddleware, getAvaliacoes);
router.get('/avaliacoes/:id', authMiddleware, getAvaliacaoById);
router.post('/avaliacoes', authMiddleware, createAvaliacao);
router.put('/avaliacoes/:id', authMiddleware, updateAvaliacao);
router.delete('/avaliacoes/:id', authMiddleware, deleteAvaliacao);

export default router;
