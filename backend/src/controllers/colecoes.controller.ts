import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getColecoes = async (req: AuthRequest, res: Response) => {
  try {
    const colecoes = await prisma.colecao.findMany({
      where: { usuarioId: req.user?.id || req.userId },
      include: {
        relogios: {
          include: {
            marca: true
          }
        }
      }
    });

    res.json(colecoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar coleções' });
  }
};

export const getColecaoById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const colecao = await prisma.colecao.findUnique({
      where: { id: parseInt(id) },
      include: {
        relogios: {
          include: {
            marca: true
          }
        }
      }
    });

    if (!colecao) {
      return res.status(404).json({ error: 'Coleção não encontrada' });
    }

    if (colecao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(colecao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar coleção' });
  }
};

export const getColecaoRelogios = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const colecao = await prisma.colecao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!colecao) {
      return res.status(404).json({ error: 'Coleção não encontrada' });
    }

    if (colecao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const relogios = await prisma.relogio.findMany({
      where: { colecaoId: parseInt(id) },
      include: {
        marca: true
      }
    });

    res.json(relogios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relógios da coleção' });
  }
};

export const createColecao = async (req: AuthRequest, res: Response) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const colecao = await prisma.colecao.create({
      data: {
        usuarioId: req.user?.id || req.userId || 0,
        nome,
        descricao
      }
    });

    res.status(201).json(colecao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar coleção' });
  }
};

export const updateColecao = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const colecao = await prisma.colecao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!colecao) {
      return res.status(404).json({ error: 'Coleção não encontrada' });
    }

    if (colecao.usuarioId !== (req.user?.id || req.userId)) {
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

export const deleteColecao = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const colecao = await prisma.colecao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!colecao) {
      return res.status(404).json({ error: 'Coleção não encontrada' });
    }

    if (colecao.usuarioId !== (req.user?.id || req.userId)) {
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
