# Lenormand Backend
> Generated: 2026-09-07 | Path: `C:\dev\angular\09_lenormand\backend`

## Purpose
This backend records Lenormand readings and provides persistence for the frontend app.

## Why This Exists
The frontend intentionally avoids accounts and PII, but still needs a small server-side store for anonymous reading history or aggregate behavior. NestJS plus Prisma keeps the API and database layer explicit.

## What Has Been Done
- Created a NestJS backend.
- Added Prisma with PostgreSQL support.
- Added a `readings` module with controller, service, and types.
- Added Prisma service/module infrastructure.
- Added Vitest, oxlint, and Prettier tooling.
- Added Dockerfile and local build output.

## When
- Files were created or heavily touched on 2026-09-07.
- Backend build output exists from 2026-09-07.

## Technical Stack
- Runtime: Node.js, NestJS.
- Database: PostgreSQL.
- ORM: Prisma.
- Testing: Vitest, Supertest.
- Tooling: oxlint, Prettier, TypeScript.
- Deployment: Docker.

## How To Run
- Install: `npm install`
- Start dev server: `npm run start:dev`
- Build: `npm run build`
- Start production build: `npm run start:prod`
- Lint: `npm run lint`
- Test: `npm test`

## AI Notes
This folder contains a real `.env`. Do not expose it. The intended data model is small and privacy-light; preserve that simplicity unless the product direction changes.
