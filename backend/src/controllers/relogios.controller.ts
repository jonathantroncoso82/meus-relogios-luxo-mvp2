import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getRelogios = async (req: AuthRequest, res: Response) => {
  try {
    const relogios = await prisma.relogio.findMany({
      where: { usuarioId: req.user?.id || req.userId },
      include: {
        marca: true,
        colecao: true
      }
    });

    res.json(relogios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relógios' });
  }
};

export const getRelogioById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const relogio = await prisma.relogio.findUnique({
      where: { id: parseInt(id) },
      include: {
        marca: true,
        colecao: true,
        manutencoes: true,
        seguros: true,
        avaliacoes: true,
        registrosServico: true
      }
    });

    if (!relogio) {
      return res.status(404).json({ error: 'Relógio não encontrado' });
    }

    if (relogio.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(relogio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relógio' });
  }
};

export const createRelogio = async (req: AuthRequest, res: Response) => {
  try {
    const { marcaId, colecaoId, modelo, referencia, anoFabricacao, descricao, preco, condicao } = req.body;

    if (!marcaId || !modelo || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const relogio = await prisma.relogio.create({
      data: {
        usuarioId: req.user?.id || req.userId || 0,
        marcaId,
        colecaoId: colecaoId || null,
        modelo,
        referencia,
        anoFabricacao: anoFabricacao ? parseInt(anoFabricacao) : null,
        descricao,
        preco: parseFloat(preco),
        condicao: condicao || 'novo'
      },
      include: {
        marca: true,
        colecao: true
      }
    });

    res.status(201).json(relogio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar relógio' });
  }
};

export const updateRelogio = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { marcaId, colecaoId, modelo, referencia, anoFabricacao, descricao, preco, condicao } = req.body;

    const relogio = await prisma.relogio.findUnique({
      where: { id: parseInt(id) }
    });

    if (!relogio) {
      return res.status(404).json({ error: 'Relógio não encontrado' });
    }

    if (relogio.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await prisma.relogio.update({
      where: { id: parseInt(id) },
      data: {
        ...(marcaId && { marcaId }),
        ...(colecaoId !== undefined && { colecaoId: colecaoId || null }),
        ...(modelo && { modelo }),
        ...(referencia !== undefined && { referencia }),
        ...(anoFabricacao !== undefined && { anoFabricacao: anoFabricacao ? parseInt(anoFabricacao) : null }),
        ...(descricao !== undefined && { descricao }),
        ...(preco && { preco: parseFloat(preco) }),
        ...(condicao && { condicao })
      },
      include: {
        marca: true,
        colecao: true
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar relógio' });
  }
};

export const deleteRelogio = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const relogio = await prisma.relogio.findUnique({
      where: { id: parseInt(id) }
    });

    if (!relogio) {
      return res.status(404).json({ error: 'Relógio não encontrado' });
    }

    if (relogio.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.relogio.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Relógio deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar relógio' });
  }
};
