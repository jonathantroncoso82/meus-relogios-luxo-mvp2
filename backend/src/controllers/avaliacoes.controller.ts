import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getAvaliacoes = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId } = req.query;
    
    const where: any = { usuarioId: req.user?.id || req.userId };
    if (relogioId) {
      where.relogioId = parseInt(relogioId as string);
    }

    const avaliacoes = await prisma.avaliacao.findMany({
      where,
      include: {
        relogio: {
          include: {
            marca: true
          }
        },
        criador: true
      },
      orderBy: { data: 'desc' }
    });

    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
};

export const getAvaliacaoById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: parseInt(id) },
      include: {
        relogio: {
          include: {
            marca: true
          }
        },
        criador: true
      }
    });

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (avaliacao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliação' });
  }
};

export const createAvaliacao = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId, valor, data, descricao } = req.body;

    if (!relogioId || !valor || !data) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Verificar se o relógio pertence ao usuário
    const relogio = await prisma.relogio.findUnique({
      where: { id: relogioId }
    });

    if (!relogio || relogio.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Relógio não encontrado ou acesso negado' });
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        relogioId,
        usuarioId: req.user?.id || req.userId || 0,
        criadorId: req.user?.id || req.userId || 0,
        valor: parseFloat(valor),
        data: new Date(data),
        descricao
      },
      include: {
        relogio: {
          include: {
            marca: true
          }
        },
        criador: true
      }
    });

    res.status(201).json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
};

export const updateAvaliacao = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { valor, data, descricao } = req.body;

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (avaliacao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await prisma.avaliacao.update({
      where: { id: parseInt(id) },
      data: {
        ...(valor !== undefined && { valor: parseFloat(valor) }),
        ...(data && { data: new Date(data) }),
        ...(descricao !== undefined && { descricao })
      },
      include: {
        relogio: {
          include: {
            marca: true
          }
        },
        criador: true
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar avaliação' });
  }
};

export const deleteAvaliacao = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (avaliacao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.avaliacao.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar avaliação' });
  }
};
