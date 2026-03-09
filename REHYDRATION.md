# filamentlabs.io — Rehydration Guide

> Current state snapshot for session bootstrap. Deploy pipeline, conventions, and related workspaces are in User Rules (`filamentlabs-deploy-pipeline.md`).

Updated: 2026-03-04 5:15 PM CST

---

## 1. Current Status

| Area | State |
|------|-------|
| Site content | ✅ Phase 2 complete — homepage + HRVSpark product page + privacy policy |
| Copy tone | ✅ Complementary positioning ("Why Raw?", reversed-flow diagram, analysis-suite bridge) |
| Testimonials | ✅ Three: beta tester (philosophy), physician (pattern validation), sports medicine physician |
| Polish | ✅ Scroll-reveal animations, hover micro-interactions, breathing glow, responsive breakpoints |
| Favicons | ✅ favicon.ico, favicon.svg, apple-touch-icon.png (dark-bg tilde+spark) |
| SEO | ✅ sitemap.xml, robots.txt, JSON-LD ($2.99 **PreOrder**), canonical URLs, OG cards (1200×630) |
| OG card | ✅ Real hero screenshot (replaced generated card), padded to 1200×630 |
| Google Search Console | ✅ Verified, sitemap submitted, indexing requested |
| Bing Webmaster Tools | ✅ Imported from GSC, sitemap submitted |
| Cloudflare Web Analytics | ✅ RUM beacon on all pages (manual JS snippet) |
| Lighthouse (product page) | ✅ Perf 89 · A11y 100 · BP 92 · SEO 100 |
| Image optimization | ✅ All screenshots WebP with `<picture>` fallback (2.6MB → 155KB) |
| Custom 404 | ✅ Branded page with sparkline decoration |
| Brand email | ✅ `info@filamentlabs.io` via iCloud+ Custom Email Domain |
| X (Twitter) | ✅ `@Filament_Labs` — branded, pinned tweet, bio set |
| Product Hunt | ✅ Account created 3/3, 1-week wait active, community engagement started |
| CSS cache version | **v=15** (all pages) |

---

## 2. HRVSpark App Status (Cross-Ref)

| Area | State |
|------|-------|
| Current build | **Build 18** (live on TestFlight) |
| RC1 blockers | **ISS-032** (StoreKit monetization) — only remaining item |
| Pricing | $2.99 one-time Pro IAP + $4.99 tip jar. No subscriptions |
| Issue tracker | `~/Library/Mobile Documents/com~apple~CloudDocs/Xcode Projects/notes/ISSUES.md` |

---

## 3. Launch Timeline

**Target:** Product Hunt launch Wednesday, March 11. App Store go-live Tuesday, March 10.

| Date | Milestone | Status |
|------|-----------|--------|
| Mon 3/3 | Copy edits, brand email, X account, OG card, PH engagement | ✅ Done |
| Tue 3/4 | PH thumbnail + gallery images, RC polish, PH engagement | ✅ Done |
| Wed 3/5 | PH gallery finish, PH maker comment draft | ✅ Done (pulled to 3/4) |
| Thu 3/6 | RC finalization, App Store prep | ⬜ |
| Fri 3/7 | App Store submission (manual release), PH launch page setup | ⬜ |
| Sat 3/8 | Buffer day — monitor App Store review | ⬜ |
| Sun 3/9 | Prepare website CTA swap + JSON-LD InStock (staged) | ⬜ |
| Mon 3/10 | **App Store go-live**, deploy website updates, Reddit follow-ups | ⬜ |
| Wed 3/11 | **🚀 Product Hunt launch day** | ⬜ |
| Thu 3/12 | Post-launch — PH badge, App Store reviews | ⬜ |

Full task list: `notes/LAUNCH_WEEK_TASKS.md`

---

## 4. Product Page Anatomy (`hrvspark/index.html`)

The product page has these sections in order. Understanding this avoids needing to read the full HTML:

| Section | Content |
|---------|---------|
| **Hero** | Logo + `hrv/spark` wordmark (Zen Tokyo Zoo font) + tagline: "Your HRV. Raw. Beautiful. On your wrist." + sub-tagline: "Data without the verdict." |
| **Screenshots** | iPhone (iOS Live Gallery) + 3 watch screenshots (watchOS App, Gauge+Rectangular Complications, Complications Picker). Phone on left, watches stacked on right. |
| **What It Is** | "A window, not a verdict." — complication-first, raw SDNN, four time windows, complementary positioning paragraph |
| **Features** | 4 animated cards: 10 (Complications), 4 (Time Windows), 0 (Stress Scores), ∞ (Trust in You) |
| **Why Raw?** | Reversed-flow diagram: `data → opaque algorithm → verdict → user` vs `data → user → intuition` |
| **Design Philosophy** | Creator quote (cold plunge/hot yoga/tvTENS patterns), beta tester quote, physician quotes (×2) |
| **Who It's For** | 4 personas: self-experimenter, biohacker, HRV veteran, anxiety-conscious |
| **Comparison Table** | "Analysis Apps" vs "hrv/spark" — 6 rows (readiness→raw, color-coded→neutral, etc.) |
| **CTA** | ⚠️ Currently: "Coming Soon to the App Store" / "Currently in TestFlight beta." / TestFlight button + Privacy Policy button. **Swap on launch day (see §7).** |

---

## 5. Image Assets (`images/`)

All PNGs have WebP counterparts. All are used on the product page with `<picture>` fallback.

