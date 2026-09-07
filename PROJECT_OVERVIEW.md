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
