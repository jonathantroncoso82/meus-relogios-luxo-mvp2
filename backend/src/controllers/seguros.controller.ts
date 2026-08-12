import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSeguros = async (req: Request, res: Response) => {
  try {
    const seguros = await prisma.insurance.findMany({
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
    res.json(seguros);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seguros' });
  }
};

export const getSeguroById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seguro = await prisma.insurance.findUnique({
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
    if (!seguro) {
      return res.status(404).json({ error: 'Seguro not found' });
    }
    res.json(seguro);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seguro' });
  }
};

export const createSeguro = async (req: Request, res: Response) => {
  try {
    const {
      watchId,
      userId,
      policyNumber,
      insurer,
      coverageValue,
      annualPremium,
      startDate,
      expirationDate,
      status,
      coverageType,
      deductible,
      notes,
    } = req.body;

    if (!watchId || !userId || !policyNumber || !insurer || !coverageValue || !startDate || !expirationDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const seguro = await prisma.insurance.create({
      data: {
        watchId,
        userId,
        policyNumber,
        insurer,
        coverageValue: parseFloat(coverageValue),
        annualPremium: annualPremium ? parseFloat(annualPremium) : null,
        startDate: new Date(startDate),
        expirationDate: new Date(expirationDate),
        status: status || 'ativo',
        coverageType,
        deductible: deductible ? parseFloat(deductible) : null,
        notes,
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
    res.status(201).json(seguro);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Policy number already exists' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Watch or User not found' });
    }
    res.status(500).json({ error: 'Failed to create seguro' });
  }
};

export const updateSeguro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      insurer,
      coverageValue,
      annualPremium,
      startDate,
      expirationDate,
      status,
      coverageType,
      deductible,
      notes,
    } = req.body;

    const seguro = await prisma.insurance.update({
      where: { id },
      data: {
        ...(insurer && { insurer }),
        ...(coverageValue && { coverageValue: parseFloat(coverageValue) }),
        ...(annualPremium && { annualPremium: parseFloat(annualPremium) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(expirationDate && { expirationDate: new Date(expirationDate) }),
        ...(status && { status }),
        ...(coverageType && { coverageType }),
        ...(deductible && { deductible: parseFloat(deductible) }),
        ...(notes && { notes }),
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
    res.json(seguro);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Seguro not found' });
    }
    res.status(500).json({ error: 'Failed to update seguro' });
  }
};

export const deleteSeguro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.insurance.update({
      where: { id },
      data: { active: false },
    });
    res.json({ message: 'Seguro deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Seguro not found' });
    }
    res.status(500).json({ error: 'Failed to delete seguro' });
  }
};
