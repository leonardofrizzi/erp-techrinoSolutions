import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const listTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        transactionDate: 'desc',
      },
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).json({ message: "Não foi possível buscar as transações." });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, paymentMethod, transactionDate, quoteId } = req.body;

    if (!description || !amount || !type || !transactionDate) {
      return res.status(400).json({ message: "Descrição, valor, tipo e data são obrigatórios." });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: Number(amount),
        type,
        paymentMethod,
        transactionDate: new Date(transactionDate),
        quoteId,
      },
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).json({ message: "Não foi possível criar a transação." });
  }
};