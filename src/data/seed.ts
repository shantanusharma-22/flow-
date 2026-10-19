import { Track, Playlist, Artist } from '../types';

export const SEED_TRACKS: Track[] = [
  {
    id: 'track-01',
    title: 'Neon Odyssey',
    artist: 'Luna Synth',
    artistId: 'artist-01',
    album: 'Synthetic Horizons',
    albumId: 'album-01',
    durationSec: 214,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#00e5ff',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 142850,
    lyrics: {
      isSynced: true,
      provider: 'LRCLIB (Verified)',
      lines: [
        { startTimeMs: 0, endTimeMs: 8500, text: '♪ (Atmospheric synth intro plays softly) ♪', romanized: '♪ [Instrumental opening] ♪', translation: '♪ [Instrumental opening] ♪' },
        { startTimeMs: 8500, endTimeMs: 14200, text: '夜の街に揺れるネオンの光', romanized: 'Yoru no machi ni yureru neon no hikari', translation: 'Neon lights swaying across the nocturnal metropolis' },
        { startTimeMs: 14200, endTimeMs: 20400, text: '遠くへと消えていく影を追う', romanized: 'Tooku e to kiete iku kage o ou', translation: 'Chasing shadows that dissolve into the distance' },
        { startTimeMs: 20400, endTimeMs: 27100, text: '誰も知らない秘密の鼓動が', romanized: 'Dare mo shiranai himitsu no kodou ga', translation: 'A secret pulse that nobody else recognizes' },
        { startTimeMs: 27100, endTimeMs: 34800, text: 'デジタルの海に響き渡る', romanized: 'Dejitaru no umi ni hibiki wataru', translation: 'Echoes continuously through the digital ocean' },
        { startTimeMs: 34800, endTimeMs: 42000, text: '流れる星のように輝いて', romanized: 'Nagareru hoshi no you ni kagayaite', translation: 'Shining like falling shooting stars' },
        { startTimeMs: 42000, endTimeMs: 50200, text: '私たちは自由を探し求めている', romanized: 'Watashitachi wa jiyuu o sagashimotomete iru', translation: 'We are reaching out, yearning for true freedom' },
        { startTimeMs: 50200, endTimeMs: 58900, text: '終わりなきシンセの波に乗って', romanized: 'Owarinaki shinse no nami ni notte', translation: 'Riding upon the endless synthesizer waves' },
        { startTimeMs: 58900, endTimeMs: 68000, text: '明日へと向かって加速していく', romanized: 'Ashita e to mukatte kasoku shite iku', translation: 'Accelerating relentlessly into tomorrow' },
        { startTimeMs: 68000, endTimeMs: 80000, text: '♪ (Resonant synth solo soaring) ♪', romanized: '♪ [Synth breakdown] ♪', translation: '♪ [Synth breakdown] ♪' },
        { startTimeMs: 80000, endTimeMs: 95000, text: '永遠に続くこのフローの中へ', romanized: 'Eien ni tsuzuku kono furoo no naka e', translation: 'Deep into this eternal Flow that never ends' }
      ],
      rawLrc: `[00:08.50]夜の街に揺れるネオンの光
[00:14.20]遠くへと消えていく影を追う
[00:20.40]誰も知らない秘密の鼓動が
[00:27.10]デジタルの海に響き渡る
[00:34.80]流れる星のように輝いて
[00:42.00]私たちは自由を探し求めている
[00:50.20]終わりなきシンセの波に乗って
[00:58.90]明日へと向かって加速していく
[01:20.00]永遠に続くこのフローの中へ`
    }
  },
  {
    id: 'track-02',
    title: 'Raindrop Sanctuary',
    artist: 'Kaito Void',
    artistId: 'artist-02',
    album: 'Midnight Tokyo Memories',
    albumId: 'album-02',
    durationSec: 186,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/659/659687_11861866-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 920,
    accentColor: '#a855f7',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 98400,
    lyrics: {
      isSynced: true,
      provider: 'Musixmatch (Synced)',
      lines: [
        { startTimeMs: 0, endTimeMs: 6000, text: '♪ (Gentle rain tapping on glass with mellow piano) ♪' },
        { startTimeMs: 6000, endTimeMs: 13500, text: 'Raindrops fall on the obsidian street', translation: 'Obsidian glass reflects the rainfall' },
        { startTimeMs: 13500, endTimeMs: 21000, text: 'Every solitary step has a rhythm and beat', translation: 'Finding calm in the footsteps' },
        { startTimeMs: 21000, endTimeMs: 29000, text: 'Looking at the reflection through the misty steam', translation: 'Watching the quiet coffee steam rise' },
        { startTimeMs: 29000, endTimeMs: 38000, text: 'Just lost in a midnight lo-fi daydream', translation: 'Drifting peaceful in the lo-fi haze' },
        { startTimeMs: 38000, endTimeMs: 52000, text: 'Close your eyes, let the static soothe your mind', translation: 'Let gentle vinyl hiss ease away tension' },
        { startTimeMs: 52000, endTimeMs: 68000, text: 'In this sanctuary, peace is what you will find', translation: 'A sanctuary in the midnight hour' }
      ],
      rawLrc: `[00:06.00]Raindrops fall on the obsidian street
[00:13.50]Every solitary step has a rhythm and beat
[00:21.00]Looking at the reflection through the misty steam
[00:29.00]Just lost in a midnight lo-fi daydream
[00:38.00]Close your eyes, let the static soothe your mind
[00:52.00]In this sanctuary, peace is what you will find`
    }
  },
  {
    id: 'track-03',
    title: 'Astral Resonance',
    artist: 'Celeste Bloom',
    artistId: 'artist-03',
    album: 'Celestial Drift',
    albumId: 'album-03',
    durationSec: 248,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/462/462808_838627-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#38bdf8',
    isLiked: false,
    isDownloaded: false,
    isCached: true,
    playCount: 65120,
    lyrics: {
      isSynced: true,
      provider: 'LRCLIB (Verified)',
      lines: [
        { startTimeMs: 0, endTimeMs: 10000, text: '♪ (Starlight chime arpeggio opening) ♪' },
        { startTimeMs: 10000, endTimeMs: 18500, text: 'We spun across constellations in deep space' },
        { startTimeMs: 18500, endTimeMs: 26000, text: 'Gravitational whispers in a warm embrace' },
        { startTimeMs: 26000, endTimeMs: 35000, text: 'Hold the frequency until the stars ignite' },
        { startTimeMs: 35000, endTimeMs: 44000, text: 'We are pure frequency wandering in the night' },
        { startTimeMs: 44000, endTimeMs: 56000, text: 'Resonance... astral resonance taking flight' }
      ]
    }
  },
  {
    id: 'track-04',
    title: 'Cyberpunk Skyline',
    artist: 'Aethelgard',
    artistId: 'artist-04',
    album: 'Neo Matrix Overdrive',
    albumId: 'album-04',
    durationSec: 198,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/558/558694_11861866-lq.mp3',
    audioFormat: 'aac',
    bitrateKbps: 256,
    accentColor: '#ec4899',
    isLiked: true,
    isDownloaded: false,
    isCached: false,
    playCount: 112300,
    lyrics: {
      isSynced: true,
      provider: 'Flow Neural Engine',
      lines: [
        { startTimeMs: 0, endTimeMs: 12000, text: '♪ (Distorted bassline and industrial 808 kick) ♪' },
        { startTimeMs: 12000, endTimeMs: 20000, text: 'Chrome towers piercing the polluted sky' },
        { startTimeMs: 20000, endTimeMs: 28000, text: 'Holographic memories that never die' },
        { startTimeMs: 28000, endTimeMs: 36000, text: 'Jack in the fiber wire, override the grid' },
        { startTimeMs: 36000, endTimeMs: 46000, text: 'Remember all the wild things that we did' },
        { startTimeMs: 46000, endTimeMs: 58000, text: 'Overdrive pulse, overclocked reality!' }
      ]
    }
  },
  {
    id: 'track-05',
    title: 'Glow in the Mist',
    artist: 'Luna Synth',
    artistId: 'artist-01',
    album: 'Synthetic Horizons',
    albumId: 'album-01',
    durationSec: 230,
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/573/573539_11861866-lq.mp3',
    audioFormat: 'flac',
    bitrateKbps: 1024,
    accentColor: '#10b981',
    isLiked: false,
    isDownloaded: false,
    isCached: true,
    playCount: 77900
  },
  {
    id: 'track-06',
    title: 'Coffee Beans & Cassette Tapes',
    artist: 'Kaito Void',
    artistId: 'artist-02',
    album: 'Midnight Tokyo Memories',
    albumId: 'album-02',
    durationSec: 165,
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/415/415998_5121236-lq.mp3',
    audioFormat: 'mp3',
    bitrateKbps: 320,
    accentColor: '#f59e0b',
    isLiked: true,
    isDownloaded: true,
    isCached: true,
    playCount: 204500
  },
  {
    id: 'track-07',
    title: 'Solar Flare Symphony',
    artist: 'Celeste Bloom',
    artistId: 'artist-03',
    album: 'Celestial Drift',
    albumId: 'album-03',
    durationSec: 275,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/462/462808_838627-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#f43f5e',
    isLiked: false,
    isDownloaded: false,
    isCached: false,
    playCount: 42100
  },
  {
    id: 'track-08',
    title: 'Midnight Highway Cruise',
    artist: 'Aethelgard',
    artistId: 'artist-04',
    album: 'Neo Matrix Overdrive',
    albumId: 'album-04',
    durationSec: 210,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    audioFormat: 'opus',
    bitrateKbps: 320,
    accentColor: '#6366f1',
    isLiked: true,
    isDownloaded: false,
    isCached: true,
    playCount: 89400
  }
];

