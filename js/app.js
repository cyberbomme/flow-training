import { EXERCISES, EQUIPMENT, byId, TEMPO, MUSCLE_GROUPS } from './exercises.js';
import { planIcon, planIconHTML } from './planicon.js';
import { TEMPLATES } from './templates.js';
import { figureStatic, animateFigure } from './figure.js';
import { db, save, uid, exportJSON, importJSON } from './store.js';
import * as T from './timer.js';
import * as PE from './planedit.js';
import { PAUSE_LINES, DONE_TITLES, QUOTES, SAVE_TOASTS } from './texts.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const fmtNum = (n) => (n == null ? '' : String(Math.round(n * 100) / 100).replace('.', ','));
const fmtDate = (t, opts = { day: '2-digit', month: '2-digit', year: '2-digit' }) => new Date(t).toLocaleDateString('de-DE', opts);
const fmtDur = (s) => { const m = Math.round(s / 60); if (m < 1) return 'unter 1 min'; return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`; };

const main = $('#main');
let stops = [];
let ticker = null;
let lastHash = null;
let catQuery = '';
let metricSel = null;
let exitSheet = false;
let planOpen = null; // aufgeklappte Zeile im Plan-Editor
let addSheet = false; // Auswahlfenster „Zu Plan hinzufügen“ auf der Übungsseite
let showTpl = null;    // Vorlagen aufgeklappt? null = automatisch (offen, solange es keine Pläne gibt)
let wakeLock = null;

T.setSound(db.sound);

// Design ('flow' | 'classic') und Erscheinungsbild ('system' | 'light' | 'dark').
// Kopie in localStorage für das Inline-Skript im <head> (kein Aufblitzen beim Start).
function applyTheme() {
  const t = db.theme || 'system', d = db.design || 'flow', root = document.documentElement;
  if (t === 'system') delete root.dataset.theme; else root.dataset.theme = t;
  if (d === 'flow') delete root.dataset.design; else root.dataset.design = d;
  try { localStorage.setItem('flow.theme', t); localStorage.setItem('flow.design', d); } catch {}
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

// ── Hilfen ────────────────────────────────────────────────
const equipNames = (ex) => ex.equip.length ? ex.equip.map((id) => EQUIPMENT.find((e) => e.id === id).name).join(' + ') : 'Ohne Geräte';
const planById = (id) => db.plans.find((p) => p.id === id);

// Plan-Icon automatisch aus Titel-Stichworten bzw. den Übungen (js/planicon.js)
const planExercises = (p) => PE.flatten(p.items).map((x) => x.it);
const planIc = (p, cls = '') => planIconHTML(p.name, planExercises(p), cls);
const planLabel = (p) => planIcon(p.name, planExercises(p)).label;

// Entwürfe: Änderungen im Editor landen in db.drafts[planId], bis gespeichert oder verworfen wird.
const draftOf = (id) => db.drafts?.[id];
const shownPlan = (id) => draftOf(id) || planById(id);
function editPlan(id) {
  db.drafts ||= {};
  if (!db.drafts[id]) { const p = planById(id); if (!p) return null; db.drafts[id] = JSON.parse(JSON.stringify(p)); }
  return db.drafts[id];
}
// Entwurf entfernen, sobald er wieder dem gespeicherten Plan entspricht
function settleDraft(id) {
  const d = draftOf(id), p = planById(id);
  if (d && p && JSON.stringify([d.name, d.items]) === JSON.stringify([p.name, p.items])) delete db.drafts[id];
}
function commitDraft(id) {
  const d = draftOf(id), p = planById(id);
  if (!d || !p) return;
  p.name = d.name; p.items = d.items;
  delete db.drafts[id];
}

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

// Sekunden pro Wiederholung: eigene Einstellung > Schätzung im Katalog > 3 s
const tempoOf = (exId) => db.tempo?.[exId] ?? TEMPO[exId] ?? 3;

// Geschätzte Dauer: Tempo × Wiederholungen + 10 s Rüstzeit pro Satz
function planEstimate(p) {
  const work = (it) => (it.mode === 'time' ? it.dur : it.reps * tempoOf(it.exId) + 10);
  let s = 0, n = 0, g = 0;
  for (const it of p.items) {
    if (it.type === 'rest') s += it.dur;
    else if (it.type === 'group') {
      g++; n += it.items.length;
      s += it.rounds * it.items.reduce((a, m) => a + work(m), 0) + Math.max(0, it.rounds - 1) * it.rest;
    } else { n++; s += it.sets * work(it) + Math.max(0, it.sets - 1) * it.rest; }
  }
  return { n, s, g };
}
const planMeta = ({ n, s, g }) => `${n} Übung${n === 1 ? '' : 'en'}${g ? ` · ${g} Superset${g === 1 ? '' : 's'}` : ''} · ca. ${fmtDur(s)}`;

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
  grip: '<svg viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h14"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  reset: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5"/></svg>',
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

// Motivationstexte: je Training in gemischter Reihenfolge, damit sich nichts wiederholt, bevor alle dran waren.
// Gleicher Index -> gleicher Text, so bleibt der Text beim Neuzeichnen einer Seite stehen.
const shuffleCache = new Map();
function pickText(pool, salt, i = 0) {
  const seed = ((db.active?.startedAt ?? 0) + salt * 7919) >>> 0;
  const key = seed + ':' + pool.length;
  if (!shuffleCache.has(key)) {
    let a = seed || 1;
    const rnd = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const order = pool.map((_, k) => k);
    for (let k = order.length - 1; k > 0; k--) { const r = Math.floor(rnd() * (k + 1)); [order[k], order[r]] = [order[r], order[k]]; }
    shuffleCache.set(key, order);
  }
  return pool[shuffleCache.get(key)[i % pool.length]];
}

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
  if (location.hash !== lastHash) addSheet = false; // Auswahlfenster nicht auf neue Seiten mitnehmen
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
  else if (view === 'einstellungen' && a === 'zeiten') html = viewTempo();
  else if (view === 'einstellungen') html = viewSettings();
  else { go('katalog'); return; }
  main.innerHTML = html;
  document.body.dataset.view = view;

  // Animation im Tempo der Übung; im Training mit Timer exakt im Takt der Wiederholungen
  for (const el of $$('[data-anim]', main)) {
    const id = el.dataset.anim;
    const synced = view === 'training' && !!db.active?.timer;
    stops.push(animateFigure(el, byId[id], { period: tempoOf(id), phase: synced ? () => trainingPhase(id) : undefined }));
  }
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
const tabOf = (v) => ({ katalog: 'katalog', uebung: 'katalog', plaene: 'plaene', plan: 'plaene', verlauf: 'verlauf', fortschritt: 'verlauf', einstellungen: 'einstellungen' })[v];

// ── Katalog ───────────────────────────────────────────────
function viewCatalog(pickFor) {
  const plan = pickFor && shownPlan(pickFor);
  const head = plan ? header('Übung hinzufügen', [`#/plan/${plan.id}`, plan.name]) : header('Übungen');
  return `${head}
    <input class="search" type="search" id="q" placeholder="Übung suchen" value="${esc(catQuery)}" autocomplete="off">
    <div class="filter-label"><p class="overline">Meine Ausrüstung</p><button class="link" data-act="equip-all">${db.equip.length ? 'keine' : 'alle'}</button></div>
    <div class="chips">${EQUIPMENT.map((e) => `<button class="chip ${db.equip.includes(e.id) ? 'on' : ''}" data-act="equip" data-id="${e.id}" aria-pressed="${db.equip.includes(e.id)}">${e.name}</button>`).join('')}</div>
    <div class="filter-label"><p class="overline">Muskelgruppe</p></div>
    <div class="chips" role="radiogroup" aria-label="Muskelgruppe">${[{ id: '', name: 'Alle' }, ...MUSCLE_GROUPS].map((g) => {
      const on = (db.muscle || '') === g.id;
      return `<button class="chip ${on ? 'on' : ''}" data-act="muscle" data-id="${g.id}" role="radio" aria-checked="${on}">${g.name}</button>`;
    }).join('')}</div>
    <div id="list" class="ilist"></div>`;
}

