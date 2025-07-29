import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware/auth.middleware.js';

import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import quoteRoutes from './routes/quote.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/orcamentos', authMiddleware, quoteRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor pronto na porta ${PORT}`);
});