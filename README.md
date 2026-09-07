# Lenormand Oracle — Yes or No

A lighthearted, mobile-first web app: think of a yes/no question, shuffle and cut a
36-card Lenormand deck, and get your answer from where the **Ring** card lands. No
accounts, no money — just a fun little oracle.

Deployed at `lenormand.sn8w.com`. Repo: `kounrisu/lenormand`.

## The rule

Shuffle the deck, cut it, then look at the first 13 cards. If the **Ring** (card #25) is
among them, the answer is **Yes**. Otherwise, **No**.

## Stack

- **Frontend**: Angular 22 (standalone components, signals, zoneless), installable PWA
  (`@angular/pwa` — manifest + service worker).
- **Backend**: NestJS + Prisma + Postgres, a single `readings` table recording each
  draw's ring position/answer/optional question, keyed by a random `deviceId` generated
  client-side (`localStorage`) — no login, no PII.
- **Deploy**: Docker Compose, joining the shared `web` Docker network on the existing
  OVH VPS, behind the shared Caddy reverse proxy (see `07_my_server_infact_anacottest`'s
  `VPS-OPERATIONS.md` in the sibling repo for the canonical runbook). Frontend build
  happens via a throwaway `node:24-alpine` container, same as `06-lotokarma`.

## Card artwork

Faces are crops of Johann Kaspar Hechtel's **Das Spiel der Hofnung** (The Game of
Hope), Nuremberg, 1799 — the public-domain ancestor of the Petit Lenormand. Scans
live in `public/cards/<slug>.jpg`. Source sheet:
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Das_Spiel_der_Hofnung_(The_Game_of_Hope).png)
(British Museum object 1896,0501.495). See `public/cards/CREDIT.txt`.

## Local development

Frontend:

```bash
npm start
```

Backend + Postgres:

```bash
docker compose up
```

Then point `src/environments/environment.ts`'s `apiBaseUrl` at the backend (defaults to
`http://localhost:3000/api`).

## Deployment

Same pattern as `06-lotokarma`:

1. Add DNS `A` record: `lenormand.sn8w.com` → the VPS IP.
2. `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build` on the
   VPS (copy `.env.prod.example` to `.env.prod` first, fill in real values).
3. Add a Caddyfile block on the shared proxy (`~/proxy/Caddyfile`):
   `lenormand.sn8w.com { reverse_proxy lenormand-backend:3000 }` for the API, plus a
   static `file_server` block for the built frontend — then reload Caddy.
4. Build the frontend via the throwaway Node container and drop `dist/lenormand/browser`
   wherever the Caddy static block points, same as lotokarma.
