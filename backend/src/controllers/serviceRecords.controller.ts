import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export async function getServiceRecords(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { watchId } = req.query as { watchId?: string };

    const records = await prisma.serviceRecord.findMany({
      where: {
        ...(watchId ? { watchId } : {}),
        watch: { userId: req.user!.userId },
      },
      include: {
        watch: { select: { id: true, model: true, brand: { select: { name: true } } } },
      },
      orderBy: { serviceDate: 'desc' },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
}

export async function getServiceRecord(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await prisma.serviceRecord.findFirst({
      where: { id: req.params.id, watch: { userId: req.user!.userId } },
      include: {
        watch: { select: { id: true, model: true, brand: { select: { name: true } } } },
      },
    });

    if (!record) {
      res.status(404).json({ success: false, message: 'Service record not found' });
      return;
    }

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

export async function createServiceRecord(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const {
      watchId,
      serviceDate,
      serviceType,
      serviceCenter,
      technician,
      cost,
      currency,
      description,
      nextServiceDate,
      warrantyUntil,
    } = req.body;

    // Verify watch belongs to user
    const watch = await prisma.watch.findFirst({
      where: { id: watchId, userId: req.user!.userId },
    });

    if (!watch) {
      res.status(404).json({ success: false, message: 'Watch not found' });
      return;
    }

    const record = await prisma.serviceRecord.create({
      data: {
        watchId,
        serviceDate: new Date(serviceDate),
        serviceType,
        serviceCenter,
        technician,
        cost,
        currency,
        description,
        nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
        warrantyUntil: warrantyUntil ? new Date(warrantyUntil) : undefined,
      },
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

export async function updateServiceRecord(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const existing = await prisma.serviceRecord.findFirst({
      where: { id: req.params.id, watch: { userId: req.user!.userId } },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Service record not found' });
      return;
    }

    const {
      serviceDate,
      serviceType,
      serviceCenter,
      technician,
      cost,
      currency,
      description,
      nextServiceDate,
      warrantyUntil,
    } = req.body;

    const record = await prisma.serviceRecord.update({
      where: { id: req.params.id },
      data: {
        serviceDate: serviceDate ? new Date(serviceDate) : undefined,
        serviceType,
        serviceCenter,
        technician,
        cost,
        currency,
        description,
        nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
        warrantyUntil: warrantyUntil ? new Date(warrantyUntil) : undefined,
      },
    });

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

export async function deleteServiceRecord(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.serviceRecord.findFirst({
      where: { id: req.params.id, watch: { userId: req.user!.userId } },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Service record not found' });
      return;
    }

    await prisma.serviceRecord.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Service record deleted' });
  } catch (err) {
    next(err);
  }
}
