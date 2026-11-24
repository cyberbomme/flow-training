// DEMO (vor dem Merge entfernen): legt die Konzepte A/B/C für die Übungsinfo über die echte App,
// ohne js/app.js zu ändern. Dazu der Vergleich der Figuren „heute / Entwurf von vorn“.
import { db } from '../js/store.js';
import { byId, TEMPO, isStretch } from '../js/exercises.js';
import { animateFigure } from '../js/figure.js';
import { FRONT } from './entwurf-front.js';

const $ = (x, r = document) => r.querySelector(x), $$ = (x, r = document) => [...r.querySelectorAll(x)];
let mode = 'a'; try { mode = localStorage.getItem('demo.info') || 'a'; } catch {}
const guide = new Set(); let flipped = null;

const css = document.createElement('style');
css.textContent = `
  .d-tap { position: relative; cursor: pointer; } .ic-circle.d-tap { overflow: visible; } .ic-circle.d-tap > svg { border-radius: 50%; overflow: hidden; }
  .d-i { position: absolute; right: -3px; bottom: -3px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-forest); color: var(--color-surface); display: grid; place-items: center; font: 600 12px/1 var(--font-body); border: 2px solid var(--color-surface); }
  .tr-hero > .d-i { width: 34px; height: 34px; font-size: 17px; right: calc(50% - 112px); bottom: 14px; border-color: var(--color-bg); }
  .d-btn { flex: none; width: 36px; height: 36px; border-radius: 50%; border: 0; background: var(--color-fill); color: var(--color-forest); font: 600 16px/1 var(--font-body); cursor: pointer; display: grid; place-items: center; }
  .prow-main .d-btn { margin-right: -8px; } .next-card .d-btn { margin-left: auto; }
  .d-name { display: flex; align-items: center; justify-content: center; gap: 10px; } .d-name .tr-name { min-width: 0; } .d-name .d-btn { margin-top: 16px; }
  .d-sheet { text-align: left; max-height: 86vh; overflow: auto; gap: 14px; } .d-sheet .serif { margin: 0; }
  .d-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .d-timer { flex: none; background: var(--color-peach); color: var(--color-text); border-radius: 999px; padding: 6px 12px; font: 600 16px/1 var(--font-display); font-variant-numeric: tabular-nums; }
  .d-sheet .fig-hero, .d-full .fig-hero { margin: 0; height: 190px; width: auto; max-height: none; aspect-ratio: auto; }
  .d-full { position: fixed; inset: 0; z-index: 60; background: var(--color-bg); overflow: auto; padding: calc(16px + env(safe-area-inset-top)) 16px calc(40px + env(safe-area-inset-bottom)); display: grid; gap: 14px; align-content: start; text-align: left; }
  .d-full h1 { margin: 0; } .d-back { border: 0; background: none; color: var(--color-forest); font: inherit; padding: 8px 0; text-align: left; cursor: pointer; } .d-back svg { width: 18px; height: 18px; vertical-align: -3px; }
  .d-flip { background: var(--color-sage-light); border-radius: var(--r-box); height: min(60vw, 250px); box-sizing: border-box; overflow: auto; text-align: left; padding: 14px 16px; font-size: 15px; line-height: 1.4; } .d-flip.rose { background: var(--color-peach); }
  .d-flip b { display: block; } .d-flip ul { margin: 2px 0 0; padding-left: 18px; } .d-flip small { color: var(--color-text-muted); display: block; margin-top: 8px; }
  .d-inl { font-size: 15px; line-height: 1.45; display: grid; gap: 8px; } .d-inl .fig-hero { margin: 0; height: 150px; width: auto; max-height: none; aspect-ratio: auto; } .d-inl ul { margin: 0; padding-left: 18px; color: var(--color-text-muted); }
  .d-bar { position: fixed; z-index: 50; left: 50%; transform: translateX(-50%); bottom: calc(env(safe-area-inset-bottom) + 8px); display: flex; gap: 4px; padding: 4px; border-radius: 999px; background: var(--color-text); }
  body:not([data-view="training"]) .d-bar { top: calc(env(safe-area-inset-top) + 6px); bottom: auto; left: auto; right: 8px; transform: none; }
  .d-bar button { border: 0; border-radius: 999px; min-width: 34px; height: 30px; padding: 0 10px; background: none; color: var(--color-bg); font: 600 13px/1 var(--font-body); cursor: pointer; } .d-bar button.on { background: var(--color-bg); color: var(--color-text); }
  div:has(> .d-sheet) + .d-bar { display: none; }
  .d-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; } .d-pair .fig-hero { height: auto; aspect-ratio: 1; } .d-pair small { color: var(--color-text-muted); }
  .d-full section { background: var(--color-surface); border-radius: var(--r-card); padding: 12px; display: grid; gap: 8px; }`;
