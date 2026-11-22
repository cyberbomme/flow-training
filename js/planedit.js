// Plan-Struktur mit Supersets + Drag & Drop für den Plan-Editor.
// Item-Typen: { type:'ex' } | { type:'rest', dur } | { type:'group', rounds, rest, items:[ex…] }
// In einem Superset gibt es keine Pause zwischen den Übungen; Pause (rest) folgt nach jeder Runde.

// ── Modell ────────────────────────────────────────────────
export function walk(items, fn, parent = null) {
  for (let i = 0; i < items.length; i++) {
    if (fn(items[i], items, i, parent) === false) return false;
    if (items[i].type === 'group' && walk(items[i].items, fn, items[i]) === false) return false;
  }
}

export function find(items, id) {
  let r = null;
  walk(items, (it, arr, i, parent) => { if (it.id === id) { r = { it, arr, i, parent }; return false; } });
  return r;
}

export function remove(items, id) {
  const f = find(items, id);
  if (f) f.arr.splice(f.i, 1);
  return f?.it;
}

// Gruppen mit einer Übung auflösen, leere entfernen
export function normalize(items) {
  for (let i = items.length - 1; i >= 0; i--) {
    const g = items[i];
    if (g.type !== 'group') continue;
    if (!g.items.length) items.splice(i, 1);
    else if (g.items.length === 1) items.splice(i, 1, { ...g.items[0], sets: g.rounds, rest: g.rest });
  }
}

// Alle Übungen in Planreihenfolge, mit Superset-Bezug
export function flatten(items) {
  const out = [];
  let letter = 0;
  for (const it of items) {
    if (it.type === 'ex') out.push({ it, group: null });
    else if (it.type === 'group') {
      const L = 'ABCDEFGHIJ'[letter++];
      it.items.forEach((m, i) => out.push({ it: m, group: it, label: `${L}${i + 1}` }));
    }
  }
  return out;
}

export function letterOf(items, gid) {
  let k = 0;
  for (const it of items) if (it.type === 'group') { if (it.id === gid) return 'ABCDEFGHIJ'[k]; k++; }
  return '';
}

export function moveTo(items, srcId, targetId, pos, newId) {
  if (srcId === targetId || !find(items, targetId)) return;
  const item = remove(items, srcId);
  if (!item) return;
  const t = find(items, targetId);
  if (!t) { items.push(item); normalize(items); return; }
  if (pos === 'merge') {
    if (t.it.type === 'group') t.it.items.push(item);
    else if (t.parent) t.arr.splice(t.i + 1, 0, item);
    else t.arr.splice(t.i, 1, { id: newId(), type: 'group', rounds: t.it.sets, rest: t.it.rest, items: [t.it, item] });
  } else if (t.parent && item.type !== 'ex') {
    const g = find(items, t.parent.id);
    g.arr.splice(g.i + (pos === 'after' ? 1 : 0), 0, item);
  } else {
    t.arr.splice(t.i + (pos === 'after' ? 1 : 0), 0, item);
  }
  normalize(items);
}

export function unlink(items, id) {
  const f = find(items, id);
  if (!f?.parent) return;
  const g = f.parent;
  f.arr.splice(f.i, 1);
  const gf = find(items, g.id);
  gf.arr.splice(gf.i + 1, 0, { ...f.it, sets: g.rounds, rest: g.rest });
  normalize(items);
}

export function split(items, gid) {
  const f = find(items, gid);
  if (!f || f.it.type !== 'group') return;
  const g = f.it;
  f.arr.splice(f.i, 1, ...g.items.map((m) => ({ ...m, sets: g.rounds, rest: g.rest })));
}

export function reId(items, newId) {
  walk(items, (it) => { it.id = newId(); });
}

// ── Drag & Drop ───────────────────────────────────────────
// Griff [data-handle] ziehen = sortieren; auf Übung/Superset-Kopf ziehen und kurz halten = Superset.
const MERGE_DELAY = 450;
let drag = null;
let line = null;
let onDrop = null;
let suppressClick = false;

