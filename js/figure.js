// Schematische Strichfiguren: Posen über Gelenkwinkel (0° = nach oben, im Uhrzeigersinn)
// oder IK-Ziele für Hände (w) und Füße (a). Blickrichtung = rechts.

const L = { torso: 28, neck: 10, head: 6, thigh: 20, shin: 20, ua: 14, fa: 13, foot: 5 };
const GROUND = 90;

const rad = (d) => (d * Math.PI) / 180;
const dir = (a, len) => [Math.sin(rad(a)) * len, -Math.cos(rad(a)) * len];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const norm = (v) => { const d = Math.hypot(v[0], v[1]) || 1; return [v[0] / d, v[1] / d]; };
const lerp = (a, b, t) => a + (b - a) * t;

// Zweigelenk-IK; bend +1/-1 wählt die Seite des Mittelgelenks
function ik(root, target, l1, l2, bend) {
  const v = sub(target, root);
  let d = Math.hypot(v[0], v[1]);
  const u = norm(v);
  if (d >= l1 + l2) {
    return [add(root, [u[0] * l1, u[1] * l1]), add(root, [u[0] * (l1 + l2), u[1] * (l1 + l2)])];
  }
  d = Math.max(d, Math.abs(l1 - l2) + 0.01);
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) * (bend >= 0 ? 1 : -1);
  const m = [u[0] * Math.cos(a) - u[1] * Math.sin(a), u[0] * Math.sin(a) + u[1] * Math.cos(a)];
  return [add(root, [m[0] * l1, m[1] * l1]), target];
}

function limb(root, a1, a2, target, l1, l2, bend) {
  if (target) return ik(root, target, l1, l2, bend);
  const m = add(root, dir(a1, l1));
  return [m, add(m, dir(a2, l2))];
}

function footOf(k, a, flip = 1) {
  const s = norm(sub(a, k));
  return add(a, [s[1] * L.foot * flip, -s[0] * L.foot * flip]);
}

export function solve(p) {
  const hp = p.hp;
  const n = add(hp, dir(p.tr, L.torso));
  const h = add(n, dir(p.hd ?? p.tr, L.neck));
  // Fehlende Winkel = Glied hängt senkrecht nach unten
  const [e, w] = limb(n, p.ua ?? 180, p.fa ?? 180, p.w, L.ua, L.fa, p.wb ?? 1);
  const hasArm2 = p.ua2 != null || p.w2;
  const [e2, w2] = hasArm2 ? limb(n, p.ua2, p.fa2, p.w2, L.ua, L.fa, p.wb2 ?? 1) : [e, w];
  const [k, a] = limb(hp, p.th ?? 180, p.sh ?? 180, p.a, L.thigh, L.shin, p.ab ?? -1);
  const hasLeg2 = p.th2 != null || p.a2;
  const [k2, a2] = hasLeg2 ? limb(hp, p.th2, p.sh2, p.a2, L.thigh, L.shin, p.ab2 ?? -1) : [k, a];
  // fd = Richtung des Fußes (Winkel), sonst rechtwinklig zum Schienbein
  const f = p.fd != null ? add(a, dir(p.fd, L.foot)) : footOf(k, a, p.ff ?? 1);
  const f2 = !hasLeg2 ? f : p.fd2 != null ? add(a2, dir(p.fd2, L.foot)) : footOf(k2, a2, p.ff2 ?? p.ff ?? 1);
  return { hp, n, h, e, w, e2, w2, k, a, k2, a2, f, f2 };
}

// Zwischenpose: Gelenkwinkel (nicht Punkte) verschieben, damit alle Glieder ihre Länge behalten.
// Hände/Füße mit festem Ziel in beiden Posen folgen dem Ziel (IK), Füße auch, wenn nur eine Pose ein Ziel hat (Bodenkontakt).
const angOf = (p, q) => (Math.atan2(q[0] - p[0], p[1] - q[1]) * 180) / Math.PI;
const wrap = (d, min) => ((((d - min) % 360) + 360) % 360) + min; // auf [min, min + 360) bringen
const lerpAng = (a, b, t) => a + wrap(b - a, -180) * t;
const lerpPt = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];

