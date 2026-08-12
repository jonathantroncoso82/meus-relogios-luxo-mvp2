import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import brandsRoutes from './routes/brands.routes';
import watchesRoutes from './routes/watches.routes';
import collectionsRoutes from './routes/collections.routes';
import serviceRecordsRoutes from './routes/serviceRecords.routes';
import valuationsRoutes from './routes/valuations.routes';
import usuariosRoutes from './routes/usuarios.routes';
import relogiosRoutes from './routes/relogios.routes';
import colecoesRoutes from './routes/colecoes.routes';
import manutencoeRoutes from './routes/manutencoes.routes';
import segurosRoutes from './routes/seguros.routes';
import avaliacoesRoutes from './routes/avaliacoes.routes';
import healthRoutes from './routes/health.routes';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Legacy routes
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/watches', watchesRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/service-records', serviceRecordsRoutes);
app.use('/api/valuations', valuationsRoutes);

// New routes
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/relogios', relogiosRoutes);
app.use('/api/colecoes', colecoesRoutes);
app.use('/api/manutencoes', manutencoeRoutes);
app.use('/api/seguros', segurosRoutes);
app.use('/api/avaliacoes', avaliacoesRoutes);
app.use('/health', healthRoutes);

app.use(errorHandler);

export default app;
