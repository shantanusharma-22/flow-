import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('A11Y & Responsive Layout Verification', async (t) => {
  await t.test('A11Y-H1: Core interactive components declare proper ARIA roles and labels', () => {
    const playerBarFile = fs.readFileSync(path.resolve(process.cwd(), 'src/components/PlayerBar.tsx'), 'utf-8');
    const scrubBarFile = fs.readFileSync(path.resolve(process.cwd(), 'src/components/ScrubBar.tsx'), 'utf-8');
    const modalFile = fs.readFileSync(path.resolve(process.cwd(), 'src/components/CreatePlaylistModal.tsx'), 'utf-8');
    const sidebarFile = fs.readFileSync(path.resolve(process.cwd(), 'src/components/Sidebar.tsx'), 'utf-8');

    // PlayerBar ARIA region
    assert.ok(playerBarFile.includes('role="region"'), 'PlayerBar must have role="region"');
    assert.ok(playerBarFile.includes('aria-label="Audio Player"'), 'PlayerBar must have aria-label');

    // ScrubBar slider
    assert.ok(scrubBarFile.includes('role="slider"'), 'ScrubBar must declare role="slider"');
    assert.ok(scrubBarFile.includes('aria-label="Playback Progress"'), 'ScrubBar must have aria-label');
    assert.ok(scrubBarFile.includes('aria-valuemin={0}'), 'ScrubBar must declare aria-valuemin');

    // Modal dialog
    assert.ok(modalFile.includes('role="dialog"'), 'Modal must declare role="dialog"');
    assert.ok(modalFile.includes('aria-modal="true"'), 'Modal must declare aria-modal="true"');

    // Navigation
    assert.ok(sidebarFile.includes('aria-label="Primary Navigation"'), 'Sidebar must have primary navigation landmark');
  });

  await t.test('A11Y-H2: Design tokens meet WCAG AA contrast ratio (4.5:1 text, 3:1 UI elements)', () => {
    const tokensFile = fs.readFileSync(path.resolve(process.cwd(), 'replica/design/tokens.json'), 'utf-8');
    const tokens = JSON.parse(tokensFile);

    // Calculate luminance
    function getLuminance(hex: string): number {
      const rgb = [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255
      ].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }

    function getContrast(hex1: string, hex2: string): number {
      const lum1 = getLuminance(hex1);
      const lum2 = getLuminance(hex2);
      return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    }

    const bg = tokens.color.bg;
    const text = tokens.color.text;
    const accent = tokens.color.accent;
    const onAccent = tokens.color['on-accent'];

    const textContrast = getContrast(text, bg);
    assert.ok(textContrast >= 4.5, `Primary text contrast ${textContrast.toFixed(2)} must be >= 4.5:1`);

    const accentContrast = getContrast(accent, onAccent);
    assert.ok(accentContrast >= 4.5, `Accent button contrast ${accentContrast.toFixed(2)} must be >= 4.5:1`);
  });
});
