import { Router } from 'express';
import {
  getAllManutencoes,
  getManutencaoById,
  createManutencao,
  updateManutencao,
  deleteManutencao,
} from '../controllers/manutencoes.controller';

const router = Router();

router.get('/', getAllManutencoes);
router.get('/:id', getManutencaoById);
router.post('/', createManutencao);
router.put('/:id', updateManutencao);
router.delete('/:id', deleteManutencao);

export default router;
