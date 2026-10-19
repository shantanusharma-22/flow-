import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { runMigrations } from './db/migrate';
import { runSeeds } from './db/seed';
import { FlowDatabase } from './db';
import { startMusicDirectoryWatcher } from './routes/library';

const PORT = parseInt(process.env.PORT || '8901', 10);

async function startServer() {
  try {
    console.log('🚀 [Flow Server] Booting Flow Desktop Backend API...');
    
    // Run schema migrations
    runMigrations();

    // Check if database needs initial seeding
    const trackCount = FlowDatabase.get<{ count: number }>('SELECT COUNT(*) as count FROM tracks;');
    if (!trackCount || trackCount.count === 0) {
      console.log('📦 [Flow Server] Fresh database detected. Seeding initial library...');
      runSeeds();
    }

    const server = app.listen(PORT, '127.0.0.1', () => {
      console.log(`\n======================================================`);
      console.log(`🎵 Flow Desktop Backend running at: http://127.0.0.1:${PORT}`);
      console.log(`   Health Check: http://127.0.0.1:${PORT}/api/health`);
      console.log(`   Catalog API:  http://127.0.0.1:${PORT}/api/search?q=Synth`);
      console.log(`======================================================\n`);

      // Initialize background music directory watcher for C:\Users\shant\Music
      startMusicDirectoryWatcher();
    });

    const shutdown = () => {
      console.log('\n🛑 [Flow Server] Gracefully shutting down...');
      server.close(() => {
        console.log('🏁 [Flow Server] Closed all connections.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('💥 [Flow Server] Fatal startup failure:', error);
    process.exit(1);
  }
}

startServer();
