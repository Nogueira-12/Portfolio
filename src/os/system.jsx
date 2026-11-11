import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { PROFILE } from '../data.js';
import { APP_META, DOCK_SPACE, MENU_H, MOBILE_QUERY, WALLPAPERS, clamp } from './meta.js';

/* ───────────────────────── helpers ───────────────────────── */

export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export function useNow(every = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), every);
    return () => clearInterval(id);
  }, [every]);
  return now;
}

const store = {
  get(k, fallback) { try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  sessionGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sessionSet(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage blocked */ } },
};

/* usable area for windows: between the menu bar and the dock */
export function workArea() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return { x: 0, y: MENU_H, w: vw, h: vh - MENU_H - DOCK_SPACE, vw, vh };
}

export const windowIdFor = (app, props) => (app === 'project' && props?.id ? `project:${props.id}` : app);

/* ───────────────────────── window manager ───────────────────────── */

function wmReducer(state, a) {
  const map = (fn) => state.windows.map((w) => (w.id === a.id ? fn(w) : w));
  switch (a.type) {
    case 'open': {
      const top = state.top + 1;
      const existing = state.windows.find((w) => w.id === a.id);
      if (existing) {
        return {
          top,
          windows: map((w) => ({ ...w, z: top, minimized: false, props: a.props ?? w.props, propsKey: a.props ? w.propsKey + 1 : w.propsKey })),
        };
      }
      return { top, windows: [...state.windows, { id: a.id, app: a.app, props: a.props, z: top, minimized: false, maximized: !!a.maximized, rect: a.rect, anim: 0, propsKey: 0 }] };
    }
    case 'close':
      return { ...state, windows: state.windows.filter((w) => w.id !== a.id) };
    case 'closeAll':
      return { ...state, windows: [] };
    case 'focus': {
      const w = state.windows.find((x) => x.id === a.id);
      if (!w || (w.z === state.top && !w.minimized)) return state;
      const top = state.top + 1;
      return { top, windows: map((x) => ({ ...x, z: top, minimized: false })) };
    }
    case 'minimize':
      return { ...state, windows: map((w) => ({ ...w, minimized: true })) };
    case 'toggleMax':
      return { ...state, windows: map((w) => ({ ...w, maximized: !w.maximized, anim: w.anim + 1 })) };
    case 'setRect':
      return {
        ...state,
        windows: map((w) => ({ ...w, rect: a.rect, maximized: !!a.maximized, anim: a.animate ? w.anim + 1 : w.anim })),
      };
    case 'arrange': {
      const open = state.windows.filter((w) => !w.minimized).sort((x, y) => x.z - y.z);
      let top = state.top;
      const placed = new Map(open.map((w, i) => {
        top += 1;
        const width = Math.min(w.rect.w, a.area.w - 80);
        const height = Math.min(w.rect.h, a.area.h - 80);
        return [w.id, { ...w, z: top, maximized: false, anim: w.anim + 1, rect: { w: width, h: height, x: 40 + i * 34, y: a.area.y + 16 + i * 30 } }];
      }));
      return { top, windows: state.windows.map((w) => placed.get(w.id) ?? w) };
    }
    case 'clamp': {
      // the browser window changed size: shrink windows that no longer fit and pull them back on screen
      const { area } = a;
      return {
        ...state,
        windows: state.windows.map((w) => {
          const r = w.rect;
          const width = Math.min(r.w, area.w - 16);
          const height = Math.min(r.h, area.h - 8);
          const x = clamp(r.x, 0, Math.max(0, area.w - width));
          const y = clamp(r.y, MENU_H, Math.max(MENU_H, area.y + area.h - height));
          return x === r.x && y === r.y && width === r.w && height === r.h ? w : { ...w, rect: { x, y, w: width, h: height } };
        }),
      };
    }
    default:
      return state;
  }
}

/* where a new window appears: centred, slightly cascaded from the ones already open */
function initialRect(app, openCount) {
  const area = workArea();
  const [pw, ph] = APP_META[app]?.size ?? [720, 520];
  const w = Math.min(pw, area.w - 24);
  const h = Math.min(ph, area.h - 24);
  const step = (openCount % 5) * 28;
  const x = Math.round(clamp((area.w - w) / 2 - 56 + step, 12, area.w - w - 12));
  const y = Math.round(clamp(area.y + (area.h - h) * 0.35 - 28 + step, area.y + 8, area.y + area.h - h));
  return { x, y, w, h };
}

/* ───────────────────────── system context ───────────────────────── */

const SystemContext = createContext(null);

