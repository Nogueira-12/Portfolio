/*
 * Liquid glass refraction.
 *
 * Chromium can run an SVG filter as a backdrop-filter, so there the glass really bends what is behind it: every
 * surface gets its own displacement map that pushes the backdrop inward near the edges, like the rim of a thick
 * lens (optionally splitting red/green/blue a little for a chromatic fringe). Other browsers keep the CSS-only
 * material from styles.css (.lg): blur, specular rim, inner glow and the pointer highlight.
 *
 * The map is built from nine pieces (four corners, four edge strips, a neutral centre) that only depend on the
 * corner radius and the rim depth. Resizing a surface (the dock while it magnifies, for example) just moves the
 * pieces; nothing is redrawn or reloaded, so it never flickers.
 */
import { useCallback, useRef } from 'react';

const NS = 'http://www.w3.org/2000/svg';
let supported;
let host;
let uid = 0;
let canvas;
const tileCache = new Map();

export function liquidSupported() {
  if (supported !== undefined) return supported;
  if (typeof window === 'undefined') return (supported = false);
  const ua = navigator.userAgent;
  supported = /Chrom(e|ium)\/\d+/.test(ua)
    && !/Firefox|FxiOS|CriOS|EdgiOS/.test(ua)
    && window.CSS?.supports?.('backdrop-filter', 'url(#a)') === true
    && !window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
  return supported;
}

/* ── displacement tiles ── */

