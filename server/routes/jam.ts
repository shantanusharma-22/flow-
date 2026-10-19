import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { Track } from '../../src/types';

export const jamRouter = Router();

// BitChord-compatible Base32 Crockford-style alphabet (no I, L, O)
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_LENGTH = 6;

export function generateJamCode(): string {
  let result = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHABET.length);
    result += ALPHABET[randomIndex];
  }
  return result;
}

export function normalizeJamCode(code: string): string {
  return code
    .toUpperCase()
    .trim()
    .replace(/[\s-]/g, '')
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0');
}

export interface JamMember {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

export interface JamRoom {
  code: string;
  name: string;
  hostId: string;
  hostName: string;
  members: JamMember[];
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTimeSec: number;
  lastStateUpdateMs: number;
  hostOnlyControl: boolean;
  maxMembers: number;
  createdAt: number;
}

// In-memory active Jam / Party room ledger
const rooms = new Map<string, JamRoom>();

// Seed a default demo party room
const demoCode = 'FLOW26';
rooms.set(demoCode, {
  code: demoCode,
  name: "Flow Lounge",
  hostId: 'host-harrmane',
  hostName: 'Harrmane',
  members: [
    { id: 'host-harrmane', name: 'Harrmane', isHost: true, joinedAt: Date.now() - 120000 },
    { id: 'member-alex', name: 'Alex', isHost: false, joinedAt: Date.now() - 60000 }
  ],
  currentTrack: {
    id: 'yt-synth-01',
    title: 'Midnight City Glow',
    artist: 'Neon Mirage',
    album: 'Retrowave Dreams',
    durationSec: 215,
    streamUrl: 'https://cdn.flowplayer.local/audio/synth-01.flac',
    coverArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop',
    isLossless: true,
    lyricsSynced: true,
    audioQuality: 'FLAC (24-bit/1411kbps)'
  },
  isPlaying: true,
  currentTimeSec: 42,
  lastStateUpdateMs: Date.now(),
  hostOnlyControl: false,
  maxMembers: 16,
  createdAt: Date.now() - 120000
});

// GET /api/jam/rooms - List active rooms
jamRouter.get('/rooms', (_req: Request, res: Response) => {
  const activeRooms = Array.from(rooms.values()).map(r => ({
    code: r.code,
    name: r.name,
    hostName: r.hostName,
    memberCount: r.members.length,
    maxMembers: r.maxMembers,
    currentTrackTitle: r.currentTrack?.title || 'Idle',
    currentTrackArtist: r.currentTrack?.artist || 'None',
    isPlaying: r.isPlaying
  }));
  res.json({ rooms: activeRooms });
});

// POST /api/jam/create - Host a new Jam room
jamRouter.post(
  '/create',
  validate({
    body: z.object({
      roomName: z.string().min(1).max(50).default("My Flow Jam"),
      userName: z.string().min(1).max(30).default("Host"),
      hostOnlyControl: z.boolean().default(false),
      currentTrack: z.any().optional()
    })
  }),
  (req: Request, res: Response) => {
    let code = generateJamCode();
    while (rooms.has(code)) {
      code = generateJamCode();
    }

    const hostMember: JamMember = {
      id: `usr-${Date.now().toString(36)}`,
      name: req.body.userName,
      isHost: true,
      joinedAt: Date.now()
    };

    const newRoom: JamRoom = {
      code,
      name: req.body.roomName,
      hostId: hostMember.id,
      hostName: hostMember.name,
      members: [hostMember],
      currentTrack: req.body.currentTrack || null,
      isPlaying: false,
      currentTimeSec: 0,
      lastStateUpdateMs: Date.now(),
      hostOnlyControl: req.body.hostOnlyControl,
      maxMembers: 16,
      createdAt: Date.now()
    };

    rooms.set(code, newRoom);

    res.status(201).json({
      room: newRoom,
      member: hostMember,
      inviteUrl: `http://localhost:5173/?jam=${code}`
    });
  }
);

// POST /api/jam/join - Join room by 6-character code
jamRouter.post(
  '/join',
  validate({
    body: z.object({
      code: z.string().min(4),
      userName: z.string().min(1).max(30).default("Listener")
    })
  }),
  (req: Request, res: Response) => {
    const normalized = normalizeJamCode(req.body.code);
    const room = rooms.get(normalized);

    if (!room) {
      res.status(404).json({ error: `Jam room '${normalized}' not found.` });
      return;
    }

    if (room.members.length >= room.maxMembers) {
      res.status(403).json({ error: 'Room is at maximum member capacity.' });
      return;
    }

    const member: JamMember = {
      id: `usr-${Date.now().toString(36)}`,
      name: req.body.userName,
      isHost: false,
      joinedAt: Date.now()
    };

    room.members.push(member);

    res.json({
      room,
      member
    });
  }
);

// GET /api/jam/room/:code - Get current state
jamRouter.get('/room/:code', (req: Request, res: Response) => {
  const normalized = normalizeJamCode(req.params.code);
  const room = rooms.get(normalized);

  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  // Calculate synchronized playback position based on elapsed time if playing
  let estimatedTimeSec = room.currentTimeSec;
  if (room.isPlaying && room.lastStateUpdateMs > 0) {
    const elapsedSec = (Date.now() - room.lastStateUpdateMs) / 1000;
    estimatedTimeSec += elapsedSec;
    if (room.currentTrack && estimatedTimeSec > room.currentTrack.durationSec) {
      estimatedTimeSec = room.currentTrack.durationSec;
    }
  }

  res.json({
    ...room,
    estimatedTimeSec: Math.floor(estimatedTimeSec)
  });
});

// POST /api/jam/room/:code/sync - Synchronize playback state
jamRouter.post(
  '/room/:code/sync',
  validate({
    body: z.object({
      memberId: z.string(),
      action: z.enum(['play', 'pause', 'seek', 'setTrack', 'next', 'previous']),
      track: z.any().optional(),
      currentTimeSec: z.number().optional(),
      isPlaying: z.boolean().optional()
    })
  }),
  (req: Request, res: Response) => {
    const normalized = normalizeJamCode(req.params.code);
    const room = rooms.get(normalized);

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const member = room.members.find(m => m.id === req.body.memberId);
    if (!member) {
      res.status(403).json({ error: 'Not a member of this room' });
      return;
    }

    if (room.hostOnlyControl && !member.isHost) {
      res.status(403).json({ error: 'Only the host may control playback in this room' });
      return;
    }

    if (req.body.track !== undefined) {
      room.currentTrack = req.body.track;
    }
    if (req.body.currentTimeSec !== undefined) {
      room.currentTimeSec = req.body.currentTimeSec;
    }
    if (req.body.isPlaying !== undefined) {
      room.isPlaying = req.body.isPlaying;
    }

    room.lastStateUpdateMs = Date.now();

    res.json({
      success: true,
      room
    });
  }
);

// POST /api/jam/room/:code/leave - Leave room
jamRouter.post(
  '/room/:code/leave',
  validate({
    body: z.object({
      memberId: z.string()
    })
  }),
  (req: Request, res: Response) => {
    const normalized = normalizeJamCode(req.params.code);
    const room = rooms.get(normalized);

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    room.members = room.members.filter(m => m.id !== req.body.memberId);

    // If host leaves and members remain, assign new host; if empty, close room
    if (room.members.length === 0) {
      rooms.delete(normalized);
    } else if (room.hostId === req.body.memberId) {
      room.members[0].isHost = true;
      room.hostId = room.members[0].id;
      room.hostName = room.members[0].name;
    }

    res.json({ success: true });
  }
);
