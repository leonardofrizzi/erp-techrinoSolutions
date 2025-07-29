import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const listQuotes = async (req, res) => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { name: true } },
        contact: { select: { name: true } }
      }
    });
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Não foi possível buscar os orçamentos." });
  }
};

export const createQuote = async (req, res) => {
  try {
    const { clientId, contactId, totalValue, items } = req.body;
    if (!clientId || !contactId || !items || items.length === 0) {
      return res.status(400).json({ message: "Cliente, contato e itens são obrigatórios." });
    }
    const itemsToCreate = items.map(item => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.quantity) * Number(item.unitPrice),
    }));
    const newQuote = await prisma.quote.create({
      data: {
        totalValue: Number(totalValue),
        client: { connect: { id: clientId } },
        contact: { connect: { id: contactId } },
        items: { create: itemsToCreate },
      },
      include: { items: true }
    });
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ message: "Não foi possível criar o orçamento." });
  }
};

export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await prisma.quote.findUnique({
      where: { id: id },
      include: { client: true, contact: true, items: true },
    });
    if (!quote) {
      return res.status(404).json({ message: "Orçamento não encontrado." });
    }
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: "Não foi possível buscar o orçamento." });
  }
};

export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, contactId, totalValue, items } = req.body;
    const itemsToCreate = items.map(item => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.quantity) * Number(item.unitPrice),
    }));
    const updatedQuote = await prisma.$transaction(async (tx) => {
      await tx.quoteItem.deleteMany({ where: { quoteId: id } });
      const quote = await tx.quote.update({
        where: { id: id },
        data: {
          totalValue: Number(totalValue),
          client: { connect: { id: clientId } },
          contact: { connect: { id: contactId } },
          items: { create: itemsToCreate },
        },
        include: { items: true },
      });
      return quote;
    });
    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: "Não foi possível atualizar o orçamento." });
  }
};