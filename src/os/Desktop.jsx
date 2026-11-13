import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSystem, useNow } from './system.jsx';
import { DOCK_ORDER, MENU_H, clamp } from './meta.js';
import { AppIcon, Glyph } from './icons.jsx';
import { APP_COMPONENTS, appIconId, appTitle } from './apps.jsx';
import MenuBar from './MenuBar.jsx';
import Dock from './Dock.jsx';
import Window, { SnapPreview } from './Window.jsx';
import Spotlight from './Spotlight.jsx';
import Notifications from './Notifications.jsx';
import { PROFILE } from '../data.js';
import { useLiquidGlass } from './liquid.js';

const WIDGET_GLASS = { depth: 18, strength: 14, aberration: 0.2 };

/* the icons on the desktop (open on double-click; on phones the home screen shows every app instead) */
const ICONS = [
  { id: 'readme', open: (s) => s.open('readme') },
  { id: 'projects', open: (s) => s.open('projects') },
  { id: 'carhelp', open: (s) => s.open('carhelp') },
  { id: 'cv', open: (s) => s.open('cv') },
  { id: 'sportx', open: (s) => s.open('project', { id: 'sportx' }) },
];
const CELL = { w: 96, h: 104 };
let welcomed = false; // once per page load (the desktop remounts after the lock screen)

function defaultIconPos(i) {
  const x = window.innerWidth - CELL.w - 18;
  return { x, y: MENU_H + 18 + i * CELL.h };
}