// paints a w×h tile; fn(x, y) returns the inward displacement [dx, dy] in -1…1
function paint(w, h, fn) {
  canvas ??= document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const px = img.data;
  for (let y = 0, i = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i += 4) {
      const [dx, dy] = fn(x + 0.5, y + 0.5);
      px[i] = 128 + dx * 127;
      px[i + 1] = 128 + dy * 127;
      px[i + 2] = 128;
      px[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

function tiles(R, depth) {
  const key = `${R}:${depth}`;
  if (tileCache.has(key)) return tileCache.get(key);

  // strongest at the very edge, fading to nothing `depth` px inside
  const bend = (dist) => {
    const t = Math.min(Math.max(dist / depth, 0), 1);
    return (1 - t) * (1 - t);
  };
  // fx/fy mirror the top-left corner into the other three
  const corner = (fx, fy) => paint(R, R, (x, y) => {
    const cx = R - (fx ? R - x : x);
    const cy = R - (fy ? R - y : y);
    const l = Math.hypot(cx, cy) || 1;
    const m = bend(R - l);
    return [(cx / l) * m * (fx ? -1 : 1), (cy / l) * m * (fy ? -1 : 1)];
  });

  const t = {
    tl: corner(false, false),
    tr: corner(true, false),
    bl: corner(false, true),
    br: corner(true, true),
    top: paint(2, R, (x, y) => [0, bend(y)]),
    bottom: paint(2, R, (x, y) => [0, -bend(R - y)]),
    left: paint(R, 2, (x) => [bend(x), 0]),
    right: paint(R, 2, (x) => [-bend(R - x), 0]),
  };
  tileCache.set(key, t);
  return t;
}

/* ── the SVG filter ── */

function node(tag, attrs) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

const PIECES = ['tl', 'tr', 'bl', 'br', 'top', 'bottom', 'left', 'right'];

function createFilter(id, strength, aberration) {
  if (!host) {
    host = node('svg', { 'aria-hidden': 'true', width: 0, height: 0 });
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    document.body.appendChild(host);
  }
  const filter = node('filter', {
    id, x: 0, y: 0, width: 1, height: 1,
    filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB',
  });
  filter.append(node('feFlood', { 'flood-color': '#808080', result: 'neutral' }));
  const images = {};
  const merge = node('feMerge', { result: 'map' });
  merge.append(node('feMergeNode', { in: 'neutral' }));
  for (const p of PIECES) {
    images[p] = node('feImage', { preserveAspectRatio: 'none', result: `p-${p}` });
    filter.append(images[p]);
    merge.append(node('feMergeNode', { in: `p-${p}` }));
  }
  filter.append(merge);

  const lenses = []; // [node, base scale]: pressing the glass thickens every lens for a moment
  const displace = (scale, result) => {
    const n = node('feDisplacementMap', { in: 'SourceGraphic', in2: 'map', scale, xChannelSelector: 'R', yChannelSelector: 'G', ...(result && { result }) });
    lenses.push([n, scale]);
    return n;
  };
  if (aberration) {
    // red bends a little more than green, blue a little less: a faint prism fringe along the rim
    const keep = ['1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'];
    [1 + aberration, 1, 1 - aberration].forEach((k, i) => {
      filter.append(displace(strength * k, `d${i}`), node('feColorMatrix', { in: `d${i}`, type: 'matrix', values: keep[i], result: `c${i}` }));
    });
    // each layer holds one channel, so adding them rebuilds the full colour (feBlend's screen mode broke it in Chromium)
    const add = (a, b, result) => node('feComposite', { in: a, in2: b, operator: 'arithmetic', k2: 1, k3: 1, ...(result && { result }) });
    filter.append(add('c0', 'c1', 'rg'), add('rg', 'c2'));
  } else {
    filter.append(displace(strength));
  }
  host.append(filter);
  return { filter, images, lenses };
}

const glassOf = new WeakMap(); // element → { press(on) }

function radiusOf(el, w) {
  const v = getComputedStyle(el).borderTopLeftRadius;
  const n = parseFloat(v) || 0;
  return v.endsWith('%') ? (n / 100) * w : n;
}

/**
 * Gives `el` refracting edges. Returns a function that removes them.
 * depth: how far in from the edge the glass bends (px) · strength: twice the largest shift of the backdrop (px)
 * aberration: 0…1, how much the colour channels split along the rim
 */
export function attachGlass(el, { depth = 16, strength = 12, aberration = 0 } = {}) {
  if (!liquidSupported() || !el) return () => {};
  const id = `lg-${++uid}`;
  const { filter, images, lenses } = createFilter(id, strength, aberration);
  let curKey = '';
  let curSize = '';
  let raf = 0;

  // press: a small spring drives the lens strength up (and back), overshooting a little like jelly
  let k = 1;
  let v = 0;
  let target = 1;
  let springRaf = 0;
  const step = () => {
    v = (v + (target - k) * 0.16) * 0.74;
    k += v;
    for (const [n, base] of lenses) n.setAttribute('scale', (base * k).toFixed(2));
    springRaf = Math.abs(target - k) + Math.abs(v) > 0.002 ? requestAnimationFrame(step) : 0;
  };
  glassOf.set(el, {
    press(on) {
      target = on ? 1.35 : 1;
      if (!springRaf) springRaf = requestAnimationFrame(step);
    },
  });

  const place = (p, x, y, w, h) => {
    const im = images[p];
    im.setAttribute('x', x);
    im.setAttribute('y', y);
    im.setAttribute('width', Math.max(0, w));
    im.setAttribute('height', Math.max(0, h));
  };

  const update = () => {
    raf = 0;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w < 4 || h < 4) return;
    const R = Math.max(1, Math.min(Math.round(Math.max(radiusOf(el, w), depth)), Math.floor(w / 2), Math.floor(h / 2)));
    const d = Math.min(depth, R);
    const key = `${R}:${d}`;
    if (key !== curKey) {
      curKey = key;
      const t = tiles(R, d);
      for (const p of PIECES) images[p].setAttribute('href', t[p]);
      curSize = '';
    }
    const size = `${w}x${h}`;
    if (size === curSize) return;
    curSize = size;
    filter.setAttribute('width', w);
    filter.setAttribute('height', h);
    place('tl', 0, 0, R, R);
    place('tr', w - R, 0, R, R);
    place('bl', 0, h - R, R, R);
    place('br', w - R, h - R, R, R);
    place('top', R, 0, w - 2 * R, R);
    place('bottom', R, h - R, w - 2 * R, R);
    place('left', 0, R, R, h - 2 * R);
    place('right', w - R, R, R, h - 2 * R);
  };

  update();
  el.style.setProperty('--lg-filter', `url(#${id})`);
  const ro = new ResizeObserver(() => { if (!raf) raf = requestAnimationFrame(update); });
  ro.observe(el, { box: 'border-box' });

  return () => {
    ro.disconnect();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(springRaf);
    glassOf.delete(el);
    filter.remove();
    el.style.removeProperty('--lg-filter');
  };
}

/* ref callback for React elements (motion components included) */
export function useLiquidGlass(opts) {
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const stop = useRef(null);
  return useCallback((el) => {
    stop.current?.();
    stop.current = el ? attachGlass(el, optsRef.current) : null;
  }, []);
}

/*
 * Interactive glass (.lg-i):
 * - a highlight follows the pointer (--lx/--ly) and the bright side of the rim turns to face it (--lg-angle)
 * - small controls (.lg-m) lean a few px toward the pointer (--mx/--my)
 * - pressing swells the sheet (.is-pressed, CSS) and thickens its lens (liquid.js)
 */
const REST_ANGLE = 145;
const PULL = 0.07; // how strongly .lg-m leans toward the pointer
const MAX_PULL = 4; // px

export function installGlassLight() {
  let hot = null;
  let pressed = null;

  // turn to the nearest equivalent angle, so the transition never spins the long way round
  const turn = (el, a) => {
    const prev = el.__lgAngle ?? REST_ANGLE;
    const next = prev + ((((a - prev) % 360) + 540) % 360) - 180;
    el.__lgAngle = next;
    el.style.setProperty('--lg-angle', `${next.toFixed(1)}deg`);
  };
  const rest = (el) => {
    turn(el, REST_ANGLE);
    el.style.removeProperty('--mx');
    el.style.removeProperty('--my');
  };

  const move = (e) => {
    const el = e.target instanceof Element ? e.target.closest('.lg-i') : null;
    if (hot && hot !== el) rest(hot);
    hot = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--lx', `${Math.round(x)}px`);
    el.style.setProperty('--ly', `${Math.round(y)}px`);
    const dx = x - r.width / 2;
    const dy = y - r.height / 2;
    // the gradient starts on the side opposite its direction, so point it away from the pointer
    turn(el, (Math.atan2(dx, -dy) * 180) / Math.PI + 180);
    if (el.classList.contains('lg-m')) {
      const c = (n) => Math.max(-MAX_PULL, Math.min(MAX_PULL, n * PULL));
      el.style.setProperty('--mx', `${c(dx).toFixed(1)}px`);
      el.style.setProperty('--my', `${c(dy).toFixed(1)}px`);
    }
  };
  const down = (e) => {
    move(e);
    const el = e.target instanceof Element ? e.target.closest('.lg-i') : null;
    if (!el) return;
    pressed = el;
    el.classList.add('is-pressed');
    glassOf.get(el)?.press(true);
  };
  const up = () => {
    if (!pressed) return;
    pressed.classList.remove('is-pressed');
    glassOf.get(pressed)?.press(false);
    pressed = null;
  };
  const out = (e) => { if (!e.relatedTarget && hot) { rest(hot); hot = null; } };

  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', down, { passive: true });
  window.addEventListener('pointerup', up, { passive: true });
  window.addEventListener('pointercancel', up, { passive: true });
  window.addEventListener('blur', up);
  document.addEventListener('pointerout', out, { passive: true });
  return () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerdown', down);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    window.removeEventListener('blur', up);
    document.removeEventListener('pointerout', out);
  };
}
