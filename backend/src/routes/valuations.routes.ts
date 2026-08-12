import { Router } from 'express';
import { body } from 'express-validator';
import {
  getValuations,
  getValuation,
  createValuation,
} from '../controllers/valuations.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getValuations);
router.get('/:id', getValuation);

router.post(
  '/',
  [
    body('watchId').notEmpty().withMessage('Watch ID is required'),
    body('valuationDate').isISO8601().withMessage('Valid valuation date is required'),
    body('marketValue').isNumeric().withMessage('Market value must be a number'),
  ],
  createValuation
);

export default router;