export const SEED_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-01',
    title: 'Flow Discover Weekly',
    description: 'Curated deep-groove electronic, neo-synthwave, and atmospheric lo-fi updated daily for deep focus.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    accentColor: '#00e5ff',
    isCustom: false,
    createdAt: '2026-10-15',
    source: 'youtube',
    tracks: [SEED_TRACKS[0], SEED_TRACKS[1], SEED_TRACKS[2], SEED_TRACKS[3], SEED_TRACKS[4]]
  },
  {
    id: 'playlist-02',
    title: 'Tokyo Midnight Cyberpunk',
    description: 'Dark club energy, heavy synth basslines, and rain-soaked dystopian neon melodies.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
    accentColor: '#ec4899',
    isCustom: false,
    createdAt: '2026-10-12',
    source: 'youtube',
    tracks: [SEED_TRACKS[3], SEED_TRACKS[0], SEED_TRACKS[7]]
  },
  {
    id: 'playlist-03',
    title: 'Midnight Lo-Fi Coding Sanctuary',
    description: 'Warm vinyl crackle, gentle Rhodes chords, and mellow beats designed for continuous engineering flow state.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    accentColor: '#a855f7',
    isCustom: true,
    createdAt: '2026-10-18',
    source: 'local',
    tracks: [SEED_TRACKS[1], SEED_TRACKS[5], SEED_TRACKS[2]]
  },
  {
    id: 'playlist-04',
    title: 'Cosmic Ambient Soundscapes',
    description: 'Ethereal modular synths, celestial pad swells, and wide sonic spaces for late night stargazing.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    accentColor: '#38bdf8',
    isCustom: false,
    createdAt: '2026-10-10',
    source: 'spotify',
    tracks: [SEED_TRACKS[2], SEED_TRACKS[6], SEED_TRACKS[4]]
  }
];

