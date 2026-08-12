import { Router } from 'express';
import {
  getAllSeguros,
  getSeguroById,
  createSeguro,
  updateSeguro,
  deleteSeguro,
} from '../controllers/seguros.controller';

const router = Router();

router.get('/', getAllSeguros);
router.get('/:id', getSeguroById);
router.post('/', createSeguro);
router.put('/:id', updateSeguro);
router.delete('/:id', deleteSeguro);

export default router;