// Arm in Seitenansicht: Schulter relativ zum Rumpf nie durch den Rücken (von hinten-unten über vorn bis über den Kopf),
// Ellbogen nur beugen/strecken. ex.front (Frontalansicht, Arm zur Seite): einfach der kürzere Weg.
function armAng(A, B, t, front, trA, trB) {
  if (front) return { up: lerpAng(A.up, B.up, t), lo: lerpAng(A.lo, B.lo, t) };
  const sh = lerp(wrap(A.up - trA, -70), wrap(B.up - trB, -70), t);
  const el = lerp(wrap(A.up - A.lo, -60), wrap(B.up - B.lo, -60), t);
  const up = sh + lerpAng(trA, trB, t);
  return { up, lo: up - el };
}

function inbetween(ex, pA, pB, A, B, t) {
  if (t <= 0) return A;
  if (t >= 1) return B;
  // flat: Bewegung auf den Betrachter zu – Arm wird perspektivisch kürzer, daher Punkte statt Winkel
  if (pA.flat) return Object.fromEntries(Object.keys(A).map((k) => [k, lerpPt(A[k], B[k], t)]));
  const hp = lerpPt(A.hp, B.hp, t), tr = lerpAng(pA.tr, pB.tr, t);
  const p = { hp, tr, hd: lerpAng(pA.hd ?? pA.tr, pB.hd ?? pB.tr, t), ff: pA.ff, ff2: pA.ff2 };
  if (pA.fd != null || pB.fd != null) p.fd = lerpAng(angOf(A.a, A.f), angOf(B.a, B.f), t);
  if (pA.fd2 != null || pB.fd2 != null) p.fd2 = lerpAng(angOf(A.a2, A.f2), angOf(B.a2, B.f2), t);
  const arm = (far) => {
    const spec = (q) => (far && (q.ua2 != null || q.w2) ? [q.w2, q.wb2] : [q.w, q.wb]);
    const [wA, bA] = spec(pA), [wB, bB] = spec(pB), s = far ? '2' : '';
    if (wA && wB) return { ['w' + s]: lerpPt(wA, wB, t), ['wb' + s]: bA ?? bB };
    const of = (J) => ({ up: angOf(J.n, J['e' + s]), lo: angOf(J['e' + s], J['w' + s]) });
    const a = armAng(of(A), of(B), t, ex.front, pA.tr, pB.tr);
    return { ['ua' + s]: a.up, ['fa' + s]: a.lo };
  };
  const leg = (far) => {
    const spec = (q) => (far && (q.th2 != null || q.a2) ? [q.a2, q.ab2] : [q.a, q.ab]);
    const [tA, bA] = spec(pA), [tB, bB] = spec(pB), s = far ? '2' : '';
    if (tA || tB) return { ['a' + s]: lerpPt(tA || A['a' + s], tB || B['a' + s], t), ['ab' + s]: tA ? bA : bB };
    const of = (J) => [angOf(J.hp, J['k' + s]), angOf(J['k' + s], J['a' + s])];
    const [t1, s1] = of(A), [t2, s2] = of(B);
    return { ['th' + s]: lerpAng(t1, t2, t), ['sh' + s]: lerpAng(s1, s2, t) };
  };
  return solve(Object.assign(p, arm(false), arm(true), leg(false), leg(true)));
}

const f1 = (x) => Math.round(x * 10) / 10;
const pt = (p) => `${f1(p[0])},${f1(p[1])}`;
const line = (p, q) => `M${pt(p)}L${pt(q)}`;
const poly = (...ps) => 'M' + ps.map(pt).join('L');

function bodySVG(J, ghost) {
  const far = poly(J.f2, J.a2, J.k2, J.hp) + poly(J.n, J.e2, J.w2);
  const near = poly(J.f, J.a, J.k, J.hp, J.n) + line(J.n, J.h);
  const cls = ghost ? 'fig-ghost' : 'fig-body';
  // Der nahe Arm liegt vor dem Kopf
  return `<g class="${cls}"><path class="fig-far" d="${far}"/><path d="${near}"/>` +
    `<circle class="fig-head" cx="${f1(J.h[0])}" cy="${f1(J.h[1])}" r="${L.head}"/><path d="${poly(J.n, J.e, J.w)}"/></g>`;
}

