import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { authRouter } from './routes/auth';
import { searchRouter } from './routes/search';
import { tracksRouter } from './routes/tracks';
import { lyricsRouter } from './routes/lyrics';
import { playlistsRouter } from './routes/playlists';
import { queueRouter } from './routes/queue';
import { cacheRouter } from './routes/cache';
import { settingsRouter } from './routes/settings';
import { integrationsRouter } from './routes/integrations';
import { libraryRouter } from './routes/library';
import { exploreRouter } from './routes/explore';
import { jamRouter } from './routes/jam';
import { authMiddleware } from './middleware/auth';

export const app = express();

// Security Headers & CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173,http://localhost:3000').split(',');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, or same-origin) or any localhost/127.0.0.1 port or vercel deployments
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      origin.endsWith('.vercel.app') ||
      Boolean(process.env.VERCEL)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by Flow CORS Policy'));
    }
  },
  credentials: true
}));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Attach Auth / Local Profile Middleware
app.use(authMiddleware);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'Flow Music Player Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/tracks', tracksRouter);
app.use('/api/lyrics', lyricsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/queue', queueRouter);
app.use('/api/cache', cacheRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/library', libraryRouter);
app.use('/api/explore', exploreRouter);
app.use('/api/jam', jamRouter);

// Serve static frontend bundle if dist/ exists
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Flow Server Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err?.message || 'Unexpected failure'
  });
});
