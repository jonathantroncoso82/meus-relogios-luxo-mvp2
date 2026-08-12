import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRelogios = async (req: Request, res: Response) => {
  try {
    const relogios = await prisma.watch.findMany({
      where: { active: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(relogios);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch relogios' });
  }
};

export const getRelogioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const relogio = await prisma.watch.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        maintenances: true,
        insurances: true,
        valuations: true,
      },
    });
    if (!relogio) {
      return res.status(404).json({ error: 'Relogio not found' });
    }
    res.json(relogio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch relogio' });
  }
};

export const createRelogio = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      brand,
      model,
      reference,
      yearProduction,
      type,
      material,
      caseSize,
      movement,
      condition,
      estimatedPrice,
      description,
      imageUrl,
      acquisitionDate,
    } = req.body;

    if (!userId || !brand || !model) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const relogio = await prisma.watch.create({
      data: {
        userId,
        brand,
        model,
        reference,
        yearProduction,
        type,
        material,
        caseSize,
        movement,
        condition,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
        description,
        imageUrl,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(201).json(relogio);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to create relogio' });
  }
};

export const updateRelogio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      brand,
      model,
      reference,
      yearProduction,
      type,
      material,
      caseSize,
      movement,
      condition,
      estimatedPrice,
      description,
      imageUrl,
      acquisitionDate,
    } = req.body;

    const relogio = await prisma.watch.update({
      where: { id },
      data: {
        ...(brand && { brand }),
        ...(model && { model }),
        ...(reference && { reference }),
        ...(yearProduction && { yearProduction }),
        ...(type && { type }),
        ...(material && { material }),
        ...(caseSize && { caseSize }),
        ...(movement && { movement }),
        ...(condition && { condition }),
        ...(estimatedPrice && { estimatedPrice: parseFloat(estimatedPrice) }),
        ...(description && { description }),
        ...(imageUrl && { imageUrl }),
        ...(acquisitionDate && { acquisitionDate: new Date(acquisitionDate) }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(relogio);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Relogio not found' });
    }
    res.status(500).json({ error: 'Failed to update relogio' });
  }
};

export const deleteRelogio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.watch.update({
      where: { id },
      data: { active: false },
    });
    res.json({ message: 'Relogio deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Relogio not found' });
    }
    res.status(500).json({ error: 'Failed to delete relogio' });
  }
};
