import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useSystem } from './system.jsx';
import { DOCK_ORDER } from './meta.js';
import { AppIcon, Glyph, SocialIcon } from './icons.jsx';
import { PROFILE, SOCIALS } from '../data.js';
import { useLiquidGlass } from './liquid.js';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Spotlight() {
  const sys = useSystem();
  const { t } = sys;
  const s = t.os.spotlight;
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const glass = useLiquidGlass({ depth: 22, strength: 14 });
  const close = () => sys.setSpotlight(false);

  const groups = useMemo(() => {
    const a = t.os.actions;
    const all = [
      { group: s.apps, items: [...DOCK_ORDER, 'readme'].map((id) => ({ key: id, label: t.os.apps[id], icon: <AppIcon id={id} size={22} />, run: () => sys.open(id) })) },
      { group: s.projects, items: t.projects.map((p) => ({ key: p.id, label: `${p.title} — ${p.subtitle}`, extra: p.tags.join(' '), icon: <AppIcon id={p.id === 'sportx' ? 'sportx' : p.id.startsWith('carhelp') ? 'carhelp' : 'projects'} size={22} />, run: () => sys.open('project', { id: p.id }) })) },
      {
        group: s.actions,
        items: [
          { key: 'copy', label: a.copyEmail, icon: <Glyph name="copy" />, run: sys.copyEmail },
          { key: 'cv', label: a.cv, icon: <Glyph name="download" />, run: () => window.open(PROFILE.cv, '_blank', 'noopener') },
          { key: 'wa', label: a.whatsapp, icon: <SocialIcon name="WhatsApp" />, run: () => window.open(PROFILE.whatsappLink, '_blank', 'noopener') },
          { key: 'ch', label: a.carhelp, icon: <Glyph name="external" />, run: () => window.open('https://carhelp.pt', '_blank', 'noopener') },
          { key: 'lang', label: a.lang, icon: <Glyph name="globe" />, run: sys.toggleLang },
          { key: 'wall', label: a.wallpaper, icon: <Glyph name="star" />, run: sys.nextWallpaper },
          { key: 'lock', label: a.lock, icon: <Glyph name="lock" />, run: sys.lock },
        ],
      },
      { group: s.social, items: SOCIALS.map((so) => ({ key: so.label, label: so.label, icon: <SocialIcon name={so.label} />, run: () => window.open(so.href, '_blank', 'noopener') })) },
    ];
    const n = norm(q.trim());
    return all
      .map((g) => ({ ...g, items: n ? g.items.filter((it) => norm(`${it.label} ${it.extra ?? ''}`).includes(n)) : g.items }))
      .filter((g) => g.items.length);
  }, [q, t, s, sys]);

  const flat = groups.flatMap((g) => g.items);
  useEffect(() => setIdx(0), [q]);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    listRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  const choose = (it) => { close(); it?.run(); };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, flat.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(flat[idx]); }
  };

  let n = -1;
  return (
    <motion.div className="spot-backdrop" onPointerDown={(e) => e.target === e.currentTarget && close()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      <motion.div ref={glass} className="spot lg" role="dialog" aria-label={s.aria} initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.18 }}>
        <div className="spot-input">
          <Glyph name="search" size={18} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder={s.placeholder} aria-label={s.placeholder} spellCheck="false" autoComplete="off" />
          <kbd>esc</kbd>
        </div>
        <div className="spot-list" ref={listRef} role="listbox">
          {flat.length === 0 && <p className="spot-empty">{s.empty}</p>}
          {groups.map((g) => (
            <div key={g.group} className="spot-group">
              <span className="spot-group-t">{g.group}</span>
              {g.items.map((it) => {
                n += 1;
                const i = n;
                return (
                  <button key={it.key} role="option" aria-selected={i === idx} className={`spot-row${i === idx ? ' is-active' : ''}`} onMouseMove={() => idx !== i && setIdx(i)} onClick={() => choose(it)}>
                    <span className="spot-ic">{it.icon}</span>
                    <span>{it.label}</span>
                    <span className="spot-enter" aria-hidden="true">↵</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="spot-foot">{s.hint}</div>
      </motion.div>
    </motion.div>
  );
}
