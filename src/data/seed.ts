import { Track, Playlist, Artist } from '../types';

export const SEED_TRACKS: Track[] = [
  {
    id: 'track-barood',
    title: 'Barood',
    artist: 'OG TEHRAN & Aditya Pushkarna',
    artistId: 'artist-og-tehran',
    album: 'Hustle 5 - Episode 1',
    albumId: 'album-hustle-5',
    durationSec: 150,
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 1411,
    accentColor: '#9333ea',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 542000,
    lyrics: {
      isSynced: true,
      provider: 'YouTube Music',
      lines: [
        { startTimeMs: 2000, endTimeMs: 8000, text: 'Yo yeah' },
        { startTimeMs: 8500, endTimeMs: 14000, text: 'बीटों पे बम बम बारूद' },
        { startTimeMs: 14200, endTimeMs: 19500, text: 'चीखूँ मैं गर्दन फाड़ूं' },
        { startTimeMs: 19800, endTimeMs: 25200, text: 'मुझे मेरा संकल्प मालूम' },
        { startTimeMs: 25500, endTimeMs: 30800, text: 'गानो से भूकंप लादूं' },
        { startTimeMs: 31000, endTimeMs: 36200, text: 'दिल्ली में अंधा कानून' },
        { startTimeMs: 36500, endTimeMs: 42000, text: 'ये दिखेंगे चिरकुट चालू' },
        { startTimeMs: 42200, endTimeMs: 47800, text: 'ये rappers सब बंदर cartoon' },
        { startTimeMs: 48000, endTimeMs: 53800, text: 'करे मेरा सर दर्द खातून' },
        { startTimeMs: 54000, endTimeMs: 59800, text: 'बीटों पे बम बम बारूद' },
        { startTimeMs: 60000, endTimeMs: 68000, text: 'चीखूँ मैं गर्दन फाड़ूं' }
      ],
      rawLrc: `[00:02.00]Yo yeah
[00:08.50]बीटों पे बम बम बारूद
[00:14.20]चीखूँ मैं गर्दन फाड़ूं
[00:19.80]मुझे मेरा संकल्प मालूम
[00:25.50]गानो से भूकंप लादूं
[00:31.00]दिल्ली में अंधा कानून
[00:36.50]ये दिखेंगे चिरकुट चालू
[00:42.20]ये rappers सब बंदर cartoon
[00:48.00]करे मेरा सर दर्द खातून
[00:54.00]बीटों पे बम बम बारूद
[01:00.00]चीखूँ मैं गर्दन फाड़ूं`
    }
  },
  {
    id: 'track-naksha',
    title: 'Naksha',
    artist: 'Seedhe Maut',
    artistId: 'artist-seedhe-maut',
    album: 'Nayaab',
    albumId: 'album-nayaab',
    durationSec: 194,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/659/659687_11861866-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 1411,
    accentColor: '#f59e0b',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 890000
  },
  {
    id: 'track-raat-ki-rani',
    title: 'Raat Ki Rani',
    artist: 'Seedhe Maut',
    artistId: 'artist-seedhe-maut',
    album: 'Lunch Break',
    albumId: 'album-lunch-break',
    durationSec: 218,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/462/462808_838627-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#ec4899',
    isLiked: true,
    isDownloaded: false,
    isCached: true,
    playCount: 1120000
  },
  {
    id: 'track-masti',
    title: 'Masti',
    artist: 'Encore ABJ, Dhanji',
    artistId: 'artist-seedhe-maut',
    album: 'Masti EP',
    albumId: 'album-masti',
    durationSec: 184,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/573/573539_11861866-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#eab308',
    isLiked: false,
    isDownloaded: false,
    isCached: true,
    playCount: 420000
  },
  {
    id: 'track-pocket-full',
    title: 'Pocket Full Of Flows',
    artist: 'Siyaahi, Aditya Pushkarna',
    artistId: 'artist-siyaahi',
    album: 'Pocket Full Of Flows',
    albumId: 'album-flows',
    durationSec: 172,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/540/540846_11861866-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 1411,
    accentColor: '#10b981',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 310000
  },
  {
    id: 'track-sharara',
    title: 'Sharara',
    artist: 'Siyaahi, ACHARYA',
    artistId: 'artist-siyaahi',
    album: 'Sharara Single',
    albumId: 'album-sharara',
    durationSec: 165,
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/415/415998_5121236-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#06b6d4',
    isLiked: false,
    isDownloaded: false,
    isCached: false,
    playCount: 275000
  },
  {
    id: 'track-ltb',
    title: 'LTB',
    artist: 'sammad, Dhanji',
    artistId: 'artist-dhanji',
    album: 'Ruab',
    albumId: 'album-ruab',
    durationSec: 202,
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#f97316',
    isLiked: false,
    isDownloaded: false,
    isCached: true,
    playCount: 195000
  },
  {
    id: 'track-underdog',
    title: 'UNDERDOG SHIT (Red Bull 64 Bars)',
    artist: 'vichaar, Karan Kanchan',
    artistId: 'artist-vichaar',
    album: 'Red Bull 64 Bars',
    albumId: 'album-redbull',
    durationSec: 156,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/659/659687_11861866-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 1411,
    accentColor: '#ef4444',
    isLiked: true,
    isDownloaded: false,
    isCached: true,
    playCount: 680000
  },
  {
    id: 'track-bawe',
    title: 'BAWE MAIN CHECK',
    artist: 'King, RAGA',
    artistId: 'artist-king',
    album: 'Monopoly Moves',
    albumId: 'album-monopoly',
    durationSec: 188,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/462/462808_838627-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 1411,
    accentColor: '#f43f5e',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 1450000
  },
  {
    id: 'track-cut-that',
    title: 'CUT THAT BI...',
    artist: 'Naam Sujal, Arpit Bala',
    artistId: 'artist-naam-sujal',
    album: 'Gande Gaane',
    albumId: 'album-gande-gaane',
    durationSec: 168,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/573/573539_11861866-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#8b5cf6',
    isLiked: false,
    isDownloaded: false,
    isCached: false,
    playCount: 520000
  },
  {
    id: 'track-17',
    title: '17',
    artist: 'Naam Sujal',
    artistId: 'artist-naam-sujal',
    album: '17 Single',
    albumId: 'album-17',
    durationSec: 174,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/415/415998_5121236-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#dc2626',
    isLiked: true,
    isDownloaded: false,
    isCached: true,
    playCount: 780000
  },
  {
    id: 'track-payback',
    title: 'Payback',
    artist: 'whysoKai, Aditya Pushkarna',
    artistId: 'artist-whysokai',
    album: 'Payback',
    albumId: 'album-payback',
    durationSec: 192,
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 1411,
    accentColor: '#3b82f6',
    isLiked: false,
    isDownloaded: false,
    isCached: true,
    playCount: 340000
  },
  {
    id: 'track-deewar',
    title: 'Deewar',
    artist: 'Siyaahi, Aditya Pushkarna',
    artistId: 'artist-siyaahi',
    album: 'Deewar Single',
    albumId: 'album-deewar',
    durationSec: 206,
    thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/659/659687_11861866-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#10b981',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 460000
  }
];

