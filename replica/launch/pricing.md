# Pricing Strategy: Flow (100% Free & Open)

The distribution model, competitive landscape, and pricing policy for **Flow** across the **Official Website / Web App**, **Mac App Store**, and **Microsoft Store**.

---

## 1. Competitive Pricing Matrix

Surveyed against the original project and commercial streaming alternatives (retrieved October 19, 2026):

| Player / Distribution Channel | Model | Upfront Price | Monthly Fee | In-App Purchases | Source & Date Checked |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Flow Web App (`getflow.audio`)** | 100% Free | **$0.00 (Free)** | **$0 / mo** | **None (100% Unlocked)** | Direct Web Stream (Oct 19, 2026) |
| **Flow Microsoft Store** | 100% Free | **$0.00 (Free)** | **$0 / mo** | **None (100% Unlocked)** | Microsoft Partner Center (Oct 19, 2026) |
| **Flow Mac App Store** | 100% Free | **$0.00 (Free)** | **$0 / mo** | **None (100% Unlocked)** | App Store Connect (Oct 19, 2026) |
| **Original Player** | FOSS / Donation | $0 (GitHub only) | $0 | None | [GitHub Repository](https://github.com/kushagrasinghx/BitChord) (Checked Oct 19, 2026) |
| **Spotify Web / Desktop** | Commercial | $0 (Ad-supported) | $11.99 / mo | Required for ad-free & offline | [Spotify Plans](https://www.spotify.com/us/premium/) (Checked Oct 19, 2026) |
| **Apple Music** | Commercial | No free tier | $10.99 / mo | Subscription required | [Apple Music](https://www.apple.com/apple-music/) (Checked Oct 19, 2026) |
| **Cider Audio** | Paid Client | $4.99 on MS Store | $0 | One-time store purchase | [Microsoft Store Cider](https://apps.microsoft.com/) (Checked Oct 19, 2026) |

---

## 2. Why Flow is 100% Free Everywhere

From the 32 real reviews and issue reports analyzed in `replica/feedback.md`:
1. **Zero-Account Local Freedom (22% of feedback):**
   Desktop and web music listeners despise paywalls and forced cloud subscriptions just to organize their music. Flow eliminates subscription friction completely.
2. **Instant Zero-Install Access:**
   Many users listen on work computers, school laptops, or shared machines where installing native software is restricted. Flow’s web app gives them instant high-fidelity streaming in any browser.
3. **Export Independence (22% of feedback):**
   Users should own their listening data. 1-click `.lrc` timestamped lyrics export for car stereos and `.m3u8` playlist export are standard, unmetered features in both browser and native desktop builds.
4. **No Commercial Dark Patterns:**
   No audio advertisements interrupting playback, no banners cluttering the interface, and no paywalls gating lossless audio bitrates or lyrics transliteration.

---

## 3. The 100% Free Tier Breakdown

Every feature is unlocked for every user out of the box across all three channels:

```
+-------------------------------------------------------------------------------+
|                            FLOW — 100% FREE CLIENT                             |
|                           $0.00 Forever / All Stores                          |
+-------------------------------------------------------------------------------+
| * Web App (`getflow.audio`) Zero-Install Instant Playback                      |
| * Mac App Store & Microsoft Store 1-Click Native Installs                     |
| * Installable Progressive Web App (PWA) with Offline Caching                  |
| * Unlimited streaming across millions of songs with lossless quality          |
| * Real-time syllable-synchronized lyrics with bilingual translations          |
| * Phonetic Romanization toggle (Romaji, Hangul, Pinyin)                       |
| * Zero-login local playlist creation & .m3u8 library export                   |
| * 1-click .lrc timestamped file export to local disk / browser downloads      |
| * Granular cache manager with single-track eviction and MB inspection         |
| * Dedicated 3-state loop button (Repeat-One) & 0.5x–2.0x pitch-preserved tempo|
| * Browser Media Session API integration (hardware media keys & lockscreen)    |
| * Zero audio ads, zero banners, zero telemetry, zero forced account sign-ins   |
+-------------------------------------------------------------------------------+
```

---

## 4. Platform Store & Hosting Configurations

### Official Website (`https://getflow.audio`)
- **Hosting:** Static edge hosting via Cloudflare Pages / Vercel with global CDN caching.
- **Cost to User:** Free ($0.00).
- **PWA Manifest:** Configured for 1-click standalone desktop installation.
- **Privacy Policy:** Zero tracking scripts, zero cookie consent banners needed (no non-essential cookies used).

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

For users who wish to support server bandwidth for lyric resolvers and domain maintenance, Flow accepts non-coercive voluntary sponsorships:
- **GitHub Sponsors:** `github.com/sponsors/flow-audio` ($2 / $5 voluntary monthly tier).
- **Open Collective:** Transparent community fund for domain renewals and store developer accounts.
- **Guarantee:** 100% of application features, updates, and releases remain completely free and open. No feature is ever held behind a sponsor paywall.