export const SEED_ARTISTS: Artist[] = [
  {
    id: 'artist-01',
    name: 'Luna Synth',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    description: 'Tokyo and Berlin-based electronic producer sculpting melancholic analog synths with futuristic pop sensibilities.',
    subscribersCount: '482K',
    monthlyListeners: '1.8M',
    topTracks: [SEED_TRACKS[0], SEED_TRACKS[4]],
    albums: [
      {
        id: 'album-01',
        title: 'Synthetic Horizons',
        year: 2026,
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
        trackCount: 10
      }
    ]
  },
  {
    id: 'artist-02',
    name: 'Kaito Void',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    description: 'Pioneer of rain-drenched midnight chillhop, blending jazz piano chords with organic field recordings.',
    subscribersCount: '620K',
    monthlyListeners: '2.4M',
    topTracks: [SEED_TRACKS[1], SEED_TRACKS[5]],
    albums: [
      {
        id: 'album-02',
        title: 'Midnight Tokyo Memories',
        year: 2025,
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        trackCount: 8
      }
    ]
  },
  {
    id: 'artist-03',
    name: 'Celeste Bloom',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    description: 'Ethereal ambient composer weaving celestial harmonics and modular synthesizers into dreamlike acoustic soundscapes.',
    subscribersCount: '315K',
    monthlyListeners: '980K',
    topTracks: [SEED_TRACKS[2], SEED_TRACKS[6]],
    albums: [
      {
        id: 'album-03',
        title: 'Celestial Drift',
        year: 2026,
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
        trackCount: 9
      }
    ]
  },
  {
    id: 'artist-04',
    name: 'Aethelgard',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    description: 'Cyberpunk darkwave architect forging driving industrial beats, aggressive synth leads, and raw dystopian energy.',
    subscribersCount: '540K',
    monthlyListeners: '1.6M',
    topTracks: [SEED_TRACKS[3], SEED_TRACKS[7]],
    albums: [
      {
        id: 'album-04',
        title: 'Neo Matrix Overdrive',
        year: 2025,
        thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
        trackCount: 12
      }
    ]
  }
];
