import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export async function getCollections(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId: req.user!.userId },
      include: { _count: { select: { watches: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: collections });
  } catch (err) {
    next(err);
  }
}

export async function getCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: {
        _count: { select: { watches: true } },
        watches: {
          include: {
            brand: { select: { id: true, name: true } },
            images: { where: { isPrimary: true }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }

    res.json({ success: true, data: collection });
  } catch (err) {
    next(err);
  }
}

export async function createCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, description, isPublic } = req.body as {
      name: string;
      description?: string;
      isPublic?: boolean;
    };

    const collection = await prisma.collection.create({
      data: { userId: req.user!.userId, name, description, isPublic: isPublic ?? false },
    });

    res.status(201).json({ success: true, data: collection });
  } catch (err) {
    next(err);
  }
}

export async function updateCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const existing = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }

    const { name, description, isPublic } = req.body as {
      name?: string;
      description?: string;
      isPublic?: boolean;
    };

    const collection = await prisma.collection.update({
      where: { id: req.params.id },
      data: { name, description, isPublic },
    });

    res.json({ success: true, data: collection });
  } catch (err) {
    next(err);
  }
}

export async function deleteCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }

    await prisma.collection.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Collection deleted' });
  } catch (err) {
    next(err);
  }
}
