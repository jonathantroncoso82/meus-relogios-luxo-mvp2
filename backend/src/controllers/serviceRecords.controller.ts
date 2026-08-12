import { Request, Response } from 'express';
import { PrismaClient, Decimal } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getServiceRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId } = req.query;
    
    const where: any = { usuarioId: req.user?.id || req.userId };
    if (relogioId) {
      where.relogioId = parseInt(relogioId as string);
    }

    const registros = await prisma.registroServico.findMany({
      where,
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      },
      orderBy: { dataServico: 'desc' }
    });

    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar registros de serviço' });
  }
};

export const getServiceRecordById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const registro = await prisma.registroServico.findUnique({
      where: { id: parseInt(id) },
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      }
    });

    if (!registro) {
      return res.status(404).json({ error: 'Registro de serviço não encontrado' });
    }

    if (registro.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar registro de serviço' });
  }
};

export const createServiceRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { relogioId, dataServico, tipoServico, descricao, custo, tecnico } = req.body;

    if (!relogioId || !dataServico || !tipoServico) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Verificar se o relógio pertence ao usuário
    const relogio = await prisma.relogio.findUnique({
      where: { id: relogioId }
    });

    if (!relogio || relogio.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Relógio não encontrado ou acesso negado' });
    }

    const registro = await prisma.registroServico.create({
      data: {
        relogioId,
        usuarioId: req.user?.id || req.userId || 0,
        dataServico: new Date(dataServico),
        tipoServico,
        descricao,
        custo: custo ? new Decimal(parseFloat(custo)) : new Decimal(0),
        tecnico
      },
      include: {
        relogio: {
          include: {
            marca: true
          }
        }
      }
    });

    res.status(201).json(registro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar registro de serviço' });
  }
};

export const updateServiceRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { dataServico, tipoServico, descricao, custo, tecnico } = req.body;

    const registro = await prisma.registroServico.findUnique({
      where: { id: parseInt(id) }
    });

    if (!registro) {
      return res.status(404).json({ error: 'Registro de serviço não encontrado' });
    }

    if (registro.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await prisma.registroServico.update({
      where: { id: parseInt(id) },
      data: {
        ...(dataServico && { dataServico: new Date(dataServico) }),
        ...(tipoServico && { tipoServico }),
        ...(descricao !== undefined && { descricao }),
        ...(custo !== undefined && { custo: custo ? new Decimal(parseFloat(custo)) : new Decimal(0) }),
        ...(tecnico !== undefined && { tecnico })
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
    res.status(500).json({ error: 'Erro ao atualizar registro de serviço' });
  }
};

export const deleteServiceRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const registro = await prisma.registroServico.findUnique({
      where: { id: parseInt(id) }
    });

    if (!registro) {
      return res.status(404).json({ error: 'Registro de serviço não encontrado' });
    }

    if (registro.usuarioId !== (req.user?.id || req.userId)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.registroServico.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Registro de serviço deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar registro de serviço' });
  }
};