export default function Desktop() {
  const sys = useSystem();
  const { t } = sys;
  const [menu, setMenu] = useState(null); // right-click menu position

  /* first visit: open the README and show a hint */
  useEffect(() => {
    if (welcomed) return undefined;
    const params = new URLSearchParams(window.location.search);
    const deep = params.get('open');
    const tm = setTimeout(() => {
      welcomed = true;
      if (deep && APP_COMPONENTS[deep]) sys.open(deep);
      else if (!sys.mobile && !sys.windows.length) { sys.open('about'); }
      sys.notify({ title: t.os.notify.welcomeTitle, text: sys.mobile ? t.os.notify.welcomeMobile : t.os.notify.welcomeText, icon: 'readme', timeout: sys.mobile ? 5000 : 9000, onClick: () => sys.open('readme') });
    }, 450);
    return () => clearTimeout(tm);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onContext = (e) => {
    if (e.target.closest('.win, .dock-wrap, .menubar, .widget')) return;
    e.preventDefault();
    setMenu({ x: clamp(e.clientX, 4, window.innerWidth - 236), y: clamp(e.clientY, MENU_H, window.innerHeight - 300) });
  };

  return (
    <motion.div
      className="desktop"
      onContextMenu={onContext}
      onPointerDown={(e) => { if (menu && !e.target.closest('.ctx')) setMenu(null); }}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <MenuBar />
      <main className="desk" aria-label={t.os.desktop.aria}>
        {sys.mobile ? <HomeScreen /> : <>
          <Widgets />
          <DesktopIcons />
        </>}
        <SnapPreview />
        <AnimatePresence>
          {sys.windows.map((w) => {
            const App = APP_COMPONENTS[w.app];
            return (
              <Window key={w.id} win={w} title={appTitle(w, t)} iconId={appIconId(w)}>
                <App win={w} {...(w.props || {})} />
              </Window>
            );
          })}
        </AnimatePresence>
      </main>
      <Dock />
      <Notifications />
      <AnimatePresence>{sys.spotlight && <Spotlight />}</AnimatePresence>
      <AnimatePresence>{menu && <ContextMenu at={menu} onClose={() => setMenu(null)} />}</AnimatePresence>
    </motion.div>
  );
}

/* ── desktop icons: select on click, open on double-click (tap on touch), drag to move ── */
function DesktopIcons() {
  const sys = useSystem();
  const [selected, setSelected] = useState(null);
  const [pos, setPos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tn-icons')) || {}; } catch { return {}; }
  });

  useEffect(() => { if (sys.iconsNonce) setPos({}); }, [sys.iconsNonce]);

  const save = (next) => {
    setPos(next);
    try { localStorage.setItem('tn-icons', JSON.stringify(next)); } catch { /* */ }
  };

  return (
    <div className="desk-icons" onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
      {ICONS.map((ic, i) => (
        <DesktopIcon
          key={ic.id}
          ic={ic}
          pos={pos[ic.id] ?? defaultIconPos(i)}
          selected={selected === ic.id}
          onSelect={() => setSelected(ic.id)}
          onOpen={() => ic.open(sys)}
          onMove={(p) => save({ ...pos, [ic.id]: p })}
          label={sys.t.os.desktop[ic.id]}
        />
      ))}
    </div>
  );
}

function DesktopIcon({ ic, pos, selected, onSelect, onOpen, onMove, label }) {
  const ref = useRef(null);
  const down = (e) => {
    if (e.button !== 0) return;
    onSelect();
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    const p0 = { x: e.clientX, y: e.clientY };
    let moved = false;
    let next = pos;
    const move = (ev) => {
      const dx = ev.clientX - p0.x;
      const dy = ev.clientY - p0.y;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true;
      next = {
        x: clamp(pos.x + dx, 0, window.innerWidth - CELL.w),
        y: clamp(pos.y + dy, MENU_H, window.innerHeight - CELL.h - 90),
      };
      el.style.transform = `translate(${next.x}px, ${next.y}px)`;
      el.classList.add('is-dragging');
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.classList.remove('is-dragging');
      if (moved) onMove({ x: Math.round(next.x), y: Math.round(next.y) });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <button
      ref={ref}
      className={`desk-icon${selected ? ' is-selected' : ''}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onPointerDown={down}
      onDoubleClick={onOpen}
      onClick={(e) => { if (e.nativeEvent.pointerType === 'touch') onOpen(); }}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}
    >
      <AppIcon id={ic.id} size={54} />
      <span className="desk-label">{label}</span>
    </button>
  );
}

/* ── widgets on the left of the desktop ── */
function Widgets() {
  const sys = useSystem();
  const { t, lang } = sys;
  const now = useNow(1000);
  const lisbon = new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' }).format(now);
  const sec = now.getSeconds();
  const min = now.getMinutes();
  const hr = Number(lisbon.slice(0, 2)) % 12;
  const glassProfile = useLiquidGlass(WIDGET_GLASS);
  const glassCarhelp = useLiquidGlass(WIDGET_GLASS);
  const glassClock = useLiquidGlass(WIDGET_GLASS);

  return (
    <div className="widgets">
      <button ref={glassProfile} className="widget widget-profile lg lg-i" onClick={() => sys.open('about')}>
        <img src={PROFILE.photo} alt="" />
        <div>
          <span className="w-kicker">{t.os.widgets.hello}</span>
          <strong>{PROFILE.name}</strong>
          <span className="w-sub">{t.nav.role}</span>
          <span className="w-status"><i className="dot-live" />{t.contact.statusValue}</span>
        </div>
      </button>
      <div className="widget-row">
        <button ref={glassCarhelp} className="widget widget-carhelp lg lg-i" onClick={() => sys.open('carhelp')}>
          <AppIcon id="carhelp" size={44} />
          <strong>CarHelp</strong>
          <span className="w-sub">{t.os.widgets.carhelpPlay}</span>
        </button>
        <div ref={glassClock} className="widget widget-clock lg" aria-label={`${t.os.widgets.clock} ${lisbon}`}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" className="c-face" />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="50" y1="9" x2="50" y2={i % 3 ? 13 : 16} transform={`rotate(${i * 30} 50 50)`} className="c-tick" />
            ))}
            <line x1="50" y1="50" x2="50" y2="28" transform={`rotate(${hr * 30 + min / 2} 50 50)`} className="c-hour" />
            <line x1="50" y1="50" x2="50" y2="17" transform={`rotate(${min * 6 + sec / 10} 50 50)`} className="c-min" />
            <line x1="50" y1="56" x2="50" y2="14" transform={`rotate(${sec * 6} 50 50)`} className="c-sec" />
            <circle cx="50" cy="50" r="2.6" className="c-pin" />
          </svg>
          <span className="w-sub">{t.os.widgets.clock} · {lisbon}</span>
        </div>
      </div>
    </div>
  );
}

/* ── phones: a home screen with every app ── */
function HomeScreen() {
  const sys = useSystem();
  const { t } = sys;
  const apps = [...DOCK_ORDER, 'readme'];
  const glass = useLiquidGlass(WIDGET_GLASS);
  return (
    <div className="home">
      <button ref={glass} className="widget widget-profile lg lg-i" onClick={() => sys.open('about')}>
        <img src={PROFILE.photo} alt="" />
        <div>
          <strong>{PROFILE.name}</strong>
          <span className="w-sub">{t.nav.role}</span>
          <span className="w-status"><i className="dot-live" />{t.contact.statusValue}</span>
        </div>
      </button>
      <div className="home-grid">
        {apps.map((id) => (
          <button key={id} className="home-app" onClick={() => sys.open(id)}>
            <AppIcon id={id} size={58} />
            <span>{t.os.apps[id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── right-click menu ── */
function ContextMenu({ at, onClose }) {
  const sys = useSystem();
  const c = sys.t.os.ctx;
  const glass = useLiquidGlass({ depth: 14, strength: 10 });
  const items = [
    { label: c.terminal, icon: 'terminal', action: () => sys.open('terminal') },
    { label: c.settings, icon: 'settings', action: () => sys.open('settings') },
    '-',
    { label: c.nextWall, action: sys.nextWallpaper },
    { label: c.resetIcons, action: sys.resetIcons },
    { label: c.arrange, action: sys.arrange, disabled: !sys.windows.length },
    { label: c.closeAll, action: sys.closeAll, disabled: !sys.windows.length },
    '-',
    { label: c.lang, action: sys.toggleLang, glyph: 'globe' },
    { label: c.lock, action: sys.lock, glyph: 'lock' },
  ];
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <motion.div
      ref={glass}
      className="menu ctx lg"
      role="menu"
      style={{ left: at.x, top: at.y }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: 0.12 }}
    >
      {items.map((it, i) => it === '-' ? <div key={i} className="menu-sep" /> : (
        <div
          key={i}
          role="menuitem"
          className={`menu-row${it.disabled ? ' is-disabled' : ''}`}
          onClick={() => { if (it.disabled) return; onClose(); it.action(); }}
        >
          <span className="menu-check" />
          {it.icon && <AppIcon id={it.icon} size={16} />}
          {it.glyph && <span className="menu-glyph"><Glyph name={it.glyph} size={14} /></span>}
          <span className="menu-label">{it.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
