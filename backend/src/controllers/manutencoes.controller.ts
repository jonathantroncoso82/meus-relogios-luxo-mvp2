import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getManutencoes = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId } = req.query;
    
    const where: any = { usuarioId: req.user?.id || req.userId };
    if (relogioId) {
      where.relogioId = parseInt(relogioId as string);
    }

    const manutencoes = await prisma.manutencao.findMany({
      where,
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      },
      orderBy: { data: 'desc' }
    });

    res.json(manutencoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar manutenções' });
  }
};

export const getManutencaoById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const manutencao = await prisma.manutencao.findUnique({
      where: { id: parseInt(id) },
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      }
    });

    if (!manutencao) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }

    if (manutencao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(manutencao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar manutenção' });
  }
};

export const createManutencao = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId, tipo, data, descricao, custo } = req.body;

    if (!relogioId || !tipo || !data) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Verificar se o relógio pertence ao usuário
    const relogio = await prisma.relogio.findUnique({
      where: { id: relogioId }
    });

    if (!relogio || relogio.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Relógio não encontrado ou acesso negado' });
    }

    const manutencao = await prisma.manutencao.create({
      data: {
        relogioId,
        usuarioId: req.user?.id || req.userId || 0,
        tipo,
        data: new Date(data),
        descricao,
        custo: custo ? parseFloat(custo) : 0
      },
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      }
    });

    res.status(201).json(manutencao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar manutenção' });
  }
};

export const updateManutencao = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { tipo, data, descricao, custo } = req.body;

    const manutencao = await prisma.manutencao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!manutencao) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }

    if (manutencao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await prisma.manutencao.update({
      where: { id: parseInt(id) },
      data: {
        ...(tipo && { tipo }),
        ...(data && { data: new Date(data) }),
        ...(descricao !== undefined && { descricao }),
        ...(custo !== undefined && { custo: parseFloat(custo) })
      },
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar manutenção' });
  }
};

export const deleteManutencao = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const manutencao = await prisma.manutencao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!manutencao) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }

    if (manutencao.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.manutencao.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Manutenção deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar manutenção' });
  }
};