function renderCatalogList(pickFor) {
  const q = catQuery.trim().toLowerCase();
  const list = EXERCISES.filter((ex) => ex.equip.every((e) => db.equip.includes(e)))
    .filter((ex) => !db.muscle || ex.groups.includes(db.muscle))
    .filter((ex) => !q || (ex.name + ' ' + ex.muscles).toLowerCase().includes(q));
  const el = $('#list');
  if (!list.length) { el.innerHTML = empty('Keine passende Übung.', 'Wähl mehr Ausrüstung, eine andere Muskelgruppe oder ändere die Suche.'); return; }
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
    <button class="btn primary big" data-act="add-sheet">${icon.plus}Zu Plan hinzufügen</button>
    ${addSheet ? `<div class="sheet-bg" data-act="add-sheet-close"></div>
    <div class="sheet add-sheet" role="dialog" aria-label="Zu Plan hinzufügen">
      <p class="serif">${esc(ex.name)} hinzufügen zu …</p>
      <div class="sheet-list">${db.plans.map((p) => {
        const sp = shownPlan(p.id), n = planEstimate(sp).n;
        return `<button class="sheet-row" data-act="add-to-plan" data-plan="${p.id}" data-ex="${ex.id}">${planIc(sp, 'sm')}
          <span><b>${esc(sp.name)}</b><small>${n} Übung${n === 1 ? '' : 'en'}${draftOf(p.id) ? ' · nicht gespeichert' : ''}</small></span>${icon.plus}</button>`;
      }).join('')}</div>
      <button class="btn ghost" data-act="add-to-new" data-ex="${ex.id}">${icon.plus}Neuer Plan</button>
      <button class="btn" data-act="add-sheet-close">Abbrechen</button></div>` : ''}`;
}

// ── Pläne ─────────────────────────────────────────────────
function viewPlans() {
  const top = !db.plans.length
    ? empty('Noch kein Training geplant.', 'Starte mit deinem Körper, nicht gegen ihn – mit einer Vorlage oder einem eigenen Plan.',
      `<button class="btn primary" data-act="new-plan">${icon.plus}Eigenen Plan anlegen</button>`)
    : `<div class="stack">
    ${db.plans.map((p) => {
      const est = planEstimate(p), n = est.n;
      return `<div class="plan">
        <a class="plan-main" href="#/plan/${p.id}">${planIc(p)}<span class="plan-txt"><b>${esc(p.name)}</b><small>${planLabel(p) ? `${planLabel(p)} · ` : ''}${planMeta(est)}</small>${draftOf(p.id) ? `<span class="badge draft">Nicht gespeicherte Änderungen</span>` : ''}</span></a>
        <div class="plan-actions">
          <button class="btn primary" data-act="start" data-plan="${p.id}" ${n ? '' : 'disabled'}>${icon.play}Start</button>
          <button class="btn" data-act="dup-plan" data-plan="${p.id}">Kopieren</button>
          <button class="btn danger-text" data-act="del-plan" data-plan="${p.id}">Löschen</button>
        </div></div>`;
    }).join('')}
    <button class="btn ghost" data-act="new-plan">${icon.plus}Neuer Plan</button>
    </div>`;
  return header('Pläne') + top + templatesBlock();
}

// Vorlagen: Beispielpläne zum Übernehmen (js/templates.js)
function templatesBlock() {
  const open = showTpl ?? !db.plans.length;
  const head = `<button class="tpl-toggle" data-act="tpl-toggle" aria-expanded="${open}">
    <span class="pill-label">Vorlagen</span><span class="more">${open ? 'Einklappen' : `${TEMPLATES.length} Beispielpläne`}</span></button>`;
  if (!open) return head;
  return head + `<p class="hint">Übernimm eine Vorlage als eigenen Plan und pass Gewichte und Wiederholungen danach an dich an.</p>
    <div class="stack">${TEMPLATES.map((t) => {
      const exs = PE.flatten(t.items).map((x) => x.it);
      const est = planEstimate(t), label = planIcon(t.name, exs).label;
      const equip = [...new Set(exs.flatMap((e) => byId[e.exId].equip))].map((id) => EQUIPMENT.find((e) => e.id === id).name);
      const taken = db.plans.some((p) => p.tpl === t.id);
      return `<div class="plan tpl">
        <div class="plan-main">${planIconHTML(t.name, exs)}<span class="plan-txt"><b>${esc(t.name)}</b>
          <small>${label ? `${label} · ` : ''}${planMeta(est)}</small>
          <small class="tpl-equip">${equip.length ? equip.join(' · ') : 'Ohne Geräte'}</small></span></div>
        <p class="tpl-note">${esc(t.note)}</p>
        <div class="plan-actions">
          <button class="btn ${taken ? 'ghost' : 'primary'}" data-act="tpl-add" data-tpl="${t.id}">${icon.plus}${taken ? 'Nochmal übernehmen' : 'Übernehmen'}</button>
          ${taken ? `<span class="tpl-taken">${icon.check}Schon in deinen Plänen</span>` : ''}
        </div></div>`;
    }).join('')}</div>`;
}

function viewPlanEditor(id) {
  const p = shownPlan(id);
  if (!p) return header('Plan', ['#/plaene', 'Pläne']) + empty('Diesen Plan gibt es nicht (mehr).');
  const est = planEstimate(p), dirty = !!draftOf(id);
  const list = p.items.map((it) => it.type === 'group' ? groupBlock(p, it) : it.type === 'rest' ? restRow(it) : exRow(p, it, null)).join('');
  return `<header class="app-head"><a class="back" href="#/plaene">${icon.back}Pläne</a>
      <div class="head-row"><input class="title-input" data-plan-name="${p.id}" value="${esc(p.name)}" aria-label="Name des Plans">${LOGO}</div></header>
    <div class="sub plan-sub" id="plan-meta">${planIc(p, 'xs')}<span>${planLabel(p) ? `${planLabel(p)} · ` : ''}${planMeta(est)}${dirty ? ' · <span class="dirty">nicht gespeichert</span>' : ''}</span></div>
    ${p.items.length ? `<p class="hint">Am Griff ziehen zum Sortieren. Auf eine Übung ziehen und kurz halten bildet ein Superset.</p>` : ''}
    <div class="plist" id="plan-list" data-plan="${p.id}">${list || '<p class="hint">Noch leer. Füg Übungen und Pausen hinzu.</p>'}</div>
    <div class="row">
      <a class="btn" href="#/plan/${p.id}/add">${icon.plus}Übung</a>
      <button class="btn peach" data-act="add-rest" data-plan="${p.id}">${icon.plus}Pause</button>
    </div>
    ${dirty ? `<div class="row save-row">
      <button class="btn ghost" data-act="draft-discard" data-plan="${p.id}">Verwerfen</button>
      <button class="btn" data-act="draft-save" data-plan="${p.id}">${icon.check}Speichern</button></div>
    <button class="btn primary big" data-act="save-start" data-plan="${p.id}" ${est.n ? '' : 'disabled'}>${icon.play}Speichern &amp; starten</button>`
    : `<button class="btn primary big" data-act="start" data-plan="${p.id}" ${est.n ? '' : 'disabled'}>${icon.play}Training starten</button>`}`;
}

// Einheitliche Zeile: Kreis · Name + Werte · Griff. Antippen klappt die Regler auf.
const grip = `<button class="handle" data-handle aria-label="Ziehen zum Verschieben">${icon.grip}</button>`;
const exSummary = (it, inGroup) => {
  const v = it.mode === 'time' ? `${it.dur} s` : `${it.reps} Wdh.`;
  const w = it.weight ? ` · ${fmtNum(it.weight)} kg` : '';
  return inGroup ? v + w : `${it.sets} × ${v}${w} · Pause ${it.rest} s`;
};

function exRow(p, it, group, idx) {
  const ex = byId[it.exId];
  const label = group ? `<span class="tag-l">${PE.letterOf(p.items, group.id)}${idx + 1}</span>` : '';
  const open = planOpen === it.id;
  return `<div class="prow ${open ? 'open' : ''}" data-id="${it.id}" data-kind="${group ? 'member' : 'ex'}">
    <div class="prow-main" data-act="ptoggle" role="button" aria-expanded="${open}">${circleFig(ex, 'sm')}
      <div class="prow-txt"><b>${label}<span>${esc(ex.name)}</span></b><small>${exSummary(it, !!group)}</small></div>${grip}</div>
    ${open ? planFields(it, group ? 'member' : 'ex') : ''}</div>`;
}

function restRow(it) {
  const open = planOpen === it.id;
  return `<div class="prow rest-row ${open ? 'open' : ''}" data-id="${it.id}" data-kind="rest">
    <div class="prow-main" data-act="ptoggle" role="button" aria-expanded="${open}"><div class="ic-circle sm rose">${icon.rest}</div>
      <div class="prow-txt"><b><span>Pause</span></b><small>${it.dur} s</small></div>${grip}</div>
    ${open ? planFields(it, 'rest') : ''}</div>`;
}

function groupBlock(p, g) {
  const open = planOpen === g.id;
  return `<div class="pgroup ${open ? 'open' : ''}" data-id="${g.id}" data-kind="group">
    <div class="g-head" data-act="ptoggle" role="button" aria-expanded="${open}">
      <div class="g-txt"><span class="g-label">Superset ${PE.letterOf(p.items, g.id)}</span>
      <small>${g.rounds} Runde${g.rounds === 1 ? '' : 'n'} · Pause ${g.rest} s nach jeder Runde</small></div>${grip}</div>
    ${open ? planFields(g, 'group') : ''}
    <div class="g-members">${g.items.map((m, i) => exRow(p, m, g, i)).join('')}</div></div>`;
}

function pStepper(field, label, val, step, unit, ph) {
  return `<div class="stepper-wrap" data-pfield="${field}" data-step="${step}"><span>${label}</span><div class="stepper">
    <button data-act="pstep" data-d="-1" aria-label="${label} weniger">−</button>
    <input type="text" inputmode="decimal" value="${fmtNum(val)}" placeholder="${ph || ''}" data-pf="${field}" aria-label="${label}${unit ? ` in ${unit}` : ''}">
    <button data-act="pstep" data-d="1" aria-label="${label} mehr">+</button></div></div>`;
}

function planFields(it, kind) {
  let h = '';
  if (kind === 'rest') h = pStepper('dur', 'Dauer (s)', it.dur, 15, 's');
  else if (kind === 'group') h = pStepper('rounds', 'Runden', it.rounds, 1) + pStepper('rest', 'Pause nach Runde (s)', it.rest, 15, 's');
  else {
    h = `<div class="seg"><button class="${it.mode === 'reps' ? 'on' : ''}" data-act="pmode" data-mode="reps">Wiederholungen</button><button class="${it.mode === 'time' ? 'on' : ''}" data-act="pmode" data-mode="time">Dauer</button></div>`;
    if (kind === 'ex') h += pStepper('sets', 'Sätze', it.sets, 1);
    h += it.mode === 'reps' ? pStepper('reps', 'Wiederholungen', it.reps, 1) : pStepper('dur', 'Dauer (s)', it.dur, 5, 's');
    h += pStepper('weight', 'Gewicht (kg)', it.weight, 1, 'kg', 'Körper');
    if (kind === 'ex') h += pStepper('rest', 'Satzpause (s)', it.rest, 15, 's');
    else h += `<p class="hint">Runden und Pause gelten für das ganze Superset. Zwischen den Übungen gibt es keine Pause.</p>`;
    const last = lastFor(it.exId);
    if (last) h += `<p class="hint">Zuletzt (${fmtDate(last.date)}): ${setsText(last.sets, last.mode)}</p>`;
  }
  const extra = kind === 'member' ? `<button class="btn ghost small" data-act="punlink">Aus Superset lösen</button>`
    : kind === 'group' ? `<button class="btn ghost small" data-act="psplit">Superset auflösen</button>` : '';
  return `<div class="pfields" data-for="${it.id}">${h}<div class="f-actions">${extra}<button class="btn danger-text small" data-act="premove">Entfernen</button></div></div>`;
}

// ── Training ──────────────────────────────────────────────
// Superset: Runde für Runde alle Übungen nacheinander, Pause erst nach der Runde.
function buildSteps(items) {
  const steps = [];
  let letter = 0;
  for (const it of items) {
    if (it.type === 'rest') { if (it.dur > 0) steps.push({ k: 'rest', dur: it.dur }); continue; }
    if (it.type === 'group') {
      const L = 'ABCDEFGHIJ'[letter++];
      for (let r = 0; r < it.rounds; r++) {
        it.items.forEach((m, i) => steps.push({ k: 'work', item: m.id, set: r, of: it.rounds, ss: `${L}${i + 1}` }));
        if (r < it.rounds - 1 && it.rest > 0) steps.push({ k: 'rest', dur: it.rest });
      }
      continue;
    }
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
  enterStep(!!db.autopilot);
  go('training');
}

function itemOf(step) { return PE.find(db.active.items, step.item)?.it; }
const activeExercises = () => PE.flatten(db.active.items).filter(({ it }) => db.active.log[it.id]?.some(Boolean));

function enterStep(autoStart) {
  const A = db.active, step = A.steps[A.idx], before = A.steps[A.idx - 1];
  A.timer = null; A.cur = null;
  if (step) {
    if (step.k === 'rest') {
      // Die Pause läuft immer von selbst – Start/Pause/Stop gibt es dort nicht
      A.timer = T.makeTimer(step.dur);
      T.start(A.timer);
    } else {
      const it = itemOf(step);
      const prev = A.log[it.id]?.[step.set] || A.log[it.id]?.[step.set - 1];
      const pre = A.weightFor?.[it.id];  // in der Pause vorgewähltes Gewicht
      A.cur = { reps: prev?.reps ?? it.reps, weight: pre !== undefined ? pre : prev?.weight ?? it.weight, dur: it.dur };
      if (A.weightFor) delete A.weightFor[it.id];
      const afterRest = before?.k === 'rest';
      // Zeit-Übungen laufen nach einer Pause von selbst los, im Autopilot immer – auch Wiederholungen.
      const auto = autoStart && (db.autopilot || (afterRest && it.mode === 'time'));
      const counted = it.mode === 'time' || db.autopilot;
      if (counted) {
        // Vorlauf nur im Autopilot und nur, wenn keine Pause davor lag (die endet schon mit 3-2-1)
        const setup = db.autopilot && auto && !afterRest ? (db.setup ?? 5) : 0;
        const work = it.mode === 'time' ? it.dur : Math.max(1, A.cur.reps) * tempoOf(it.exId);
        A.timer = T.makeTimer(setup + work);
        A.timer.setup = setup;
        if (it.mode !== 'time') { A.timer.reps = Math.max(1, A.cur.reps); A.timer.tempo = tempoOf(it.exId); }
        if (auto) T.start(A.timer);
      }
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

// Alle Trainingsseiten (Übung, Autopilot, Vorlauf, Zeit, Superset, Pause, Abschluss) teilen ein Gerüst
// mit zehn festen Plätzen – nur der Inhalt wechselt, damit nichts springt (Konzept A).
function trScreen({ hero, title, sub, card1, card2, main, next, nav }) {
  const A = db.active;
  const pct = Math.round((Math.min(A.idx, A.steps.length) / A.steps.length) * 100);
  return `<section class="tr-screen">
    <header class="tr-top">
      <button class="icon-btn" data-act="exit" aria-label="Training beenden">${icon.del}</button>
      <div class="tr-title"><b>${esc(A.planName)}</b><small>${Math.min(A.idx + 1, A.steps.length)} / ${A.steps.length}</small></div>
      <button class="icon-btn" data-act="sound" aria-label="Ton ${db.sound ? 'aus' : 'an'}schalten">${db.sound ? icon.bell : icon.bellOff}</button>
    </header>
    <div class="progress"><div style="width:${pct}%"></div></div>
    <div class="tr-hero">${hero}</div>
    <h2 class="tr-name">${title}</h2>
    <p class="tr-set">${sub}</p>
    ${card1}${card2}${main}${next}${nav}</section>`;
}
const trNav = (right = `<button class="btn ghost" data-act="skip">Überspringen ›</button>`) => `<div class="tr-nav">
  <button class="btn ghost" data-act="prev" ${db.active.idx === 0 ? 'disabled' : ''}>‹ Zurück</button>${right}</div>`;
const trMain = (act, label, ic, soft) => `<button class="btn ${soft ? '' : 'primary'} tr-main" data-act="${act}">${ic}${label}</button>`;

function viewTraining() {
  const A = db.active;
  if (!A) return header('Training') + empty('Gerade läuft kein Training.', '', `<a class="btn primary" href="#/plaene">Plan starten</a>`);
  const step = A.steps[A.idx];
  const sheet = exitSheet ? `<div class="sheet-bg" data-act="exit-cancel"></div><div class="sheet">
      <p class="serif">Training beenden?</p>
      <button class="btn primary" data-act="finish">Beenden &amp; speichern</button>
      <button class="btn danger" data-act="discard">Verwerfen</button>
      <button class="btn" data-act="exit-cancel">Weiter trainieren</button></div>` : '';

  if (!step) return viewSummary() + sheet;

  if (step.k === 'rest') {
    return trScreen({
      hero: `<div class="fig-tr rose timed"><div class="fig-icon">${icon.rest}</div>${figRing()}</div>`,
      title: 'Pause',
      sub: pickText(PAUSE_LINES, 1, A.steps.slice(0, A.idx).filter((x) => x.k === 'rest').length),
      card1: restCard(),
      card2: nextWeightCard(),
      main: trMain('skip', 'Pause beenden', icon.chev, true),
      next: nextCard(),
      nav: trNav(),
    }) + sheet;
  }

  const it = itemOf(step), ex = byId[it.exId];
  const target = it.mode === 'time' ? `${it.dur} s` : `${it.reps} Wdh.`;
  const counted = !!A.timer;
  const setLine = step.ss ? `<span class="tag-l">${step.ss}</span> Runde ${step.set + 1} von ${step.of}` : `Satz ${step.set + 1} von ${it.sets}`;
  return trScreen({
    hero: `<div class="fig-tr ${counted ? 'timed' : ''}"><div class="fig-anim" data-anim="${ex.id}"></div>${counted ? figRing() : ''}</div>`,
    title: esc(ex.name),
    sub: `${setLine} · Ziel ${target}${it.weight ? ` × ${fmtNum(it.weight)} kg` : ''}`,
    card1: counted ? timerCard() : stepper('reps', 'Wiederholungen', A.cur.reps, 1),
    card2: stepper('weight', 'Gewicht (kg)', A.cur.weight, 1, 'Körper'),
    main: trMain('done', 'Satz erledigt', icon.check),
    next: nextCard(),
    nav: trNav(),
  }) + sheet;
}

// Pause: −15 s / +15 s an der Stelle von − / +
function restCard() {
  const z = timerState(db.active.timer);
  return `<div class="stepper-wrap timer-card"><span id="tlabel">Pause</span><div class="stepper">
    <button data-act="t-add" data-s="-15" aria-label="15 Sekunden kürzer">−15</button>
    <output class="t-val" id="tdisp" aria-live="off">${z.value}</output>
    <button data-act="t-add" data-s="15" aria-label="15 Sekunden länger">+15</button></div></div>`;
}

// Pause: Gewicht für den nächsten Satz schon jetzt einstellen
function nextWorkStep() {
  const A = db.active;
  for (let i = A.idx + 1; i < A.steps.length; i++) if (A.steps[i].k === 'work') return A.steps[i];
  return null;
}
function nextWeight(step) {
  const A = db.active, it = itemOf(step);
  if (A.weightFor && it.id in A.weightFor) return A.weightFor[it.id];
  const prev = A.log[it.id]?.[step.set] || A.log[it.id]?.[step.set - 1];
  return prev?.weight ?? it.weight;
}
function nextWeightCard() {
  const nx = nextWorkStep();
  if (!nx) return `<div class="stepper-wrap is-empty"><span>Nächster Satz</span><div class="stepper"><output class="t-val">–</output></div></div>`;
  return `<div class="stepper-wrap"><span>Nächster Satz (kg)</span><div class="stepper">
    <button data-act="nw" data-d="-1" aria-label="Gewicht für den nächsten Satz weniger">−</button>
    <input type="text" inputmode="decimal" value="${fmtNum(nextWeight(nx))}" placeholder="Körper" data-nw="1" aria-label="Gewicht für den nächsten Satz">
    <button data-act="nw" data-d="1" aria-label="Gewicht für den nächsten Satz mehr">+</button></div></div>`;
}

// „Als Nächstes“: kleine Vorschau mit Piktogramm – auf Übungs- und Pausen-Screens gleich
function nextCard() {
  const A = db.active, cur = A.steps[A.idx], nx = A.steps[A.idx + 1];
  let ic, title, sub, over = 'Als Nächstes';
  if (!nx) { ic = `<div class="ic-circle sm">${icon.check}</div>`; title = 'Abschluss'; sub = 'Gleich geschafft'; }
  else if (nx.k === 'rest') { ic = `<div class="ic-circle sm rose">${icon.rest}</div>`; title = 'Pause'; sub = `${nx.dur} s`; }
  else {
    const it = itemOf(nx), ex = byId[it.exId];
    if (cur.k === 'work' && cur.ss && nx.ss && nx.set === cur.set) over = 'Danach direkt';
    ic = circleFig(ex, 'sm');
    title = `${nx.ss ? `<span class="tag-l">${nx.ss}</span> ` : ''}${esc(ex.name)}`;
    sub = `${nx.ss ? `Runde ${nx.set + 1} von ${nx.of}` : `Satz ${nx.set + 1} von ${it.sets}`} · ${it.mode === 'time' ? `${it.dur} s` : `${it.reps} Wdh.`}${it.weight ? ` · ${fmtNum(it.weight)} kg` : ''}`;
  }
  return `<div class="next-card">${ic}<div class="next-txt"><small class="next-over">${over}</small><b>${title}</b><small>${sub}</small></div></div>`;
}

function stepper(key, label, val, step, ph = '') {
  return `<div class="stepper-wrap"><span>${label}</span><div class="stepper" data-key="${key}">
    <button data-act="stp" data-d="${-step}" aria-label="weniger">−</button>
    <input type="text" inputmode="decimal" value="${fmtNum(val)}" placeholder="${ph}" data-cur="${key}">
    <button data-act="stp" data-d="${step}" aria-label="mehr">+</button></div></div>`;
}

// Zeit-Übung: Countdown-Ring liegt auf dem Figur-Kreis, die Bedienung sitzt im Regler-Platz
// der Wiederholungs-Übungen – so bleibt der Bildaufbau bei beiden Übungsarten identisch.
// Phase der laufenden Wiederholung (0…1) für die Animation; null = Startpose halten
function trainingPhase(exId) {
  const t = db.active?.timer;
  if (!t) return null;
  const z = timerState(t);
  if (z.setupLeft > 0 || (!t.running && z.wr >= z.work)) return null;
  const tempo = t.tempo || tempoOf(exId);
  return ((z.work - z.wr) % tempo) / tempo;
}

// Timer-Zustand mit Vorlauf: total = setup + work. Im Vorlauf steht der Ring voll.
function timerState(t) {
  const r = T.remaining(t), work = t.total - (t.setup || 0);
  const wr = Math.min(r, work);
  return {
    r, work, wr,
    setupLeft: Math.max(0, r - work),
    frac: work > 0 ? wr / work : 0,
    value: t.reps ? String(Math.min(t.reps, Math.ceil(wr / t.tempo))) : T.fmt(wr),
    label: r - work > 0.05 ? `Los in ${Math.ceil(r - work)} s` : t.reps ? 'Wiederholungen' : 'Zeit',
  };
}
function figRing() {
  const z = timerState(db.active.timer);
  return `<svg class="fig-ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="57.5"/>
    <circle class="ring" cx="60" cy="60" r="57.5" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - z.frac * 100}"/></svg>`;
}
function timerCard() {
  const t = db.active.timer, z = timerState(t);
  return `<div class="stepper-wrap timer-card"><span id="tlabel">${z.label}</span><div class="stepper">
    <button data-act="t-stop" aria-label="Zurücksetzen">${icon.reset}</button>
    <output class="t-val" id="tdisp" aria-live="off">${z.value}</output>
    <button class="t-go" data-act="t-toggle" id="t-toggle" aria-label="${t.running ? 'Pause' : 'Start'}">${t.running ? icon.pause : icon.play}</button></div></div>`;
}

