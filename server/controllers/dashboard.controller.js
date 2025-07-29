import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const openQuotesCount = prisma.quote.count({ where: { status: 'Em Aberto' } });
    const activeClientsCount = prisma.client.count({ where: { status: 'Ativo' } });
    const monthlyRevenue = prisma.quote.aggregate({
      _sum: { totalValue: true },
      where: {
        status: 'Aprovado',
        createdAt: { gte: startOfMonth },
      },
    });

    const [quotes, clients, revenue] = await Promise.all([
      openQuotesCount,
      activeClientsCount,
      monthlyRevenue,
    ]);

    res.status(200).json({
      openQuotesCount: quotes,
      activeClientsCount: clients,
      monthlyRevenue: revenue._sum.totalValue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Não foi possível buscar as estatísticas." });
  }
};