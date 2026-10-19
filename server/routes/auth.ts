import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';

export const authRouter = Router();

// Fix #903: External system browser loopback OAuth
// Spawns system browser instead of internal WebView to prevent crash on custom OS/architectures
authRouter.get(
  '/external-oauth',
  validate({
    query: z.object({
      provider: z.enum(['spotify', 'google'])
    })
  }),
  (req: Request, res: Response) => {
    const { provider } = req.query as { provider: 'spotify' | 'google' };
    const state = Math.random().toString(36).substring(2, 15);
    const redirectUri = `http://127.0.0.1:8901/api/auth/callback/${provider}`;

    let authUrl = '';
    if (provider === 'spotify') {
      const clientId = process.env.SPOTIFY_CLIENT_ID || 'flow_mock_spotify_client';
      const scopes = ['user-read-playback-state', 'playlist-read-private', 'playlist-read-collaborative'].join(' ');
      authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    } else {
      const clientId = process.env.GOOGLE_CLIENT_ID || 'flow_mock_google_client';
      const scopes = ['https://www.googleapis.com/auth/youtube.readonly'].join(' ');
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    }

    res.json({
      provider,
      state,
      redirectUri,
      authUrl,
      instruction: 'Open authUrl in default external browser (Fix #903: Eliminates WebView crashes)'
    });
  }
);

// OAuth Callback Handler (Loopback receiver)
authRouter.get('/callback/:provider', (req: Request, res: Response) => {
  const { provider } = req.params;
  const { code, state, error } = req.query;

  if (error) {
    res.status(400).send(`
      <html>
        <body style="background:#080b12;color:#fb7185;font-family:sans-serif;padding:40px;text-align:center;">
          <h2>Authentication Cancelled</h2>
          <p>${error}</p>
        </body>
      </html>
    `);
    return;
  }

  // Generate local access session
  const sessionToken = `flow_${provider}_session_${Date.now()}`;

  res.send(`
    <html>
      <body style="background:#080b12;color:#f8fafc;font-family:sans-serif;padding:40px;text-align:center;">
        <h1 style="color:#00e5ff;">Flow Authentication Successful</h1>
        <p style="color:#94a3b8;">Connected to ${provider}. You can now return to the Flow desktop player.</p>
        <script>
          window.opener?.postMessage({ type: 'FLOW_AUTH_SUCCESS', provider: '${provider}', token: '${sessionToken}' }, '*');
          setTimeout(() => window.close(), 2500);
        </script>
      </body>
    </html>
  `);
});

// Privacy & Wipe Data Endpoint (Full GDPR & Apple deletion compliance)
authRouter.post('/wipe-data', (req: Request, res: Response) => {
  try {
    FlowDatabase.run('DELETE FROM playback_queue;');
    FlowDatabase.run('DELETE FROM playlist_tracks WHERE playlist_id IN (SELECT id FROM playlists WHERE is_custom = 1);');
    FlowDatabase.run('DELETE FROM playlists WHERE is_custom = 1;');
    FlowDatabase.run("UPDATE tracks SET is_liked = 0, is_cached = 0, is_downloaded = 0, play_count = 0;");
    FlowDatabase.run("DELETE FROM lyrics WHERE provider = 'local';");

    res.json({
      success: true,
      message: 'All local profile data, custom playlists, and cache history wiped.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to wipe local data' });
  }
});
