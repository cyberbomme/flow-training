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
  const [e, w] = limb(n, p.ua, p.fa, p.w, L.ua, L.fa, p.wb ?? 1);
  const hasArm2 = p.ua2 != null || p.w2;
  const [e2, w2] = hasArm2 ? limb(n, p.ua2, p.fa2, p.w2, L.ua, L.fa, p.wb2 ?? 1) : [e, w];
  const [k, a] = limb(hp, p.th, p.sh, p.a, L.thigh, L.shin, p.ab ?? -1);
  const hasLeg2 = p.th2 != null || p.a2;
  const [k2, a2] = hasLeg2 ? limb(hp, p.th2, p.sh2, p.a2, L.thigh, L.shin, p.ab2 ?? -1) : [k, a];
  const f = footOf(k, a, p.ff ?? 1);
  const f2 = footOf(k2, a2, p.ff2 ?? p.ff ?? 1);
  return { hp, n, h, e, w, e2, w2, k, a, k2, a2, f, f2 };
}

function lerpJ(A, B, t) {
  const o = {};
  for (const key in A) o[key] = [lerp(A[key][0], B[key][0], t), lerp(A[key][1], B[key][1], t)];
  return o;
}

const f1 = (x) => Math.round(x * 10) / 10;
const pt = (p) => `${f1(p[0])},${f1(p[1])}`;
const line = (p, q) => `M${pt(p)}L${pt(q)}`;
const poly = (...ps) => 'M' + ps.map(pt).join('L');

function bodySVG(J, ghost) {
  const far = poly(J.f2, J.a2, J.k2, J.hp) + poly(J.n, J.e2, J.w2);
  const near = poly(J.f, J.a, J.k, J.hp, J.n) + poly(J.n, J.e, J.w) + line(J.n, J.h);
  const cls = ghost ? 'fig-ghost' : 'fig-body';
  return `<g class="${cls}"><path class="fig-far" d="${far}"/><path d="${near}"/>` +
    `<circle class="fig-head" cx="${f1(J.h[0])}" cy="${f1(J.h[1])}" r="${L.head}"/></g>`;
}

function propsSVG(props, J, ghost) {
  let s = '';
  const cls = ghost ? ' prop-ghost' : '';
  for (const pr of props) {
    if (pr.t === 'db') {
      for (const key of pr.both === false ? ['w'] : ['w2', 'w']) {
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
      s += `<path class="prop-band" d="${line(pr.from, J[pr.to || 'w'])}"/><circle class="prop-anchor" cx="${pr.from[0]}" cy="${pr.from[1]}" r="1.8"/>`;
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

function frame(ex, inner) {
  const view = ex.view || '0 0 100 100';
  const ground = ex.noGround ? '' : `<path class="fig-ground" d="M2,${GROUND + 1.5}H98"/>`;
  return `<svg class="fig" viewBox="${view}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${ground}${staticSVG(ex.props || [])}${inner}</svg>`;
}

const cache = new Map();
function posesOf(ex) {
  if (!cache.has(ex.id)) cache.set(ex.id, ex.poses.map(solve));
  return cache.get(ex.id);
}

// Statische Darstellung: Startpose blass, Endpose kräftig
export function figureStatic(ex) {
  const P = posesOf(ex);
  const props = ex.props || [];
  if (P.length === 1) return frame(ex, propsSVG(props, P[0]) + bodySVG(P[0]));
  return frame(ex, propsSVG(props, P[0], true) + bodySVG(P[0], true) + propsSVG(props, P[1]) + bodySVG(P[1]));
}

function figureAt(ex, t) {
  const P = posesOf(ex);
  const J = P.length === 1 ? P[0] : lerpJ(P[0], P[1], t);
  return propsSVG(ex.props || [], J) + bodySVG(J);
}

// Animiert zwischen den Posen; liefert Stop-Funktion
export function animateFigure(el, ex) {
  const P = posesOf(ex);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (P.length === 1 || reduce) { el.innerHTML = figureStatic(ex); return () => {}; }
  el.innerHTML = frame(ex, '<g class="anim"></g>');
  const g = el.querySelector('.anim');
  const hold = 450, move = 1100, cycle = 2 * (hold + move);
  const ease = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  let raf, start = performance.now(), stopped = false;
  const tick = (now) => {
    if (stopped || !el.isConnected) return;
    const c = (now - start) % cycle;
    let t;
    if (c < hold) t = 0;
    else if (c < hold + move) t = ease((c - hold) / move);
    else if (c < 2 * hold + move) t = 1;
    else t = 1 - ease((c - 2 * hold - move) / move);
    g.innerHTML = figureAt(ex, t);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => { stopped = true; cancelAnimationFrame(raf); };
}
