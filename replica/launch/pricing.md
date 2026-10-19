# Pricing Strategy: Flow

The pricing model, competitive landscape, tier definitions, and Stripe billing structure for **Flow**.

---

## 1. Competitive Pricing Matrix

Surveyed against the original project and commercial desktop/streaming alternatives (retrieved October 19, 2026):

| Player / Service | Model | Free Tier | Monthly | Annual / Lifetime | Public Reference & Date Checked |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Original Player** | Donation / FOSS | 100% Free | $0 (Donations via Ko-fi) | $0 | [GitHub Repository](https://github.com/kushagrasinghx/BitChord) (Checked Oct 19, 2026) |
| **Spotify Premium** | Subscription | Ad-supported (mobile shuffle, audio ads) | $11.99 / mo | $119.88 / yr | [Spotify Plans](https://www.spotify.com/us/premium/) (Checked Oct 19, 2026) |
| **YouTube Music Premium** | Subscription | Ad-supported (no background play on mobile) | $10.99 / mo | $109.99 / yr | [YouTube Music Plans](https://music.youtube.com/premium) (Checked Oct 19, 2026) |
| **Cider Audio** | Paid Client | 14-day trial | N/A | $4.99 one-time (MS Store / itch.io) | [Cider Collective](https://cider.sh/) (Checked Oct 19, 2026) |

---

## 2. Reviewer Sentiment & Market Gap

From the 32 real reviews and issue reports analyzed in `replica/feedback.md`:
1. **Zero-Account Local Freedom (7 reviews / 22%):**
   Users strongly resent forced cloud logins just to curate a playlist or listen to local files. Many desktop listeners refuse to link personal Google/Spotify credentials due to privacy or corporate device restrictions.
2. **Export Independence (7 reviews / 22%):**
   Users want portable ownership of their listening data: 1-click `.lrc` timestamped lyrics export for car stereos and MP3 DAPs, and standard `.m3u8` playlist exports.
3. **Friction-Free Desktop Experience (6 reviews / 19%):**
   Users reject bloated web clients that chew up 1.5 GB of RAM or lock basic features behind recurring $12/month fees when all they need is a fast, beautiful audio player.

---

## 3. The Flow Tier Model

Flow adopts a **generous, local-first hybrid model**: the desktop player is free forever for offline listening and core streaming, while optional cloud sync, listen-together rooms, and early access are powered by a lightweight Pro subscription or lifetime license.

### The 3 Tiers (Named by Audience)

```
+---------------------------+---------------------------+---------------------------+
|      FREE LISTENER        |       PRO EXPLORER        |     LIFETIME PATRON       |
|       $0 / forever        |    $3.99/mo or $29/yr     |      $39 / one-time       |
+---------------------------+---------------------------+---------------------------+
| For everyday music lovers | For multi-device listeners| For loyal supporters who  |
| who want a lightning-fast | & audiophiles who want    | want perpetual access and |
| desktop client.           | sync and shared rooms.    | zero subscriptions.       |
|                           |                           |                           |
| * Unlimited streaming     | * Everything in Free      | * Everything in Pro       |
| * Synchronized lyrics     | * Encrypted cloud sync    | * Perpetual updates       |
| * Phonetic Romaji toggle  | * Listen-together rooms   | * Early access builds     |
| * Zero-login playlists    | * Priority lyrics fetch   | * Founder Discord role    |
| * 1-click .lrc export     | * Multi-workstation queue | * Name in About screen    |
| * Granular cache manager  | * 2 months free on annual | * 100% DRM-free license   |
+---------------------------+---------------------------+---------------------------+
```

---

## 4. Anti-Hostile Billing Guarantees

In response to community complaints regarding predatory recurring billing models in modern software:
- **1-Click Cancellation:** Immediate self-serve cancellation inside Settings with no retention surveys or phone calls.
- **Renewal Transparency:** Automated email notice sent 7 days before annual subscription renewal.
- **No Per-Seat or Tier Jumps:** Single personal license covers all your desktop machines (Windows, macOS, Linux).
- **Graceful Downgrade:** If Pro expires, your local playlists, cached songs, and exported `.lrc` files remain 100% accessible on your disk.

---

## 5. Stripe Catalog Configuration

Ready for deployment in Stripe Dashboard (Live and Test modes):

### 1. Flow Pro (Monthly)
- **Product Name:** `Flow Pro Monthly`
- **Product ID:** `prod_flow_pro_monthly`
- **Price:** `$3.99 USD`
- **Billing Interval:** `Monthly (recurring)`
- **Statement Descriptor:** `FLOW MUSIC PRO`

### 2. Flow Pro (Annual — 2 Months Free)
- **Product Name:** `Flow Pro Annual`
- **Product ID:** `prod_flow_pro_annual`
- **Price:** `$29.00 USD`
- **Billing Interval:** `Yearly (recurring, $2.42/mo effective)`
- **Statement Descriptor:** `FLOW MUSIC PRO YR`

### 3. Flow Lifetime License
- **Product Name:** `Flow Lifetime License`
- **Product ID:** `prod_flow_lifetime`
- **Price:** `$39.00 USD`
- **Billing Interval:** `One-time purchase`
- **Statement Descriptor:** `FLOW MUSIC LIFE`
