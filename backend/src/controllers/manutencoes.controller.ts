import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllManutencoes = async (req: Request, res: Response) => {
  try {
    const manutencoes = await prisma.maintenance.findMany({
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
    res.json(manutencoes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch manutencoes' });
  }
};

export const getManutencaoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const manutencao = await prisma.maintenance.findUnique({
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
    if (!manutencao) {
      return res.status(404).json({ error: 'Manutencao not found' });
    }
    res.json(manutencao);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch manutencao' });
  }
};

export const createManutencao = async (req: Request, res: Response) => {
  try {
    const {
      watchId,
      userId,
      serviceType,
      description,
      serviceDate,
      completionDate,
      cost,
      serviceProvider,
      status,
      notes,
    } = req.body;

    if (!watchId || !userId || !serviceType || !serviceDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const manutencao = await prisma.maintenance.create({
      data: {
        watchId,
        userId,
        serviceType,
        description,
        serviceDate: new Date(serviceDate),
        completionDate: completionDate ? new Date(completionDate) : null,
        cost: cost ? parseFloat(cost) : null,
        serviceProvider,
        status: status || 'pendente',
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
    res.status(201).json(manutencao);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Watch or User not found' });
    }
    res.status(500).json({ error: 'Failed to create manutencao' });
  }
};

export const updateManutencao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      serviceType,
      description,
      serviceDate,
      completionDate,
      cost,
      serviceProvider,
      status,
      notes,
    } = req.body;

    const manutencao = await prisma.maintenance.update({
      where: { id },
      data: {
        ...(serviceType && { serviceType }),
        ...(description && { description }),
        ...(serviceDate && { serviceDate: new Date(serviceDate) }),
        ...(completionDate && { completionDate: new Date(completionDate) }),
        ...(cost && { cost: parseFloat(cost) }),
        ...(serviceProvider && { serviceProvider }),
        ...(status && { status }),
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
    res.json(manutencao);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Manutencao not found' });
    }
    res.status(500).json({ error: 'Failed to update manutencao' });
  }
};

export const deleteManutencao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.maintenance.update({
      where: { id },
      data: { active: false },
    });
    res.json({ message: 'Manutencao deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Manutencao not found' });
    }
    res.status(500).json({ error: 'Failed to delete manutencao' });
  }
};
