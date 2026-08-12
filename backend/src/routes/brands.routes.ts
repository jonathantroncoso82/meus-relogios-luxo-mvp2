import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brands.controller';

const router = Router();

router.get('/brands', getBrands);
router.get('/brands/:id', getBrandById);
router.post('/brands', authMiddleware, createBrand);
router.put('/brands/:id', authMiddleware, updateBrand);
router.delete('/brands/:id', authMiddleware, deleteBrand);

export default router;
