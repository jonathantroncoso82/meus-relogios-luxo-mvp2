import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export async function getValuations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { watchId } = req.query as { watchId?: string };

    const valuations = await prisma.valuation.findMany({
      where: {
        ...(watchId ? { watchId } : {}),
        watch: { userId: req.user!.userId },
      },
      include: {
        watch: { select: { id: true, model: true, brand: { select: { name: true } } } },
      },
      orderBy: { valuationDate: 'desc' },
    });

    res.json({ success: true, data: valuations });
  } catch (err) {
    next(err);
  }
}

export async function getValuation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const valuation = await prisma.valuation.findFirst({
      where: { id: req.params.id, watch: { userId: req.user!.userId } },
      include: {
        watch: { select: { id: true, model: true, brand: { select: { name: true } } } },
      },
    });

    if (!valuation) {
      res.status(404).json({ success: false, message: 'Valuation not found' });
      return;
    }

    res.json({ success: true, data: valuation });
  } catch (err) {
    next(err);
  }
}

export async function createValuation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const { watchId, valuationDate, appraiser, marketValue, currency, source, notes } = req.body;

    // Verify watch belongs to user
    const watch = await prisma.watch.findFirst({
      where: { id: watchId, userId: req.user!.userId },
    });

    if (!watch) {
      res.status(404).json({ success: false, message: 'Watch not found' });
      return;
    }

    const valuation = await prisma.valuation.create({
      data: {
        watchId,
        valuationDate: new Date(valuationDate),
        appraiser,
        marketValue,
        currency,
        source,
        notes,
      },
    });

    // Update watch current value
    await prisma.watch.update({
      where: { id: watchId },
      data: { currentValue: marketValue },
    });

    res.status(201).json({ success: true, data: valuation });
  } catch (err) {
    next(err);
  }
}
