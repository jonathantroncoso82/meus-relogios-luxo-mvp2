import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.marca.findMany();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar marcas' });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const brand = await prisma.marca.findUnique({
      where: { id: parseInt(id) },
      include: {
        relogios: true
      }
    });

    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar marca' });
  }
};

export const createBrand = async (req: AuthRequest, res: Response) => {
  try {
    const { nome, pais, fundacao, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const brand = await prisma.marca.create({
      data: {
        nome,
        pais,
        fundacao: fundacao ? parseInt(fundacao) : null,
        descricao
      }
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar marca' });
  }
};

export const updateBrand = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, pais, fundacao, descricao } = req.body;

    const brand = await prisma.marca.findUnique({
      where: { id: parseInt(id) }
    });

    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    const updated = await prisma.marca.update({
      where: { id: parseInt(id) },
      data: {
        ...(nome && { nome }),
        ...(pais !== undefined && { pais }),
        ...(fundacao !== undefined && { fundacao: fundacao ? parseInt(fundacao) : null }),
        ...(descricao !== undefined && { descricao })
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar marca' });
  }
};

export const deleteBrand = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const brand = await prisma.marca.findUnique({
      where: { id: parseInt(id) }
    });

    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    await prisma.marca.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Marca deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar marca' });
  }
};
