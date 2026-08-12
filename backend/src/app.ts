import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import watchesRoutes from './routes/watches.routes';
import brandsRoutes from './routes/brands.routes';
import collectionsRoutes from './routes/collections.routes';
import serviceRecordsRoutes from './routes/serviceRecords.routes';
import valuationsRoutes from './routes/valuations.routes';
import healthRoutes from './routes/health.routes';
import relogiosRoutes from './routes/relogios.routes';
import colecoesRoutes from './routes/colecoes.routes';
import manutencoeRoutes from './routes/manutencoes.routes';
import avaliacoesRoutes from './routes/avaliacoes.routes';
import segurosRoutes from './routes/seguros.routes';
import usuariosRoutes from './routes/usuarios.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', watchesRoutes);
app.use('/api', brandsRoutes);
app.use('/api', collectionsRoutes);
app.use('/api', serviceRecordsRoutes);
app.use('/api', valuationsRoutes);
app.use('/api', healthRoutes);
app.use('/api', relogiosRoutes);
app.use('/api', colecoesRoutes);
app.use('/api', manutencoeRoutes);
app.use('/api', avaliacoesRoutes);
app.use('/api', segurosRoutes);
app.use('/api', usuariosRoutes);

// Middleware de erro
app.use(errorHandler);

export default app;
