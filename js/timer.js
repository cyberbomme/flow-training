// Countdown-Timer (zeitstempelbasiert, läuft nach App-Wechsel korrekt weiter) + Töne via WebAudio

let ctx;
export function unlockAudio() {
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'transient';
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    // stummer Ton, damit iOS den Kontext freigibt
    const o = ctx.createOscillator(), g = ctx.createGain();
    g.gain.value = 0; o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.01);
  } catch {}
}

export let soundOn = true;
export const setSound = (v) => { soundOn = v; };

function tone(freq, start, len, vol = 0.35) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  const t = ctx.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + len + 0.02);
}

export function beep(kind) {
  if (!soundOn || !ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  if (kind === 'tick') tone(880, 0, 0.12);
  else if (kind === 'end') { tone(1320, 0, 0.18); tone(1320, 0.22, 0.18); tone(1760, 0.44, 0.5, 0.45); }
  else if (kind === 'start') tone(660, 0, 0.15);
}

// Timer-Zustand ist ein schlichtes Objekt, damit es im Trainingszustand mitgespeichert werden kann:
// { total, remaining, endAt, running }
export function makeTimer(total) { return { total, remaining: total, endAt: null, running: false }; }

export function remaining(t) {
  if (!t.running) return t.remaining;
  return Math.max(0, (t.endAt - Date.now()) / 1000);
}
export function start(t) {
  if (t.running) return;
  if (t.remaining <= 0) t.remaining = t.total;
  t.endAt = Date.now() + t.remaining * 1000; t.running = true;
}
export function pause(t) {
  if (!t.running) return;
  t.remaining = remaining(t); t.running = false; t.endAt = null;
}
export function reset(t) { t.running = false; t.endAt = null; t.remaining = t.total; }
export function addTime(t, s) {
  t.total = Math.max(1, t.total + s);
  if (t.running) t.endAt += s * 1000; else t.remaining = Math.max(0, t.remaining + s);
}

export const fmt = (s) => {
  s = Math.ceil(s);
  const m = Math.floor(s / 60), r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
};
