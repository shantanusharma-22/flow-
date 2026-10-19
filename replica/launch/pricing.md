# Pricing Strategy: Flow (100% Free & Open)

The distribution model, competitive landscape, and store pricing policy for **Flow** on the **Mac App Store**, **Microsoft Store**, and direct releases.

---

## 1. Competitive Pricing Matrix

Surveyed against the original project and commercial desktop/streaming alternatives (retrieved October 19, 2026):

| Player / Store Listing | Model | Store Price | Monthly Fee | In-App Purchases | Source & Date Checked |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Flow (Our Player)** | 100% Free | **$0.00 (Free)** | **$0 / mo** | **None (100% Unlocked)** | App Store & Microsoft Store (Oct 19, 2026) |
| **Original Player** | FOSS / Donation | $0 (GitHub only) | $0 | None | [GitHub Repository](https://github.com/kushagrasinghx/BitChord) (Checked Oct 19, 2026) |
| **Spotify** | Commercial | $0 (Ad-supported) | $11.99 / mo | Required for ad-free & offline | [Spotify Plans](https://www.spotify.com/us/premium/) (Checked Oct 19, 2026) |
| **Apple Music** | Commercial | No free tier | $10.99 / mo | Subscription required | [Apple Music](https://www.apple.com/apple-music/) (Checked Oct 19, 2026) |
| **Cider Audio** | Paid Client | $4.99 on MS Store | $0 | One-time store purchase | [Microsoft Store Cider](https://apps.microsoft.com/) (Checked Oct 19, 2026) |

---

## 2. Why Flow is 100% Free Everywhere

From the 32 real reviews and issue reports analyzed in `replica/feedback.md`:
1. **Zero-Account Local Freedom (22% of feedback):**
   Desktop music listeners despise paywalls and forced cloud subscriptions just to organize their music. Flow eliminates subscription friction completely.
2. **Export Independence (22% of feedback):**
   Users should own their listening data. 1-click `.lrc` timestamped lyrics export for car stereos and `.m3u8` playlist export are standard, unmetered features.
3. **No Commercial Dark Patterns:**
   No audio advertisements interrupting playback, no banners cluttering the interface, and no paywalls gating lossless audio bitrates or lyrics transliteration.

---

## 3. The 100% Free Tier Breakdown

Every feature is unlocked for every user out of the box:

```
+-------------------------------------------------------------------------------+
|                            FLOW — 100% FREE CLIENT                             |
|                           $0.00 Forever / All Stores                          |
+-------------------------------------------------------------------------------+
| * Mac App Store & Microsoft Store 1-Click Install                             |
| * Unlimited desktop streaming across millions of songs                        |
| * Real-time syllable-synchronized lyrics with bilingual translations          |
| * Phonetic Romanization toggle (Romaji, Hangul, Pinyin)                       |
| * Zero-login local playlist creation & .m3u8 library export                   |
| * 1-click .lrc timestamped file export to local disk                          |
| * Granular cache manager with single-track eviction and MB inspection         |
| * Dedicated 3-state loop button (Repeat-One) & 0.5x–2.0x pitch-preserved tempo|
| * Zero audio ads, zero banners, zero telemetry, zero forced account sign-ins   |
+-------------------------------------------------------------------------------+
```

---

## 4. App Store & Microsoft Store Pricing Settings

### Mac App Store (App Store Connect)
- **Price Schedule:** `Free (Tier 0)`
- **In-App Purchases:** None.
- **Availability:** Free in all 175 App Store territories.
- **App Privacy:** "Data Not Collected" (zero telemetry, zero user tracking).

### Microsoft Store (Partner Center)
- **Base Price:** `Free ($0.00 USD)`
- **Trial:** None (Full product free).
- **In-App Products (IAP):** None.
- **Markets:** Worldwide distribution across all Windows 10 & Windows 11 markets.
- **Category:** `Multimedia & Media Players > Audio & Music`.

---

## 5. Voluntary Community Sponsorship (Optional)

For users who wish to support ongoing maintenance, server bandwidth for lyric resolvers, and packaging builds, Flow accepts non-coercive voluntary sponsorships:
- **GitHub Sponsors:** `github.com/sponsors/flow-audio` ($2 / $5 / $10 voluntary monthly tier).
- **Open Collective:** Transparent community fund for domain renewals and store developer accounts.
- **Guarantee:** 100% of application features, updates, and releases remain completely free and open. No feature is ever held behind a sponsor paywall.
