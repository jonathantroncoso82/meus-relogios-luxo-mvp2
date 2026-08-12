import { Router } from 'express';
import {
  getAllAvaliacoes,
  getAvaliacao,
  createAvaliacao,
  updateAvaliacao,
  deleteAvaliacao,
} from '../controllers/avaliacoes.controller';

const router = Router();

router.get('/', getAllAvaliacoes);
router.get('/:id', getAvaliacao);
router.post('/', createAvaliacao);
router.put('/:id', updateAvaliacao);
router.delete('/:id', deleteAvaliacao);

export default router;
