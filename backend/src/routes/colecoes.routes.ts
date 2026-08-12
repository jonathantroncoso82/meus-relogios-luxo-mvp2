import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getColecoes,
  getColecaoById,
  getColecaoRelogios,
  createColecao,
  updateColecao,
  deleteColecao
} from '../controllers/colecoes.controller';

const router = Router();

router.get('/colecoes', authMiddleware, getColecoes);
router.get('/colecoes/:id', authMiddleware, getColecaoById);
router.get('/colecoes/:id/relogios', authMiddleware, getColecaoRelogios);
router.post('/colecoes', authMiddleware, createColecao);
router.put('/colecoes/:id', authMiddleware, updateColecao);
router.delete('/colecoes/:id', authMiddleware, deleteColecao);

export default router;