// ── Ansichten „von vorn“ und „von oben“ (ex.cam: 'front' | 'top') ──
// Posen als Punkte mit Schulter- und Hüftbreite, L/R = links/rechts im Bild: h, sL/sR Schultern, pL/pR Hüfte,
// eL/eR Ellbogen, wL/wR Hände, kL/kR Knie, aL/aR Füße. nose = Blickrichtung (°, 0 = oben). Glieder dürfen perspektivisch kürzer sein.
const WIDE_PARENT = { eL: 'sL', eR: 'sR', wL: 'eL', wR: 'eR' };
const WIDE_KEYS = ['h', 'sL', 'sR', 'pL', 'pR', 'kL', 'kR', 'aL', 'aR', 'eL', 'eR', 'wL', 'wR'];
function wideBetween(A, B, t) {
  if (t <= 0) return A;
  if (t >= 1) return B;
  const o = {};
  for (const k of WIDE_KEYS) {
    if (!A[k] || !B[k]) continue;
    const pa = WIDE_PARENT[k];
    if (!pa || A.lin) { o[k] = lerpPt(A[k], B[k], t); continue; } // lin: Bewegung auf den Betrachter zu
    const va = sub(A[k], A[pa]), vb = sub(B[k], B[pa]), ga = angOf([0, 0], va);
    o[k] = add(o[pa], dir(lerpAng(ga, angOf([0, 0], vb), t), lerp(Math.hypot(...va), Math.hypot(...vb), t)));
  }
  if (A.nose != null) o.nose = lerp(A.nose, B.nose, t);
  return o;
}
function wideSVG(ex, J, ghost) {
  const mid = (p, q) => lerpPt(p, q, 0.5), path = (...a) => (a.every(Boolean) ? poly(...a) : '');
  const ns = mid(J.sL, J.sR), bent = ex.cam === 'front' && J.h[1] > J.sL[1]; // vorgebeugt: Kopf vor den Schultern
  const foot = (a, x) => (ex.cam === 'front' && a ? line(a, [a[0] + x, a[1] + 1]) : '');
  const hips = path(J.pL, J.pR), legs = path(J.pL, J.kL, J.aL) + path(J.pR, J.kR, J.aR) + foot(J.aL, -3.5) + foot(J.aR, 3.5);
  const standTop = ex.cam === 'top' && !J.kL; // stehend von oben: Hüfte blass unter den Schultern
  const far = standTop ? hips : bent ? hips + legs : '';
  const near = (far ? '' : hips + legs + line(ns, mid(J.pL, J.pR))) + path(J.sL, J.sR) + (standTop || bent ? '' : line(ns, J.h));
  const nose = J.nose == null ? '' : line(add(J.h, dir(J.nose, L.head)), add(J.h, dir(J.nose, L.head + 3.5)));
  return `<g class="${ghost ? 'fig-ghost' : 'fig-body'}"><path class="fig-far" d="${far}"/><path d="${near}${nose}"/>` +
    `<circle class="fig-head" cx="${f1(J.h[0])}" cy="${f1(J.h[1])}" r="${L.head}"/><path d="${path(J.sL, J.eL, J.wL)}${path(J.sR, J.eR, J.wR)}"/></g>`;
}
function wideProps(props, J, ghost) {
  return props.filter((pr) => pr.t === 'db').map((pr) => (pr.mid ? [lerpPt(J.wL, J.wR, 0.5)] : [J.wL, J.wR]).map((p) =>
    `<g class="prop${ghost ? ' prop-ghost' : ''}"><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="4.2"/></g>`).join('')).join('');
}
const drawn = (ex, J, ghost) => (ex.cam ? wideSVG(ex, J, ghost) + wideProps(ex.props || [], J, ghost) : propsSVG(ex.props || [], J, ghost) + bodySVG(J, ghost));
export const CAM_LABEL = { front: 'Von vorn', top: 'Von oben' };

