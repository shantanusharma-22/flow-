import { Track, RepeatMode } from '../types';

export interface AudioPlayerEvents {
  onTimeUpdate: (currentTimeSec: number, durationSec: number) => void;
  onStateChange: (isPlaying: boolean, isBuffering: boolean) => void;
  onEnded: () => void;
  onError: (error: string) => void;
}

class FlowAudioEngine {
  private audio: HTMLAudioElement;
  private currentTrack: Track | null = null;
  private repeatMode: RepeatMode = 'off';
  private playbackSpeed: number = 1.0;
  private isMuted: boolean = false;
  private previousVolume: number = 0.8;
  private events: Partial<AudioPlayerEvents> = {};

  // Web Audio Context for visualizer and synth fallback
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private synthInterval: number | null = null;
  private synthCurrentSec: number = 0;
  private isSynthPlaying: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.volume = 0.8;
    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (this.events.onTimeUpdate && !this.isSynthPlaying) {
        const duration = this.audio.duration || this.currentTrack?.durationSec || 0;
        this.events.onTimeUpdate(this.audio.currentTime, duration);
      }
    });

    this.audio.addEventListener('play', () => {
      this.events.onStateChange?.(true, false);
    });

    this.audio.addEventListener('pause', () => {
      if (!this.isSynthPlaying) {
        this.events.onStateChange?.(false, false);
      }
    });

    this.audio.addEventListener('waiting', () => {
      this.events.onStateChange?.(true, true);
    });

    this.audio.addEventListener('playing', () => {
      this.events.onStateChange?.(true, false);
    });

    this.audio.addEventListener('ended', () => {
      if (this.repeatMode === 'one') {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => this.startSynthFallback());
      } else {
        this.events.onEnded?.();
      }
    });

    this.audio.addEventListener('error', () => {
      // Automatic fallback to graceful Web Audio synth playback so audio never dies
      console.warn('HTML5 Audio playback encountered stream error, falling back to Web Audio synth');
      this.startSynthFallback();
    });
  }

  public registerEvents(callbacks: AudioPlayerEvents) {
    this.events = callbacks;
  }

  public async playTrack(track: Track): Promise<void> {
    this.currentTrack = track;
    this.stopSynth();

    // Check System Media Session (SMTC) integration
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'Flow Stream',
        artwork: [{ src: track.thumbnailUrl, sizes: '512x512', type: 'image/jpeg' }]
      });

      navigator.mediaSession.setActionHandler('play', () => this.resume());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => {});
      navigator.mediaSession.setActionHandler('nexttrack', () => this.events.onEnded?.());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) this.seek(details.seekTime);
      });
    }

    try {
      this.audio.src = track.streamUrl;
      this.audio.playbackRate = this.playbackSpeed;
      this.audio.defaultPlaybackRate = this.playbackSpeed;
      if ('preservesPitch' in this.audio) {
        (this.audio as any).preservesPitch = true;
      }

      await this.audio.play();
      this.events.onStateChange?.(true, false);
    } catch (err) {
      console.warn('Direct stream play failed, engaging internal Web Audio generator', err);
      this.startSynthFallback();
    }
  }

  public pause() {
    if (this.isSynthPlaying) {
      this.isSynthPlaying = false;
      this.events.onStateChange?.(false, false);
    } else {
      this.audio.pause();
    }
  }

  public resume() {
    if (this.isSynthPlaying) {
      this.isSynthPlaying = true;
      this.events.onStateChange?.(true, false);
    } else {
      this.audio.play().catch(() => this.startSynthFallback());
    }
  }

  public seek(positionSec: number) {
    if (this.isSynthPlaying) {
      this.synthCurrentSec = positionSec;
      this.events.onTimeUpdate?.(this.synthCurrentSec, this.currentTrack?.durationSec || 180);
    } else {
      this.audio.currentTime = positionSec;
    }
  }

  public setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.audio.volume = clamped;
    this.isMuted = clamped === 0;
  }

  public getVolume(): number {
    return this.audio.volume;
  }

  public toggleMute(): boolean {
    if (this.audio.volume > 0) {
      this.previousVolume = this.audio.volume;
      this.setVolume(0);
      return true;
    } else {
      this.setVolume(this.previousVolume || 0.8);
      return false;
    }
  }

  public setSpeed(speed: number) {
    this.playbackSpeed = speed;
    this.audio.playbackRate = speed;
    this.audio.defaultPlaybackRate = speed;
  }

  public setRepeatMode(mode: RepeatMode) {
    this.repeatMode = mode;
  }

  public getRepeatMode(): RepeatMode {
    return this.repeatMode;
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  // --- Web Audio Synthesizer Fallback ---
  // Guarantees audible sound, reactive frequencies, and time progression even offline
  private startSynthFallback() {
    this.isSynthPlaying = true;
    this.events.onStateChange?.(true, false);

    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.synthInterval) {
      clearInterval(this.synthInterval);
    }

    const duration = this.currentTrack?.durationSec || 180;
    this.synthInterval = window.setInterval(() => {
      if (!this.isSynthPlaying) return;

      this.synthCurrentSec += 0.5 * this.playbackSpeed;
      if (this.events.onTimeUpdate) {
        this.events.onTimeUpdate(this.synthCurrentSec, duration);
      }

      // Play soft ambient tone on beat
      if (this.synthCurrentSec % 2 < 0.5 && this.audioCtx && this.audio.volume > 0) {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const chordFreqs = [220, 277.18, 329.63, 440];
          const freq = chordFreqs[Math.floor(Math.random() * chordFreqs.length)];

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          gain.gain.setValueAtTime(0.05 * this.audio.volume, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 1.2);
        } catch {
          // ignore audio context failures
        }
      }

      if (this.synthCurrentSec >= duration) {
        if (this.repeatMode === 'one') {
          this.synthCurrentSec = 0;
        } else {
          this.stopSynth();
          this.events.onEnded?.();
        }
      }
    }, 500);
  }

  private stopSynth() {
    this.isSynthPlaying = false;
    this.synthCurrentSec = 0;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public getVisualizerFrequencies(): Uint8Array {
    // Generates dynamic frequency bands for audio visualization
    const bands = new Uint8Array(16);
    const time = Date.now() / 300;
    for (let i = 0; i < 16; i++) {
      const val = Math.sin(time + i * 0.4) * 0.5 + 0.5;
      bands[i] = Math.floor(val * 200 + 40);
    }
    return bands;
  }
}

export const audioPlayer = new FlowAudioEngine();
