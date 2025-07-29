import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name });
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ message: "Este email já está em uso." });
    res.status(500).json({ message: "Não foi possível criar o usuário." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Credenciais inválidas." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Credenciais inválidas." });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000,
    });
    
    res.status(200).json({ message: "Login bem-sucedido!" });
  } catch (error) {
    res.status(500).json({ message: "Ocorreu um erro interno." });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout bem-sucedido." });
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil." });
  }
}