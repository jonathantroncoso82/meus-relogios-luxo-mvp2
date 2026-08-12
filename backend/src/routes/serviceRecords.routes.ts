import { Router } from 'express';
import { body } from 'express-validator';
import {
  getServiceRecords,
  getServiceRecord,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
} from '../controllers/serviceRecords.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getServiceRecords);
router.get('/:id', getServiceRecord);

router.post(
  '/',
  [
    body('watchId').notEmpty().withMessage('Watch ID is required'),
    body('serviceDate').isISO8601().withMessage('Valid service date is required'),
    body('serviceType').trim().notEmpty().withMessage('Service type is required'),
  ],
  createServiceRecord
);

router.put(
  '/:id',
  [
    body('serviceDate').optional().isISO8601().withMessage('Valid service date is required'),
    body('serviceType').optional().trim().notEmpty().withMessage('Service type cannot be empty'),
  ],
  updateServiceRecord
);

router.delete('/:id', deleteServiceRecord);

export default router;
