import { Router } from 'express';
import {
  getAllRelogios,
  getRelogioById,
  createRelogio,
  updateRelogio,
  deleteRelogio,
} from '../controllers/relogios.controller';

const router = Router();

router.get('/', getAllRelogios);
router.get('/:id', getRelogioById);
router.post('/', createRelogio);
router.put('/:id', updateRelogio);
router.delete('/:id', deleteRelogio);

export default router;
