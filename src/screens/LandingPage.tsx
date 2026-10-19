import React, { useState } from 'react';
import { ScreenId } from '../types';

interface LandingPageProps {
  onNavigate: (screen: ScreenId) => void;
  onLaunchPlayer?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLaunchPlayer }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleLaunchWebPlayer = () => {
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
      q: 'Can I use Flow directly in my web browser without installing anything?',
      a: 'Yes! Flow is a full Progressive Web App (PWA). You can launch the Web Player immediately on Chrome, Safari, Edge, or Firefox. All features—including synchronized lyrics, Romaji transliteration, and local playlists—work directly in your browser without requiring an install or sign-in.'
    },
    {
      q: 'Is Flow really 100% free on Google Play, the Website, Microsoft Store, and Mac App Store?',
      a: 'Yes! Flow is 100% free ($0.00) across all platforms: Google Play, the official website, the Microsoft Store, and the Mac App Store. There are no subscriptions, no in-app purchases, and no advertisements.'
    },
    {
      q: 'Does Flow on Android support background playback and DAPs?',
      a: 'Yes! Unlike commercial streaming apps, Flow on Android includes free background playback with screen turned off. It also uses external browser authentication to ensure seamless compatibility with dedicated Android DAPs (HiBy, FiiO, Sony Walkman).'
    },
    {
      q: 'Does the web version support media keys and keyboard shortcuts?',
      a: 'Yes. Flow integrates natively with the browser Media Session API. You can play, pause, seek, and skip using your physical keyboard media keys, headphone controls, and OS notification popups.'
    },
    {
      q: 'Can I import my existing Spotify or YouTube Music playlists on the web?',
      a: 'Yes. The web app includes our 1-click importer that accepts public playlist links or standard .m3u8 files, saving them into your browser’s secure local storage without needing your account credentials.'
    },
    {
      q: 'Does the web version support offline listening?',
      a: 'Yes! When installed as a PWA, Flow leverages client-side storage to cache downloaded audio files and timestamped lyrics so you can keep listening even during network drops.'
    },
    {
      q: 'How does the Romanized lyrics transliteration work?',
      a: 'When playing tracks in Japanese, Korean, or Mandarin, Flow automatically computes phonetic Latin transcriptions (Romaji, Hangul, Pinyin) so you can sing along in real time even if you cannot read the native characters.'
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
              background: 'rgba(52, 211, 153, 0.12)',
              color: 'var(--color-success, #34d399)',
              fontWeight: 700,
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}>
              Free Web & Desktop
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontSize: 13,
              color: 'var(--color-text-muted, #94a3b8)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              Web Engine Online
            </span>
            <button
              onClick={handleLaunchWebPlayer}
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
              Launch Web Player
            </button>
          </div>
        </header>

        {/* SECTION 1: HERO */}
        <section style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 64 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: 'var(--color-success, #34d399)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: 20
          }}>
            <span>🌐</span> 100% FREE ON GOOGLE PLAY • WEB • MICROSOFT STORE • MAC APP STORE
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
            The fluid desktop and web music player with zero-login local playlists, real-time Romanized lyrics,
            and granular offline control that respects your local disk. 100% free everywhere.
          </p>

          {/* Action CTAs: Web + Native Stores */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            {/* Primary Web Player CTA */}
            <button
              onClick={handleLaunchWebPlayer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'linear-gradient(135deg, var(--color-accent, #00e5ff) 0%, var(--color-glow, #38bdf8) 100%)',
                color: '#080b12',
                border: 'none',
                borderRadius: 10,
                padding: '14px 26px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 229, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.35)';
              }}
            >
              <span style={{ fontSize: 18 }}>▶</span>
              <span>Launch Web Player (Instant)</span>
            </button>

            {/* Microsoft Store Button */}
            <button
              onClick={handleLaunchWebPlayer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'var(--color-text, #f8fafc)',
                border: '1px solid var(--color-border-input, #64748b)',
                borderRadius: 10,
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent, #00e5ff)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-input, #64748b)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: 20 }}>🪟</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--color-text-muted, #94a3b8)' }}>Get it on</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Microsoft Store</div>
              </div>
            </button>

            {/* Mac App Store Button */}
            <button
              onClick={handleLaunchWebPlayer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'var(--color-text, #f8fafc)',
                border: '1px solid var(--color-border-input, #64748b)',
                borderRadius: 10,
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent, #00e5ff)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-input, #64748b)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: 20 }}>🍎</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--color-text-muted, #94a3b8)' }}>Download on the</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Mac App Store</div>
              </div>
            </button>

            {/* Google Play Button */}
            <button
              onClick={handleLaunchWebPlayer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'var(--color-text, #f8fafc)',
                border: '1px solid var(--color-border-input, #64748b)',
                borderRadius: 10,
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent, #00e5ff)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-input, #64748b)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: 20 }}>🤖</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--color-text-muted, #94a3b8)' }}>Get it on</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Google Play</div>
              </div>
            </button>
          </div>

          <p style={{
            fontSize: 13,
            color: 'var(--color-text-muted, #94a3b8)',
            marginTop: 18
          }}>
            Zero install required • Zero audio ads • Zero subscriptions • Zero telemetry
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
                Flow Web & Desktop — M83 • Midnight City (Synced Bilingual Lyrics)
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
                  Now Playing in Browser
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
                    background: 'rgba(0, 229, 255, 0.12)',
                    color: '#00e5ff',
                    fontWeight: 600
                  }}>
                    PWA Ready
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

        {/* SECTION 2: WEB & DESKTOP HIGHLIGHTS */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>Listen on Any Device, Anywhere</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: 0 }}>
              Zero-install web streaming or native desktop integration with one shared local-first philosophy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>⚡</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Instant Browser Playback (Zero Install)
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Jump straight into your music. Open Flow on Chrome, Edge, Safari, or Firefox without downloading any executable.
                Streams gaplessly and caches lyrics locally with zero account walls.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>📱</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Installable Progressive Web App (PWA)
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Install Flow directly to your desktop, taskbar, or home screen in one click. Enjoy a standalone window experience
                with native keyboard media controls via the Web Media Session API.
              </p>
            </div>

            <div style={{
              background: 'var(--color-surface, #111827)',
              borderRadius: 14,
              padding: '28px',
              border: '1px solid var(--color-border, #1f293d)'
            }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>💾</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px 0', color: 'var(--color-accent, #00e5ff)' }}>
                Offline Storage & 1-Click Exports
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Save playlists directly into your browser's persistent IndexedDB or export standard .m3u8 and timestamped .lrc files
                straight to your hard drive with zero server storage.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURES / FIXES */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>Core Features & Power Controls</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: 0 }}>
              Built specifically for listeners who want clarity, control, and zero friction.
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
                Inspect exact track sizes in megabytes and remove individual cached files. Never wipe your entire music library just to free space.
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

        {/* SECTION 4: 100% FREE SHOWCASE ACROSS PLATFORMS */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>100% Free Everywhere. Zero Compromises.</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: '0 auto 24px auto', maxWidth: 640 }}>
              No subscriptions, no paid upgrades, and no locked features. Stream directly on the Web or get Flow from the Microsoft Store or Mac App Store.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, rgba(52, 211, 153, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)',
            borderRadius: 20,
            padding: '40px 32px',
            border: '2px solid rgba(52, 211, 153, 0.4)',
            boxShadow: '0 0 40px rgba(52, 211, 153, 0.12)',
            maxWidth: 780,
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 24 }}>
              <div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--color-success, #34d399)',
                  letterSpacing: '0.8px'
                }}>
                  Universal Free Edition
                </span>
                <h3 style={{ fontSize: 36, fontWeight: 800, margin: '4px 0 0 0' }}>
                  $0.00 <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-muted, #94a3b8)' }}>forever</span>
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--color-border, #1f293d)' }}>
                  🤖 Google Play
                </span>
                <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--color-border, #1f293d)' }}>
                  🌐 Web App (PWA)
                </span>
                <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--color-border, #1f293d)' }}>
                  🪟 Microsoft Store
                </span>
                <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--color-border, #1f293d)' }}>
                  🍎 Mac App Store
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>Unlimited streaming on Web and Desktop</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>Real-time lyrics with Romaji toggle</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>Zero-login local playlist creation</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>1-click .lrc timestamped lyric export</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>Granular cache inspection by megabyte</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>Standard .m3u8 playlist export</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>Dedicated 3-state loop & speed slider</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--color-success, #34d399)' }}>✓</span>
                <span>Browser Media Session API integration</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 14,
              flexWrap: 'wrap',
              paddingTop: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                onClick={handleLaunchWebPlayer}
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--color-accent, #00e5ff) 0%, var(--color-glow, #38bdf8) 100%)',
                  color: '#080b12',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                }}
              >
                Web Player
              </button>
              <button
                onClick={handleLaunchWebPlayer}
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid var(--color-border, #1f293d)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Google Play
              </button>
              <button
                onClick={handleLaunchWebPlayer}
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid var(--color-border, #1f293d)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Microsoft Store
              </button>
              <button
                onClick={handleLaunchWebPlayer}
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid var(--color-border, #1f293d)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Mac App Store
              </button>
            </div>
          </div>

          <div style={{
            marginTop: 28,
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--color-text-muted, #94a3b8)',
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            flexWrap: 'wrap'
          }}>
            <span>🚫 Zero audio or banner ads</span>
            <span>🔒 Zero mandatory cloud sign-ins</span>
            <span>🛡️ Zero analytics or user tracking</span>
          </div>
        </section>

        {/* SECTION 5: FAQ */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: 16, margin: 0 }}>
              Honest answers to common questions about Flow on Web and Desktop.
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

        {/* SECTION 6: FINAL CTA */}
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
            Launch in your browser right now or install from the Microsoft Store or Mac App Store. No credit card, no ads, no sign-up wall.
          </p>

          <button
            onClick={handleLaunchWebPlayer}
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
            Launch Flow Web Player Now
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
            © 2026 Flow Audio. 100% Free & Open Web & Desktop Music Player.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Privacy Promise</span>
            <span>Documentation</span>
            <span>Release Notes</span>
            <span style={{ cursor: 'pointer', color: 'var(--color-accent, #00e5ff)' }} onClick={() => onNavigate('home')}>
              Open Web Player
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
};
