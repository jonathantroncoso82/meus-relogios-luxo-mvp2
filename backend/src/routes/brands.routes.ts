import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brands.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getBrands);
router.get('/:id', getBrand);

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Brand name is required')],
  createBrand
);

router.put(
  '/:id',
  [body('name').optional().trim().notEmpty().withMessage('Brand name cannot be empty')],
  updateBrand
);

router.delete('/:id', deleteBrand);

export default router;
