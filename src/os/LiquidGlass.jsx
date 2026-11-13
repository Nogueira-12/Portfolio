/*
 * <LiquidGlass> — a surface in the spirit of iOS 26 Liquid Glass.
 *
 * Material (styles.css, .lg): backdrop-filter blur(20px) saturate(180%), luminous inner edges
 * (specular highlights as inset box-shadows), subtle gradients along the edges and a bright rim.
 * Refraction (liquid.js): a light SVG feDisplacementMap bends the backdrop near the edges (Chromium).
 * Motion (here): spring physics. The sheet swells on hover, leans toward the pointer, stretches along
 * the direction the pointer moves (keeping its volume, like a drop) and, when pressed, expands and
 * wobbles back on release.
 *
 *   <LiquidGlass as="button" className="my-pill" onClick={…}>Entrar</LiquidGlass>
 *
 * Props: as (tag), blur (px), saturate (1.8 = 180%), tint (CSS colour), refraction ({ depth, strength,
 * aberration } or false), interactive (springs + pointer light), and any prop of the underlying element.
 */
import { useCallback, useRef } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';
import { useLiquidGlass } from './liquid.js';

const JELLY = { stiffness: 420, damping: 14, mass: 0.6 }; // low damping: overshoots and wobbles
const LEAN = { stiffness: 260, damping: 20, mass: 0.5 };
const HOVER = 1.03;
const PRESS = 1.07;
const PULL = 0.06; // how far it leans toward the pointer, per px from the centre
const MAX_PULL = 5; // px
const MAX_STRETCH = 0.07;

const clamp = (v, m) => Math.max(-m, Math.min(m, v));

export default function LiquidGlass({
  as = 'div',
  className = '',
  style,
  blur = 20,
  saturate = 1.8,
  tint,
  refraction = { depth: 22, strength: 28, aberration: 0.15 },
  interactive = true,
  ref,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  children,
  ...rest
}) {
  const Tag = motion[as];
  const still = useReducedMotion();
  const springy = interactive && !still;

  const sx = useSpring(1, JELLY);
  const sy = useSpring(1, JELLY);
  const x = useSpring(0, LEAN);
  const y = useSpring(0, LEAN);
  const s = useRef({ hover: false, press: false, last: null, relax: 0, wobble: 0 });

  /* refraction + any ref passed in (stable: a new `refraction` object on each render must not rebuild the filter) */
  const glass = useLiquidGlass(refraction || {});
  const refracts = !!refraction;
  const setRef = useCallback((el) => {
    if (refracts) glass(el);
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  }, [glass, ref, refracts]);

  const rest_ = () => (s.current.press ? PRESS : s.current.hover ? HOVER : 1);
  const settle = () => { sx.set(rest_()); sy.set(rest_()); };

  const handlers = springy ? {
    onPointerEnter(e) {
      s.current.hover = true;
      s.current.last = { x: e.clientX, y: e.clientY };
      settle();
      onPointerEnter?.(e);
    },
    onPointerMove(e) {
      const r = e.currentTarget.getBoundingClientRect();
      x.set(clamp((e.clientX - (r.left + r.width / 2)) * PULL, MAX_PULL));
      y.set(clamp((e.clientY - (r.top + r.height / 2)) * PULL, MAX_PULL));

      // stretch along the movement, squeeze across it: a drop keeps its volume
      const last = s.current.last ?? { x: e.clientX, y: e.clientY };
      const vx = Math.abs(e.clientX - last.x);
      const vy = Math.abs(e.clientY - last.y);
      s.current.last = { x: e.clientX, y: e.clientY };
      const amount = Math.min(Math.hypot(vx, vy) * 0.004, MAX_STRETCH);
      if (amount > 0.004) {
        const along = vx / (vx + vy);
        const base = rest_();
        sx.set(base + amount * along - amount * 0.5 * (1 - along));
        sy.set(base + amount * (1 - along) - amount * 0.5 * along);
        clearTimeout(s.current.relax);
        s.current.relax = setTimeout(settle, 90);
      }
      onPointerMove?.(e);
    },
    onPointerLeave(e) {
      s.current.hover = false;
      s.current.press = false;
      x.set(0);
      y.set(0);
      settle();
      onPointerLeave?.(e);
    },
    onPointerDown(e) {
      s.current.press = true;
      // a quick squash before it swells, so the press reads as liquid rather than a plain zoom
      sx.set(PRESS + 0.02);
      sy.set(PRESS - 0.03);
      clearTimeout(s.current.wobble);
      s.current.wobble = setTimeout(settle, 70);
      onPointerDown?.(e);
    },
    onPointerUp(e) {
      s.current.press = false;
      // release: dip below the resting size, then the low-damping spring wobbles back
      sx.set(rest_() - 0.04);
      sy.set(rest_() - 0.02);
      clearTimeout(s.current.wobble);
      s.current.wobble = setTimeout(settle, 60);
      onPointerUp?.(e);
    },
    onPointerCancel(e) {
      s.current.press = false;
      settle();
      onPointerCancel?.(e);
    },
  } : { onPointerEnter, onPointerMove, onPointerLeave, onPointerDown, onPointerUp, onPointerCancel };

  return (
    <Tag
      ref={setRef}
      className={`lg lg-spring${interactive ? ' lg-i' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--lg-blur': `${blur}px`,
        '--lg-sat': saturate,
        ...(tint && { '--lg-tint': tint }),
        ...(springy && { x, y, scaleX: sx, scaleY: sy }),
        ...style,
      }}
      {...handlers}
      {...rest}
    >
      {children}
    </Tag>
  );
}
