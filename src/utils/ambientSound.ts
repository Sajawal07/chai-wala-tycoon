/**
 * Ambient Sound Engine — Chai Wala Tycoon
 * Generates all sounds procedurally via Web Audio API.
 * No audio files required → zero copyright/Play Store issues.
 */

let ctx: AudioContext | null = null;
const nodes: { stop: () => void }[] = [];

function getCtx(): AudioContext | null {
  try {
    if (!ctx || ctx.state === 'closed') {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function stopAll() {
  nodes.forEach(n => { try { n.stop(); } catch { /* ignore */ } });
  nodes.length = 0;
}

// ─── RAIN ──────────────────────────────────────────────────────────────────────
function startRain(volume: number): () => void {
  const c = getCtx();
  if (!c) return () => {};

  const master = c.createGain();
  master.gain.setValueAtTime(0, c.currentTime);
  master.gain.linearRampToValueAtTime(volume * 0.35, c.currentTime + 2.5);
  master.connect(c.destination);

  // White noise buffer (2 second looped)
  const bufLen = c.sampleRate * 2;
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const source = c.createBufferSource();
  source.buffer = buf;
  source.loop = true;

  const lpf = c.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 700;
  lpf.Q.value = 0.8;

  const hpf = c.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = 200;

  source.connect(hpf);
  hpf.connect(lpf);
  lpf.connect(master);
  source.start();

  // Occasional rain drop plinks
  let dropTimer: ReturnType<typeof setTimeout>;
  function scheduleDrop() {
    const delay = 80 + Math.random() * 300;
    dropTimer = setTimeout(() => {
      const dc = getCtx();
      if (!dc) return;
      const osc = dc.createOscillator();
      const g = dc.createGain();
      osc.type = 'sine';
      osc.frequency.value = 900 + Math.random() * 600;
      g.gain.setValueAtTime(volume * 0.04, dc.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, dc.currentTime + 0.07);
      osc.connect(g);
      g.connect(master);
      osc.start();
      osc.stop(dc.currentTime + 0.07);
      scheduleDrop();
    }, delay);
  }
  scheduleDrop();

  const entry = {
    stop: () => {
      clearTimeout(dropTimer);
      const t = getCtx()?.currentTime ?? 0;
      master.gain.linearRampToValueAtTime(0, t + 1.5);
      setTimeout(() => { try { source.stop(); } catch { /* ignore */ } }, 1600);
    }
  };
  nodes.push(entry);
  return entry.stop;
}

// ─── NIGHT CRICKETS + GIRGIT (GECKO) ──────────────────────────────────────────
function startNightInsects(volume: number): () => void {
  const c = getCtx();
  if (!c) return () => {};

  const master = c.createGain();
  master.gain.setValueAtTime(0, c.currentTime);
  master.gain.linearRampToValueAtTime(volume * 0.18, c.currentTime + 3);
  master.connect(c.destination);

  const stoppers: Array<() => void> = [];

  // Crickets: rapid chirps
  function chirpCricket() {
    const cc = getCtx();
    if (!cc) return;
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const t = cc.currentTime + i * 0.04;
      const osc = cc.createOscillator();
      const g = cc.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4200 + Math.random() * 400, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(volume * 0.12, t + 0.01);
      g.gain.linearRampToValueAtTime(0, t + 0.03);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.035);
    }
  }
  let cricketTimer: ReturnType<typeof setTimeout>;
  function scheduleCricket() {
    cricketTimer = setTimeout(() => { chirpCricket(); scheduleCricket(); }, 180 + Math.random() * 250);
  }
  scheduleCricket();
  stoppers.push(() => clearTimeout(cricketTimer));

  // Gecko / Girgit: occasional "tuk-tuk" clicks
  function geckoClick() {
    const gc = getCtx();
    if (!gc) return;
    const clicks = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < clicks; i++) {
      const t = gc.currentTime + i * 0.12;
      const osc = gc.createOscillator();
      const g = gc.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);
      g.gain.setValueAtTime(volume * 0.15, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.09);
    }
  }
  let geckoTimer: ReturnType<typeof setTimeout>;
  function scheduleGecko() {
    geckoTimer = setTimeout(() => { geckoClick(); scheduleGecko(); }, 8000 + Math.random() * 12000);
  }
  scheduleGecko();
  stoppers.push(() => clearTimeout(geckoTimer));

  const entry = {
    stop: () => {
      stoppers.forEach(s => s());
      master.gain.linearRampToValueAtTime(0, (getCtx()?.currentTime ?? 0) + 2);
    }
  };
  nodes.push(entry);
  return entry.stop;
}

// ─── MORNING BIRDS ────────────────────────────────────────────────────────────
function startMorningBirds(volume: number): () => void {
  const c = getCtx();
  if (!c) return () => {};

  const master = c.createGain();
  master.gain.setValueAtTime(0, c.currentTime);
  master.gain.linearRampToValueAtTime(volume * 0.22, c.currentTime + 3);
  master.connect(c.destination);

  const stoppers: Array<() => void> = [];

  const birds = [
    { baseFreq: 2800, range: 600, chirps: 3, gap: 0.09, min: 1200, max: 2500 },
    { baseFreq: 1900, range: 400, chirps: 2, gap: 0.14, min: 2500, max: 5000 },
    { baseFreq: 3400, range: 800, chirps: 5, gap: 0.07, min: 800,  max: 1800 },
  ];

  birds.forEach(bird => {
    function chirp() {
      const bc = getCtx();
      if (!bc) return;
      const baseF = bird.baseFreq + (Math.random() - 0.5) * bird.range;
      for (let i = 0; i < bird.chirps; i++) {
        const t = bc.currentTime + i * (bird.gap + Math.random() * 0.02);
        const osc = bc.createOscillator();
        const g = bc.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseF * 0.85, t);
        osc.frequency.linearRampToValueAtTime(baseF * 1.15, t + bird.gap * 0.4);
        osc.frequency.linearRampToValueAtTime(baseF * 0.9, t + bird.gap * 0.9);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(volume * 0.18, t + 0.01);
        g.gain.linearRampToValueAtTime(0, t + bird.gap * 0.95);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + bird.gap);
      }
    }

    let birdTimer: ReturnType<typeof setTimeout>;
    function scheduleBird() {
      birdTimer = setTimeout(() => { chirp(); scheduleBird(); }, bird.min + Math.random() * (bird.max - bird.min));
    }
    setTimeout(scheduleBird, Math.random() * 1500);
    stoppers.push(() => clearTimeout(birdTimer));
  });

  const entry = {
    stop: () => {
      stoppers.forEach(s => s());
      master.gain.linearRampToValueAtTime(0, (getCtx()?.currentTime ?? 0) + 2);
    }
  };
  nodes.push(entry);
  return entry.stop;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
export type AmbientMode = 'rain' | 'night' | 'morning' | 'none';

let currentMode: AmbientMode = 'none';
let currentStop: (() => void) | null = null;

export function setAmbientMode(mode: AmbientMode, soundOn: boolean) {
  if (!soundOn) {
    if (currentStop) { currentStop(); currentStop = null; }
    currentMode = 'none';
    return;
  }
  if (mode === currentMode) return;
  currentMode = mode;

  if (currentStop) { currentStop(); currentStop = null; }
  stopAll();

  const vol = 0.7;
  if (mode === 'rain')    currentStop = startRain(vol);
  if (mode === 'night')   currentStop = startNightInsects(vol);
  if (mode === 'morning') currentStop = startMorningBirds(vol);
}

export function resumeAudioContext() {
  if (ctx?.state === 'suspended') ctx.resume();
}
