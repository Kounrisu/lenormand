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

export function playShuffle(style: 'riffle' | 'overhand' | 'strip' | 'wash' | 'casino'): void {
  stopLive();
  if (style === 'riffle') {
    playFile(files.riffle, { volume: 0.95, rate: 1 });
    return;
  }
  if (style === 'overhand') {
    playFile(files.shuffle, { volume: 0.9, rate: 0.92 });
    return;
  }
  if (style === 'strip') {
    playFile(files.shuffle, { volume: 0.85, rate: 1.05 });
    setTimeout(() => playFile(files.riffle, { volume: 0.7, rate: 1.1, maxMs: 900 }), 500);
    return;
  }
  if (style === 'wash') {
    playFile(files.riffleLong, { volume: 0.9, rate: 1, maxMs: 2200 });
    return;
  }
  playFile(files.riffleLong, { volume: 0.92, rate: 1, maxMs: 3000 });
}

export function playDeal(): void {
  const start = 0.4 + Math.random() * 18;
  playSnippet(files.dealing, start, 220, 0.8);
}

export function playCut(): void {
  playSnippet(files.dealing, 0.2, 280, 0.9);
}

export function warmSounds(): void {
  load(files.riffle);
  load(files.riffleLong);
  load(files.shuffle);
  load(files.dealing);
}
