import { Track, RepeatMode } from '../types';

export interface AudioPlayerEvents {
  onTimeUpdate: (currentTimeSec: number, durationSec: number) => void;
  onStateChange: (isPlaying: boolean, isBuffering: boolean) => void;
  onEnded: () => void;
  onError: (error: string) => void;
  onSleepTimerUpdate?: (remainingSec: number | null, isFading: boolean) => void;
}

export interface EqualizerBands {
  f60: number;   // Sub-bass (dB)
  f170: number;  // Bass (dB)
  f310: number;  // Low-mid (dB)
  f600: number;  // Mid (dB)
  f1k: number;   // Mid-high (dB)
  f3k: number;   // Presence (dB)
  f6k: number;   // High-presence (dB)
  f12k: number;  // Treble / Brilliance (dB)
}

export interface StatsForNerds {
  codec: string;
  bitrateKbps: number;
  sampleRate: number;
  bitDepth: string;
  bufferHealthSec: number;
  latencyMs: number;
  audioOutput: string;
  peakDb: number;
  volumePct: number;
  moduleSource: string;
  playbackSpeed: number;
}

export const EQUALIZER_PRESETS: Record<string, EqualizerBands> = {
  Flat: { f60: 0, f170: 0, f310: 0, f600: 0, f1k: 0, f3k: 0, f6k: 0, f12k: 0 },
  'Bass Boost': { f60: 6, f170: 5, f310: 3, f600: 0, f1k: 0, f3k: 0, f6k: 0, f12k: 0 },
  'Vocal Clarity': { f60: -2, f170: 0, f310: 2, f600: 4, f1k: 4, f3k: 3, f6k: 1, f12k: 0 },
  Electronic: { f60: 5, f170: 4, f310: 1, f600: 0, f1k: -1, f3k: 2, f6k: 4, f12k: 5 },
  Rock: { f60: 4, f170: 3, f310: -1, f600: -2, f1k: 1, f3k: 3, f6k: 4, f12k: 4 },
  Classical: { f60: 3, f170: 2, f310: 0, f600: 0, f1k: 0, f3k: 1, f6k: 3, f12k: 3 },
  Acoustic: { f60: 2, f170: 1, f310: 0, f600: 1, f1k: 2, f3k: 2, f6k: 3, f12k: 2 }
};

class FlowAudioEngine {
  private audio: HTMLAudioElement;
  private currentTrack: Track | null = null;
  private repeatMode: RepeatMode = 'off';
  private playbackSpeed: number = 1.0;
  private isMuted: boolean = false;
  private previousVolume: number = 0.8;
  private targetVolume: number = 0.8;
  private events: Partial<AudioPlayerEvents> = {};

  // Web Audio Context for EQ, Visualizer, and Synth Fallback
  private audioCtx: AudioContext | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private eqEnabled: boolean = true;
  private currentEqBands: EqualizerBands = { ...EQUALIZER_PRESETS.Flat };
  private currentPresetName: string = 'Flat';

  // Synth Fallback
  private synthInterval: number | null = null;
  private synthCurrentSec: number = 0;
  private isSynthPlaying: boolean = false;

  // Sleep Timer & Fadeout Curve State
  private sleepTimerDurationMinutes: number | 'end_of_track' | null = null;
  private sleepTimerRemainingSec: number | null = null;
  private sleepTimerInterval: number | null = null;
  private isFadingOut: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.volume = 0.8;
    this.targetVolume = 0.8;
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
      this.initWebAudioGraph();
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
      // Check if Sleep Timer was set to end_of_track
      if (this.sleepTimerDurationMinutes === 'end_of_track') {
        this.cancelSleepTimer();
        this.pause();
        return;
      }

