import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getSeguros = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId } = req.query;
    
    const where: any = { usuarioId: req.user?.id || req.userId };
    if (relogioId) {
      where.relogioId = parseInt(relogioId as string);
    }

    const seguros = await prisma.seguro.findMany({
      where,
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      },
      orderBy: { dataInicio: 'desc' }
    });

    res.json(seguros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seguros' });
  }
};

export const getSeguroById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const seguro = await prisma.seguro.findUnique({
      where: { id: parseInt(id) },
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      }
    });

    if (!seguro) {
      return res.status(404).json({ error: 'Seguro não encontrado' });
    }

    if (seguro.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(seguro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seguro' });
  }
};

export const createSeguro = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId, numero, valor, dataInicio, dataFim } = req.body;

    if (!relogioId || !numero || !valor || !dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Verificar se o relógio pertence ao usuário
    const relogio = await prisma.relogio.findUnique({
      where: { id: relogioId }
    });

    if (!relogio || relogio.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Relógio não encontrado ou acesso negado' });
    }

    const seguro = await prisma.seguro.create({
      data: {
        relogioId,
        usuarioId: req.user?.id || req.userId || 0,
        numero,
        valor: parseFloat(valor),
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim)
      },
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      }
    });

    res.status(201).json(seguro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar seguro' });
  }
};

export const updateSeguro = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { numero, valor, dataInicio, dataFim } = req.body;

    const seguro = await prisma.seguro.findUnique({
      where: { id: parseInt(id) }
    });

    if (!seguro) {
      return res.status(404).json({ error: 'Seguro não encontrado' });
    }

    if (seguro.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await prisma.seguro.update({
      where: { id: parseInt(id) },
      data: {
        ...(numero && { numero }),
        ...(valor !== undefined && { valor: parseFloat(valor) }),
        ...(dataInicio && { dataInicio: new Date(dataInicio) }),
        ...(dataFim && { dataFim: new Date(dataFim) })
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
    res.status(500).json({ error: 'Erro ao atualizar seguro' });
  }
};

export const deleteSeguro = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const seguro = await prisma.seguro.findUnique({
      where: { id: parseInt(id) }
    });

    if (!seguro) {
      return res.status(404).json({ error: 'Seguro não encontrado' });
    }

    if (seguro.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.seguro.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Seguro deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar seguro' });
  }
};
