import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collections.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getCollections);
router.get('/:id', getCollection);

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Collection name is required')],
  createCollection
);

router.put(
  '/:id',
  [body('name').optional().trim().notEmpty().withMessage('Collection name cannot be empty')],
  updateCollection
);

router.delete('/:id', deleteCollection);

export default router;