document.head.append(css);
const ov = document.createElement('div'), bar = document.createElement('div'); bar.className = 'd-bar';
document.body.append(ov, bar);
const drawBar = () => { bar.innerHTML = [['a', 'A'], ['b', 'B'], ['c', 'C'], ['f', 'Figuren']].map(([k, l]) => `<button data-k="${k}" class="${k === mode ? 'on' : ''}" aria-label="${k === 'f' ? 'Figuren vergleichen' : 'Konzept ' + l}">${l}</button>`).join(''); };
drawBar();

const bulb = '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>';
const check = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>', back = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
const period = (e) => (isStretch(e) && !e.dynamic ? 6 : db.tempo?.[e.id] ?? TEMPO[e.id] ?? 3);
const run = (root) => $$('[data-fig]', root).forEach((el) => { const e = byId[el.dataset.fig] || FRONT.find((x) => x.id === el.dataset.fig); animateFigure(el, e, { period: e.of ? (e.seq ? 5 : TEMPO[e.of] ?? 3) : period(e) }); });
const list = (e) => (e.cues?.length ? `<ul>${e.cues.map((x) => `<li>${x}</li>`).join('')}</ul>` : '');
const body = (e) => `<div class="fig-hero ${isStretch(e) ? 'rose' : ''}" data-fig="${e.id}"></div>
  <div class="info-box" style="margin:0"><span class="ic">${bulb}</span><div><b>So geht’s</b><p>${e.how}</p></div></div>
  ${e.cues?.length ? `<ul class="checklist">${e.cues.map((x) => `<li><span class="ck">${check}</span><span>${x}</span></li>`).join('')}</ul>` : ''}`;
const inTr = () => document.body.dataset.view === 'training' && !!db.active;
const timer = () => (inTr() && db.active.timer && $('#tdisp') ? `<span class="d-timer">${$('#tdisp').textContent}</span>` : '');
setInterval(() => { const t = $('.d-timer'), d = $('#tdisp'); if (t && d) t.textContent = d.textContent; }, 200);
const close = () => { ov.innerHTML = ''; };
function info(id) {
  const e = byId[id]; if (!e) return;
  if (mode === 'b') ov.innerHTML = `<div class="d-full"><div class="d-top"><button class="d-back">${back}Zurück ${inTr() ? 'zum Training' : 'zum Plan'}</button>${timer()}</div><h1>${e.name}</h1>${body(e)}</div>`;
  else ov.innerHTML = `<div class="sheet-bg" data-x></div><div class="sheet d-sheet" role="dialog" aria-label="${e.name}"><div class="d-top"><p class="serif">${e.name}</p>${timer()}</div>${body(e)}<button class="btn big" data-x>Schließen</button></div>`;
  run(ov);
}
function figures() {
  ov.innerHTML = `<div class="d-full"><button class="d-back">${back}Zurück zur App</button><h1>Figuren</h1>
    <section><b>Beincurl liegend: Arme korrigiert</b><div class="fig-hero" data-fig="beincurl-kh"></div></section>
    ${FRONT.map((e) => `<section><b>${e.name}</b><div class="d-pair"><div><div class="fig-hero" data-fig="${e.of}"></div><small>Heute</small></div><div><div class="fig-hero" data-fig="${e.id}"></div><small>Entwurf</small></div></div></section>`).join('')}</div>`;
  run(ov);
}

// Übung zu einer Zeile bzw. einem Trainingsschritt
const find = (items, id) => { for (const it of items || []) { if (it.id === id) return it; const m = it.items && find(it.items, id); if (m) return m; } return null; };
const exOfRow = (id) => { for (const p of [...Object.values(db.drafts || {}), ...db.plans]) { const it = find(p.items, id); if (it) return it.exId; } return null; };
const exOfStep = (s) => (s?.k === 'work' ? find(db.active.items, s.item)?.exId : null);
const here = () => db.active?.steps[db.active.idx], next = () => db.active?.steps[db.active.idx + 1];