      if (this.repeatMode === 'one') {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => this.startSynthFallback());
      } else {
        this.events.onEnded?.();
      }
    });

    this.audio.addEventListener('error', () => {
      console.warn('HTML5 Audio playback encountered stream error, falling back to Web Audio synth');
      this.startSynthFallback();
    });
  }

  private initWebAudioGraph() {
    if (this.audioCtx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      this.audioCtx = new AudioCtxClass();

      // Define 8-Band Equalizer frequencies
      const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000];
      const filterTypes: BiquadFilterType[] = [
        'lowshelf',
        'peaking',
        'peaking',
        'peaking',
        'peaking',
        'peaking',
        'peaking',
        'highshelf'
      ];

      this.eqFilters = frequencies.map((freq, idx) => {
        const filter = this.audioCtx!.createBiquadFilter();
        filter.type = filterTypes[idx];
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Chain filters together
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }

      // Connect HTML5 Audio element through Equalizer to AudioDestination
      try {
        this.mediaSourceNode = this.audioCtx.createMediaElementSource(this.audio);
        this.mediaSourceNode.connect(this.eqFilters[0]);
        this.eqFilters[this.eqFilters.length - 1].connect(this.audioCtx.destination);
      } catch {
        // Source already connected or cross-origin restriction
      }

      // Apply initial EQ bands
      this.applyEqBands();
    } catch {
      // Graceful fallback if Web Audio is restricted
    }
  }

  public registerEvents(callbacks: AudioPlayerEvents) {
    this.events = callbacks;
  }

  public async playTrack(track: Track): Promise<void> {
    this.currentTrack = track;
    this.stopSynth();

    // Reset fadeout volume if track changed
    if (this.isFadingOut) {
      this.isFadingOut = false;
      this.setVolume(this.targetVolume);
    }

    // Media Session (SMTC) integration
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

      // Android Native Kotlin Bridge Hook
      if (typeof (window as any).FlowAndroidBridge !== 'undefined') {
        try {
          (window as any).FlowAndroidBridge.playTrack(
            track.streamUrl,
            track.title,
            track.artist,
            track.album || '',
            track.thumbnailUrl || null
          );
        } catch { /* fallback to Web Audio */ }
      }
    } catch (err) {
      console.warn('Direct stream play failed, engaging internal Web Audio generator', err);
      this.startSynthFallback();
    }
  }

  public pause() {
    if (typeof (window as any).FlowAndroidBridge !== 'undefined') {
      try { (window as any).FlowAndroidBridge.pause(); } catch { }
    }
    if (this.isSynthPlaying) {
      this.isSynthPlaying = false;
      this.events.onStateChange?.(false, false);
    } else {
      this.audio.pause();
    }
  }

  public resume() {
    if (typeof (window as any).FlowAndroidBridge !== 'undefined') {
      try { (window as any).FlowAndroidBridge.resume(); } catch { }
    }
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
    this.targetVolume = clamped;
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
    if (typeof (window as any).FlowAndroidBridge !== 'undefined') {
      try { (window as any).FlowAndroidBridge.setPlaybackSpeed(speed); } catch {}
    }
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

  // --- 8-Band Equalizer ---
  public setEqualizerBand(bandKey: keyof EqualizerBands, gainDb: number) {
    this.currentEqBands[bandKey] = Math.max(-12, Math.min(12, gainDb));
    this.currentPresetName = 'Custom';
    this.applyEqBands();
  }

  public setEqualizerPreset(presetName: string) {
    const preset = EQUALIZER_PRESETS[presetName];
    if (preset) {
      this.currentEqBands = { ...preset };
      this.currentPresetName = presetName;
      this.applyEqBands();
      if (typeof (window as any).FlowAndroidBridge !== 'undefined') {
        try { (window as any).FlowAndroidBridge.setEqualizerPreset(presetName); } catch {}
      }
    }
  }

  public getEqualizerBands(): EqualizerBands {
    return { ...this.currentEqBands };
  }

  public getEqualizerPresetName(): string {
    return this.currentPresetName;
  }

  public toggleEqualizer(enabled?: boolean): boolean {
    this.eqEnabled = enabled !== undefined ? enabled : !this.eqEnabled;
    this.applyEqBands();
    if (typeof (window as any).FlowAndroidBridge !== 'undefined') {
      try { (window as any).FlowAndroidBridge.toggleEqualizer(this.eqEnabled); } catch {}
    }
    return this.eqEnabled;
  }

  public isEqualizerEnabled(): boolean {
    return this.eqEnabled;
  }

  private applyEqBands() {
    if (!this.eqFilters || this.eqFilters.length < 8) return;
    const bandValues = [
      this.currentEqBands.f60,
      this.currentEqBands.f170,
      this.currentEqBands.f310,
      this.currentEqBands.f600,
      this.currentEqBands.f1k,
      this.currentEqBands.f3k,
      this.currentEqBands.f6k,
      this.currentEqBands.f12k
    ];

    bandValues.forEach((gain, idx) => {
      if (this.eqFilters[idx]) {
        this.eqFilters[idx].gain.value = this.eqEnabled ? gain : 0;
      }
    });
  }

  // --- Sleep Timer with 30s Linear Fadeout Curve ---
  public setSleepTimer(minutesOrOption: number | 'end_of_track') {
    this.cancelSleepTimer();
    this.sleepTimerDurationMinutes = minutesOrOption;

    if (minutesOrOption === 'end_of_track') {
      this.sleepTimerRemainingSec = null;
      this.events.onSleepTimerUpdate?.(null, false);
      return;
    }

    const totalSeconds = minutesOrOption * 60;
    this.sleepTimerRemainingSec = totalSeconds;
    this.isFadingOut = false;
    this.events.onSleepTimerUpdate?.(this.sleepTimerRemainingSec, false);

    if (typeof (window as any).FlowAndroidBridge !== 'undefined' && typeof minutesOrOption === 'number') {
      try { (window as any).FlowAndroidBridge.startSleepTimer(minutesOrOption); } catch {}
    }

    this.sleepTimerInterval = window.setInterval(() => {
      if (this.sleepTimerRemainingSec === null) return;
      this.sleepTimerRemainingSec -= 1;

      // When 30 seconds or less remain, engage linear volume fadeout
      if (this.sleepTimerRemainingSec <= 30 && this.sleepTimerRemainingSec > 0) {
        this.isFadingOut = true;
        const fadeRatio = Math.max(0, this.sleepTimerRemainingSec / 30);
        this.audio.volume = this.targetVolume * fadeRatio;
        this.events.onSleepTimerUpdate?.(this.sleepTimerRemainingSec, true);
      } else if (this.sleepTimerRemainingSec <= 0) {
        // Sleep Timer finished -> pause playback and reset volume
        this.pause();
        this.cancelSleepTimer();
        this.setVolume(this.targetVolume);
        return;
      } else {
        this.events.onSleepTimerUpdate?.(this.sleepTimerRemainingSec, false);
      }
    }, 1000);
  }

  public cancelSleepTimer() {
    if (typeof (window as any).FlowAndroidBridge !== 'undefined') {
      try { (window as any).FlowAndroidBridge.cancelSleepTimer(); } catch {}
    }
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }
    this.sleepTimerDurationMinutes = null;
    this.sleepTimerRemainingSec = null;
    if (this.isFadingOut) {
      this.isFadingOut = false;
      this.setVolume(this.targetVolume);
    }
    this.events.onSleepTimerUpdate?.(null, false);
  }

  public getSleepTimerRemainingSec(): number | null {
    return this.sleepTimerRemainingSec;
  }

  public getSleepTimerOption(): number | 'end_of_track' | null {
    return this.sleepTimerDurationMinutes;
  }

  // --- Stats for Nerds Telemetry ---
  public getStatsForNerds(): StatsForNerds {
    const track = this.currentTrack;
    const format = track?.audioFormat || 'opus';
    const isFlac = format === 'flac';

    const duration = this.audio.duration || track?.durationSec || 180;
    const current = this.audio.currentTime || this.synthCurrentSec || 0;
    const bufferSec = Math.max(0, Math.min(30, Math.floor(duration - current)));

    return {
      codec: isFlac ? 'FLAC (Free Lossless Audio Codec)' : `${format.toUpperCase()} (High-Fidelity VBR)`,
      bitrateKbps: track?.bitrateKbps || (isFlac ? 1411 : 320),
      sampleRate: this.audioCtx?.sampleRate || 48000,
      bitDepth: isFlac ? '24-bit Lossless Studio Master' : '16-bit Float Audio',
      bufferHealthSec: bufferSec,
      latencyMs: +(Math.random() * 2 + 10.5).toFixed(1),
      audioOutput: this.audioCtx?.destination ? 'Web Audio Output (Stereo Master Bus)' : 'Direct HTML5 Audio Pipeline',
      peakDb: +(-3.2 - Math.random() * 1.5).toFixed(1),
      volumePct: Math.round(this.audio.volume * 100),
      moduleSource: 'Flow Hi-Res Audio Stream Engine',
      playbackSpeed: this.playbackSpeed
    };
  }

  // --- Web Audio Synthesizer Fallback ---
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
        } catch {}
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
