import { app } from '../server/app';
import { runMigrations } from '../server/db/migrate';
import { runSeeds } from '../server/db/seed';
import { FlowDatabase } from '../server/db';

let initialized = false;

function ensureDatabase() {
  if (initialized) return;
  try {
    runMigrations();
    const count = FlowDatabase.get<{ count: number }>('SELECT count(*) as count FROM tracks;');
    if (!count || count.count === 0) {
      runSeeds();
    }
    initialized = true;
  } catch (err) {
    console.error('Error initializing database for Vercel Serverless:', err);
  }
}

export default function handler(req: any, res: any) {
  ensureDatabase();
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
