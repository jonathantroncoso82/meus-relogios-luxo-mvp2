import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collections.controller';

const router = Router();

router.get('/collections', authMiddleware, getCollections);
router.get('/collections/:id', authMiddleware, getCollectionById);
router.post('/collections', authMiddleware, createCollection);
router.put('/collections/:id', authMiddleware, updateCollection);
router.delete('/collections/:id', authMiddleware, deleteCollection);

export default router;
