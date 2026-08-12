import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllColecoes = async (req: Request, res: Response) => {
  try {
    const colecoes = await prisma.collection.findMany({
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
    res.json(colecoes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colecoes' });
  }
};

export const getColecaoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const colecao = await prisma.collection.findUnique({
      where: { id },
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
    if (!colecao) {
      return res.status(404).json({ error: 'Colecao not found' });
    }
    res.json(colecao);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colecao' });
  }
};

export const createColecao = async (req: Request, res: Response) => {
  try {
    const { userId, name, description, theme, watchCount, totalValue } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const colecao = await prisma.collection.create({
      data: {
        userId,
        name,
        description,
        theme,
        watchCount: watchCount || 0,
        totalValue: totalValue ? parseFloat(totalValue) : null,
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
    res.status(201).json(colecao);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to create colecao' });
  }
};

export const updateColecao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, theme, watchCount, totalValue } = req.body;

    const colecao = await prisma.collection.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(theme && { theme }),
        ...(watchCount !== undefined && { watchCount }),
        ...(totalValue && { totalValue: parseFloat(totalValue) }),
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
    res.json(colecao);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Colecao not found' });
    }
    res.status(500).json({ error: 'Failed to update colecao' });
  }
};

export const deleteColecao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.collection.update({
      where: { id },
      data: { active: false },
    });
    res.json({ message: 'Colecao deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Colecao not found' });
    }
    res.status(500).json({ error: 'Failed to delete colecao' });
  }
};
