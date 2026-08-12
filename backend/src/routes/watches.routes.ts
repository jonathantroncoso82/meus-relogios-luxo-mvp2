import { Router } from 'express';
import { body } from 'express-validator';
import {
  getWatches,
  getWatch,
  createWatch,
  updateWatch,
  deleteWatch,
} from '../controllers/watches.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getWatches);
router.get('/:id', getWatch);

router.post(
  '/',
  [
    body('brandId').notEmpty().withMessage('Brand is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
  ],
  createWatch
);

router.put(
  '/:id',
  [
    body('brandId').optional().notEmpty().withMessage('Brand cannot be empty'),
    body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
  ],
  updateWatch
);

router.delete('/:id', deleteWatch);

export default router;