function propsSVG(props, J, ghost) {
  let s = '';
  const cls = ghost ? ' prop-ghost' : '';
  for (const pr of props) {
    if (pr.t === 'db') {
      for (const key of pr.at ? [pr.at] : pr.both === false ? ['w'] : ['w2', 'w']) {
        const p = J[key];
        s += `<g class="prop${cls}"><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="4.2"/></g>`;
        if (J.w2[0] === J.w[0] && J.w2[1] === J.w[1]) break;
      }
    } else if (pr.t === 'bb') {
      let p = J[pr.at || 'w'];
      if (pr.back) { const td = norm(sub(J.n, J.hp)); p = add(J.n, [td[1] * pr.back, -td[0] * pr.back]); }
      s += `<g class="prop${cls}"><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="7.5"/><circle class="prop-hub" cx="${f1(p[0])}" cy="${f1(p[1])}" r="1.6"/></g>`;
    } else if (pr.t === 'kb') {
      const u = norm(sub(J.w, J.e));
      const c = add(J.w, [u[0] * 6.5, u[1] * 6.5]);
      s += `<g class="prop${cls}"><path class="prop-line" d="${line(J.w, c)}"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="5"/></g>`;
    } else if (pr.t === 'band' && !ghost) {
      // from = fester Ankerpunkt oder Gelenkname (Band am Körper, z. B. um den Fuß)
      const body = typeof pr.from === 'string', q = body ? J[pr.from] : pr.from;
      s += `<path class="prop-band" d="${line(q, J[pr.to || 'w'])}"/>` + (body ? '' : `<circle class="prop-anchor" cx="${q[0]}" cy="${q[1]}" r="1.8"/>`);
    }
  }
  return s;
}

function staticSVG(props) {
  let s = '';
  for (const pr of props) {
    if (pr.t === 'bench') {
      s += `<g class="equip"><rect x="${pr.x}" y="${pr.y}" width="${pr.w}" height="3.5" rx="1.5"/>` +
        `<path d="M${pr.x + 4},${pr.y + 3}V${GROUND}M${pr.x + pr.w - 4},${pr.y + 3}V${GROUND}"/></g>`;
    } else if (pr.t === 'bar') {
      s += `<g class="equip"><path d="M${pr.x - 24},${pr.y}H${pr.x + 24}"/></g>`;
    } else if (pr.t === 'wall') {
      s += `<g class="equip"><path d="M${pr.x},4V${GROUND}"/></g>`;
    }
  }
  return s;
}

// Quadratischer Ausschnitt um den Inhalt (für runde Thumbnails)
function fitView(ex) {
  const xs = [], ys = [];
  for (const J of posesOf(ex)) for (const k in J) if (Array.isArray(J[k])) { xs.push(J[k][0]); ys.push(J[k][1]); }
  const hs = posesOf(ex).map((J) => J.h);
  hs.forEach((h) => { xs.push(h[0] - L.head, h[0] + L.head); ys.push(h[1] - L.head, h[1] + L.head); });
  for (const pr of ex.props || []) {
    if (pr.t === 'bench') { xs.push(pr.x, pr.x + pr.w); ys.push(pr.y); }
    if (pr.t === 'bar') { ys.push(pr.y); }
    if (pr.t === 'band' && typeof pr.from !== 'string') { xs.push(pr.from[0]); ys.push(pr.from[1]); }
  }
  if (!ex.noGround && ex.cam !== 'top') ys.push(GROUND);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = Math.max(x1 - x0, y1 - y0) * 1.3 + 8;
  return `${f1((x0 + x1) / 2 - s / 2)} ${f1((y0 + y1) / 2 - s / 2)} ${f1(s)} ${f1(s)}`;
}

function frame(ex, inner, fit) {
  const view = fit ? fitView(ex) : ex.view || '0 0 100 100';
  const ground = ex.noGround || ex.cam === 'top' ? '' : `<path class="fig-ground" d="M2,${GROUND + 1.5}H98"/>`;
  return `<svg class="fig" viewBox="${view}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${ground}${staticSVG(ex.props || [])}${inner}${!fit && ex.cam ? `<text class="fig-cam" x="50" y="99">${CAM_LABEL[ex.cam]}</text>` : ''}</svg>`;
}

const cache = new Map();
function posesOf(ex) {
  if (!cache.has(ex.id)) cache.set(ex.id, ex.cam ? ex.poses : ex.poses.map(solve));
  return cache.get(ex.id);
}

// Statische Darstellung: Startpose blass, Hauptpose kräftig (ex.key, sonst die zweite Pose)
export function figureStatic(ex, fit = false) {
  const P = posesOf(ex);
  if (P.length === 1) return frame(ex, drawn(ex, P[0]), fit);
  return frame(ex, drawn(ex, P[0], true) + drawn(ex, P[ex.key ?? 1]), fit);
}

