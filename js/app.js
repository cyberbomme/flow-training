import { EXERCISES, EQUIPMENT, byId } from './exercises.js';
import { figureStatic, animateFigure } from './figure.js';
import { db, save, uid, exportJSON, importJSON } from './store.js';
import * as T from './timer.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const fmtNum = (n) => (n == null ? '' : String(Math.round(n * 100) / 100).replace('.', ','));
const fmtDate = (t, opts = { day: '2-digit', month: '2-digit', year: '2-digit' }) => new Date(t).toLocaleDateString('de-DE', opts);
const fmtDur = (s) => { const m = Math.round(s / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`; };

const main = $('#main');
let stops = [];
let ticker = null;
let lastHash = null;
let catQuery = '';
let metricSel = null;
let exitSheet = false;
let wakeLock = null;

T.setSound(db.sound);

// Erscheinungsbild: 'system' | 'light' | 'dark'. Kopie in localStorage für das Inline-Skript im <head> (kein Aufblitzen).
function applyTheme() {
  const t = db.theme || 'system';
  if (t === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  try { localStorage.setItem('flow.theme', t); } catch {}
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

// ── Hilfen ────────────────────────────────────────────────
const equipNames = (ex) => ex.equip.length ? ex.equip.map((id) => EQUIPMENT.find((e) => e.id === id).name).join(' + ') : 'Ohne Geräte';
const planById = (id) => db.plans.find((p) => p.id === id);

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2200);
}

// Gleiche aufeinanderfolgende Sätze zusammenfassen: „3 × 12 Wdh. @ 20 kg · 1 × 10 Wdh. @ 20 kg“
function setsText(sets, mode) {
  const one = (s) => (mode === 'time' ? `${fmtNum(s.dur)} s` : `${fmtNum(s.reps)} Wdh.`) + (s.weight ? ` @ ${fmtNum(s.weight)} kg` : '');
  const runs = [];
  for (const s of sets) {
    const t = one(s), last = runs[runs.length - 1];
    if (last && last.t === t) last.n++; else runs.push({ t, n: 1 });
  }
  return runs.map((r) => `${r.n} × ${r.t}`).join(' · ');
}

function lastFor(exId) {
  for (let i = db.history.length - 1; i >= 0; i--) {
    const it = db.history[i].items.find((x) => x.exId === exId);
    if (it) return { date: db.history[i].date, ...it };
  }
  return null;
}

function newItem(exId) {
  const ex = byId[exId], last = lastFor(exId);
  const item = { id: uid(), type: 'ex', exId, sets: 3, mode: ex.mode, reps: 10, dur: 30, weight: null, rest: 60 };
  if (last?.sets.length) {
    const s = last.sets[last.sets.length - 1];
    item.mode = last.mode; item.sets = last.sets.length;
    if (s.reps) item.reps = s.reps;
    if (s.dur) item.dur = s.dur;
    item.weight = s.weight ?? null;
  }
  return item;
}

function planEstimate(p) {
  let s = 0, n = 0;
  for (const it of p.items) {
    if (it.type === 'rest') { s += it.dur; continue; }
    n++;
    s += it.sets * (it.mode === 'time' ? it.dur : it.reps * 3 + 10) + Math.max(0, it.sets - 1) * it.rest;
  }
  return { n, s };
}

const icon = {
  katalog: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.5v6M7 10.5h10M12 13.5l-3.5 6M12 13.5l3.5 6"/></svg>',
  plaene: '<svg viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8.5h6M9 12h6M9 15.5h4"/></svg>',
  verlauf: '<svg viewBox="0 0 24 24"><path d="M4 19.5h16M6 16l4-5 3.5 3 5-7"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M6 14l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M6 10l6 6 6-6"/></svg>',
  del: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path class="fill" d="M8 5.5v13l10.5-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect class="fill" x="7" y="7" width="10" height="10" rx="1.5"/></svg>',
  rest: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 2M10 3.5h4"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/></svg>',
  bellOff: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 9.5-4.9M18 11v5l1.5 2H8M10 20.5a2 2 0 0 0 4 0M4 4l16 16"/></svg>',
};

// TODO(Design): Platzhalter-Signet – echtes Line-Art-Logo (meditierende Figur über fließender Form) fehlt noch (DESIGN.md §9).
// Farbvarianten über currentColor: .logo (forest), .logo.rose, .logo.white
const LOGO = `<span class="logo" role="img" aria-label="flow.training"><svg viewBox="0 0 32 32">
  <circle cx="16" cy="7.5" r="2.6"/><path d="M16 11v6.5M10.5 15l5.5 2.5 5.5-2.5M9 21.5c3-2.4 11-2.4 14 0"/>
  <path d="M4 26c3.5-2.6 6.5 1.6 10 0s6.5-2.4 9.5-.4 4.5 1.2 4.5 1.2"/></svg></span>`;

// Florale Line-Art in Rosé – nur auf Leer- und Erfolgs-Screens
const LEAF = `<span class="leaf" aria-hidden="true"><svg viewBox="0 0 64 64">
  <path d="M32 58C32 42 30 28 22 14"/><path d="M27 34c-8 1-14-3-16-10 7-1 13 2 16 10z"/><path d="M30 46c7-2 13 0 16 6-7 2-13 0-16-6z"/>
  <path d="M24 22c6-3 7-10 4-15-5 3-7 9-4 15z"/><path d="M31 32c6-4 13-3 17 2-6 4-13 3-17-2z"/></svg></span>`;

const SIGNATURES = [
  'Dein Zyklus. Deine Stärke.',
  'Trainiere mit deinem Körper, nicht gegen ihn.',
  'Anpassung – nicht Verzicht.',
  'Kraft ist mehr als Optik.',
  'Regeneration ist kein Trainingsausfall. Sie ist Teil des Trainings.',
];

// AppHeader: Titel links, Signet rechts, dünne Linie darunter
const header = (title, back) => `<header class="app-head">${back ? `<a class="back" href="${back[0]}">${icon.back}${esc(back[1])}</a>` : ''}
  <div class="head-row"><h1>${esc(title)}</h1>${LOGO}</div></header>`;
const pill = (t) => `<h2 class="pill-label">${t}</h2>`;
const empty = (line, sub = '', cta = '') => `<div class="empty">${LEAF}<p class="serif">${line}</p>${sub ? `<p>${sub}</p>` : ''}${cta}</div>`;
const circleFig = (ex, cls = "") => `<div class="ic-circle ${cls}">${figureStatic(ex, true)}</div>`;

// ── Router ────────────────────────────────────────────────
const route = () => (location.hash.slice(2) || 'katalog').split('/').map(decodeURIComponent);
const go = (h) => { location.hash = '#/' + h; };
window.addEventListener('hashchange', render);

function render() {
  stops.forEach((f) => f()); stops = [];
  clearInterval(ticker); ticker = null;
  const [view, a, b] = route();
  let html;
  if (view === 'katalog') html = viewCatalog();
  else if (view === 'uebung') html = viewExercise(a);
  else if (view === 'plaene') html = viewPlans();
  else if (view === 'plan' && b === 'add') html = viewCatalog(a);
  else if (view === 'plan') html = viewPlanEditor(a);
  else if (view === 'training') html = viewTraining();
  else if (view === 'verlauf' && a) html = viewSession(a);
  else if (view === 'verlauf') html = viewHistory();
  else if (view === 'fortschritt') html = viewProgress(a);
  else { go('katalog'); return; }
  main.innerHTML = html;
  document.body.dataset.view = view;

  for (const el of $$('[data-anim]', main)) stops.push(animateFigure(el, byId[el.dataset.anim]));
  if (view === 'katalog' || (view === 'plan' && b === 'add')) renderCatalogList(b === 'add' ? a : null);
  if (view === 'fortschritt') drawChart();
  if (view === 'training') startTicker();
  manageWakeLock(view === 'training');

  $$('.tabbar a').forEach((t) => t.classList.toggle('on', t.dataset.tab === tabOf(view)));
  const banner = $('#resume');
  banner.hidden = !db.active || view === 'training';
  if (db.active) $('#resume-name').textContent = db.active.planName;

  if (location.hash !== lastHash) { window.scrollTo(0, 0); lastHash = location.hash; }
}
const tabOf = (v) => ({ katalog: 'katalog', uebung: 'katalog', plaene: 'plaene', plan: 'plaene', verlauf: 'verlauf', fortschritt: 'verlauf' })[v];

// ── Katalog ───────────────────────────────────────────────
function viewCatalog(pickFor) {
  const plan = pickFor && planById(pickFor);
  const head = plan ? header('Übung hinzufügen', [`#/plan/${plan.id}`, plan.name]) : header('Übungen');
  return `${head}
    <input class="search" type="search" id="q" placeholder="Übung suchen" value="${esc(catQuery)}" autocomplete="off">
    <div class="filter-label"><p class="overline">Meine Ausrüstung</p><button class="link" data-act="equip-all">${db.equip.length ? 'keine' : 'alle'}</button></div>
    <div class="chips">${EQUIPMENT.map((e) => `<button class="chip ${db.equip.includes(e.id) ? 'on' : ''}" data-act="equip" data-id="${e.id}" aria-pressed="${db.equip.includes(e.id)}">${e.name}</button>`).join('')}</div>
    <div id="list" class="ilist"></div>`;
}

function renderCatalogList(pickFor) {
  const q = catQuery.trim().toLowerCase();
  const list = EXERCISES.filter((ex) => ex.equip.every((e) => db.equip.includes(e)))
    .filter((ex) => !q || (ex.name + ' ' + ex.muscles).toLowerCase().includes(q));
  const el = $('#list');
  if (!list.length) { el.innerHTML = empty('Keine passende Übung.', 'Wähl mehr Ausrüstung aus oder ändere die Suche.'); return; }
  el.innerHTML = list.map((ex) => `
    <a class="ilist-item" href="${pickFor ? '#' : '#/uebung/' + ex.id}" ${pickFor ? `data-act="pick" data-plan="${pickFor}" data-ex="${ex.id}"` : ''}>
      ${circleFig(ex)}
      <div class="ilist-text"><b>${esc(ex.name)}</b><small>${esc(ex.muscles)}</small>
      <span class="badge">${equipNames(ex)}${ex.mode === 'time' ? ' · Zeit' : ''}</span></div>
      <span class="chev">${pickFor ? icon.plus : icon.chev}</span>
    </a>`).join('');
}

// Beschreibung → erster Satz als Hinweis, Rest als Checkliste
function splitDesc(desc) {
  const s = desc.match(/[^.!?]+[.!?]+/g)?.map((x) => x.trim()) || [desc];
  return { lead: s[0], points: s.slice(1) };
}

function viewExercise(id) {
  const ex = byId[id];
  if (!ex) return header('Übung') + empty('Diese Übung gibt es nicht (mehr).');
  const last = lastFor(id);
  const { lead, points } = splitDesc(ex.desc);
  return header(ex.name, ['#/katalog', 'Übungen']) + `
    <div class="fig-hero" data-anim="${ex.id}"></div>
    <p class="overline">${esc(ex.muscles)}</p>
    <div class="badges"><span class="badge">${equipNames(ex)}</span><span class="badge">${ex.mode === 'time' ? 'Auf Zeit' : 'Wiederholungen'}</span></div>
    <div class="info-box"><span class="ic">${icon.bulb}</span><div><b>So geht’s</b><p>${esc(lead)}</p></div></div>
    ${points.length ? pill('Worauf ich achte') + `<ul class="checklist">${points.map((p) => `<li><span class="ck">${icon.check}</span><span>${esc(p)}</span></li>`).join('')}</ul>` : ''}
    ${last ? `<a class="row-link" href="#/fortschritt/${ex.id}"><span>Zuletzt ${fmtDate(last.date)}: ${setsText(last.sets, last.mode)}</span><span class="more">Verlauf</span></a>` : ''}
    ${pill('Zu Plan hinzufügen')}
    <div class="stack">
      ${db.plans.map((p) => `<button class="btn" data-act="add-to-plan" data-plan="${p.id}" data-ex="${ex.id}">${icon.plus}${esc(p.name)}</button>`).join('')}
      <button class="btn ghost" data-act="add-to-new" data-ex="${ex.id}">${icon.plus}Neuer Plan</button>
    </div>`;
}

// ── Pläne ─────────────────────────────────────────────────
function viewPlans() {
  if (!db.plans.length) {
    return header('Pläne') + empty('Noch kein Training geplant.', 'Starte mit deinem Körper, nicht gegen ihn.',
      `<button class="btn primary" data-act="new-plan">${icon.plus}Ersten Plan anlegen</button>`);
  }
  return header('Pläne') + `
    <div class="stack">
    ${db.plans.map((p) => {
      const { n, s } = planEstimate(p);
      return `<div class="plan">
        <a class="plan-main" href="#/plan/${p.id}"><b>${esc(p.name)}</b><small>${n} Übung${n === 1 ? '' : 'en'} · ca. ${fmtDur(s)}</small></a>
        <div class="plan-actions">
          <button class="btn primary" data-act="start" data-plan="${p.id}" ${n ? '' : 'disabled'}>${icon.play}Start</button>
          <button class="btn" data-act="dup-plan" data-plan="${p.id}">Kopieren</button>
          <button class="btn danger-text" data-act="del-plan" data-plan="${p.id}">Löschen</button>
        </div></div>`;
    }).join('')}
    <button class="btn ghost" data-act="new-plan">${icon.plus}Neuer Plan</button>
    </div>`;
}

function viewPlanEditor(id) {
  const p = planById(id);
  if (!p) return header('Plan', ['#/plaene', 'Pläne']) + empty('Diesen Plan gibt es nicht (mehr).');
  const items = p.items.map((it, i) => {
    const tools = `<div class="tools">
      <button class="icon-btn" data-act="mv" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="nach oben">${icon.up}</button>
      <button class="icon-btn" data-act="mv" data-dir="1" ${i === p.items.length - 1 ? 'disabled' : ''} aria-label="nach unten">${icon.down}</button>
      <button class="icon-btn" data-act="rm" aria-label="entfernen">${icon.del}</button></div>`;
    if (it.type === 'rest') {
      return `<li class="item rest" data-item="${it.id}"><div class="item-head"><div class="ic-circle sm rose">${icon.rest}</div><div class="item-name"><b>Pause</b></div>${tools}</div>
        <div class="fields"><label>Dauer (s)<input type="number" inputmode="numeric" data-f="dur" value="${it.dur}"></label></div></li>`;
    }
    const ex = byId[it.exId];
    const last = lastFor(it.exId);
    return `<li class="item" data-item="${it.id}">
      <div class="item-head">${circleFig(ex, 'sm')}
        <div class="item-name"><b>${esc(ex.name)}</b>${last ? `<small>Zuletzt: ${setsText(last.sets, last.mode)}</small>` : ''}</div>${tools}</div>
      <div class="seg"><button class="${it.mode === 'reps' ? 'on' : ''}" data-act="mode" data-mode="reps">Wiederholungen</button><button class="${it.mode === 'time' ? 'on' : ''}" data-act="mode" data-mode="time">Dauer</button></div>
      <div class="fields">
        <label>Sätze<input type="number" inputmode="numeric" data-f="sets" value="${it.sets}" min="1"></label>
        ${it.mode === 'time'
          ? `<label>Dauer (s)<input type="number" inputmode="numeric" data-f="dur" value="${it.dur}"></label>`
          : `<label>Wdh.<input type="number" inputmode="numeric" data-f="reps" value="${it.reps}"></label>`}
        <label>Gewicht (kg)<input type="text" inputmode="decimal" data-f="weight" value="${fmtNum(it.weight)}" placeholder="Körper"></label>
        <label>Satzpause (s)<input type="number" inputmode="numeric" data-f="rest" value="${it.rest}"></label>
      </div></li>`;
  }).join('');
  const { n, s } = planEstimate(p);
  return `<header class="app-head"><a class="back" href="#/plaene">${icon.back}Pläne</a>
      <div class="head-row"><input class="title-input" data-plan-name="${p.id}" value="${esc(p.name)}" aria-label="Name des Plans">${LOGO}</div></header>
    <p class="sub">${n} Übung${n === 1 ? '' : 'en'} · ca. ${fmtDur(s)} · wird automatisch gespeichert</p>
    <ol class="items" data-plan="${p.id}">${items || '<p class="hint">Noch leer. Füg Übungen und Pausen hinzu.</p>'}</ol>
    <div class="row">
      <a class="btn" href="#/plan/${p.id}/add">${icon.plus}Übung</a>
      <button class="btn peach" data-act="add-rest" data-plan="${p.id}">${icon.plus}Pause</button>
    </div>
    <button class="btn primary big" data-act="start" data-plan="${p.id}" ${n ? '' : 'disabled'}>${icon.play}Training starten</button>`;
}

// ── Training ──────────────────────────────────────────────
function buildSteps(items) {
  const steps = [];
  for (const it of items) {
    if (it.type === 'rest') { if (it.dur > 0) steps.push({ k: 'rest', dur: it.dur }); continue; }
    for (let s = 0; s < it.sets; s++) {
      steps.push({ k: 'work', item: it.id, set: s });
      if (s < it.sets - 1 && it.rest > 0) steps.push({ k: 'rest', dur: it.rest });
    }
  }
  return steps;
}

function startTraining(planId) {
  if (db.active && !confirm('Es läuft bereits ein Training. Verwerfen und neu starten?')) { go('training'); return; }
  const p = planById(planId);
  const items = JSON.parse(JSON.stringify(p.items));
  db.active = { planId, planName: p.name, startedAt: Date.now(), items, steps: buildSteps(items), idx: 0, log: {}, timer: null, cur: null };
  T.unlockAudio();
  enterStep(false);
  go('training');
}

function itemOf(step) { return db.active.items.find((i) => i.id === step.item); }

function enterStep(autoStart) {
  const A = db.active, step = A.steps[A.idx];
  A.timer = null; A.cur = null;
  if (step) {
    if (step.k === 'rest') {
      A.timer = T.makeTimer(step.dur);
      if (autoStart) T.start(A.timer);
    } else {
      const it = itemOf(step);
      const prev = A.log[it.id]?.[step.set] || A.log[it.id]?.[step.set - 1];
      A.cur = { reps: prev?.reps ?? it.reps, weight: prev?.weight ?? it.weight, dur: it.dur };
      if (it.mode === 'time') A.timer = T.makeTimer(it.dur);
    }
  }
  save();
}

function logSet(dur) {
  const A = db.active, step = A.steps[A.idx], it = itemOf(step);
  const entry = it.mode === 'time'
    ? { dur: Math.round(dur ?? it.dur), weight: A.cur.weight || null }
    : { reps: A.cur.reps, weight: A.cur.weight || null };
  (A.log[it.id] ||= [])[step.set] = entry;
}

function nextStep() {
  db.active.idx++;
  enterStep(true);
  render();
}

function viewTraining() {
  const A = db.active;
  if (!A) return header('Training') + empty('Gerade läuft kein Training.', '', `<a class="btn primary" href="#/plaene">Plan starten</a>`);
  const step = A.steps[A.idx];
  const pct = Math.round((A.idx / A.steps.length) * 100);
  const top = `<header class="tr-top">
      <button class="icon-btn" data-act="exit" aria-label="Training beenden">${icon.del}</button>
      <div class="tr-title"><b>${esc(A.planName)}</b><small>${Math.min(A.idx + 1, A.steps.length)} / ${A.steps.length}</small></div>
      <button class="icon-btn" data-act="sound" aria-label="Ton ${db.sound ? 'aus' : 'an'}schalten">${db.sound ? icon.bell : icon.bellOff}</button>
    </header><div class="progress"><div style="width:${pct}%"></div></div>`;
  const sheet = exitSheet ? `<div class="sheet-bg" data-act="exit-cancel"></div><div class="sheet">
      <p class="serif">Training beenden?</p>
      <button class="btn primary" data-act="finish">Beenden &amp; speichern</button>
      <button class="btn danger" data-act="discard">Verwerfen</button>
      <button class="btn" data-act="exit-cancel">Weiter trainieren</button></div>` : '';

  if (!step) return top + viewSummary() + sheet;

  const nav = `<div class="tr-nav">
      <button class="btn ghost" data-act="prev" ${A.idx === 0 ? 'disabled' : ''}>‹ Zurück</button>
      <button class="btn ghost" data-act="skip">Überspringen ›</button></div>`;

  if (step.k === 'rest') {
    const nx = A.steps[A.idx + 1];
    const nxText = nx ? (nx.k === 'rest' ? 'Pause' : `${byId[itemOf(nx).exId].name} – Satz ${nx.set + 1}`) : 'Geschafft';
    return top + `<section class="tr-step">
      <div class="rest-head"><div class="ic-circle rose">${icon.rest}</div></div>
      <h2 class="tr-name">Pause</h2>
      <p class="tr-set">Durchatmen. Regeneration ist Teil des Trainings.</p>
      ${timerBlock(true)}
      <p class="next">Als Nächstes: <b>${esc(nxText)}</b></p>
      </section>` + nav + sheet;
  }

  const it = itemOf(step), ex = byId[it.exId];
  const target = it.mode === 'time' ? `${it.dur} s` : `${it.reps} Wdh.`;
  return top + `<section class="tr-step">
    <div class="fig-tr" data-anim="${ex.id}"></div>
    <h2 class="tr-name">${esc(ex.name)}</h2>
    <p class="tr-set">Satz ${step.set + 1} von ${it.sets} · Ziel ${target}${it.weight ? ` × ${fmtNum(it.weight)} kg` : ''}</p>
    ${it.mode === 'time' ? timerBlock(false) : stepper('reps', 'Wiederholungen', A.cur.reps, 1)}
    ${stepper('weight', 'Gewicht (kg)', A.cur.weight, 1, 'Körper')}
    <button class="btn primary big" data-act="done">${icon.check}Satz erledigt</button>
    </section>` + nav + sheet;
}

function stepper(key, label, val, step, ph = '') {
  return `<div class="stepper-wrap"><span>${label}</span><div class="stepper" data-key="${key}">
    <button data-act="stp" data-d="${-step}" aria-label="weniger">−</button>
    <input type="text" inputmode="decimal" value="${fmtNum(val)}" placeholder="${ph}" data-cur="${key}">
    <button data-act="stp" data-d="${step}" aria-label="mehr">+</button></div></div>`;
}

function timerBlock(isRest) {
  const t = db.active.timer;
  const r = T.remaining(t);
  return `<div class="timer ${isRest ? 'is-rest' : ''}">
      <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/>
      <circle class="ring" cx="60" cy="60" r="54" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - (r / t.total) * 100}"/></svg>
      <div class="time" id="tdisp">${T.fmt(r)}</div>
    </div>
    <div class="tbtns">
      <button class="btn primary" data-act="t-start" id="t-start" ${t.running ? 'disabled' : ''}>${icon.play}Start</button>
      <button class="btn" data-act="t-pause" id="t-pause" ${t.running ? '' : 'disabled'}>${icon.pause}Pause</button>
      <button class="btn" data-act="t-stop">${icon.stop}Stop</button>
    </div>
    <div class="tadj"><button class="link" data-act="t-add" data-s="-15">−15 s</button><button class="link" data-act="t-add" data-s="15">+15 s</button></div>`;
}

let lastBeep = null;
function startTicker() {
  const A = db.active;
  if (!A?.timer) return;
  lastBeep = null;
  const tick = () => {
    const t = A.timer;
    if (!t || db.active !== A) return;
    const r = T.remaining(t);
    const d = $('#tdisp'), ring = $('.timer .ring');
    if (d) d.textContent = T.fmt(r);
    if (ring) ring.setAttribute('stroke-dashoffset', 100 - (r / t.total) * 100);
    $('#t-start')?.toggleAttribute('disabled', t.running);
    $('#t-pause')?.toggleAttribute('disabled', !t.running);
    if (!t.running) return;
    const sec = Math.ceil(r);
    if (sec <= 3 && sec > 0 && sec !== lastBeep) { lastBeep = sec; T.beep('tick'); }
    if (r <= 0) {
      T.pause(t); T.beep('end');
      const step = A.steps[A.idx];
      if (step.k === 'work') logSet(t.total);
      nextStep();
    }
  };
  tick();
  ticker = setInterval(tick, 200);
}

function viewSummary() {
  const A = db.active;
  const mins = fmtDur((Date.now() - A.startedAt) / 1000);
  const rows = A.items.filter((i) => i.type === 'ex' && A.log[i.id]?.some(Boolean))
    .map((i) => `<li class="ck-row"><span class="ck">${icon.check}</span><div><b>${esc(byId[i.exId].name)}</b><small>${setsText(A.log[i.id].filter(Boolean), i.mode)}</small></div></li>`).join('');
  const quote = SIGNATURES[Math.floor((A.startedAt / 1000) % SIGNATURES.length)];
  return `<section class="summary">
    ${LEAF}
    <h2 class="hero-title">Stark<span class="accent">gemacht!</span></h2>
    <p class="sub">${mins} · ${A.items.filter((i) => i.type === 'ex' && A.log[i.id]?.some(Boolean)).length} Übungen</p>
    <ul class="list checklist-list">${rows || '<li>Keine Sätze erfasst.</li>'}</ul>
    <blockquote class="quote-card">${quote}</blockquote>
    <button class="btn primary big" data-act="finish">${icon.check}Speichern</button>
    <button class="btn ghost" data-act="prev">‹ Zurück</button>
    <button class="btn danger-text" data-act="discard">Verwerfen</button></section>`;
}

function finishTraining() {
  const A = db.active;
  const items = A.items.filter((i) => i.type === 'ex' && A.log[i.id]?.some(Boolean))
    .map((i) => ({ exId: i.exId, mode: i.mode, sets: A.log[i.id].filter(Boolean) }));
  if (items.length) {
    const s = { id: uid(), date: A.startedAt, end: Date.now(), planId: A.planId, planName: A.planName, items };
    db.history.push(s);
    db.active = null; exitSheet = false; save();
    toast('Stark gemacht! 💚 Training gespeichert');
    go('verlauf/' + s.id);
  } else {
    db.active = null; exitSheet = false; save();
    toast('Nichts erfasst – nicht gespeichert');
    go('plaene');
  }
}

async function manageWakeLock(on) {
  try {
    if (on && !wakeLock && 'wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch {}
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && route()[0] === 'training') { manageWakeLock(true); render(); }
});

// ── Verlauf ───────────────────────────────────────────────
function exerciseStats() {
  const m = new Map();
  for (const s of db.history) for (const it of s.items) {
    const e = m.get(it.exId) || { n: 0, last: 0 };
    e.n++; e.last = Math.max(e.last, s.date); m.set(it.exId, e);
  }
  return [...m.entries()].filter(([id]) => byId[id]).sort((a, b) => b[1].last - a[1].last);
}

function viewHistory() {
  const sessions = [...db.history].sort((a, b) => b.date - a.date);
  const stats = exerciseStats();
  const theme = db.theme || 'system';
  return header('Verlauf') + `
    ${!sessions.length ? empty('Kraft ist mehr als Optik.', 'Nach deinem ersten gespeicherten Training siehst du hier deinen Fortschritt.',
      `<a class="btn primary" href="#/plaene">Zu deinen Plänen</a>`) : `
    ${pill('Fortschritt je Übung')}
    <div class="list-links">${stats.map(([id, s]) => `<a href="#/fortschritt/${id}"><span>${esc(byId[id].name)}</span><small>${s.n}× · ${fmtDate(s.last)}</small></a>`).join('')}</div>
    ${pill('Trainings')}
    <div class="list-links">${sessions.map((s) => `<a href="#/verlauf/${s.id}"><span>${esc(s.planName)}</span><small>${fmtDate(s.date, { weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit' })} · ${fmtDur((s.end - s.date) / 1000)}</small></a>`).join('')}</div>`}
    ${pill('Einstellungen &amp; Daten')}
    <div class="stack">
      <div class="setting"><span>Erscheinungsbild</span>
        <div class="seg" role="radiogroup">${[['system', 'System'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([k, l]) =>
          `<button class="${theme === k ? 'on' : ''}" data-act="theme" data-theme="${k}" role="radio" aria-checked="${theme === k}">${l}</button>`).join('')}</div></div>
      <label class="setting toggle"><span>Ton beim Timer</span><input type="checkbox" data-act="sound-cb" ${db.sound ? 'checked' : ''}></label>
      <button class="btn" data-act="export">Daten exportieren (JSON)</button>
      <label class="btn ghost">Daten importieren<input type="file" accept="application/json,.json" id="import" hidden></label>
      <p class="hint">Deine Daten liegen nur auf diesem Gerät. Exportier sie ab und zu, dann gehen sie nicht verloren.</p>
    </div>`;
}

function viewSession(id) {
  const s = db.history.find((x) => x.id === id);
  if (!s) return header('Training', ['#/verlauf', 'Verlauf']) + empty('Dieses Training gibt es nicht (mehr).');
  return header(s.planName, ['#/verlauf', 'Verlauf']) + `
    <p class="sub">${fmtDate(s.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${new Date(s.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · ${fmtDur((s.end - s.date) / 1000)}</p>
    <ul class="list">${s.items.map((it) => `<li><a href="#/fortschritt/${it.exId}">${byId[it.exId] ? circleFig(byId[it.exId], 'sm') : ''}
      <div><b>${esc(byId[it.exId]?.name || it.exId)}</b><small>${setsText(it.sets, it.mode)}</small></div></a></li>`).join('')}</ul>
    <button class="btn danger-text" data-act="del-session" data-id="${s.id}">Training löschen</button>`;
}

const METRICS = [
  { k: 'maxW', label: 'Max. Gewicht', unit: 'kg' },
  { k: 'vol', label: 'Volumen', unit: 'kg' },
  { k: 'reps', label: 'Wdh. gesamt', unit: 'Wdh.' },
  { k: 'bestReps', label: 'Beste Serie', unit: 'Wdh.' },
  { k: 'maxDur', label: 'Längste Dauer', unit: 's' },
  { k: 'sumDur', label: 'Dauer gesamt', unit: 's' },
];

function seriesFor(exId) {
  const pts = [];
  for (const s of [...db.history].sort((a, b) => a.date - b.date)) {
    const its = s.items.filter((i) => i.exId === exId);
    if (!its.length) continue;
    const sets = its.flatMap((i) => i.sets);
    const ws = sets.map((x) => x.weight || 0);
    pts.push({
      date: s.date, sid: s.id,
      text: its.map((i) => setsText(i.sets, i.mode)).join(' / '),
      maxW: Math.max(...ws) || null,
      vol: sets.reduce((a, x) => a + (x.reps || 0) * (x.weight || 0), 0) || null,
      reps: sets.reduce((a, x) => a + (x.reps || 0), 0) || null,
      bestReps: Math.max(...sets.map((x) => x.reps || 0)) || null,
      maxDur: Math.max(...sets.map((x) => x.dur || 0)) || null,
      sumDur: sets.reduce((a, x) => a + (x.dur || 0), 0) || null,
    });
  }
  return pts;
}

function viewProgress(exId) {
  const ex = byId[exId];
  if (!ex) return header('Fortschritt', ['#/verlauf', 'Verlauf']) + empty('Diese Übung gibt es nicht (mehr).');
  const pts = seriesFor(exId);
  const avail = METRICS.filter((m) => pts.some((p) => p[m.k] != null));
  if (!avail.find((m) => m.k === metricSel)) metricSel = avail[0]?.k;
  return header(ex.name, ['#/verlauf', 'Verlauf']) + `<p class="overline">Fortschritt</p>
    ${pts.length ? `
    <div class="chips">${avail.map((m) => `<button class="chip ${m.k === metricSel ? 'on' : ''}" data-act="metric" data-k="${m.k}">${m.label}</button>`).join('')}</div>
    <div id="chart" class="chart" data-ex="${exId}"></div>
    <table class="tbl"><thead><tr><th>Datum</th><th>${METRICS.find((m) => m.k === metricSel).label}</th><th>Sätze</th></tr></thead><tbody>
    ${[...pts].reverse().map((p) => `<tr><td>${fmtDate(p.date)}</td><td>${p[metricSel] != null ? fmtNum(p[metricSel]) : '–'}</td><td>${p.text}</td></tr>`).join('')}
    </tbody></table>` : empty('Noch keine Daten zu dieser Übung.')}
    <a class="row-link" href="#/uebung/${ex.id}"><span>Zur Übung</span><span class="more">Ansehen</span></a>`;
}

function niceTicks(lo, hi, n = 4) {
  const span = hi - lo || 1;
  const step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0);
  const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step;
  const t = []; for (let v = a; v <= b + step / 2; v += step) t.push(Math.round(v * 1000) / 1000);
  return t;
}

