import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getCollections = async (req: AuthRequest, res: Response) => {
  try {
    const collections = await prisma.colecao.findMany({
      where: { usuarioId: req.user?.id || req.userId },
      include: {
        relogios: {
          include: {
            marca: true
          }
        }
      }
    });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar coleções' });
  }
};

export const getCollectionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const collection = await prisma.colecao.findUnique({
      where: { id: parseInt(id) },
      include: {
        relogios: {
          include: {
            marca: true
          }
        }
      }
    });

    if (!collection) {
      return res.status(404).json({ error: 'Coleção não encontrada' });
    }

    if (collection.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar coleção' });
  }
};

export const createCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const collection = await prisma.colecao.create({
      data: {
        usuarioId: req.user?.id || req.userId || 0,
        nome,
        descricao
      }
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar coleção' });
  }
};

export const updateCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const collection = await prisma.colecao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!collection) {
      return res.status(404).json({ error: 'Coleção não encontrada' });
    }

    if (collection.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await prisma.colecao.update({
      where: { id: parseInt(id) },
      data: {
        ...(nome && { nome }),
        ...(descricao !== undefined && { descricao })
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar coleção' });
  }
};

export const deleteCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const collection = await prisma.colecao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!collection) {
      return res.status(404).json({ error: 'Coleção não encontrada' });
    }

    if (collection.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.colecao.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Coleção deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar coleção' });
  }
};