// Ablauf einer Wiederholung: ex.seq = Reihenfolge der Posen (Standard: alle der Reihe nach), danach zurück zur ersten.
// Posen mit via: true werden ohne Halt durchlaufen. Zusammen HOLD_SUM der Zeit wird in den übrigen Posen gehalten.
const HOLD_SUM = 0.24;
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const timelines = new Map();
function timeline(ex) {
  if (timelines.has(ex.id)) return timelines.get(ex.id);
  const seq = ex.seq || ex.poses.map((_, i) => i), n = seq.length;
  const stops = seq.map((_, i) => i).filter((i) => i === 0 || !ex.poses[seq[i]].via);
  // ex.dur = Gewicht je Abschnitt (Standard: alle gleich lang)
  const w = seq.map((_, i) => ex.dur?.[i] ?? 1), sum = w.reduce((a, b) => a + b, 0);
  const hold = HOLD_SUM / stops.length, unit = (1 - HOLD_SUM) / sum;
  let at = 0;
  const legs = stops.map((from, k) => {
    const to = k + 1 < stops.length ? stops[k + 1] : n, part = w.slice(from, to), len = part.reduce((a, b) => a + b, 0), o = { from, segs: to - from, part, len, t1: at + hold, t2: at + hold + len * unit };
    at = o.t2;
    return o;
  });
  const tl = { seq, n, legs };
  timelines.set(ex.id, tl);
  return tl;
}

// Nahe und ferne Seite tauschen (ex.alt: jede zweite Wiederholung mit der anderen Seite)
function mirror(q) {
  const o = { ...q }, leg2 = q.th2 != null || q.a2, arm2 = q.ua2 != null || q.w2;
  const swap = (has, keys) => { if (has) for (const k of keys) { o[k] = q[k + '2']; o[k + '2'] = q[k]; } };
  swap(leg2, ['th', 'sh', 'a', 'ab', 'ff', 'fd']);
  swap(arm2, ['ua', 'fa', 'w', 'wb']);
  return o;
}
const mirrored = new Map();
function poseOf(ex, i, m) {
  if (!m) return [ex.poses[i], posesOf(ex)[i]];
  if (!mirrored.has(ex.id)) mirrored.set(ex.id, ex.poses.map((q) => { const p = mirror(q); return [p, solve(p)]; }));
  return mirrored.get(ex.id)[i];
}

// Figur zur Phase ph: ganze Zahl = Wiederholung, Nachkomma = Fortschritt darin
export function figureAt(ex, ph) {
  const P = posesOf(ex);
  let J = P[0];
  if (P.length > 1) {
    const rep = Math.floor(ph + 1e-9), { seq, n, legs } = timeline(ex);
    let x = Math.max(0, ph - rep);
    if (ex.rev && rep % 2 === 1) x = 1 - x; // jede zweite Wiederholung rückwärts
    const L = legs.find((l) => x < l.t2) || legs[legs.length - 1];
    let u = x <= L.t1 ? 0 : ease(Math.min(1, (x - L.t1) / (L.t2 - L.t1))) * L.len, k = 0;
    while (k < L.segs - 1 && u >= L.part[k]) u -= L.part[k++];
    const v = k + Math.min(1, u / L.part[k]), i = L.from + k, m = !!ex.alt && rep % 2 === 1;
    const [pA, A] = poseOf(ex, seq[i], m);
    const [pB, B] = i + 1 < n ? poseOf(ex, seq[i + 1], m) : poseOf(ex, seq[0], ex.alt ? !m : false);
    J = ex.cam ? wideBetween(A, B, v - k) : inbetween(ex, pA, pB, A, B, v - k);
  }
  return drawn(ex, J);
}

// Animiert die Posenfolge; liefert Stop-Funktion. Ein Zyklus = eine Wiederholung, passend zum Tempo der Übung.
// period: Sekunden pro Wiederholung. phase(): optional, liefert die Phase vom Trainings-Timer
// (Wiederholung + Anteil) oder null = in Startpose halten (Vorlauf, noch nicht gestartet).
export function animateFigure(el, ex, { period = 3, phase } = {}) {
  const P = posesOf(ex);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (P.length === 1 || reduce) { el.innerHTML = figureStatic(ex); return () => {}; }
  el.innerHTML = frame(ex, '<g class="anim"></g>');
  const g = el.querySelector('.anim');
  let raf, start = performance.now(), stopped = false, last = '';
  const tick = (now) => {
    if (stopped || !el.isConnected) return;
    const ph = phase ? phase() : Math.max(0, (now - start) / 1000 / period);
    const svg = figureAt(ex, ph ?? 0);
    if (svg !== last) { g.innerHTML = svg; last = svg; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => { stopped = true; cancelAnimationFrame(raf); };
}