let lastBeep = null;
function startTicker() {
  const A = db.active;
  if (!A?.timer) return;
  lastBeep = null;
  const tick = () => {
    const t = A.timer;
    if (!t || db.active !== A) return;
    const z = timerState(t), r = z.r;
    const d = $('#tdisp'), ring = $('.fig-ring .ring'), lb = $('#tlabel');
    if (d) d.textContent = z.value;
    if (ring) ring.setAttribute('stroke-dashoffset', 100 - z.frac * 100);
    if (lb && A.steps[A.idx]?.k !== 'rest' && lb.textContent !== z.label) lb.textContent = z.label;
    const tg = $('#t-toggle');
    if (tg && tg.dataset.running !== String(t.running)) {
      tg.dataset.running = t.running; tg.innerHTML = t.running ? icon.pause : icon.play;
      tg.setAttribute('aria-label', t.running ? 'Pause' : 'Start');
    }
    if (!t.running) return;
    // Töne: 3-2-1 am Ende von Vorlauf und Satz/Pause, Startton nach dem Vorlauf
    const phase = z.setupLeft > 0 ? 's' : 'w';
    const sec = Math.ceil(phase === 's' ? z.setupLeft : r);
    const key = phase + sec;
    if (phase === 'w' && lastBeep?.[0] === 's') { lastBeep = 'w-go'; T.beep('start'); }
    else if (sec <= 3 && sec > 0 && key !== lastBeep) { lastBeep = key; T.beep('tick'); }
    if (r <= 0) {
      T.pause(t); T.beep('end');
      const step = A.steps[A.idx];
      if (step.k === 'work') t.reps ? logSet() : logSet(z.work);
      nextStep();
    }
  };
  tick();
  ticker = setInterval(tick, 200);
}