export function SystemProvider({ children }) {
  const { lang, setLang, t } = useLang();
  const mobile = useMediaQuery(MOBILE_QUERY);

  // boot → lock → desktop. A visitor who already logged in during this session goes straight to the desktop.
  const [phase, setPhase] = useState(() => (store.sessionGet('tn-os') ? 'desktop' : 'boot'));
  const [wallpaper, setWallpaperState] = useState(() => {
    const w = store.get('tn-wall', 'aurora');
    return WALLPAPERS.includes(w) ? w : 'aurora';
  });
  const [wm, dispatch] = useReducer(wmReducer, { top: 10, windows: [] });
  const [snap, setSnapState] = useState(null);
  const [spotlight, setSpotlight] = useState(false);
  const [notes, setNotes] = useState([]);
  const [iconsNonce, setIconsNonce] = useState(0);

  const windowsRef = useRef(wm.windows);
  windowsRef.current = wm.windows;

  const setWallpaper = useCallback((w) => { setWallpaperState(w); store.set('tn-wall', w); }, []);
  const nextWallpaper = useCallback(() => {
    setWallpaperState((cur) => {
      const next = WALLPAPERS[(WALLPAPERS.indexOf(cur) + 1) % WALLPAPERS.length];
      store.set('tn-wall', next);
      return next;
    });
  }, []);

  const open = useCallback((app, props) => {
    const id = windowIdFor(app, props);
    const openCount = windowsRef.current.filter((w) => !w.minimized).length;
    const exists = windowsRef.current.some((w) => w.id === id);
    dispatch({ type: 'open', id, app, props, rect: exists ? undefined : initialRect(app, openCount) });
    return id;
  }, []);

  const close = useCallback((id) => dispatch({ type: 'close', id }), []);
  const focus = useCallback((id) => dispatch({ type: 'focus', id }), []);
  const minimize = useCallback((id) => dispatch({ type: 'minimize', id }), []);
  const toggleMax = useCallback((id) => dispatch({ type: 'toggleMax', id }), []);
  const setRect = useCallback((id, rect, opts = {}) => dispatch({ type: 'setRect', id, rect, ...opts }), []);
  const closeAll = useCallback(() => dispatch({ type: 'closeAll' }), []);
  const arrange = useCallback(() => dispatch({ type: 'arrange', area: workArea() }), []);
  const setSnap = useCallback((s) => setSnapState((cur) => (cur === s ? cur : s)), []);

  /* dock click: open → restore → focus → (if already in front) minimise */
  const launch = useCallback((app) => {
    const mine = windowsRef.current.filter((w) => (APP_META[w.app]?.dock === undefined ? w.app : APP_META[w.app].dock) === app);
    if (!mine.length) return open(app);
    const topZ = Math.max(...windowsRef.current.filter((w) => !w.minimized).map((w) => w.z), 0);
    const visible = mine.filter((w) => !w.minimized).sort((a, b) => b.z - a.z);
    if (visible.length && visible[0].z === topZ) { visible.forEach((w) => minimize(w.id)); return; }
    const target = visible[0] ?? [...mine].sort((a, b) => b.z - a.z)[0];
    focus(target.id);
  }, [open, focus, minimize]);

  const notify = useCallback((n) => {
    const id = Math.random().toString(36).slice(2);
    setNotes((list) => [...list.slice(-2), { id, ...n }]);
    setTimeout(() => setNotes((list) => list.filter((x) => x.id !== id)), n.timeout ?? 5000);
  }, []);
  const dismiss = useCallback((id) => setNotes((list) => list.filter((x) => x.id !== id)), []);

  const copyEmail = useCallback(() => {
    const done = () => notify({ title: PROFILE.email, text: t.os.notify.copied, icon: 'contact', timeout: 3000 });
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(PROFILE.email).then(done, () => { window.location.href = `mailto:${PROFILE.email}`; });
    else window.location.href = `mailto:${PROFILE.email}`;
  }, [notify, t]);

  const unlock = useCallback(() => { store.sessionSet('tn-os', '1'); setPhase('desktop'); }, []);
  const lock = useCallback(() => { setSpotlight(false); setPhase('lock'); }, []);
  const restart = useCallback(() => { setSpotlight(false); dispatch({ type: 'closeAll' }); setPhase('boot'); }, []);
  const toggleLang = useCallback(() => setLang(lang === 'pt' ? 'en' : 'pt'), [lang, setLang]);
  const resetIcons = useCallback(() => { try { localStorage.removeItem('tn-icons'); } catch { /* */ } setIconsNonce((n) => n + 1); }, []);

  // keep windows reachable when the browser window gets smaller
  useEffect(() => {
    let raf;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => dispatch({ type: 'clamp', area: workArea() })); };
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  // Ctrl/⌘ + K opens the search
  useEffect(() => {
    const on = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && phase === 'desktop') {
        e.preventDefault();
        setSpotlight((s) => !s);
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [phase]);

  const visible = wm.windows.filter((w) => !w.minimized);
  const focusedId = visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).id : null;

  const value = useMemo(() => ({
    lang, t, mobile,
    phase, setPhase, unlock, lock, restart,
    wallpaper, setWallpaper, nextWallpaper,
    windows: wm.windows, focusedId,
    open, close, focus, minimize, toggleMax, setRect, closeAll, arrange, launch,
    snap, setSnap,
    spotlight, setSpotlight,
    notes, notify, dismiss,
    copyEmail, toggleLang, setLang,
    iconsNonce, resetIcons,
  }), [lang, t, mobile, phase, unlock, lock, restart, wallpaper, setWallpaper, nextWallpaper, wm.windows, focusedId,
    open, close, focus, minimize, toggleMax, setRect, closeAll, arrange, launch, snap, setSnap, spotlight, notes, notify,
    dismiss, copyEmail, toggleLang, setLang, iconsNonce, resetIcons]);

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export const useSystem = () => useContext(SystemContext);