export const SEED_ALBUMS = [
  {
    id: 'album-mad-dawg',
    title: 'MAD DAWG 101',
    artist: 'KARMA',
    type: 'Album',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'album-distortion',
    title: ':distortion::',
    artist: 'Hurricane & D...',
    type: 'Album',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'album-hustle-20',
    title: 'Hustle 5 - Episode 20',
    artist: 'Aditya Pushkarna',
    type: 'EP',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'album-aigiri',
    title: 'Aigiri Nandini - Mahi...',
    artist: 'Madhubanti Ba...',
    type: 'Single',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'album-troublesome',
    title: "TROUBLESOME '96",
    artist: 'Talha Anjum',
    type: 'Album',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'album-known-unknowns',
    title: 'Known Unknowns',
    artist: 'Gur Sidhu & K...',
    type: 'Album',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80'
  }
];

export const SEED_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-liked',
    title: 'Liked Music',
    description: 'Auto playlist of all your favorite tracks',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    accentColor: '#ec4899',
    isCustom: false,
    createdAt: '2026-10-19',
    source: 'local',
    tracks: [SEED_TRACKS[0], SEED_TRACKS[1], SEED_TRACKS[2], SEED_TRACKS[4], SEED_TRACKS[7], SEED_TRACKS[8]]
  },
  {
    id: 'playlist-choti',
    title: 'choti',
    description: 'Personal curated mix',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    accentColor: '#a855f7',
    isCustom: true,
    createdAt: '2026-10-18',
    source: 'local',
    tracks: [SEED_TRACKS[0], SEED_TRACKS[3], SEED_TRACKS[5]]
  },
  {
    id: 'playlist-episodes-later',
    title: 'Episodes for Later',
    description: 'Saved episodes and long form music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    accentColor: '#38bdf8',
    isCustom: true,
    createdAt: '2026-10-17',
    source: 'local',
    tracks: [SEED_TRACKS[6], SEED_TRACKS[9]]
  }
];

export const SEED_ARTISTS: Artist[] = [
  {
    id: 'artist-og-tehran',
    name: 'OG TEHRAN',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    description: 'Indian Hip Hop artist & performer on Hustle 5.',
    subscribersCount: '580K',
    monthlyListeners: '2.1M',
    topTracks: [SEED_TRACKS[0]],
    albums: []
  },
  {
    id: 'artist-seedhe-maut',
    name: 'Seedhe Maut',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    description: 'Delhi rap duo Calm & Encore ABJ redefining Desi Hip Hop.',
    subscribersCount: '1.2M',
    monthlyListeners: '3.6M',
    topTracks: [SEED_TRACKS[1], SEED_TRACKS[2]],
    albums: []
  }
];
