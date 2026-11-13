import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { useSystem, workArea } from './system.jsx';
import { APP_META, MENU_H, clamp, dockIdOf } from './meta.js';
import { AppIcon, Glyph } from './icons.jsx';

const EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 };

/* while dragging/resizing: no text selection, and iframes can't steal the pointer */
const busy = (on) => document.documentElement.classList.toggle('wm-busy', on);

export function snapRect(side) {
  const a = workArea();
  const half = Math.round(a.w / 2);
  if (side === 'left') return { x: 0, y: a.y, w: half, h: a.h };
  if (side === 'right') return { x: a.w - half, y: a.y, w: half, h: a.h };
  return { x: 0, y: a.y, w: a.w, h: a.h };
}

export default function Window({ win, title, iconId, children }) {
  const sys = useSystem();
  const { t } = sys;
  const ref = useRef(null);
  const controls = useAnimationControls();
  const meta = APP_META[win.app] ?? { min: [320, 240] };
  const focused = sys.focusedId === win.id;
  const max = win.maximized || sys.mobile;
  const [anim, setAnim] = useState(false);
  const firstAnim = useRef(win.anim);

  /* animate geometry (left/top/size) only for maximise, snap and arrange — never while dragging */
  useEffect(() => {
    if (win.anim === firstAnim.current) return;
    setAnim(true);
    const tm = setTimeout(() => setAnim(false), 340);
    return () => clearTimeout(tm);
  }, [win.anim]);

  /* open, minimise (fly into the dock icon) and restore */
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      controls.set(sys.mobile ? { opacity: 0, y: 40, scale: 1 } : { opacity: 0, scale: 0.92, y: 14 });
      controls.start({ opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0.28, ease: [0.2, 0.9, 0.3, 1] } });
      return;
    }
    if (win.minimized) {
      const el = ref.current;
      const icon = document.querySelector(`[data-dock-id="${dockIdOf(win.app)}"]`);
      const box = el.getBoundingClientRect();
      const r = icon?.getBoundingClientRect() ?? { left: window.innerWidth / 2, top: window.innerHeight - 30, width: 0, height: 0 };
      controls.start({
        x: r.left + r.width / 2 - (box.left + box.width / 2),
        y: r.top + r.height / 2 - (box.top + box.height / 2),
        scale: 0.06,
        opacity: 0,
        transition: { duration: 0.42, ease: [0.5, 0, 0.75, 0] },
      });
    } else {
      controls.start({ x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } });
    }
  }, [win.minimized]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── drag by the title bar ── */
  const onTitleDown = (e) => {
    if (e.button !== 0 || sys.mobile || e.target.closest('button, a, input')) return;
    const el = ref.current;
    const p0 = { x: e.clientX, y: e.clientY };
    let base = p0;
    let start = { ...win.rect };
    let rect = start;
    let started = false;
    let snap = null;

    const move = (ev) => {
      if (!started) {
        if (Math.hypot(ev.clientX - p0.x, ev.clientY - p0.y) < 4) return;
        started = true;
        busy(true);
        if (win.maximized) {
          // pull the window out of "maximised", keeping the grab point under the cursor
          const ratio = (p0.x - 0) / window.innerWidth;
          start = { ...start, x: Math.round(ev.clientX - start.w * ratio), y: MENU_H };
          base = { x: ev.clientX, y: ev.clientY };
          sys.setRect(win.id, start);
        }
      }
      const a = workArea();
      const x = clamp(start.x + ev.clientX - base.x, 80 - start.w, a.vw - 80);
      const y = clamp(start.y + ev.clientY - base.y, MENU_H, a.vh - 60);
      rect = { ...start, x, y };
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      snap = ev.clientY <= MENU_H + 2 ? 'max' : ev.clientX <= 4 ? 'left' : ev.clientX >= a.vw - 5 ? 'right' : null;
      sys.setSnap(snap);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!started) return;
      busy(false);
      sys.setSnap(null);
      if (snap === 'max') sys.setRect(win.id, rect, { maximized: true, animate: true });
      else if (snap) sys.setRect(win.id, snapRect(snap), { animate: true });
      else sys.setRect(win.id, rect);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  /* ── resize from any edge or corner ── */
  const onEdgeDown = (dir) => (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    sys.focus(win.id);
    const el = ref.current;
    const s = { ...win.rect };
    const p0 = { x: e.clientX, y: e.clientY };
    const [minW, minH] = meta.min;
    let rect = s;
    busy(true);
    document.documentElement.style.cursor = getComputedStyle(e.currentTarget).cursor;

    const move = (ev) => {
      const a = workArea();
      const dx = ev.clientX - p0.x;
      const dy = ev.clientY - p0.y;
      let { x, y, w, h } = s;
      if (dir.includes('e')) w = clamp(s.w + dx, minW, a.vw - s.x);
      if (dir.includes('s')) h = clamp(s.h + dy, minH, a.vh - s.y);
      if (dir.includes('w')) { w = clamp(s.w - dx, minW, s.x + s.w); x = s.x + s.w - w; }
      if (dir.includes('n')) { h = clamp(s.h - dy, minH, s.y + s.h - MENU_H); y = s.y + s.h - h; }
      rect = { x, y, w, h };
      Object.assign(el.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      busy(false);
      document.documentElement.style.cursor = '';
      sys.setRect(win.id, rect);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const r = win.rect;
  const style = max
    ? { left: 0, top: MENU_H, width: '100%', height: `calc(100% - ${MENU_H}px - var(--dock-space))`, zIndex: win.z }
    : { left: r.x, top: r.y, width: r.w, height: r.h, zIndex: win.z };

  return (
    <motion.section
      ref={ref}
      className={`win${focused ? ' is-focused' : ''}${max ? ' is-max' : ''}${anim ? ' is-anim' : ''}${win.minimized ? ' is-min' : ''}`}
      style={style}
      animate={controls}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.16, ease: 'easeIn' } }}
      onPointerDownCapture={() => { if (!focused) sys.focus(win.id); }}
      role="dialog"
      aria-label={title}
      aria-hidden={win.minimized || undefined}
      data-app={win.app}
    >
      <header className="win-bar" onPointerDown={onTitleDown} onDoubleClick={(e) => { if (!sys.mobile && !e.target.closest('button')) sys.toggleMax(win.id); }}>
        <div className="win-lights">
          <button className="light light-close" onClick={() => sys.close(win.id)} aria-label={t.os.win.close} title={t.os.win.close}>
            <Glyph name="close" size={8} stroke={2.2} />
          </button>
          <button className="light light-min" onClick={() => sys.minimize(win.id)} aria-label={t.os.win.minimize} title={t.os.win.minimize}>
            <Glyph name="min" size={8} stroke={2.2} />
          </button>
          {!sys.mobile && (
            <button className="light light-max" onClick={() => sys.toggleMax(win.id)} aria-label={win.maximized ? t.os.win.restore : t.os.win.maximize} title={win.maximized ? t.os.win.restore : t.os.win.maximize}>
              <Glyph name="max" size={8} stroke={2.2} />
            </button>
          )}
        </div>
        <div className="win-title">
          <AppIcon id={iconId ?? win.app} size={16} />
          <span>{title}</span>
        </div>
        <div className="win-bar-end" />
      </header>
      <div className="win-body">{children}</div>
      {!max && EDGES.map((d) => <div key={d} className={`win-edge edge-${d}`} onPointerDown={onEdgeDown(d)} />)}
    </motion.section>
  );
}

/* the translucent preview shown while dragging a window to a screen edge */
export function SnapPreview() {
  const { snap } = useSystem();
  if (!snap) return null;
  const r = snapRect(snap);
  return <div className="snap-preview" style={{ left: r.x + 6, top: r.y + 6, width: r.w - 12, height: r.h - 12 }} />;
}
