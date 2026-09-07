# CLAUDE.md

Project guidance for Claude Code working in this repository.

## What this is

A funny, no-stakes yes/no oracle game using a 36-card Lenormand deck. Shuffle, cut, and
check whether the Ring card (#25) landed in the first 13 cards. No accounts, no money,
no serious "fortune telling" framing — keep the tone light.

## Frontend aesthetics

Dark, mystical fortune-telling-parlour aesthetic — deep indigo/violet backgrounds,
antique gold accents, parchment-cream text. See `src/styles.scss` for the token set;
reuse it rather than introducing new colors ad hoc.

- Colors: `--bg`/`--surface`/`--surface-2`/`--surface-3` (background layers), `--text`/
  `--muted` (the only two text colors), `--accent` (antique gold — headings, primary
  actions, the Ring), `--accent-2` (violet, reserved for secondary highlights/focus),
  `--yes` (muted emerald) and `--no` (muted wine red) for the two possible answers only —
  don't reuse them for anything else.
- Headings use the serif stack (`ui-serif, 'Iowan Old Style', 'Palatino Linotype',
  Georgia, serif`); body text stays on the plain sans stack. Don't mix a third font.
- Buttons: `.btn--primary` (gold gradient) for the main call to action per screen,
  `.btn--ghost` (outlined) for secondary/navigational actions. No sharp 0-radius
  rectangular buttons.
- Panels (`.panel`): a subtle top-lit gradient over `var(--surface)`, thin gold-tinted
  border, `var(--radius)`, `var(--shadow-soft)` — reuse this for any new card-like
  container instead of inventing a one-off box style.
- Cards (`shared/card/`): fixed-size bordered rectangles, gold border, a symbol/glyph
  centered, number top-left, name at the bottom. A highlighted card (the Ring, once
  revealed within the first 13) gets an emerald glow ring + lift, matching the "Yes"
  color — never a border-only or checkmark treatment.

## Card artwork

Currently CSS/emoji placeholders (`src/app/core/card-symbols.ts`), not real scans — see
README.md "Card artwork" for the plan to swap in public-domain 19th-century Lenormand
deck scans. Don't add copyrighted modern deck artwork.

## Backend

NestJS + Prisma + Postgres, one `readings` table. No auth, no user accounts — a
client-generated `deviceId` (UUID, `localStorage`) scopes each device's own history.
Don't add login/signup; it's out of scope for a "fun game" with no stakes. Validation in
`readings.controller.ts` is hand-rolled (no class-validator dependency) to match this
project's otherwise minimal backend footprint — keep it that way unless the DTO surface
grows substantially.

## Deployment

Follows the shared VPS/Docker/Caddy pattern used by every other `sn8w.com` subdomain
(see `06-lotokarma` and `07_my_server_infact_anacottest/VPS-OPERATIONS.md` in the sibling
repos). Don't introduce a different hosting approach (e.g. Vercel, a new reverse proxy)
without discussing it first — the whole point is one shared VPS/Caddy setup for all
`*.sn8w.com` projects.