export function initDrag(dropHandler) {
  onDrop = dropHandler;
  line = document.createElement('div');
  line.className = 'drop-line';
  document.body.appendChild(line);

  document.addEventListener('pointerdown', (e) => {
    if (drag || e.button > 0) return;
    const h = e.target.closest('#plan-list [data-handle]');
    if (!h) return;
    e.preventDefault();
    start(h.closest('[data-id]'), e.clientX, e.clientY);
  });
  window.addEventListener('pointermove', (e) => { if (drag) move(e.clientX, e.clientY); });
  window.addEventListener('touchmove', (e) => {
    if (!drag) return;
    e.preventDefault();
    move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  window.addEventListener('pointerup', () => { if (drag) end(); });
  window.addEventListener('touchend', () => { if (drag) end(); });
  // Klick nach dem Loslassen nicht als Antippen werten
  document.addEventListener('click', (e) => {
    if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopPropagation(); }
  }, true);
}

function start(el, x, y) {
  const r = el.getBoundingClientRect();
  const ghost = el.cloneNode(true);
  ghost.classList.add('drag-ghost');
  Object.assign(ghost.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px' });
  document.body.appendChild(ghost);
  el.classList.add('dragging');
  drag = { id: el.dataset.id, kind: el.dataset.kind, el, ghost, dy: y - r.top, x, y, target: null, mergeId: null, armed: false, timer: null };
  autoScroll();
}

function clearMerge() {
  clearTimeout(drag.timer);
  drag.timer = null; drag.armed = false; drag.mergeId = null;
  document.querySelectorAll('.merge-hover, .merge-armed').forEach((e) => e.classList.remove('merge-hover', 'merge-armed'));
}

function setLine(e, pos) {
  const r = e.getBoundingClientRect();
  Object.assign(line.style, { display: 'block', left: r.left + 'px', width: r.width + 'px', top: (pos === 'before' ? r.top - 5 : r.bottom + 2) + 'px' });
  drag.target = { id: e.dataset.id, pos };
}
const hideLine = () => { line.style.display = 'none'; };

function move(x, y) {
  drag.x = x; drag.y = y;
  drag.ghost.style.top = (y - drag.dy) + 'px';
  const cands = [...document.querySelectorAll('#plan-list [data-id]')].filter((e) => e !== drag.el && !drag.el.contains(e));
  let hit = null;
  for (const e of cands) {
    const r = e.getBoundingClientRect();
    if (y >= r.top && y <= r.bottom && (!hit || r.height < hit.r.height)) hit = { e, r };
  }
  const canMerge = (drag.kind === 'ex' || drag.kind === 'member') && !document.querySelector('#plan-list[data-nomerge]');
  if (!hit) {
    clearMerge();
    const tops = [...document.querySelectorAll('#plan-list > [data-id]')].filter((e) => e !== drag.el);
    if (!tops.length) { drag.target = null; hideLine(); return; }
    const first = tops[0].getBoundingClientRect(), last = tops[tops.length - 1].getBoundingClientRect();
    if (y < first.top) setLine(tops[0], 'before');
    else if (y > last.bottom) setLine(tops[tops.length - 1], 'after');
    else hideLine();
    return;
  }
  let { e, r } = hit;
  let kind = e.dataset.kind;
  if (kind === 'member' && !canMerge) { e = e.closest('[data-kind="group"]'); r = e.getBoundingClientRect(); kind = 'group'; }
  const rel = (y - r.top) / r.height;
  let mergeZone = false;
  if (canMerge && kind !== 'rest') {
    if (kind === 'group') { const h = e.querySelector('.g-head').getBoundingClientRect(); mergeZone = y >= h.top && y <= h.bottom; }
    else mergeZone = rel > 0.28 && rel < 0.72;
  }
  if (mergeZone) {
    hideLine();
    if (drag.mergeId !== e.dataset.id) {
      clearMerge();
      drag.mergeId = e.dataset.id;
      e.classList.add('merge-hover');
      drag.timer = setTimeout(() => {
        if (!drag) return;
        drag.armed = true;
        e.classList.remove('merge-hover');
        e.classList.add('merge-armed');
      }, MERGE_DELAY);
    }
    drag.target = { id: e.dataset.id, pos: 'merge' };
  } else {
    clearMerge();
    setLine(e, rel < 0.5 ? 'before' : 'after');
  }
}

function end() {
  const d = drag;
  const armed = d.armed;
  clearMerge();
  drag = null;
  hideLine();
  d.ghost.remove();
  d.el.classList.remove('dragging');
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 60);
  if (!d.target || (d.target.pos === 'merge' && !armed)) return;
  onDrop(d.id, d.target.id, d.target.pos);
}

function autoScroll() {
  if (!drag) return;
  const edge = 80, H = window.innerHeight;
  let v = 0;
  if (drag.y < edge) v = -Math.ceil((edge - drag.y) / 6);
  else if (drag.y > H - edge) v = Math.ceil((drag.y - (H - edge)) / 6);
  if (v) { window.scrollBy(0, v); move(drag.x, drag.y); }
  requestAnimationFrame(autoScroll);
}
