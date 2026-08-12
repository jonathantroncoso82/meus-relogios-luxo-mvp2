import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export async function getWatches(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { search, brandId, collectionId } = req.query as {
      search?: string;
      brandId?: string;
      collectionId?: string;
    };

    const watches = await prisma.watch.findMany({
      where: {
        userId,
        ...(brandId ? { brandId } : {}),
        ...(collectionId ? { collectionId } : {}),
        ...(search
          ? {
              OR: [
                { model: { contains: search, mode: 'insensitive' } },
                { referenceNumber: { contains: search, mode: 'insensitive' } },
                { serialNumber: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        brand: { select: { id: true, name: true, logoUrl: true } },
        collection: { select: { id: true, name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: watches });
  } catch (err) {
    next(err);
  }
}

export async function getWatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const watch = await prisma.watch.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: {
        brand: true,
        collection: true,
        movement: true,
        images: { orderBy: { sortOrder: 'asc' } },
        serviceRecords: { orderBy: { serviceDate: 'desc' } },
        valuations: { orderBy: { valuationDate: 'desc' } },
      },
    });

    if (!watch) {
      res.status(404).json({ success: false, message: 'Watch not found' });
      return;
    }

    res.json({ success: true, data: watch });
  } catch (err) {
    next(err);
  }
}

export async function createWatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const userId = req.user!.userId;
    const {
      brandId,
      collectionId,
      movementId,
      model,
      referenceNumber,
      serialNumber,
      yearManufactured,
      dialColor,
      caseMaterial,
      caseDiameterMm,
      braceletMaterial,
      waterResistanceM,
      gender,
      condition,
      acquisitionType,
      acquisitionDate,
      acquisitionPrice,
      acquisitionCurrency,
      currentValue,
      notes,
      isForSale,
      askingPrice,
    } = req.body;

    const watch = await prisma.watch.create({
      data: {
        userId,
        brandId,
        collectionId,
        movementId,
        model,
        referenceNumber,
        serialNumber,
        yearManufactured,
        dialColor,
        caseMaterial,
        caseDiameterMm,
        braceletMaterial,
        waterResistanceM,
        gender,
        condition,
        acquisitionType,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : undefined,
        acquisitionPrice,
        acquisitionCurrency,
        currentValue,
        notes,
        isForSale: isForSale ?? false,
        askingPrice,
      },
      include: {
        brand: { select: { id: true, name: true } },
        collection: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ success: true, data: watch });
  } catch (err) {
    next(err);
  }
}

export async function updateWatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const existing = await prisma.watch.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Watch not found' });
      return;
    }

    const {
      brandId,
      collectionId,
      movementId,
      model,
      referenceNumber,
      serialNumber,
      yearManufactured,
      dialColor,
      caseMaterial,
      caseDiameterMm,
      braceletMaterial,
      waterResistanceM,
      gender,
      condition,
      acquisitionType,
      acquisitionDate,
      acquisitionPrice,
      acquisitionCurrency,
      currentValue,
      notes,
      isForSale,
      askingPrice,
    } = req.body;

    const watch = await prisma.watch.update({
      where: { id: req.params.id },
      data: {
        brandId,
        collectionId,
        movementId,
        model,
        referenceNumber,
        serialNumber,
        yearManufactured,
        dialColor,
        caseMaterial,
        caseDiameterMm,
        braceletMaterial,
        waterResistanceM,
        gender,
        condition,
        acquisitionType,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : undefined,
        acquisitionPrice,
        acquisitionCurrency,
        currentValue,
        notes,
        isForSale,
        askingPrice,
      },
      include: {
        brand: { select: { id: true, name: true } },
        collection: { select: { id: true, name: true } },
      },
    });

    res.json({ success: true, data: watch });
  } catch (err) {
    next(err);
  }
}

export async function deleteWatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.watch.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Watch not found' });
      return;
    }

    await prisma.watch.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Watch deleted' });
  } catch (err) {
    next(err);
  }
}
