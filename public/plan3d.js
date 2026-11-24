// 3D view of the floor plan: built from the same walls, rooms and furniture sizes as the 2D plan (mm → m).
// Loaded only when someone taps "3D view". Simple blocks with real sizes, not a photo render.
import * as T from '/vendor/three-0.187.0.js';

// Heights in mm by kind (estimates; beds use the Dunlopillo bed-top height).
const HEIGHT = {bed: 760, desk: 750, chair: 1000, wardrobe: 2000, lwardrobe: 2700, toilet: 760, basin: 850, stool: 450, sofa: 820, ctable: 420, recliner: 1000, mjtable: 760, tv: 1000, table: 750, fridge: 1770, dispenser: 450, cfan: 1300, dock: 100, wifi: 220};
const LIFT = {tv: 550, dispenser: 900};
const ROOMS = [['all', 'Whole home'], ['living', 'Living'], ['ky', 'KY'], ['ks', 'KS'], ['kx', 'KX'], ['dining', 'Dining'], ['kitchen', 'Kitchen']];

let ui = null;

function sizeOf(it) {
 const s = it.c ? {w: it.c.w, d: it.c.d} : it.sizes?.[it.s] ?? it.sizes?.[0];
 return s ? {w: s.w, d: s.d, n: it.c ? 'Custom' : s.n} : null;
}

