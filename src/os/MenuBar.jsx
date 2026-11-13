import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSystem, useNow } from './system.jsx';
import { DOCK_ORDER, WALLPAPERS } from './meta.js';
import { AppIcon, Battery, Glyph, Logo } from './icons.jsx';
import { appTitle } from './apps.jsx';
import { useLiquidGlass } from './liquid.js';
import LiquidGlass from './LiquidGlass.jsx';

const REPO = 'https://github.com/Nogueira-12/Portfolio';

export default function MenuBar() {
  const sys = useSystem();
  const { t, lang } = sys;
  const m = t.os.menu;
  const now = useNow(10000);
  const [open, setOpen] = useState(null); // which menu is open
  const barRef = useRef(null);

  const focused = sys.windows.find((w) => w.id === sys.focusedId);
  const appName = focused ? appTitle(focused, t) : m.desktop;

  useEffect(() => {
    if (!open) return;
    const off = (e) => { if (!barRef.current?.contains(e.target)) setOpen(null); };
    const esc = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('pointerdown', off);
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('pointerdown', off); window.removeEventListener('keydown', esc); };
  }, [open]);

  const locale = lang === 'pt' ? 'pt-PT' : 'en-GB';
  const part = (o) => new Intl.DateTimeFormat(locale, o).format(now).replace(/\./g, '');
  const date = `${part({ weekday: 'short' })} ${part({ day: 'numeric' })} ${part({ month: 'short' })}`;
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(now);

  const run = (fn) => () => { setOpen(null); fn(); };

  const menus = {
    logo: [
      { label: m.about, action: () => sys.open('settings', { tab: 'about' }) },
      { label: m.settings, action: () => sys.open('settings') },
      '-',
      { label: m.lock, action: sys.lock, hint: '' },
      { label: m.restart, action: sys.restart },
    ],
    go: DOCK_ORDER.map((id) => ({ label: t.os.apps[id], icon: id, action: () => sys.open(id) })),
    window: [
      { label: m.minimize, action: () => focused && sys.minimize(focused.id), disabled: !focused },
      { label: focused?.maximized ? m.restore : m.maximize, action: () => focused && sys.toggleMax(focused.id), disabled: !focused || sys.mobile },
      { label: m.close, action: () => focused && sys.close(focused.id), disabled: !focused },
      '-',
      { label: m.arrange, action: sys.arrange, disabled: !sys.windows.length || sys.mobile },
      { label: m.closeAll, action: sys.closeAll, disabled: !sys.windows.length },
      '-',
      ...(sys.windows.length
        ? [...sys.windows].sort((a, b) => a.z - b.z).map((w) => ({ label: appTitle(w, t), icon: w.app === 'project' ? 'projects' : w.app, check: w.id === sys.focusedId, action: () => sys.focus(w.id) }))
        : [{ label: m.noWindows, disabled: true }]),
    ],
    help: [
      { label: m.howto, icon: 'readme', action: () => sys.open('readme') },
      { label: m.spotlight, hint: 'Ctrl K', action: () => sys.setSpotlight(true) },
      '-',
      { label: m.source, action: () => window.open(REPO, '_blank', 'noopener') },
    ],
  };

  const trigger = (id, children, className = '', extra = {}) => (
    <span className="mb-wrap">
      <button
        className={`mb-item ${className}${open === id ? ' is-open' : ''}`}
        onPointerDown={(e) => { if (e.button === 0) { e.preventDefault(); setOpen(open === id ? null : id); } }}
        onPointerEnter={() => open && open !== id && id !== 'control' && open !== 'control' && setOpen(id)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === id ? null : id); } }}
        aria-haspopup="menu"
        aria-expanded={open === id}
        {...extra}
      >
        {children}
      </button>
      <AnimatePresence>{open === id && id !== 'control' && <Menu items={menus[id]} run={run} />}</AnimatePresence>
    </span>
  );

  return (
    <header className="menubar" ref={barRef}>
      <div className="mb-left">
        {trigger('logo', <Logo size={18} />, 'mb-logo', { 'aria-label': t.os.name })}
        <span className="mb-app">{appName}</span>
        {!sys.mobile && (
          <>
            {trigger('go', m.go)}
            {trigger('window', m.window)}
            {trigger('help', m.help)}
          </>
        )}
      </div>
      <div className="mb-right">
        {!sys.mobile && <span className="mb-status"><i className="dot-live" />{m.status}</span>}
        <button className="mb-item mb-lang" onClick={sys.toggleLang} aria-label={t.os.ctx.lang} title={t.os.ctx.lang}>{lang.toUpperCase()}</button>
        {!sys.mobile && <span className="mb-icon" aria-hidden="true"><Glyph name="wifi" size={15} /></span>}
        {!sys.mobile && <span className="mb-icon" aria-hidden="true"><Battery /></span>}
        <button className="mb-item mb-icon" onClick={() => sys.setSpotlight(true)} aria-label={m.search} title={m.search}><Glyph name="search" size={14} /></button>
        {trigger('control', <Glyph name="sliders" size={15} />, 'mb-icon', { 'aria-label': m.control, title: m.control })}
        <span className="mb-clock">{!sys.mobile && <span className="mb-date">{date}</span>}{time}</span>
      </div>
      <AnimatePresence>{open === 'control' && <ControlCenter onClose={() => setOpen(null)} />}</AnimatePresence>
    </header>
  );
}

