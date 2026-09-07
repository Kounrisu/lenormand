# Lenormand Oracle
> Generated: 2026-09-07 | Path: `C:\dev\angular\09_lenormand`

## Purpose
Lenormand Oracle is a lighthearted mobile-first yes/no oracle app using a 36-card Lenormand deck. The answer is based on where the Ring card lands after shuffle and cut.

## Why This Exists
It is a polished small web app: no accounts, no money, no heavy user identity. It combines a playful frontend experience, installable PWA behavior, and a minimal backend for anonymous reading records.

## What Has Been Done
- Built an Angular frontend with standalone components, signals, and zoneless-style modern Angular.
- Added an installable PWA manifest and service worker configuration.
- Added a NestJS plus Prisma backend in `backend/`.
- Added card, table, back, portrait, map, and sound assets.
- Added pages for reading, question, history, looks, about, and pack information.
- Added Leaflet map support.
- Added Docker Compose deployment files.
- Recent git history shows many UI/layout refinements on 2026-09-07: reading result placement, map cropping, marker visibility, Google Maps link, settings flow, Madame Lenormand page, pack page, and tall-phone layout fixes.

## When
- This is the most recently active project in the workspace, with commits on 2026-09-07.
- Local package files were updated on 2026-09-07.

## Timeline

All work so far happened in one continuous stretch, 2026-09-07 into 2026-09-08:

| When (local) | Commit | What |
|---|---|---|
| 09-07 04:11 | `658eb0a` | Scaffold: Angular 22 PWA + NestJS/Prisma backend, shuffle/cut engine, basic UI |
| 09-07 06:38 | `2d5344d` | Replaced placeholder card art with real 1799 "Game of Hope" scans; overhead card-table photo background; shuffle-method chips + player-driven cut |
| 09-07 07:30–07:31 | `e4b5aa3`, `4041978` | Table-theme styling polish; CSS budget fix |
| 09-07 08:01 | `d91ec69` | Added "The pack" about page (Marie-Anne Lenormand's real history); fixed an off-screen layout bug on tall phones |
| 09-07 08:15 | `1350acb` | Rebuilt the about page as a full standalone page with portraits, an embedded map, a card-size toggle |
| 09-07 08:27–08:31 | `8e40571`, `9c313a3` | Fixed map marker visibility, added a Google Maps link, fixed a Settings navigation dead-end, fixed map cropping on wider viewports |
| 09-07 08:53 | `b4c57b1` | Moved the Yes/No result out of the felt mat into its own overlay; made the 13-card layout fit any screen without scrolling |
| 09-08 00:26 | `2503e4b` | Added this file |

First deploy to `lenormand.sn8w.com` (backend + DB + shared VPS Caddy proxy) landed the same day as the initial scaffold; every commit after that shipped straight to production.

## Token Consumption & Efficiency

No historical per-session token metrics are available here — that data isn't retained anywhere this file can read from (check the Claude Code usage view / claude.ai billing page for real numbers). What follows is qualitative, based on how the work in this repo actually went:

**What burned tokens without adding much value:**
- Several rounds of "fix a CSS bug → rebuild → screenshot → fix another" one at a time, each involving a full `ng build`/`ng test` cycle and a fresh headless-browser round-trip. Bundling related layout fixes (e.g. the map-marker, Google-Maps-link, and Settings-back-button fixes were three separate reported bugs but got fixed and verified together) is cheaper than one bug at a time.
- Repeated dev-server start/stop/port-conflict churn (port 4200 was occupied by an unrelated process most of the session, so every verification pass had to pick a new port). Fixing `.claude/launch.json` once to a free, fixed port would remove this recurring cost.
- Re-discovering the same architectural facts (e.g. `.mat`'s `container-type: size` also constrains `position: fixed` descendants) mid-session via trial and error. That's now written down below and in `CLAUDE.md` — a future session shouldn't need to rediscover it.

**Cheaper going forward:**
- Keep `CLAUDE.md` and this file current after every feature — a fresh session reading two short docs is far cheaper than one that greps the whole codebase to reconstruct "why is the mat sized this way."
- Prefer fixing a whole class of bug at once (e.g. "nothing inside `.mat` may assume it can escape via `position: fixed`, `vw`, or fixed `rem` grid tracks — use `cqi`/`cqh`/`%` instead") over patching each symptom as it's reported.
- When testing in a browser, batch multiple viewport checks (mobile, tablet, desktop) in one script/session rather than re-navigating and re-establishing state per check.

## Improvement Roadmap

Ordered by what would matter most to a player first, then how it looks/feels, then internal efficiency — not by ease of implementation.

### 1. Features & functionality
1. **Stats from the data already being collected** — the `readings` table already stores every draw; a simple "X% yes over Y readings" on the History page would cost almost nothing new on the backend and adds a reason to come back.
2. **Shareable result** — a "share this reading" action (native `navigator.share` with a short generated summary, or an image) fits the game's lighthearted framing and is the kind of thing that spreads on its own.
3. **A second card-face option** — Settings already has a disabled "More later" slot next to "Game of Hope"; filling it in (a modern illustrated deck, still public-domain/licensed) is scoped-out functionality the UI already promises.
4. **French translation** — the historical subject (Marie-Anne Lenormand) and likely audience skew French; the app is currently English-only.
5. Keep resisting scope creep toward "real" fortune-telling spreads (3-card, Grand Tableau) unless specifically wanted — `CLAUDE.md` deliberately keeps this a light yes/no game, not a divination app.

### 2. UX / UI improvements
1. **First-run explanation** — the Ring/first-13-cards rule is not obvious from the table screen alone; a one-time short explainer (or a permanent "how it works" link near the shuffle button, separate from the historical "About" page) would reduce confusion for new players.
2. **Perceived load time** — `public/table/`, `public/cards/`, and `public/portraits/` together are several MB of JPGs; a blurred low-res placeholder or a simple loading state on first paint would help on slow mobile connections, especially since the whole aesthetic depends on that photo loading.
3. **Accessibility pass** — result announcements already use `aria-live`; extend that same care to the shuffle/cut flow (keyboard-operable spread, visible focus rings on the card grid, alt text on the card images already present in `about.html` but not yet in the play screens).
4. **History pagination** — currently caps at 100 rows server-side with no UI paging; fine today, will matter once someone actually plays a lot.

### 3. Technical / efficiency improvements
1. Convert `public/table/*.jpg` and `public/cards/*.jpg` to responsive/WebP variants — likely the single biggest real-world load-time win, independent of any framework change.
2. Consider trimming the `question.scss` component-style budget overage (currently allowed via a raised budget rather than fixed) if that file keeps growing — it's a signal the component is accumulating unrelated concerns.
3. Add a couple of Playwright/Cypress smoke tests for the shuffle → cut → reveal → result flow — the unit tests cover the deck math well but nothing currently catches a UI regression like the ones fixed this session automatically.

## Technical Stack
- Frontend: Angular, TypeScript, RxJS, Leaflet, service worker/PWA.
- Backend: NestJS, Prisma, PostgreSQL.
- Assets: local card images, portraits, map markers, and audio.
- Testing: Vitest/jsdom configured.
- Deployment: Docker Compose behind the shared VPS/Caddy setup described in sibling docs.
- Package manager: npm.

## How To Run
- Install frontend: `npm install`
- Start frontend: `npm start`
- Build frontend: `npm run build`
- Test frontend: `npm test`
- Backend commands live under `backend/`.

## AI Notes
This project has real production/deployment context and a backend `.env`. Do not paste credentials. For UI work, verify mobile layouts carefully because recent commits focused heavily on viewport fit.
