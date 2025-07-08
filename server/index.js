import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, senha e nome são obrigatórios." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: "Este email já está em uso." });
    }
    console.error(error);
    res.status(500).json({ message: "Não foi possível criar o usuário." });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    res.status(200).json({
      message: "Login bem-sucedido!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
  }
});

app.get('/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: 'asc' },
      include: {
        contacts: true,
      },
    });
    res.status(200).json(clients);
  } catch (error)
{
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Não foi possível buscar os clientes." });
  }
});

app.post('/clients', async (req, res) => {
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
        contacts: {
          create: contacts,
        },
      },
      include: {
        contacts: true,
      }
    });
    res.status(201).json(newClient);
  } catch (error) {
    if (error.code === 'P2002') { 
      return res.status(409).json({ message: "Já existe um cliente com este CNPJ." });
    }
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ message: "Não foi possível criar o cliente." });
  }
});

app.put('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cnpj, status, contacts } = req.body;

    const contactsToCreate = contacts.map(contact => ({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    }));

    const updatedClient = await prisma.$transaction(async (prisma) => {
      await prisma.contact.deleteMany({
        where: { clientId: id },
      });

      const client = await prisma.client.update({
        where: { id: id },
        data: {
          name,
          cnpj,
          status,
          contacts: {
            create: contactsToCreate,
          },
        },
        include: {
          contacts: true,
        },
      });

      return client;
    });

    res.status(200).json(updatedClient);

  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ message: "Não foi possível atualizar o cliente." });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor pronto na porta ${PORT}`);
});