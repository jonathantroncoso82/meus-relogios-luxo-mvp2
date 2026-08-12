import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export async function getBrands(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { watches: true } } },
    });
    res.json({ success: true, data: brands });
  } catch (err) {
    next(err);
  }
}

export async function getBrand(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { watches: true } } },
    });
    if (!brand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }
    res.json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
}

export async function createBrand(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, country, foundedYear, website, logoUrl, description } = req.body as {
      name: string;
      country?: string;
      foundedYear?: number;
      website?: string;
      logoUrl?: string;
      description?: string;
    };

    const brand = await prisma.brand.create({
      data: { name, country, foundedYear, website, logoUrl, description },
    });
    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
}

export async function updateBrand(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    const existing = await prisma.brand.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    const { name, country, foundedYear, website, logoUrl, description } = req.body as {
      name?: string;
      country?: string;
      foundedYear?: number;
      website?: string;
      logoUrl?: string;
      description?: string;
    };

    const brand = await prisma.brand.update({
      where: { id: req.params.id },
      data: { name, country, foundedYear, website, logoUrl, description },
    });
    res.json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
}

export async function deleteBrand(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.brand.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }
    await prisma.brand.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    next(err);
  }
}