function Menu({ items, run }) {
  const glass = useLiquidGlass({ depth: 18, strength: 22 });
  return (
    <motion.div
      ref={glass}
      className="menu lg"
      role="menu"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: 0.14 }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {items.map((it, i) =>
        it === '-' ? <div key={i} className="menu-sep" role="separator" /> : (
          <div
            key={i}
            role="menuitem"
            tabIndex={-1}
            aria-disabled={it.disabled || undefined}
            className={`menu-row${it.disabled ? ' is-disabled' : ''}`}
            onClick={(e) => { e.stopPropagation(); if (!it.disabled && it.action) run(it.action)(); }}
          >
            <span className="menu-check">{it.check ? '✓' : ''}</span>
            {it.icon && <AppIcon id={it.icon} size={16} />}
            <span className="menu-label">{it.label}</span>
            {it.hint && <span className="menu-hint">{it.hint}</span>}
          </div>
        )
      )}
    </motion.div>
  );
}

function ControlCenter({ onClose }) {
  const sys = useSystem();
  const c = sys.t.os.control;
  const glass = useLiquidGlass({ depth: 24, strength: 30 });
  return (
    <motion.div
      ref={glass}
      className="control lg"
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
      transition={{ duration: 0.18 }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="cc-block lg">
        <span className="cc-label">{c.language}</span>
        <div className="seg">
          {['pt', 'en'].map((l) => (
            <button key={l} className={sys.lang === l ? 'is-on' : ''} onClick={() => sys.setLang(l)}>{l === 'pt' ? 'Português' : 'English'}</button>
          ))}
        </div>
      </div>
      <div className="cc-block lg">
        <span className="cc-label">{c.wallpaper}</span>
        <div className="cc-walls">
          {WALLPAPERS.map((w) => (
            <button key={w} className={`wall-thumb wp-${w}${sys.wallpaper === w ? ' is-on' : ''}`} onClick={() => sys.setWallpaper(w)} aria-label={sys.t.os.settings.wallpapers[w]} title={sys.t.os.settings.wallpapers[w]} />
          ))}
        </div>
      </div>
      <div className="cc-row">
        {/* inside the Control Centre's glass: no second backdrop, so no refraction of their own */}
        <LiquidGlass as="button" refraction={false} className="cc-btn" onClick={() => { onClose(); sys.lock(); }}><Glyph name="lock" size={14} /> {sys.t.os.menu.lock}</LiquidGlass>
        <LiquidGlass as="button" refraction={false} className="cc-btn" onClick={() => { onClose(); sys.open('settings'); }}><Glyph name="sliders" size={14} /> {sys.t.os.apps.settings}</LiquidGlass>
      </div>
    </motion.div>
  );
}
