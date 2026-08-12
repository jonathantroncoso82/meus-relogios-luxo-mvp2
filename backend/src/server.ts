import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Routes
import watchesRoutes from './routes/watches.routes';
import brandsRoutes from './routes/brands.routes';
import collectionsRoutes from './routes/collections.routes';
import serviceRecordsRoutes from './routes/serviceRecords.routes';
import valuationsRoutes from './routes/valuations.routes';
import relogiosRoutes from './routes/relogios.routes';
import colecoesRoutes from './routes/colecoes.routes';
import manutencoeRoutes from './routes/manutencoes.routes';
import avaliacoesRoutes from './routes/avaliacoes.routes';
import segurosRoutes from './routes/seguros.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', watchesRoutes);
app.use('/api', brandsRoutes);
app.use('/api', collectionsRoutes);
app.use('/api', serviceRecordsRoutes);
app.use('/api', valuationsRoutes);
app.use('/api', relogiosRoutes);
app.use('/api', colecoesRoutes);
app.use('/api', manutencoeRoutes);
app.use('/api', avaliacoesRoutes);
app.use('/api', segurosRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default app;
