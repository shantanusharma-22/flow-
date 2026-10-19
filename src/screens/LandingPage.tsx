import React, { useState } from 'react';
import { ScreenId } from '../types';

interface LandingPageProps {
  onNavigate: (screen: ScreenId) => void;
  onLaunchPlayer?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLaunchPlayer }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleCta = () => {
    if (onLaunchPlayer) {
      onLaunchPlayer();
    } else {
      onNavigate('home');
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Can I import my existing Spotify or YouTube Music playlists?',
      a: 'Yes. Flow includes a built-in 1-click importer that accepts public playlist links or standard .m3u8 playlist files, instantly populating your local collection without requiring cloud credentials.'
    },
    {
      q: 'Do I need to create an account or sign in?',
      a: 'No! You can launch Flow, search millions of tracks, build local playlists, and export lyrics without ever typing an email address or password. Your library stays private on your machine.'
    },
    {
      q: 'Does Flow support offline playback?',
      a: 'Yes. Any cached track or downloaded audio file can be played offline without an active internet connection. You can also inspect and prune cached songs track-by-track.'
    },
    {
      q: 'How does the Romanized lyrics toggle work?',
      a: 'When playing tracks in Japanese, Korean, or Mandarin, Flow automatically computes phonetic Latin transcriptions (Romaji, Hangul, Pinyin) so you can sing along in real time even if you cannot read the native script.'
    },
    {
      q: 'What platforms are supported?',
      a: 'Flow runs natively with responsive HiDPI windowing on Windows 10/11 (x64/ARM64), macOS 12+ (Apple Silicon and Intel), and Linux (AppImage, deb, rpm).'
    }
  ];

  return (
    <div style={{
      minHeight: '100%',
      backgroundColor: 'var(--color-bg, #080b12)',
      color: 'var(--color-text, #f8fafc)',
      padding: '40px 24px 80px 24px',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 32,
          borderBottom: '1px solid var(--color-border, #1f293d)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#080b12',
              fontWeight: 800,
              fontSize: 18
            }}>
              F
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>Flow</span>
            <span style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 12,
              background: 'rgba(0, 229, 255, 0.1)',
              color: 'var(--color-accent, #00e5ff)',
              fontWeight: 600,
              border: '1px solid rgba(0, 229, 255, 0.2)'
            }}>
              Desktop Audio
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted, #94a3b8)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'color 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text, #f8fafc)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted, #94a3b8)')}
            >
              Open Web Player
            </button>
            <button
              onClick={handleCta}
              style={{
                background: 'linear-gradient(135deg, var(--color-accent, #00e5ff) 0%, var(--color-glow, #38bdf8) 100%)',
                color: '#080b12',
                border: 'none',
                borderRadius: 8,
                padding: '8px 18px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.25)';
              }}
            >
              Launch Flow
            </button>
          </div>
        </header>

        {/* SECTION 1: HERO */}
        <section style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 64 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            color: 'var(--color-accent, #00e5ff)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: 20
          }}>
            <span>✨</span> DESKTOP-FIRST AUDIO STREAMING
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1.2px',
            margin: '0 0 20px 0',
            background: 'linear-gradient(180deg, #ffffff 40%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Stream effortlessly.<br />
            Sing along in any language.
          </h1>

          <p style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: 'var(--color-text-muted, #94a3b8)',
            maxWidth: 680,
            margin: '0 auto 36px auto'
          }}>
            The fluid desktop player with zero-login local playlists, real-time Romanized lyrics,
            and granular offline control that respects your local disk.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={handleCta}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'linear-gradient(135deg, var(--color-accent, #00e5ff) 0%, var(--color-glow, #38bdf8) 100%)',
                color: '#080b12',
                border: 'none',
                borderRadius: 10,
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
            >
              <span>Download Flow Free</span>
              <span style={{ fontSize: 18 }}>↓</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--color-text, #f8fafc)',
                border: '1px solid var(--color-border, #1f293d)',
                borderRadius: 10,
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.borderColor = 'var(--color-border-input, #64748b)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'var(--color-border, #1f293d)';
              }}
            >
              <span>Explore Web Player</span>
              <span>→</span>
            </button>
          </div>

          <p style={{
            fontSize: 13,
            color: 'var(--color-text-muted, #94a3b8)',
            marginTop: 16
          }}>
            Available for Windows 10/11, macOS & Linux • Zero ads • Zero telemetry
          </p>

          {/* Product Showcase Window Mockup */}
          <div style={{
            marginTop: 48,
            borderRadius: 16,
            background: 'var(--color-surface, #111827)',
            border: '1px solid var(--color-border, #1f293d)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 229, 255, 0.1)',
            overflow: 'hidden',
            textAlign: 'left'
          }}>
            {/* Window Titlebar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 18px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid var(--color-border, #1f293d)',
              gap: 8
            }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fb7185', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--color-text-muted, #94a3b8)', fontWeight: 500 }}>
                Flow — Midnight City • Synced Bilingual Lyrics
              </span>
            </div>

            {/* Mockup Preview Area */}
            <div style={{
              padding: '32px 28px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
              background: 'radial-gradient(circle at top right, rgba(168, 85, 247, 0.15) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(0, 229, 255, 0.12) 0%, transparent 60%)'
            }}>
              <div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--color-accent, #00e5ff)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: 8
                }}>
                  Now Playing
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px 0' }}>Midnight City</h3>
                <p style={{ fontSize: 15, color: 'var(--color-text-muted, #94a3b8)', margin: '0 0 24px 0' }}>M83 • Hurry Up, We're Dreaming</p>

                {/* Scrubber Preview */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    background: 'var(--color-border, #1f293d)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '42%',
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-accent, #00e5ff), var(--color-glow, #38bdf8))'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-muted, #94a3b8)', marginTop: 6 }}>
                    <span>01:42</span>
                    <span>04:03</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(52, 211, 153, 0.12)',
                    color: '#34d399',
                    fontWeight: 600
                  }}>
                    Lossless FLAC 1411 kbps
                  </span>
                  <span style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(168, 85, 247, 0.12)',
                    color: '#a855f7',
                    fontWeight: 600
                  }}>
                    Dual-Buffer Handover
                  </span>
                </div>
              </div>

              {/* Lyrics Panel Preview */}
              <div style={{
                background: 'rgba(8, 11, 18, 0.65)',
                borderRadius: 12,
                padding: '20px',
                border: '1px solid var(--color-border, #1f293d)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text, #f8fafc)' }}>Synchronized Lyrics</span>
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'var(--color-accent, #00e5ff)',
                    color: '#080b12',
                    fontWeight: 700
                  }}>
                    Romaji ON
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                  <div style={{ color: 'var(--color-text-muted, #94a3b8)', opacity: 0.5 }}>Waiting in a car</div>
                  <div style={{
                    color: 'var(--color-accent, #00e5ff)',
                    fontWeight: 700,
                    fontSize: 16,
                    textShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
                  }}>
                    Waiting for a ride in the dark
                    <div style={{ fontSize: 12, color: 'var(--color-violet, #a855f7)', fontWeight: 500, marginTop: 2 }}>
                      [ kuruma no naka de matteiru ]
                    </div>
                  </div>
                  <div style={{ color: 'var(--color-text-muted, #94a3b8)', opacity: 0.7 }}>The night city grows</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE PROBLEM */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>The Problem with Desktop Streaming</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: 0 }}>
              Why listening to music on a computer has become frustrating and fragile.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px 0', color: '#fb7185' }}>
                Sluggish Mobile Ports & Mid-Track Freezes
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Most modern desktop music players are clumsy mobile web wrappers. They consume gigabytes of memory,
                freeze when switching bitrates, and crash when internal webview logins fail. On high-DPI displays,
                windows overflow screen boundaries and buttons disappear.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>🔒</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px 0', color: '#fb7185' }}>
                Locked-In Clouds & All-or-Nothing Cache Wipes
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Want to make a playlist without surrendering personal cloud account credentials? Impossible.
                Want to save timestamped lyrics for your car stereo or offline DAP? Blocked.
                And when your drive runs low on storage, you're forced to nuke your entire cache rather than
                removing the tracks you no longer want.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>How Flow Works</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: 0 }}>
              Three effortless steps from search to sound.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 14,
                fontWeight: 800,
                color: 'var(--color-accent, #00e5ff)',
                opacity: 0.5
              }}>
                01
              </div>
              <div style={{ fontSize: 28, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Discover Freely</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Search any song, artist, or album instantly. Zero registration walls, no login prompts, and zero tracking cookies.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 14,
                fontWeight: 800,
                color: 'var(--color-accent, #00e5ff)',
                opacity: 0.5
              }}>
                02
              </div>
              <div style={{ fontSize: 28, marginBottom: 16 }}>🌊</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Listen in Flow</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Enjoy ultra-low latency dual-buffer streaming, dynamic album art bloom, and syllable-accurate lyrics with instant phonetic Romanization.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 14,
                fontWeight: 800,
                color: 'var(--color-accent, #00e5ff)',
                opacity: 0.5
              }}>
                03
              </div>
              <div style={{ fontSize: 28, marginBottom: 16 }}>💾</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Control & Keep Local</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Build custom playlists on your local disk, export .lrc and .m3u8 files with one click, and selectively prune cached songs by megabyte.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: FEATURES / FIXES */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>Features Built from Real Listening Demands</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: 0 }}>
              We solved the missing capabilities power listeners asked for.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 12,
              padding: '24px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🔤</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Phonetic Romanization & Dual Lyrics
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Sing along to Japanese, Korean, and non-Latin songs effortlessly. Toggle instant Romaji/Hangul transliteration with synchronized translations.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 12,
              padding: '24px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>💾</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-accent, #00e5ff)' }}>
                1-Click .lrc File Disk Export
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Save timestamped .lrc lyric files directly to your device with a single click. Ideal for car stereos, offline DAPs, and portable audio players.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 12,
              padding: '24px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>📁</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Zero-Login Local Playlists
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Create, organize, and export playlists without an account. Standard .m3u8 export ensures your playlists are never held hostage.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 12,
              padding: '24px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Resilient Dual-Buffer Audio
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Zero playback dropouts during quality transitions. External browser authentication ensures you never crash on embedded webview errors.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 12,
              padding: '24px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🧹</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Granular Selective Cache Pruning
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Inspect exact track sizes in megabytes and remove individual cached files. Never wipe your entire music library just to free a few gigabytes.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 12,
              padding: '24px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🔂</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Dedicated Repeat-One & Tempo
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Dedicated 3-state loop button (Off / All / One) plus a 0.5x to 2.0x playback speed slider with independent pitch preservation.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: PRICING */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>Transparent, Respectful Pricing</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: '0 0 24px 0' }}>
              Free forever for desktop playback. Upgrade only if you want multi-device cloud sync and collaborative listening.
            </p>

            {/* Billing Toggle */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--color-surface, #111827)',
              padding: 4,
              borderRadius: 10,
              border: '1px solid var(--color-border, #1f293d)',
              gap: 4
            }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  background: billingCycle === 'monthly' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: billingCycle === 'monthly' ? '#f8fafc' : '#94a3b8',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                style={{
                  background: billingCycle === 'annual' ? 'var(--color-accent, #00e5ff)' : 'transparent',
                  color: billingCycle === 'annual' ? '#080b12' : '#94a3b8',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>Annual</span>
                <span style={{
                  fontSize: 10,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: billingCycle === 'annual' ? '#080b12' : 'var(--color-accent, #00e5ff)',
                  color: billingCycle === 'annual' ? '#00e5ff' : '#080b12',
                  fontWeight: 800
                }}>
                  2 MO FREE
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {/* Tier 1: Free */}
            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 16,
              padding: '32px',
              border: '1px solid var(--color-border, #1f293d)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: 8 }}>
                Free Listener
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px 0' }}>$0</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted, #94a3b8)', margin: '0 0 24px 0' }}>
                For everyday music fans who want a fast, clutter-free desktop player.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Unlimited desktop streaming</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Syllable-synced lyrics with Romaji</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Zero-login local playlists & M3U8</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> 1-click .lrc timestamped export</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Granular cache pruner in MB</li>
              </ul>
              <button
                onClick={handleCta}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid var(--color-border, #1f293d)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Download Free Forever
              </button>
            </div>

            {/* Tier 2: Pro */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(0, 229, 255, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)',
              borderRadius: 16,
              padding: '32px',
              border: '2px solid var(--color-accent, #00e5ff)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 0 35px rgba(0, 229, 255, 0.15)'
            }}>
              <div style={{
                position: 'absolute',
                top: -12,
                right: 24,
                background: 'var(--color-accent, #00e5ff)',
                color: '#080b12',
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 10px',
                borderRadius: 10,
                letterSpacing: '0.5px'
              }}>
                MOST POPULAR
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent, #00e5ff)', textTransform: 'uppercase', marginBottom: 8 }}>
                Pro Explorer
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px 0' }}>
                {billingCycle === 'annual' ? '$29' : '$3.99'}
                <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-muted, #94a3b8)' }}>
                  {billingCycle === 'annual' ? ' / year' : ' / month'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted, #94a3b8)', margin: '0 0 24px 0' }}>
                For multi-device listeners who stream across workstations and share music.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> <strong>Everything in Free</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Encrypted cloud playlist sync</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Shared Listen-Together rooms</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Multi-workstation queue handoff</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Priority lyrics provider API</li>
              </ul>
              <button
                onClick={handleCta}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  background: 'var(--color-accent, #00e5ff)',
                  color: '#080b12',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                }}
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Tier 3: Lifetime */}
            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 16,
              padding: '32px',
              border: '1px solid var(--color-border, #1f293d)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-violet, #a855f7)', textTransform: 'uppercase', marginBottom: 8 }}>
                Lifetime Patron
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px 0' }}>$39</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted, #94a3b8)', margin: '0 0 24px 0' }}>
                For loyal supporters who want perpetual access with zero recurring subscriptions.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> <strong>Everything in Pro forever</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Perpetual updates (all future versions)</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Early access alpha channel</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> Founder Discord role & badge</li>
                <li style={{ display: 'flex', gap: 8 }}><span>✓</span> 100% DRM-free personal license</li>
              </ul>
              <button
                onClick={handleCta}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: 'var(--color-violet, #a855f7)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Get Lifetime License
              </button>
            </div>
          </div>

          <div style={{
            marginTop: 32,
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--color-text-muted, #94a3b8)',
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            flexWrap: 'wrap'
          }}>
            <span>🔒 1-click cancel anytime</span>
            <span>📩 7-day advance annual renewal notice</span>
            <span>🚫 Zero telemetry & no hidden fees</span>
          </div>
        </section>

        {/* SECTION 6: FAQ */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: 0 }}>
              Honest answers to common questions about Flow.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760, margin: '0 auto' }}>
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--color-surface, #111827)',
                    borderRadius: 12,
                    border: '1px solid var(--color-border, #1f293d)',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text, #f8fafc)',
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: 'var(--color-accent, #00e5ff)',
                      fontSize: 14
                    }}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 20px 20px 20px',
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: 'var(--color-text-muted, #94a3b8)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 7: FINAL CTA */}
        <section style={{
          textAlign: 'center',
          padding: '64px 32px',
          borderRadius: 20,
          background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.15) 0%, rgba(17, 24, 39, 0.95) 70%)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          boxShadow: '0 0 50px rgba(0, 229, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, margin: '0 0 16px 0' }}>
            Ready to get into the flow?
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--color-text-muted, #94a3b8)',
            maxWidth: 540,
            margin: '0 auto 32px auto'
          }}>
            Download the player in seconds. No credit card required, zero telemetry, and zero mandatory cloud accounts.
          </p>

          <button
            onClick={handleCta}
            style={{
              background: 'linear-gradient(135deg, var(--color-accent, #00e5ff) 0%, var(--color-glow, #38bdf8) 100%)',
              color: '#080b12',
              border: 'none',
              borderRadius: 10,
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
          >
            Launch Flow Player Now
          </button>
        </section>

        {/* Footer */}
        <footer style={{
          marginTop: 64,
          paddingTop: 32,
          borderTop: '1px solid var(--color-border, #1f293d)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: 13,
          color: 'var(--color-text-muted, #94a3b8)'
        }}>
          <div>
            © 2026 Flow Audio. Built for listeners.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Privacy Promise</span>
            <span>Documentation</span>
            <span>Release Notes</span>
            <span style={{ cursor: 'pointer', color: 'var(--color-accent, #00e5ff)' }} onClick={() => onNavigate('home')}>
              Web Player
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
};
