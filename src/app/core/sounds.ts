/** Real paper-card recordings (Freesound CC0). */

const files = {
  riffle: 'sounds/riffle-real.mp3',
  riffleLong: 'sounds/riffle-long.mp3',
  shuffle: 'sounds/shuffle.mp3',
  dealing: 'sounds/dealing.mp3',
} as const;

const cache = new Map<string, HTMLAudioElement>();
let live: HTMLAudioElement[] = [];

function load(src: string): HTMLAudioElement {
  let el = cache.get(src);
  if (!el) {
    el = new Audio(src);
    el.preload = 'auto';
    cache.set(src, el);
  }
  return el;
}

function stopLive(): void {
  for (const el of live) {
    el.pause();
  }
  live = [];
}

function playFile(src: string, opts?: { volume?: number; rate?: number; maxMs?: number }): HTMLAudioElement {
  const el = load(src).cloneNode(true) as HTMLAudioElement;
  el.volume = opts?.volume ?? 0.9;
  el.playbackRate = opts?.rate ?? 1;
  live.push(el);
  void el.play().catch(() => undefined);
  if (opts?.maxMs) {
    setTimeout(() => {
      el.pause();
    }, opts.maxMs);
  }
  return el;
}

function playSnippet(src: string, start: number, durationMs: number, volume = 0.85): void {
  const el = load(src).cloneNode(true) as HTMLAudioElement;
  el.volume = volume;
  const startPlay = (): void => {
    try {
      el.currentTime = start;
    } catch {
      /* ignore */
    }
    void el.play().catch(() => undefined);
    setTimeout(() => el.pause(), durationMs);
  };
  if (el.readyState >= 1) {
    startPlay();
  } else {
    el.addEventListener('loadedmetadata', startPlay, { once: true });
    el.load();
  }
  live.push(el);
}

export function playShuffle(): void {
  stopLive();
  playFile(files.riffleLong, { volume: 0.92, rate: 1, maxMs: 3000 });
}

export function playDeal(): void {
  const start = 0.4 + Math.random() * 18;
  playSnippet(files.dealing, start, 220, 0.8);
}

export function playCut(): void {
  playSnippet(files.dealing, 0.2, 280, 0.9);
}

export function playTap(): void {
  playSnippet(files.dealing, 0.05 + Math.random() * 10, 110, 0.52);
}

export function playPress(): void {
  playSnippet(files.dealing, 0.12, 200, 0.74);
}

export function playLay(): void {
  playFile(files.dealing, { volume: 0.82, rate: 1.04, maxMs: 1000 });
}

export function playGather(): void {
  playSnippet(files.dealing, 0.8, 520, 0.82);
}

export function warmSounds(): void {
  load(files.riffle);
  load(files.riffleLong);
  load(files.shuffle);
  load(files.dealing);
}
