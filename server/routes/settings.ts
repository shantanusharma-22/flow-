import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';

export const settingsRouter = Router();

// GET all user settings
settingsRouter.get('/', (req: Request, res: Response) => {
  const rows = FlowDatabase.query<{ key: string; value: string }>('SELECT key, value FROM user_settings;');
  const settings: Record<string, string> = {};
  rows.forEach(r => {
    settings[r.key] = r.value;
  });

  res.json(settings);
});

// PUT update user settings
settingsRouter.put(
  '/',
  validate({
    body: z.record(z.string(), z.string())
  }),
  (req: Request, res: Response) => {
    const updates = req.body as Record<string, string>;

    for (const [key, value] of Object.entries(updates)) {
      FlowDatabase.run(
        `INSERT INTO user_settings (key, value, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
        [key, value]
      );
    }

    res.json({ success: true, updatedKeys: Object.keys(updates) });
  }
);