export function open(D, items) {
 if (ui) ui.remove();
 const box = document.createElement('div');
 box.className = 'p3d';
 box.setAttribute('role', 'dialog');
 box.setAttribute('aria-modal', 'true');
 box.setAttribute('aria-label', '3D view of the floor plan');
 box.innerHTML = `<div class="p3d-bar"><b>3D view</b><button type="button" class="p3d-close" data-x aria-label="Close the 3D view">Close</button></div>
<div class="p3d-stage"><canvas class="p3d-canvas"></canvas><p class="p3d-label" data-label hidden></p></div>
<div class="p3d-ctrl"><div class="p3d-row">${ROOMS.map(([id, n], k) => `<button type="button" data-room="${id}"${k ? '' : ' aria-pressed="true"'}>${n}</button>`).join('')}</div>
<div class="p3d-row"><button type="button" data-sofa>Sit on the sofa</button><button type="button" data-walls aria-pressed="false">Full-height walls</button></div>
<p class="p3d-help">Drag to turn, pinch or scroll to zoom. Tap a piece for its name and size. Real sizes from the plan; heights are estimates.</p></div>`;
 document.body.append(box);
 ui = box;
 const prevFocus = document.activeElement;
 document.documentElement.classList.add('p3d-open');

 const canvas = box.querySelector('canvas'), stage = box.querySelector('.p3d-stage'), label = box.querySelector('[data-label]');
 const renderer = new T.WebGLRenderer({canvas, antialias: true});
 renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
 const scene = new T.Scene();
 scene.background = new T.Color('#f3efe8');
 const camera = new T.PerspectiveCamera(50, 1, 0.05, 100);
 scene.add(new T.HemisphereLight(0xffffff, 0xb9ad9c, 1.6));
 const sun = new T.DirectionalLight(0xffffff, 1.4);
 sun.position.set(4, 10, 6);
 scene.add(sun);

 const m = v => v / 1000, ceil = m(D.ceilingMm || 2600);
 // Floors
 for (const r of D.rooms) for (const [x, y, w, h] of r.boxes) {
  const g = new T.Mesh(new T.PlaneGeometry(m(w), m(h)), new T.MeshStandardMaterial({color: '#e2d6c3'}));
  g.rotation.x = -Math.PI / 2;
  g.position.set(m(x + w / 2), 0, m(y + h / 2));
  scene.add(g);
 }
 // Walls
 const walls = new T.Group();
 scene.add(walls);
 const wallMat = {c: new T.MeshStandardMaterial({color: '#fbf9f5'}), p: new T.MeshStandardMaterial({color: '#efe7da'})};
 for (const [x1, y1, x2, y2, t] of D.walls) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 10) continue;
  const thick = t === 'p' ? 75 : 120;
  const mesh = new T.Mesh(new T.BoxGeometry(m(len + thick), 1, m(thick)), wallMat[t] ?? wallMat.c);
  mesh.position.set(m((x1 + x2) / 2), 0, m((y1 + y2) / 2));
  mesh.rotation.y = -Math.atan2(y2 - y1, x2 - x1);
  walls.add(mesh);
 }
 const setWalls = full => walls.children.forEach(w => {const hgt = full ? ceil : 1.0; w.scale.y = hgt; w.position.y = hgt / 2;});
 setWalls(false);

 // Furniture
 const pick = [];
 for (const it of items) {
  if (it.on === false || it.kind === 'wifi' || it.kind === 'dock') continue;
  const s = sizeOf(it);
  if (!s) continue;
  const hgt = m(HEIGHT[it.kind] ?? 800), lift = m(LIFT[it.kind] ?? 0);
  const colour = it.kind === 'tv' ? '#1d1d1f' : (D.colours[it.room] ?? '#56607a');
  const mat = new T.MeshStandardMaterial({color: colour, roughness: 0.85});
  if (it.kind !== 'tv') mat.color.lerp(new T.Color('#ffffff'), 0.35);
  const mesh = new T.Mesh(new T.BoxGeometry(m(s.w), hgt, m(it.kind === 'tv' ? Math.min(s.d, 60) : s.d)), mat);
  mesh.position.set(m(it.x), lift + hgt / 2, m(it.y));
  mesh.rotation.y = -(it.r || 0) * Math.PI / 180;
  mesh.add(new T.LineSegments(new T.EdgesGeometry(mesh.geometry), new T.LineBasicMaterial({color: '#4a4036', transparent: true, opacity: 0.35})));
  mesh.userData = {name: it.name, size: s};
  scene.add(mesh);
  pick.push(mesh);
 }

 // Camera control: orbit around a target
 const orbit = {target: new T.Vector3(m(D.W / 2), 0, m(D.H / 2)), dist: 15, yaw: 0.6, pitch: 1.0};
 const place = () => {
  const p = Math.max(0.05, Math.min(1.45, orbit.pitch));
  orbit.pitch = p;
  orbit.dist = Math.max(0.5, Math.min(30, orbit.dist));
  camera.position.set(orbit.target.x + orbit.dist * Math.cos(p) * Math.sin(orbit.yaw), orbit.target.y + orbit.dist * Math.sin(p), orbit.target.z + orbit.dist * Math.cos(p) * Math.cos(orbit.yaw));
  camera.lookAt(orbit.target);
  draw();
 };
 const roomBox = id => {
  if (id === 'all') return [0, 0, D.W, D.H];
  const r = D.rooms.find(x => x.id === id);
  if (!r) return null;
  const xs = r.boxes.flatMap(([x, , w]) => [x, x + w]), ys = r.boxes.flatMap(([, y, , h]) => [y, y + h]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
 };
 const goRoom = id => {
  const b = roomBox(id);
  if (!b) return;
  orbit.target.set(m(b[0] + b[2] / 2), 0, m(b[1] + b[3] / 2));
  orbit.dist = Math.max(5, m(Math.max(b[2], b[3])) * (id === 'all' ? 0.95 : 2.2));
  orbit.pitch = 1.05;
  orbit.yaw = 0.6;
  place();
 };
 const sofaView = () => {
  const sofa = items.find(i => i.id === 'living-sofa-l'), tv = items.find(i => i.id === 'living-tv');
  if (!sofa || !tv) return;
  orbit.target.set(m(tv.x), 1.05, m(tv.y));
  const dx = m(sofa.x) - m(tv.x), dz = m(sofa.y) - m(tv.y);
  orbit.dist = Math.hypot(dx, dz);
  orbit.yaw = Math.atan2(dx, dz);
  orbit.pitch = Math.asin(Math.max(-1, Math.min(1, 0.05 / orbit.dist)));
  orbit.target.y = 1.05;
  place();
 };

 // Pointer: one finger turns, two fingers zoom
 const ptrs = new Map();
 let pinch = 0, moved = 0;
 canvas.addEventListener('pointerdown', e => {canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0;});
 canvas.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return;
  const [px, py] = ptrs.get(e.pointerId);
  ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 1) {
   orbit.yaw -= (e.clientX - px) * 0.008;
   orbit.pitch += (e.clientY - py) * 0.006;
   moved += Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
   place();
  } else if (ptrs.size === 2) {
   const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
   if (pinch) {orbit.dist *= pinch / d; place();}
   pinch = d;
   moved = 99;
  }
 });
 const up = e => {
  ptrs.delete(e.pointerId);
  if (ptrs.size < 2) pinch = 0;
  if (e.type === 'pointerup' && moved < 6) tap(e);
 };
 canvas.addEventListener('pointerup', up);
 canvas.addEventListener('pointercancel', up);
 canvas.addEventListener('wheel', e => {e.preventDefault(); orbit.dist *= Math.exp(e.deltaY * 0.001); place();}, {passive: false});

 const ray = new T.Raycaster();
 function tap(e) {
  const r = canvas.getBoundingClientRect();
  ray.setFromCamera(new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
  const hit = ray.intersectObjects(pick, false)[0];
  if (!hit) {label.hidden = true; return;}
  const {name, size} = hit.object.userData;
  label.textContent = `${name}: ${Math.round(size.w / 10)} × ${Math.round(size.d / 10)} cm`;
  label.hidden = false;
 }

 function draw() {renderer.render(scene, camera);}
 function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  // Keep about 65° side to side, like a person's comfortable view, even on a narrow phone screen.
  camera.fov = Math.max(45, Math.min(100, 2 * Math.atan(Math.tan(32.5 * Math.PI / 180) / camera.aspect) * 180 / Math.PI));
  camera.updateProjectionMatrix();
  draw();
 }
 const ro = new ResizeObserver(resize);
 ro.observe(stage);

 box.querySelectorAll('[data-room]').forEach(b => b.onclick = () => {
  box.querySelectorAll('[data-room]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  goRoom(b.dataset.room);
 });
 box.querySelector('[data-sofa]').onclick = () => {
  const wb = box.querySelector('[data-walls]');
  wb.setAttribute('aria-pressed', 'true');
  setWalls(true);
  sofaView();
 };
 box.querySelector('[data-walls]').onclick = e => {
  const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
  e.currentTarget.setAttribute('aria-pressed', String(on));
  setWalls(on);
  draw();
 };
 const close = () => {
  ro.disconnect();
  renderer.dispose();
  box.remove();
  ui = null;
  document.documentElement.classList.remove('p3d-open');
  document.removeEventListener('keydown', key);
  prevFocus?.focus?.();
 };
 const key = e => {if (e.key === 'Escape') close();};
 document.addEventListener('keydown', key);
 box.querySelector('[data-x]').onclick = close;
 box.querySelector('[data-x]').focus();
 resize();
 goRoom('all');
}
