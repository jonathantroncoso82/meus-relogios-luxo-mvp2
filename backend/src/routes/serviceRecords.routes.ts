import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} from '../controllers/serviceRecords.controller';

const router = Router();

router.get('/service-records', authMiddleware, getServiceRecords);
router.get('/service-records/:id', authMiddleware, getServiceRecordById);
router.post('/service-records', authMiddleware, createServiceRecord);
router.put('/service-records/:id', authMiddleware, updateServiceRecord);
router.delete('/service-records/:id', authMiddleware, deleteServiceRecord);

export default router;
