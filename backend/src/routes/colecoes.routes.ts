import { Router } from 'express';
import {
  getAllColecoes,
  getColecaoById,
  createColecao,
  updateColecao,
  deleteColecao,
} from '../controllers/colecoes.controller';

const router = Router();

router.get('/', getAllColecoes);
router.get('/:id', getColecaoById);
router.post('/', createColecao);
router.put('/:id', updateColecao);
router.delete('/:id', deleteColecao);

export default router;
