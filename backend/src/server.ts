import 'dotenv/config';
import app from './app.js';
import prisma from './config/database.js';

const PORT = parseInt(process.env.PORT ?? '4000', 10);

async function main(): Promise<void> {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('[DB] Connected to PostgreSQL via Prisma');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[SERVER] LuxWatch API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[SERVER] Failed to start:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('[SERVER] SIGTERM received — shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[SERVER] SIGINT received — shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

main();