function drawChart() {
  const el = $('#chart');
  if (!el) return;
  const m = METRICS.find((x) => x.k === metricSel);
  const pts = seriesFor(el.dataset.ex).filter((p) => p[m.k] != null);
  const W = el.clientWidth, H = 220, pl = 40, pr = 14, pt = 14, pb = 28;
  const vals = pts.map((p) => p[m.k]);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (lo === hi) { lo = Math.max(0, lo - 1); hi = hi + 1; }
  const pad = (hi - lo) * 0.15; lo = Math.max(0, lo - pad); hi += pad;
  const ticks = niceTicks(lo, hi);
  const y0 = ticks[0], y1 = ticks[ticks.length - 1];
  const t0 = pts[0].date, t1 = pts[pts.length - 1].date;
  const X = (t) => (t1 === t0 ? (pl + W - pr) / 2 : pl + ((t - t0) / (t1 - t0)) * (W - pl - pr));
  const Y = (v) => pt + (1 - (v - y0) / (y1 - y0)) * (H - pt - pb);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.date).toFixed(1)},${Y(p[m.k]).toFixed(1)}`).join('');
  const xl = (p, anchor) => `<text class="ax" x="${X(p.date)}" y="${H - 8}" text-anchor="${anchor}">${fmtDate(p.date, { day: '2-digit', month: '2-digit' })}</text>`;
  el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${m.label} im Verlauf">
    ${ticks.map((t) => `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${Y(t)}" y2="${Y(t)}"/><text class="ax" x="${pl - 6}" y="${Y(t) + 4}" text-anchor="end">${fmtNum(t)}</text>`).join('')}
    ${xl(pts[0], pts.length > 1 ? 'start' : 'middle')}${pts.length > 1 ? xl(pts[pts.length - 1], 'end') : ''}
    <line class="cross" id="cross" y1="${pt}" y2="${H - pb}" visibility="hidden"/>
    <path class="series" d="${path}"/>
    ${pts.map((p, i) => `<circle class="dot" data-i="${i}" cx="${X(p.date)}" cy="${Y(p[m.k])}" r="4"/>`).join('')}
    <rect class="hit" x="0" y="0" width="${W}" height="${H}"/>
  </svg><div class="tip" id="tip" hidden></div>`;
  const svg = $('svg', el), tip = $('#tip'), cross = $('#cross');
  const show = (ev) => {
    const r = svg.getBoundingClientRect(), x = ev.clientX - r.left;
    let best = 0;
    pts.forEach((p, i) => { if (Math.abs(X(p.date) - x) < Math.abs(X(pts[best].date) - x)) best = i; });
    const p = pts[best], cx = X(p.date);
    cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.setAttribute('visibility', 'visible');
    $$('.dot', svg).forEach((d) => d.classList.toggle('on', +d.dataset.i === best));
    tip.hidden = false;
    tip.innerHTML = `<b>${fmtNum(p[m.k])} ${m.unit}</b><small>${fmtDate(p.date)}</small><small>${p.text}</small>`;
    const tw = tip.offsetWidth;
    tip.style.left = Math.min(Math.max(cx - tw / 2, 0), W - tw) + 'px';
    tip.style.top = Math.max(0, Y(p[m.k]) - tip.offsetHeight - 12) + 'px';
  };
  svg.addEventListener('pointerdown', show);
  svg.addEventListener('pointermove', show);
  svg.addEventListener('pointerleave', () => { tip.hidden = true; cross.setAttribute('visibility', 'hidden'); $$('.dot', svg).forEach((d) => d.classList.remove('on')); });
}
let resizeT;
window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => route()[0] === 'fortschritt' && drawChart(), 150); });

// ── Ereignisse ────────────────────────────────────────────
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-act]');
  if (!btn) return;
  const act = btn.dataset.act;
  const A = db.active;
  const itemEl = btn.closest('[data-item]');
  const planEl = btn.closest('[data-plan]');

  switch (act) {
    case 'equip': {
      const id = btn.dataset.id;
      db.equip = db.equip.includes(id) ? db.equip.filter((x) => x !== id) : [...db.equip, id];
      save(); btn.classList.toggle('on');
      $('[data-act="equip-all"]').textContent = db.equip.length ? 'keine' : 'alle';
      renderCatalogList(route()[2] === 'add' ? route()[1] : null);
      break;
    }
    case 'equip-all':
      db.equip = db.equip.length ? [] : EQUIPMENT.map((e) => e.id); save(); render(); break;
    case 'pick': {
      ev.preventDefault();
      const p = planById(btn.dataset.plan);
      p.items.push(newItem(btn.dataset.ex)); save();
      toast(`${byId[btn.dataset.ex].name} hinzugefügt`);
      go('plan/' + p.id);
      break;
    }
    case 'add-to-plan': {
      const p = planById(btn.dataset.plan);
      p.items.push(newItem(btn.dataset.ex)); save();
      toast(`Zu „${p.name}“ hinzugefügt`);
      break;
    }
    case 'add-to-new': {
      const p = { id: uid(), name: 'Neuer Plan', items: [newItem(btn.dataset.ex)] };
      db.plans.push(p); save(); go('plan/' + p.id);
      break;
    }
    case 'new-plan': {
      const p = { id: uid(), name: 'Neuer Plan', items: [] };
      db.plans.push(p); save(); go('plan/' + p.id);
      break;
    }
    case 'dup-plan': {
      const src = planById(btn.dataset.plan);
      const p = JSON.parse(JSON.stringify(src));
      p.id = uid(); p.name = src.name + ' (Kopie)'; p.items.forEach((i) => { i.id = uid(); });
      db.plans.splice(db.plans.indexOf(src) + 1, 0, p); save(); render();
      break;
    }
    case 'del-plan': {
      const p = planById(btn.dataset.plan);
      if (confirm(`Plan „${p.name}“ löschen? Der Verlauf bleibt erhalten.`)) { db.plans = db.plans.filter((x) => x !== p); save(); render(); }
      break;
    }
    case 'add-rest': {
      const p = planById(btn.dataset.plan);
      p.items.push({ id: uid(), type: 'rest', dur: 90 }); save(); render();
      break;
    }
    case 'mv': case 'rm': case 'mode': {
      const p = planById(planEl.dataset.plan);
      const i = p.items.findIndex((x) => x.id === itemEl.dataset.item);
      if (act === 'mv') { const j = i + +btn.dataset.dir; [p.items[i], p.items[j]] = [p.items[j], p.items[i]]; }
      if (act === 'rm') p.items.splice(i, 1);
      if (act === 'mode') p.items[i].mode = btn.dataset.mode;
      save(); render();
      break;
    }
    case 'start': startTraining(btn.dataset.plan); break;

    // Training
    case 'stp': {
      const key = btn.closest('.stepper').dataset.key;
      const v = (A.cur[key] ?? 0) + +btn.dataset.d;
      A.cur[key] = key === 'weight' ? (v > 0 ? v : null) : Math.max(0, v);
      $(`[data-cur="${key}"]`).value = fmtNum(A.cur[key]);
      save();
      break;
    }
    case 'done': {
      const step = A.steps[A.idx];
      if (itemOf(step).mode === 'time') {
        const t = A.timer; T.pause(t);
        const el = t.total - T.remaining(t);
        logSet(el >= 1 ? el : t.total);
      } else logSet();
      T.unlockAudio();
      nextStep();
      break;
    }
    case 'skip': T.unlockAudio(); nextStep(); break;
    case 'prev': if (A.idx > 0) { A.idx--; enterStep(false); render(); } break;
    case 't-start': T.unlockAudio(); T.start(A.timer); T.beep('start'); save(); break;
    case 't-pause': T.pause(A.timer); save(); break;
    case 't-stop': T.reset(A.timer); lastBeep = null; save(); render(); break;
    case 't-add': T.addTime(A.timer, +btn.dataset.s); save(); break;
    case 'sound': db.sound = !db.sound; T.setSound(db.sound); save(); render(); break;
    case 'exit': exitSheet = true; render(); break;
    case 'exit-cancel': exitSheet = false; render(); break;
    case 'finish': finishTraining(); break;
    case 'discard':
      if (confirm('Training verwerfen? Erfasste Sätze gehen verloren.')) { db.active = null; exitSheet = false; save(); go('plaene'); }
      break;

    // Verlauf
    case 'metric': metricSel = btn.dataset.k; render(); break;
    case 'theme': db.theme = btn.dataset.theme; save(); applyTheme(); render(); break;
    case 'del-session':
      if (confirm('Dieses Training aus dem Verlauf löschen?')) { db.history = db.history.filter((s) => s.id !== btn.dataset.id); save(); go('verlauf'); }
      break;
    case 'export': {
      const blob = new Blob([exportJSON()], { type: 'application/json' });
      const file = new File([blob], `kraftkatalog-${new Date().toISOString().slice(0, 10)}.json`, { type: 'application/json' });
      if (navigator.canShare?.({ files: [file] })) navigator.share({ files: [file] }).catch(() => {});
      else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click(); }
      break;
    }
  }
});

document.addEventListener('input', (ev) => {
  const t = ev.target;
  if (t.id === 'q') { catQuery = t.value; renderCatalogList(route()[2] === 'add' ? route()[1] : null); }
});

document.addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.dataset.planName) {
    const p = planById(t.dataset.planName); p.name = t.value.trim() || 'Ohne Namen'; save();
  } else if (t.dataset.f) {
    const p = planById(t.closest('[data-plan]').dataset.plan);
    const it = p.items.find((x) => x.id === t.closest('[data-item]').dataset.item);
    const v = num(t.value);
    if (t.dataset.f === 'weight') it.weight = v && v > 0 ? v : null;
    else if (t.dataset.f === 'sets') it.sets = Math.max(1, Math.round(v || 1));
    else it[t.dataset.f] = Math.max(0, Math.round(v ?? 0));
    save();
    const { n, s } = planEstimate(p);
    $('.sub').textContent = `${n} Übung${n === 1 ? '' : 'en'} · ca. ${fmtDur(s)} · wird automatisch gespeichert`;
  } else if (t.dataset.cur) {
    const v = num(t.value);
    db.active.cur[t.dataset.cur] = t.dataset.cur === 'weight' ? (v && v > 0 ? v : null) : Math.max(0, v ?? 0);
    save();
  } else if (t.dataset.act === 'sound-cb') {
    db.sound = t.checked; T.setSound(db.sound); save();
  } else if (t.id === 'import' && t.files[0]) {
    t.files[0].text().then((txt) => {
      if (!confirm('Pläne und Verlauf durch den Inhalt der Datei ersetzen?')) return;
      try { importJSON(txt); toast('Import erfolgreich'); render(); } catch (e) { alert('Import fehlgeschlagen: ' + e.message); }
    });
  }
});

// Enter im Zahlenfeld schließt die Tastatur
document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.matches('input:not([type=search])')) ev.target.blur(); });

if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');

render();