function decorate() {
  $$('.prow[data-id]').forEach((r) => {
    const ex = exOfRow(r.dataset.id); if (!ex) return;
    if (mode === 'a') { const i = $('.prow-main .ic-circle', r); if (!$('.d-i', i)) { i.classList.add('d-tap'); i.dataset.info = ex; i.insertAdjacentHTML('beforeend', '<span class="d-i">i</span>'); } }
    if (mode === 'b' && !$('.d-btn', r)) $('.handle', r)?.insertAdjacentHTML('beforebegin', `<button class="d-btn" data-info="${ex}" aria-label="Anleitung">i</button>`);
    const f = $('.pfields', r);
    if (mode === 'c' && f && !$('.d-seg', f)) {
      const on = guide.has(r.dataset.id), e = byId[ex];
      [...f.children].forEach((v) => { v.style.display = on ? 'none' : ''; });
      f.insertAdjacentHTML('afterbegin', `<div class="seg d-seg"><button class="${on ? '' : 'on'}" data-g="0" data-row="${r.dataset.id}">Werte</button><button class="${on ? 'on' : ''}" data-g="1" data-row="${r.dataset.id}">Anleitung</button></div>`);
      if (on) { f.insertAdjacentHTML('beforeend', `<div class="d-inl"><div class="fig-hero ${isStretch(e) ? 'rose' : ''}" data-fig="${ex}"></div><span>${e.how}</span>${list(e)}</div>`); run(f); }
    }
  });
  if (!inTr() || !here()) return;
  const cur = exOfStep(here()), nx = exOfStep(next()), hero = $('.tr-hero'), card = $('.next-card');
  if (mode === 'a') {
    if (cur && hero && !$('.d-i', hero)) { hero.classList.add('d-tap'); hero.dataset.info = cur; hero.insertAdjacentHTML('beforeend', '<span class="d-i">i</span>'); }
    if (nx && card && !$('.d-i', card)) { const i = $('.ic-circle', card); i.classList.add('d-tap'); card.style.cursor = 'pointer'; card.dataset.info = nx; i.insertAdjacentHTML('beforeend', '<span class="d-i">i</span>'); }
  }
  if (mode === 'b') {
    const n = $('.tr-name');
    if (cur && n && !n.parentElement.classList.contains('d-name')) { const w = document.createElement('div'); w.className = 'd-name'; n.replaceWith(w); w.append(n); w.insertAdjacentHTML('beforeend', `<button class="d-btn" data-info="${cur}" aria-label="Anleitung">i</button>`); }
    if (nx && card && !$('.d-btn', card)) card.insertAdjacentHTML('beforeend', `<button class="d-btn" data-info="${nx}" aria-label="Anleitung der nächsten Übung">i</button>`);
  }
  if (mode === 'c') {
    if (cur && hero) { hero.dataset.flip = cur; hero.style.cursor = 'pointer'; }
    if (nx && card) { card.dataset.flip = nx; card.style.cursor = 'pointer'; }
    const key = flipped && `${db.active.idx}:${flipped.ex}`;
    if (flipped && flipped.key === key && hero && !$('.d-flip', hero)) { const e = byId[flipped.ex]; hero.innerHTML = `<div class="d-flip ${cur ? '' : 'rose'}"><b>${flipped.ex === cur ? 'So geht’s' : e.name}</b>${e.how}${list(e)}<small>Antippen: zurück</small></div>`; hero.dataset.flip = flipped.ex; }
  }
}
const rerender = () => window.dispatchEvent(new HashChangeEvent('hashchange'));
new MutationObserver(() => decorate()).observe($('#main'), { childList: true, subtree: true });
decorate();

window.addEventListener('click', (ev) => {
  const t = ev.target, hit = (s) => t.closest?.(s), stop = () => { ev.stopPropagation(); ev.preventDefault(); };
  let el;
  if ((el = hit('.d-bar [data-k]'))) { stop(); const k = el.dataset.k; if (k === 'f') { figures(); return; } mode = k; flipped = null; close(); try { localStorage.setItem('demo.info', k); } catch {} drawBar(); rerender(); return; }
  if (hit('.d-back') || hit('[data-x]')) { stop(); close(); return; }
  if ((el = hit('[data-g]'))) { stop(); el.dataset.g === '1' ? guide.add(el.dataset.row) : guide.delete(el.dataset.row); rerender(); return; }
  if ((el = hit('[data-info]'))) { stop(); info(el.dataset.info); return; }
  if ((el = hit('[data-flip]'))) { stop(); const key = `${db.active.idx}:${el.dataset.flip}`; flipped = flipped?.key === key ? null : { ex: el.dataset.flip, key }; rerender(); }
}, true);
