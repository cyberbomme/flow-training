// ENTWURF (nicht in der App): Figuren „von oben“ und „von vorn“ mit Schulter- und Hüftbreite.
// Gelenke je Seite als Punkte; Zwischenposen über Winkel und Länge zum Elterngelenk (Glieder dürfen perspektivisch kürzer werden).
const PARENT = { eL: 'sL', eR: 'sR', wL: 'eL', wR: 'eR', kL: 'pL', kR: 'pR', aL: 'kL', aR: 'kR' };
const ORDER = ['h', 'sL', 'sR', 'pL', 'pR', 'eL', 'eR', 'wL', 'wR', 'kL', 'kR', 'aL', 'aR'];
const rot = (p, c, deg) => { const r = (deg * Math.PI) / 180, x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * Math.cos(r) - y * Math.sin(r), c[1] + x * Math.sin(r) + y * Math.cos(r)]; };
const rotKeys = (P, keys, c, deg) => ({ ...P, ...Object.fromEntries(keys.map((k) => [k, rot(P[k], c, deg)])) });

function mix(A, B, t) {
  const o = {};
  for (const k of ORDER) {
    if (!A[k] || !B[k]) continue;
    const pa = PARENT[k];
    if (!pa || A.lin) { o[k] = [A[k][0] + (B[k][0] - A[k][0]) * t, A[k][1] + (B[k][1] - A[k][1]) * t]; continue; }
    const v = (P) => [P[k][0] - P[pa][0], P[k][1] - P[pa][1]], a = v(A), b = v(B);
    const la = Math.hypot(...a), lb = Math.hypot(...b), ga = Math.atan2(a[1], a[0]), d = ((Math.atan2(b[1], b[0]) - ga + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
    const g = ga + d * t, l = la + (lb - la) * t;
    o[k] = [o[pa][0] + Math.cos(g) * l, o[pa][1] + Math.sin(g) * l];
  }
  o.nose = A.nose == null ? null : A.nose + (B.nose - A.nose) * t;
  return o;
}

const LIE = { h: [50, 15], sL: [42, 28], sR: [58, 28], pL: [45, 54], pR: [55, 54] };
const T_ARMS = { eL: [29, 28], wL: [17, 28], eR: [71, 28], wR: [83, 28] };
const BENT = { h: [50, 50], sL: [41, 46], sR: [59, 46] };
const HANG = { eL: [40, 60], wL: [41, 73], eR: [60, 60], wR: [59, 73] };
const TOP = { h: [50, 52], sL: [38, 52], sR: [62, 52], pL: [43, 52], pR: [57, 52] };
const ROTA = { ...TOP, eL: [43, 39], wL: [49, 27], eR: [57, 39], wR: [51, 27], nose: 0 };
const ARMS = ['h', 'sL', 'sR', 'eL', 'eR', 'wL', 'wR'];
const turn = (deg) => ({ ...rotKeys(ROTA, ARMS, [50, 52], deg), nose: deg });
const SW = { ...LIE, ...T_ARMS, kL: [47, 60], kR: [53, 60], aL: [48, 64], aR: [52, 64] };
const RL = { ...LIE, ...T_ARMS, kL: [47, 65], kR: [53, 65], aL: [47, 76], aR: [53, 76], nose: 180 };
const WALL = { h: [50, 54], sL: [39, 54], sR: [61, 54], pL: [44, 54], pR: [56, 54], eL: [27, 52], wL: [27, 39], eR: [63, 60], wR: [61, 66], nose: 0 };
const W2 = rotKeys({ ...WALL, h: [51, 50], sL: [40, 50], sR: [62, 50], pL: [45, 50], pR: [57, 50], eR: [64, 56], wR: [62, 62] }, ['sL', 'sR', 'pL', 'pR', 'eR', 'wR'], [51, 50], 38);

export const DRAFTS = [
  { id: 'flys', cam: 'Von oben', db: true, seq: [0, 1], poses: [
    { ...LIE, eL: [41, 34], wL: [48, 29], eR: [59, 34], wR: [52, 29], kL: [45, 66], kR: [55, 66], aL: [45, 78], aR: [55, 78] },
    { ...LIE, eL: [29, 31], wL: [17, 28], eR: [71, 31], wR: [83, 28], kL: [45, 66], kR: [55, 66], aL: [45, 78], aR: [55, 78] }] },
  { id: 'einbein-rotation', cam: 'Von oben', db: 'mid', hipsFar: true, seq: [0, 1, 0, 2], poses: [ROTA, turn(48), turn(-48)] },
  { id: 'beinheben-seitlich', cam: 'Von oben', seq: [0, 1, 0, 2], poses: [SW,
    { ...SW, pL: [46, 53], pR: [55, 55], kL: [65, 58], kR: [73, 61], aL: [84, 60], aR: [92, 63] },
    { ...SW, pL: [45, 55], pR: [54, 53], kL: [27, 61], kR: [35, 58], aL: [8, 63], aR: [16, 60] }] },
  { id: 'rotation-liegend', cam: 'Von oben', seq: [0, 1], poses: [RL,
    { ...RL, pL: [47, 53], pR: [55, 56], kL: [66, 60], kR: [71, 66], aL: [64, 75], aR: [67, 83], nose: 270 }] },
  { id: 'brust-dehnung-wand', cam: 'Von oben', wall: 24, hipsFar: true, seq: [0, 1], poses: [WALL, { ...W2, nose: 38 }] },
  { id: 'reverse-flys', cam: 'Von vorn', db: true, ground: true, seq: [0, 1], poses: [
    { ...BENT, ...HANG, pL: [45, 52], pR: [55, 52], kL: [44, 71], kR: [56, 71], aL: [44, 90], aR: [56, 90] },
    { ...BENT, eL: [28, 44], wL: [15, 42], eR: [72, 44], wR: [85, 42], pL: [45, 52], pR: [55, 52], kL: [44, 71], kR: [56, 71], aL: [44, 90], aR: [56, 90] }] },
  { id: 'rudern-breit', cam: 'Von vorn', db: true, ground: true, seq: [0, 1], poses: [
    { ...BENT, ...HANG, pL: [44, 55], pR: [56, 55], kL: [30, 71], kR: [70, 71], aL: [28, 90], aR: [72, 90] },
    { ...BENT, eL: [27, 45], wL: [28, 58], eR: [73, 45], wR: [72, 58], pL: [44, 55], pR: [56, 55], kL: [30, 71], kR: [70, 71], aL: [28, 90], aR: [72, 90] }] },
  { id: 'schmetterling', cam: 'Von vorn', ground: true, seq: [0, 1], poses: [
    { h: [50, 33], sL: [42, 46], sR: [58, 46], pL: [45, 75], pR: [55, 75], kL: [31, 64], kR: [69, 64], aL: [48, 85], aR: [52, 85], eL: [38, 60], wL: [47, 83], eR: [62, 60], wR: [53, 83] },
    { h: [50, 35], sL: [42, 48], sR: [58, 48], pL: [45, 75], pR: [55, 75], kL: [26, 78], kR: [74, 78], aL: [48, 85], aR: [52, 85], eL: [37, 62], wL: [47, 83], eR: [63, 62], wR: [53, 83] }] },
];

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
export function draftAt(d, ph) {
  const n = d.seq.length, x = (ph % 1) * n, i = Math.floor(x), u = x - i, t = u < 0.24 ? 0 : ease((u - 0.24) / 0.76);
  return mix(d.poses[d.seq[i]], d.poses[d.seq[(i + 1) % n]], t);
}
export function draftSVG(d, J) {
  const f = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`, pl = (...a) => (a.every(Boolean) ? 'M' + a.map(f).join('L') : '');
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const hips = pl(J.pL, J.pR), spine = d.cam === 'Von oben' && !J.kL ? '' : pl(mid(J.sL, J.sR), mid(J.pL, J.pR));
  const legs = pl(J.pL, J.kL, J.aL) + pl(J.pR, J.kR, J.aR);
  const far = d.hipsFar ? hips : d.cam === 'Von vorn' && J.h[1] > J.sL[1] ? hips + legs : '';
  const near = (far ? '' : hips + legs) + spine + pl(J.sL, J.sR) + pl(J.sL, J.eL, J.wL) + pl(J.sR, J.eR, J.wR) + (d.hipsFar ? '' : pl(mid(J.sL, J.sR), J.h));
  const nose = J.nose == null ? '' : (() => { const r = (J.nose * Math.PI) / 180, s = Math.sin(r), c = -Math.cos(r); return `M${f([J.h[0] + s * 6, J.h[1] + c * 6])}L${f([J.h[0] + s * 9.5, J.h[1] + c * 9.5])}`; })();
  const db = !d.db ? [] : d.db === 'mid' ? [mid(J.wL, J.wR)] : [J.wL, J.wR];
  return `<svg class="fig" viewBox="0 0 100 100" aria-hidden="true">${d.ground ? '<path class="fig-ground" d="M2,91.5H98"/>' : ''}${d.wall ? `<g class="equip"><path d="M${d.wall},8V92"/></g>` : ''}
    ${db.map((p) => `<g class="prop"><circle cx="${p[0]}" cy="${p[1]}" r="4.2"/></g>`).join('')}
    <g class="fig-body"><path class="fig-far" d="${far}"/><path d="${near}${nose}"/><circle class="fig-head" cx="${J.h[0]}" cy="${J.h[1]}" r="6"/></g></svg>`;
}