| File | Content | Dimensions | Size |
|------|---------|------------|------|
| `logo.svg` | App icon — dark bg, blue tilde + orange spark | 1024×1024 viewBox | 2.6KB |
| `og-hrvspark.png` | OG card — hero screenshot | 1200×630 | 180KB |
| `og-homepage.png` | OG card — homepage | 1200×630 | 530KB |
| `ios_live_gallery.png` | iPhone screenshot — Gallery tab showing all complications | 1206×2047 | 1.4MB |
| `watchos_live_gallery.png` | Watch screenshot — app gallery view | 396×484 | 230KB |
| `watchos_face_gauge_rectangular_complications.png` | Watch face — gauge + rectangular complications active | 396×484 | 181KB |
| `watchos_complications_picker.png` | Watch — complications picker screen | 396×484 | 272KB |

---

## 6. Product Hunt Prep State

| Asset | Spec | Status |
|-------|------|--------|
| PH account | 1-week waiting period (signed up 3/3) | ✅ Active, engaging daily |
| PH tagline | 60 chars max: "Your HRV. Raw. Beautiful. On your wrist." (42 chars) | ✅ Drafted |
| PH description | ~60 words — reversed-flow pitch, complication-first, $2.99, no subscription | ✅ Drafted (in LAUNCH_WEEK_TASKS.md) |
| PH thumbnail | 240×240px — `images/ph-thumbnail.png` | ✅ Created (7.4KB, rsvg-convert + optipng) |
| PH gallery images | 1270×760px, 5 slides — `images/ph-gallery-{1..5}*.png` | ✅ Created (131–164KB each) |
| PH maker comment | ~200 words — `notes/ph_maker_comment.md` | ✅ Drafted + approved |

**Planned gallery slides (1270×760):**
1. Hero shot: iPhone + Watch side-by-side
2. Watch face with complications in context
3. "Why Raw?" value prop slide (text + sparkline visual)
4. Feature highlights (10 complications / 4 time windows)
5. Beta tester testimonial card

---

## 7. Site Structure

```
filamentlabs.io/
├── index.html                  # Homepage — brand landing, project cards
├── hrvspark/
│   ├── index.html              # HRVSpark product page
│   └── privacy.html            # Privacy policy
├── css/
│   └── style.css               # Shared design system (v=15)
├── js/
│   └── main.js                 # Sparkline + IntersectionObserver scroll-reveal
├── images/                     # See §5 for full inventory
├── 404.html                    # Custom branded 404 page
├── favicon.svg / favicon.ico / apple-touch-icon.png
├── robots.txt / sitemap.xml
└── shakespeare/                # Future placeholder
    └── index.html
```

---

## 8. Design Tokens

```css
:root {
    --bg-primary: #0a0a0f;
    --bg-card: rgba(255, 255, 255, 0.03);
    --bg-card-hover: rgba(255, 255, 255, 0.06);
    --text-primary: #e8e8ed;
    --text-secondary: rgba(255, 255, 255, 0.55);
    --text-muted: rgba(255, 255, 255, 0.35);
    --accent-blue: #338ef7;
    --accent-glow: rgba(51, 142, 247, 0.15);
    --accent-orange: #ff7c1e;
    --border: rgba(255, 255, 255, 0.06);
    --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

Wordmark font: `Zen Tokyo Zoo` (Google Fonts).

---

## 9. Privacy Policy URLs

| URL | Status | Used Where |
|-----|--------|------------|
| `joelfarthing.github.io/hrvspark-privacy/` | ⚠️ Legacy — still live | Unknown |
| `joelfarthing.github.io/HRVSpark/privacy.html` | ⚠️ Legacy — still live | Was in ASC |
| `filamentlabs.io/hrvspark/privacy.html` | ✅ Canonical | Updated in ASC |

> **Rule:** Do NOT create a fourth privacy policy URL.

---

## 10. Launch Day Website Changes (Staged for 3/10)

These changes are **prepared but not deployed** until App Store go-live:

- CTA heading: "Coming Soon to the App Store" → "Available on the App Store"
- CTA subtext: "Currently in TestFlight beta." → remove
- CTA button: TestFlight link → App Store download badge
- JSON-LD: `"availability": "https://schema.org/PreOrder"` → `"https://schema.org/InStock"`
- Add "No Subscription" tagline to pricing/CTA section

---

## 11. Open Items

- [x] PH thumbnail (240×240 from logo.svg) ✅
- [x] PH gallery images (1270×760 × 5 slides) ✅
- [x] PH maker comment draft (~200 words) ✅
- [ ] PH launch page setup (after 1-week wait clears ~3/10)
- [ ] Website CTA swap on launch day
- [ ] JSON-LD availability flip on launch day
- [ ] PH "Featured on Product Hunt" badge post-launch
- [ ] Contact / Support page
- [ ] Shakespeare project placeholder on homepage
- [ ] Blog / dev log (organic SEO traffic)
- [ ] Bluesky account

---

## 12. System Tooling Notes

- **ImageMagick** (`magick`) and **sips** are available for image conversion
- **`gh`** CLI is installed and authenticated
- **Node** v22.22.0, **npm** 10.9.4
- macOS 15.4, Apple M3 Pro, 18GB RAM

> **Directive:** Retrieve KI slug `safe-exec-protocol` via `mcp_ki_core` for terminal execution rules and allowlists.

---

## 13. Jules / AI Refactoring Notes

- **Jules** is Google's automated code refiner. It generates patches and GitHub PRs.
- **Jules CLI** (`jules`) is installed at `/opt/homebrew/bin/jules` and available in the environment.
- To view active/past Jules sessions, use: `jules remote list --session`
- To pull a patch from a session: `jules remote pull --session <session-id> > patch.diff`
- *Note:* The user's Jules suggestions might be spread across different repos/sessions. Check both `joelfarthing/HRVSpark` and `joelfarthing/filamentlabs-site`.
