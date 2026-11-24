// ENTWURF (nicht in der App): fünf Übungen mit gemischter Ansicht, neu „von vorn“. Vergleich in demo.html.
import { byId } from '../js/exercises.js';
const LEGS = { pL: [46, 50], pR: [54, 50], kL: [45.5, 70], kR: [54.5, 70], aL: [45, 90], aR: [55, 90] };
const STAND = { h: [50, 12], sL: [42, 23], sR: [58, 23], ...LEGS };
const DOWN = { eL: [41, 37], wL: [40.5, 50], eR: [59, 37], wR: [59.5, 50] };
// Pose an der Bildmitte spiegeln
const flip = (P) => Object.fromEntries(Object.entries(P).map(([k, v]) => (Array.isArray(v) ? [k.endsWith('L') ? k.slice(0, -1) + 'R' : k.endsWith('R') ? k.slice(0, -1) + 'L' : k, [100 - v[0], v[1]]] : [k, v])));
const COS0 = { h: [50, 17], sL: [42, 28], sR: [58, 28], pL: [46, 55], pR: [54, 55], kL: [35.5, 72], kR: [64.5, 72], aL: [25, 90], aR: [75, 90], eL: [40, 41], wL: [48, 37], eR: [60, 41], wR: [52, 37] };
const COS1 = { h: [33, 37], sL: [25, 47], sR: [41, 47], pL: [28, 72], pR: [36, 72], kL: [17, 75], kR: [55, 81], aL: [25, 90], aR: [75, 90], eL: [23, 60], wL: [31, 55], eR: [44, 60], wR: [35, 55] };
const make = (id, o) => ({ id: id + '-entwurf', of: id, name: byId[id].name, cam: 'front', ...o });
export const FRONT = [
  make('cossack-squat', { seq: [0, 1, 0, 2], poses: [COS0, COS1, flip(COS1)] }),
  make('crossleg-jumps', { view: '-4 -14 108 108', poses: [
    { ...STAND, kL: [50.5, 70], kR: [49.5, 70], aL: [57, 90], aR: [43, 90], eL: [41, 36], wL: [51, 44], eR: [59, 36], wR: [49, 44] },
    { h: [50, 6], sL: [42, 17], sR: [58, 17], pL: [46, 44], pR: [54, 44], kL: [38, 63], kR: [62, 63], aL: [29, 82], aR: [71, 82], eL: [33, 6], wL: [30, -7], eR: [67, 6], wR: [70, -7] }] }),
  make('sumo-jump-squat', { props: [{ t: 'db', mid: true }], view: '-2 -6 104 104', poses: [
    { h: [50, 30], sL: [42, 41], sR: [58, 41], pL: [46, 68], pR: [54, 68], kL: [30, 70], kR: [70, 70], aL: [30, 90], aR: [70, 90], eL: [44, 54], wL: [49, 67], eR: [56, 54], wR: [51, 67] },
    { h: [50, 6], sL: [42, 17], sR: [58, 17], pL: [46, 44], pR: [54, 44], kL: [43, 63], kR: [57, 63], aL: [41, 82], aR: [59, 82], eL: [44, 30], wL: [49, 43], eR: [56, 30], wR: [51, 43] }] }),
  make('seitheben', { props: [{ t: 'db' }], poses: [{ ...STAND, ...DOWN }, { ...STAND, eL: [28.5, 25], wL: [16, 27], eR: [71.5, 25], wR: [84, 27] }] }),
  make('bizepscurl-seitlich', { props: [{ t: 'db' }], poses: [
    { ...STAND, eL: [38, 36], wL: [34, 48], eR: [62, 36], wR: [66, 48] },
    { ...STAND, eL: [38, 36], wL: [33, 24], eR: [62, 36], wR: [67, 24] }] }),
];
