import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAvaliacoes = async (req: Request, res: Response) => {
  try {
    const avaliacoes = await prisma.valuation.findMany({
      where: { active: true },
      include: {
        watch: {
          select: {
            id: true,
            brand: true,
            model: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch avaliacoes' });
  }
};

export const getAvaliacao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const avaliacao = await prisma.valuation.findUnique({
      where: { id },
      include: {
        watch: {
          select: {
            id: true,
            brand: true,
            model: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliacao not found' });
    }
    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch avaliacao' });
  }
};

export const createAvaliacao = async (req: Request, res: Response) => {
  try {
    const {
      watchId,
      userId,
      appraiser,
      valuationDate,
      valuedAmount,
      generalCondition,
      functionality,
      authenticity,
      rarity,
      marketDemand,
      report,
      certificateNumber,
    } = req.body;

    if (!watchId || !userId || !appraiser || !valuationDate || !valuedAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const avaliacao = await prisma.valuation.create({
      data: {
        watchId,
        userId,
        appraiser,
        valuationDate: new Date(valuationDate),
        valuedAmount: parseFloat(valuedAmount),
        generalCondition,
        functionality,
        authenticity,
        rarity,
        marketDemand,
        report,
        certificateNumber,
      },
      include: {
        watch: {
          select: {
            id: true,
            brand: true,
            model: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(201).json(avaliacao);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Watch or User not found' });
    }
    res.status(500).json({ error: 'Failed to create avaliacao' });
  }
};

export const updateAvaliacao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      appraiser,
      valuationDate,
      valuedAmount,
      generalCondition,
      functionality,
      authenticity,
      rarity,
      marketDemand,
      report,
      certificateNumber,
    } = req.body;

    const avaliacao = await prisma.valuation.update({
      where: { id },
      data: {
        ...(appraiser && { appraiser }),
        ...(valuationDate && { valuationDate: new Date(valuationDate) }),
        ...(valuedAmount && { valuedAmount: parseFloat(valuedAmount) }),
        ...(generalCondition && { generalCondition }),
        ...(functionality && { functionality }),
        ...(authenticity && { authenticity }),
        ...(rarity && { rarity }),
        ...(marketDemand && { marketDemand }),
        ...(report && { report }),
        ...(certificateNumber && { certificateNumber }),
      },
      include: {
        watch: {
          select: {
            id: true,
            brand: true,
            model: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(avaliacao);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Avaliacao not found' });
    }
    res.status(500).json({ error: 'Failed to update avaliacao' });
  }
};

export const deleteAvaliacao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.valuation.update({
      where: { id },
      data: { active: false },
    });
    res.json({ message: 'Avaliacao deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Avaliacao not found' });
    }
    res.status(500).json({ error: 'Failed to delete avaliacao' });
  }
};
