# CLAUDE.md

Project guidance for Claude Code working in this repository.

## What this is

A funny, no-stakes yes/no game using a 36-card Lenormand deck. No accounts, no money,
no serious "fortune telling" framing — keep the tone light.

The yes/no rule follows the French "méthode de l'Anneau" (Ring = Ace of Clubs, card
#25):

1. Shuffle is **one button**. It runs the casino sequence (riffle→riffle→
   strip→riffle, `casinoShuffle` in `core/deck.ts`) and the player can tap it
   as many times as they like while holding the question. There is no
   method picker — that complexity was deliberately removed. The pack stays
   squared after each shuffle.
2. **Split it yourself** is a blind, player-chosen split — not a shuffle.
   Spread the 36, tap where the pack breaks, restack without turning a card.
   This is how a player mixes a factory-order (unshuffled) pack without a
   full shuffle — keep it working alongside the one-button shuffle and the
   New Deck icon below.
3. **Yes or no?** is the real cut. Spread, tap one card, that card turns over
   and is the answer. If it is the Ring, **yes at once**. Otherwise restack
   and deal the new top 13: Ring in those 13 is **yes**, after that is **no**.
   On phone the spread is 6 columns; on desktop, 6.
4. The pack never resets itself. After shuffles, mix-cuts, and a finished
   reading, the next game starts from that same order. **New deck** restores
   Rider-through-Cross order — a small icon near the header wordmark on the
   home screen (`App.newDeck()` → `PackService.newPack()`), and also
   available from Settings. Persist pack order in localStorage.

The product name is **Lenormand — yes or no** (wordmark “Lenormand”). Do not
call the app “the ring”; the Ring is only the pivot card in the method.

Don't skip the player-chosen cut in favour of a hidden random cut. Don't add login.

## Language

The app has an **English/French toggle** (Settings → Language), not a
French-only rewrite — both stay available and persist like Looks settings
(`core/locale.service.ts`, localStorage key `lenormand.locale`). Strings
live in `core/i18n.data.ts` as a flat `{en, fr}` dictionary; components
inject `LocaleService` and call `t('some.key')` in templates rather than
hardcoding copy. Card names/meanings carry both languages directly on
`LenormandCard` (`nameFr`/`meaningFr` fields in `core/cards.data.ts`) —
add both when adding a card field, don't leave one language behind.

## Frontend aesthetics

A card table, not a mystic SaaS panel. The page is an overhead photograph of a
wooden table with a card mat; the pack is laid out **on that mat in the picture**,
not over the wood. Cream playing-card stock, chosen pack backs, gold for the Ring
and the ask. **Looks** lets the player pick the mat cloth and the back; persist
in localStorage. See `src/styles.scss` for the token set;
reuse it rather than introducing new colors ad hoc.

- Table: `--baize` / `--baize-deep` (felt), `--cream` / `--ink` (card faces and the
  history slip), `--text` / `--muted` (type sitting on the felt), `--gold` (the Ring,
  the shuffle cue, focus), `--oxblood` (card backs). `--yes` and `--no` are the two
  verdict colors only — don't reuse them for chrome.
- **Mystic layer**: `--vignette` (candlelight falloff on `.scene`), `--shimmer-gold`
  (the gold sweep used on the shuffle button and the revealed Ring), `--glow-yes` /
  `--glow-no` (verdict glow, derived from the palette above) live in `src/styles.scss`
  next to the base tokens. These are an explicit, scoped exception to "reuse only the
  existing tokens" — layered on top of `--gold`/`--oxblood`/`--baize`, not a
  replacement for them. CSS/SVG only; no animation library.
- Type: **Fraunces** for the wordmark, the home title, the Yes/No verdict, and card
  numbers. **Karla** for everything else. Don't add a third family.
- The home screen is a table with a tappable stacked deck — not a form. The question
  field stays hidden behind the "Write the question down" switch; writing a question
  is optional and off by default.
- Primary action on the table is **Yes or no?** (`.btn--primary`, gold pill). Shuffle
  is the single deck button (see the shuffle rule above — no method chips);
  **Split it yourself** is italic table-talk under an “or”, and never turns a card.
  `.btn--ghost` for secondary navigation. Pills, not sharp rectangles.
- Cards (`shared/card/`): the face is the 1799 Game of Hope scan
  (`public/cards/<slug>.jpg`) — don't overlay emoji, numbers, or pips on top of it
  (those are already in the engraving). The back is a dark museum-style
  photograph of a gilt damask reverse on midnight pasteboard — not a bright
  cream print.
  The Ring, once revealed in the first 13 or at the cut, lifts and gets a gold glow
  — never a checkmark or a border-only treatment.
- History sits on a cream paper slip on the table, not a dark glass panel.
- Copy stays plain and game-like. No ALL-CAPS kickers, no "oracle" solemnity.

## Card artwork

Faces are public-domain 1799 Game of Hope scans in `public/cards/`. Don't replace them
with emoji, AI pastiches, or copyrighted modern decks (Dondorf reprints still in
commerce, etc.).

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
