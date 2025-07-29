import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const listClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: 'asc' },
      include: { contacts: true },
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Não foi possível buscar os clientes." });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, cnpj, status, contacts } = req.body;
    if (!name) {
      return res.status(400).json({ message: "O nome do cliente é obrigatório." });
    }
    const newClient = await prisma.client.create({
      data: {
        name,
        cnpj,
        status,
        contacts: { create: contacts },
      },
      include: { contacts: true }
    });
    res.status(201).json(newClient);
  } catch (error) {
    if (error.code === 'P2002') { 
      return res.status(409).json({ message: "Já existe um cliente com este CNPJ." });
    }
    res.status(500).json({ message: "Não foi possível criar o cliente." });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cnpj, status, contacts } = req.body;
    const contactsToCreate = contacts.map(c => ({ name: c.name, email: c.email, phone: c.phone }));
    const updatedClient = await prisma.$transaction(async (tx) => {
      await tx.contact.deleteMany({ where: { clientId: id } });
      const client = await tx.client.update({
        where: { id: id },
        data: {
          name,
          cnpj,
          status,
          contacts: { create: contactsToCreate },
        },
        include: { contacts: true },
      });
      return client;
    });
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: "Não foi possível atualizar o cliente." });
  }
};