function viewSummary() {
  const A = db.active;
  const done = activeExercises();
  const sets = done.flatMap(({ it }) => A.log[it.id].filter(Boolean));
  const vol = sets.reduce((a, x) => a + (x.reps || 0) * (x.weight || 0), 0);
  const secs = sets.reduce((a, x) => a + (x.dur || 0), 0);
  const quote = pickText(QUOTES, 2);
  const stat = (label, val) => `<div class="stepper-wrap"><span>${label}</span><div class="stepper"><output class="t-val">${val}</output></div></div>`;
  return trScreen({
    hero: `<div class="fig-tr rose"><div class="fig-icon leaf-icon">${LEAF}</div></div>`,
    title: pickText(DONE_TITLES, 3),
    sub: `${fmtDur((Date.now() - A.startedAt) / 1000)} · ${done.length} Übung${done.length === 1 ? '' : 'en'} · ${sets.length} Sätze`,
    card1: stat('Sätze', sets.length),
    card2: vol ? stat('Volumen (kg)', fmtNum(vol)) : stat('Zeit unter Spannung', T.fmt(secs)),
    main: trMain('finish', 'Speichern', icon.check),
    next: `<div class="next-card quote">${quote}</div>`,
    nav: trNav(`<button class="btn ghost danger-text" data-act="discard">Verwerfen</button>`),
  });
}

function finishTraining() {
  const A = db.active;
  const items = activeExercises().map(({ it: i, label }) => ({ exId: i.exId, mode: i.mode, sets: A.log[i.id].filter(Boolean), ...(label ? { ss: label } : {}) }));
  if (items.length) {
    const s = { id: uid(), date: A.startedAt, end: Date.now(), planId: A.planId, planName: A.planName, items };
    db.history.push(s);
    const msg = pickText(SAVE_TOASTS, 4); // vor dem Schließen wählen – braucht die Startzeit des Trainings
    db.active = null; exitSheet = false; save();
    toast(msg);
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
  return header('Verlauf') + `
    ${!sessions.length ? empty('Kraft ist mehr als Optik.', 'Nach deinem ersten gespeicherten Training siehst du hier deinen Fortschritt.',
      `<a class="btn primary" href="#/plaene">Zu deinen Plänen</a>`) : `
    ${pill('Fortschritt je Übung')}
    <div class="list-links">${stats.map(([id, s]) => `<a href="#/fortschritt/${id}"><span>${esc(byId[id].name)}</span><small>${s.n}× · ${fmtDate(s.last)}</small></a>`).join('')}</div>
    ${pill('Trainings')}
    <div class="list-links">${sessions.map((s) => `<a href="#/verlauf/${s.id}" class="with-ic">${planIconHTML(s.planName, s.items, 'xs')}<span>${esc(s.planName)}</span><small>${fmtDate(s.date, { weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit' })} · ${fmtDur((s.end - s.date) / 1000)}</small></a>`).join('')}</div>`}`;
}

// ── Einstellungen ─────────────────────────────────────────
function viewTempo() {
  const custom = Object.keys(db.tempo || {}).length;
  const row = (ex) => {
    const v = tempoOf(ex.id), own = db.tempo?.[ex.id] != null;
    return `<div class="tempo-row" data-ex="${ex.id}">${circleFig(ex, 'sm')}
      <div class="prow-txt"><b><span>${esc(ex.name)}</span></b><small>${own ? `geändert · Schätzung ${fmtNum(TEMPO[ex.id] ?? 3)} s` : 'Schätzung'}</small></div>
      <div class="stepper"><button data-act="tempo" data-d="-0.5" aria-label="${esc(ex.name)} schneller">−</button>
      <output class="t-val">${fmtNum(v)}<i> s</i></output>
      <button data-act="tempo" data-d="0.5" aria-label="${esc(ex.name)} langsamer">+</button></div></div>`;
  };
  return header('Zeiten', ['#/einstellungen', 'Einstellungen']) + `
    <p class="sub">Im Autopilot zählt flow.training die Wiederholungen in diesem Tempo herunter. Die Animation der Übung läuft im selben Tempo. Die Werte sind Schätzungen für eine ruhige, kontrollierte Ausführung – pass sie an dein Tempo an (1–8 s).</p>
    ${pill('Vorlauf')}
    <div class="stepper-wrap" data-pfield="setup"><span>Vor einem Satz ohne Pause davor</span><div class="stepper">
      <button data-act="setup" data-d="-1" aria-label="Vorlauf kürzer">−</button><output class="t-val">${fmtNum(db.setup ?? 5)}<i> s</i></output>
      <button data-act="setup" data-d="1" aria-label="Vorlauf länger">+</button></div></div>
    <p class="hint">Gilt z. B. beim Wechsel im Superset oder am Trainingsbeginn. Nach einer Pause geht es direkt los – die endet schon mit 3-2-1.</p>
    ${pill('Sekunden pro Wiederholung')}
    <div class="plist">${EXERCISES.map(row).join('')}</div>
    ${custom ? `<button class="btn ghost big" data-act="tempo-reset">Alle auf Schätzung zurücksetzen</button>` : ''}`;
}

const DESIGNS = [
  { id: 'flow', name: 'flow.training', note: 'Creme, Salbei & Rosé', sw: ['#F3F0EB', '#9DAA96', '#D4A19C', '#3F6B5C'] },
  { id: 'classic', name: 'Klassisch', note: 'Das ursprüngliche Design', sw: ['#F4F2EE', '#EBE8E2', '#1C7C74', '#E8590C'] },
];

function viewSettings() {
  const theme = db.theme || 'system', design = db.design || 'flow';
  return header('Einstellungen') + `
    ${pill('Design')}
    <div class="design-opts" role="radiogroup" aria-label="Design">${DESIGNS.map((d) => `
      <button class="design-opt ${design === d.id ? 'on' : ''}" data-act="design" data-design="${d.id}" role="radio" aria-checked="${design === d.id}">
        <span class="sw">${d.sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span>
        <b class="sample-${d.id}">${d.name}</b><small>${d.note}</small></button>`).join('')}</div>
    ${pill('Erscheinungsbild')}
    <div class="setting"><div class="seg" role="radiogroup" aria-label="Erscheinungsbild">${[['system', 'System'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([k, l]) =>
      `<button class="${theme === k ? 'on' : ''}" data-act="theme" data-theme="${k}" role="radio" aria-checked="${theme === k}">${l}</button>`).join('')}</div></div>
    ${pill('Training')}
    <div class="stack">
      <label class="setting toggle"><span>Ton beim Timer</span><input type="checkbox" data-act="sound-cb" ${db.sound ? 'checked' : ''}></label>
      <label class="setting toggle"><span>Autopilot<small>Auch Wiederholungen zählen herunter und es geht automatisch weiter.</small></span>
        <input type="checkbox" data-act="autopilot-cb" ${db.autopilot ? 'checked' : ''}></label>
      <a class="row-link" href="#/einstellungen/zeiten"><span>Zeiten für den Autopilot</span><span class="more">${fmtNum(db.setup ?? 5)} s Vorlauf</span></a>
    </div>
    ${pill('Daten')}
    <div class="stack">
      <button class="btn" data-act="export">Daten exportieren (JSON)</button>
      <label class="btn ghost">Daten importieren<input type="file" accept="application/json,.json" id="import" hidden></label>
      <p class="hint">Deine Daten liegen nur auf diesem Gerät. Exportier sie ab und zu, dann gehen sie nicht verloren.</p>
    </div>
    <div class="about">${LOGO}<div class="ver">flow.training ${esc(self.APP_VERSION || '')}</div>
      <button class="btn ghost small" data-act="check-update">Nach Update suchen</button>
      <a href="https://github.com/cyberbomme/flow-training" target="_blank" rel="noopener">Quellcode auf GitHub</a></div>`;
}

function viewSession(id) {
  const s = db.history.find((x) => x.id === id);
  if (!s) return header('Training', ['#/verlauf', 'Verlauf']) + empty('Dieses Training gibt es nicht (mehr).');
  return header(s.planName, ['#/verlauf', 'Verlauf']) + `
    <p class="sub">${fmtDate(s.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${new Date(s.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · ${fmtDur((s.end - s.date) / 1000)}</p>
    <ul class="list">${s.items.map((it) => `<li><a href="#/fortschritt/${it.exId}">${byId[it.exId] ? circleFig(byId[it.exId], 'sm') : ''}
      <div><b>${it.ss ? `<span class="tag-l">${it.ss}</span> ` : ''}${esc(byId[it.exId]?.name || it.exId)}</b><small>${setsText(it.sets, it.mode)}</small></div></a></li>`).join('')}</ul>
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
    case 'muscle':
      db.muscle = btn.dataset.id; save();
      btn.parentElement.querySelectorAll('[data-act=muscle]').forEach((c) => { const on = c === btn; c.classList.toggle('on', on); c.setAttribute('aria-checked', on); });
      renderCatalogList(route()[2] === 'add' ? route()[1] : null);
      break;
    case 'equip-all':
      db.equip = db.equip.length ? [] : EQUIPMENT.map((e) => e.id); save(); render(); break;
    case 'pick': {
      ev.preventDefault();
      const p = editPlan(btn.dataset.plan);
      p.items.push(newItem(btn.dataset.ex)); save();
      toast(`${byId[btn.dataset.ex].name} hinzugefügt`);
      go('plan/' + p.id);
      break;
    }
    case 'add-sheet': addSheet = true; render(); break;
    case 'add-sheet-close': addSheet = false; render(); break;
    case 'add-to-plan': {
      // Liegt schon ein Entwurf vor, landet die Übung dort – sonst direkt im Plan
      const p = draftOf(btn.dataset.plan) || planById(btn.dataset.plan);
      p.items.push(newItem(btn.dataset.ex)); save();
      toast(draftOf(btn.dataset.plan) ? `Zu „${p.name}“ hinzugefügt (noch nicht gespeichert)` : `Zu „${p.name}“ hinzugefügt`);
      addSheet = false; render();
      break;
    }
    case 'add-to-new': {
      addSheet = false;
      const p = { id: uid(), name: 'Neuer Plan', items: [newItem(btn.dataset.ex)] };
      db.plans.push(p); save(); go('plan/' + p.id);
      break;
    }
    case 'tpl-toggle': showTpl = !(showTpl ?? !db.plans.length); render(); break;
    case 'tpl-add': {
      const t = TEMPLATES.find((x) => x.id === btn.dataset.tpl);
      const items = JSON.parse(JSON.stringify(t.items));
      PE.reId(items, uid);
      const n = db.plans.filter((p) => p.tpl === t.id).length;
      db.plans.push({ id: uid(), tpl: t.id, name: n ? `${t.name} (${n + 1})` : t.name, items });
      showTpl = true; // offen lassen, falls weitere Vorlagen übernommen werden sollen
      save(); toast(`„${t.name}“ ist jetzt in deinen Plänen`); render();
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
      p.id = uid(); p.name = src.name + ' (Kopie)'; PE.reId(p.items, uid);
      db.plans.splice(db.plans.indexOf(src) + 1, 0, p); save(); render();
      break;
    }
    case 'del-plan': {
      const p = planById(btn.dataset.plan);
      if (confirm(`Plan „${p.name}“ löschen? Der Verlauf bleibt erhalten.`)) { db.plans = db.plans.filter((x) => x !== p); if (db.drafts) delete db.drafts[p.id]; save(); render(); }
      break;
    }
    case 'add-rest': {
      const p = editPlan(btn.dataset.plan);
      p.items.push({ id: uid(), type: 'rest', dur: 90 }); save(); render();
      break;
    }
    case 'ptoggle': {
      if (ev.target.closest('[data-handle]')) break;
      const id = btn.closest('[data-id]').dataset.id;
      planOpen = planOpen === id ? null : id; render();
      break;
    }
    case 'pstep': case 'pmode': case 'punlink': case 'psplit': case 'premove': {
      const p = editPlan(planEl.dataset.plan);
      const id = btn.closest('[data-for]').dataset.for;
      const it = PE.find(p.items, id)?.it;
      if (!it) break;
      if (act === 'pstep') {
        const w = btn.closest('[data-pfield]'), key = w.dataset.pfield, d = +btn.dataset.d * +w.dataset.step;
        if (key === 'weight') { const v = (it.weight || 0) + d; it.weight = v > 0 ? v : null; }
        else it[key] = Math.max(PLAN_MIN[key] ?? 0, (it[key] || 0) + d);
      }
      if (act === 'pmode') it.mode = btn.dataset.mode;
      if (act === 'punlink') PE.unlink(p.items, id);
      if (act === 'psplit') { PE.split(p.items, id); planOpen = null; }
      if (act === 'premove') { PE.remove(p.items, id); PE.normalize(p.items); planOpen = null; }
      settleDraft(p.id); save(); render();
      break;
    }
    case 'start': startTraining(btn.dataset.plan); break;
    case 'save-start': commitDraft(btn.dataset.plan); save(); toast('Plan gespeichert'); startTraining(btn.dataset.plan); break;
    case 'draft-save': commitDraft(btn.dataset.plan); save(); toast('Plan gespeichert'); render(); break;
    case 'draft-discard':
      if (confirm('Änderungen an diesem Plan verwerfen?')) { delete db.drafts[btn.dataset.plan]; planOpen = null; save(); render(); }
      break;

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
        const z = timerState(t), el = z.work - z.wr;
        logSet(el >= 1 ? el : z.work);
      } else { if (A.timer) T.pause(A.timer); logSet(); }
      T.unlockAudio();
      nextStep();
      break;
    }
    case 'skip': T.unlockAudio(); nextStep(); break;
    case 'nw': {
      const nx = nextWorkStep(); if (!nx) break;
      const id = itemOf(nx).id, v = (nextWeight(nx) || 0) + +btn.dataset.d;
      (A.weightFor ||= {})[id] = v > 0 ? v : null;
      $('[data-nw]').value = fmtNum(A.weightFor[id]); save();
      break;
    }
    case 'prev': if (A.idx > 0) { A.idx--; enterStep(false); render(); } break;
    case 't-toggle':
      if (A.timer.running) T.pause(A.timer);
      else { T.unlockAudio(); T.start(A.timer); T.beep('start'); }
      save(); break;
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
    case 'design': db.design = btn.dataset.design; save(); applyTheme(); render(); break;
    case 'tempo': {
      const id = btn.closest('[data-ex]').dataset.ex;
      const v = Math.min(8, Math.max(1, tempoOf(id) + +btn.dataset.d));
      db.tempo = { ...(db.tempo || {}) };
      if (v === (TEMPO[id] ?? 3)) delete db.tempo[id]; else db.tempo[id] = v;
      save(); render(); break;
    }
    case 'tempo-reset':
      if (confirm('Alle Tempi auf die Schätzung zurücksetzen?')) { db.tempo = {}; save(); render(); }
      break;
    case 'check-update': checkUpdate(); break;
    case 'setup': db.setup = Math.min(20, Math.max(0, (db.setup ?? 5) + +btn.dataset.d)); save(); render(); break;
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
    const p = editPlan(t.dataset.planName); p.name = t.value.trim() || 'Ohne Namen'; settleDraft(p.id); save(); render();
  } else if (t.dataset.pf) {
    const p = editPlan(t.closest('[data-plan]').dataset.plan);
    const it = PE.find(p.items, t.closest('[data-for]').dataset.for)?.it;
    if (!it) return;
    const key = t.dataset.pf, v = num(t.value);
    if (key === 'weight') it.weight = v && v > 0 ? v : null;
    else it[key] = Math.max(PLAN_MIN[key] ?? 0, Math.round(v ?? 0));
    settleDraft(p.id); save(); render();
  } else if (t.dataset.nw) {
    const nx = nextWorkStep(); if (!nx) return;
    const v = num(t.value);
    (db.active.weightFor ||= {})[itemOf(nx).id] = v && v > 0 ? v : null; save();
  } else if (t.dataset.cur) {
    const v = num(t.value);
    db.active.cur[t.dataset.cur] = t.dataset.cur === 'weight' ? (v && v > 0 ? v : null) : Math.max(0, v ?? 0);
    save();
  } else if (t.dataset.act === 'sound-cb') {
    db.sound = t.checked; T.setSound(db.sound); save();
  } else if (t.dataset.act === 'autopilot-cb') {
    db.autopilot = t.checked; save();
    toast(db.autopilot ? 'Autopilot an – gilt ab dem nächsten Satz' : 'Autopilot aus');
  } else if (t.id === 'import' && t.files[0]) {
    t.files[0].text().then((txt) => {
      if (!confirm('Pläne und Verlauf durch den Inhalt der Datei ersetzen?')) return;
      try { importJSON(txt); toast('Import erfolgreich'); render(); } catch (e) { alert('Import fehlgeschlagen: ' + e.message); }
    });
  }
});

// Enter im Zahlenfeld schließt die Tastatur
document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.matches('input:not([type=search])')) ev.target.blur(); });

// Untergrenzen der Plan-Werte
const PLAN_MIN = { sets: 1, rounds: 1, reps: 1, dur: 5, rest: 0 };

// Drag & Drop im Plan-Editor (Sortieren, Superset bilden)
PE.initDrag((srcId, targetId, pos) => {
  const p = editPlan(route()[1]);
  if (!p) return;
  const before = PE.find(p.items, srcId)?.parent?.id;
  PE.moveTo(p.items, srcId, targetId, pos, uid);
  settleDraft(p.id); save(); render();
  if (pos === 'merge') toast('Superset gebildet');
  else if (before && !PE.find(p.items, srcId)?.parent) toast('Aus Superset gelöst');
});

// Service Worker: Updates ohne HTTP-Cache prüfen, neue Version sofort übernehmen.
let swReg = null;
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((r) => { swReg = r; }).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return; // Erstinstallation: kein Neuladen nötig
    reloaded = true; location.reload();      // Zustand (auch laufendes Training) liegt im Speicher
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') swReg?.update().catch(() => {}); });
}
async function checkUpdate() {
  if (!swReg) { toast('Updates gibt es nur in der installierten Web-App'); return; }
  toast('Suche nach Updates …');
  try {
    await swReg.update();
    if (swReg.installing || swReg.waiting) toast('Neue Version wird geladen …');
    else toast(`Du hast die neueste Version (${self.APP_VERSION})`);
  } catch { toast('Keine Verbindung – später nochmal versuchen'); }
}

render();
