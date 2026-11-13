import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSystem, useNow } from './system.jsx';
import { Glyph, Logo } from './icons.jsx';
import { PROFILE } from '../data.js';
import { useLiquidGlass } from './liquid.js';

export function Boot() {
  const sys = useSystem();
  const { setPhase } = sys;
  useEffect(() => {
    const tm = setTimeout(() => setPhase('lock'), 1900);
    return () => clearTimeout(tm);
  }, [setPhase]);
  return (
    <motion.div className="boot" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="boot-logo">
        <Logo size={84} />
      </motion.div>
      <div className="boot-bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }} /></div>
      <span className="boot-t">{sys.t.os.name} {sys.t.os.version}</span>
    </motion.div>
  );
}

export function Lock() {
  const sys = useSystem();
  const { t, lang } = sys;
  const now = useNow(1000);
  const locale = lang === 'pt' ? 'pt-PT' : 'en-GB';
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(now);
  const date = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(now);

  const { unlock } = sys;
  const glass = useLiquidGlass({ depth: 20, strength: 26, aberration: 0.2 });
  useEffect(() => {
    const on = (e) => { if (e.key === 'Enter' || e.key === ' ') unlock(); };
    const wheel = (e) => { if (e.deltaY > 30) unlock(); };
    window.addEventListener('keydown', on);
    window.addEventListener('wheel', wheel, { passive: true });
    return () => { window.removeEventListener('keydown', on); window.removeEventListener('wheel', wheel); };
  }, [unlock]);

  return (
    <motion.div
      className="lock"
      onClick={sys.unlock}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-8%', filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.5, bottom: 0 }}
      onDragEnd={(_, info) => { if (info.offset.y < -60) sys.unlock(); }}
    >
      <div className="lock-top">
        <motion.p className="lock-date" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>{date}</motion.p>
        <motion.p className="lock-time" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>{time}</motion.p>
      </div>
      <motion.div className="lock-user" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <img src={PROFILE.photo} alt="" />
        <strong>{PROFILE.name}</strong>
        <span>{t.os.lock.role}</span>
        <button ref={glass} className="lock-btn lg lg-i lg-m" onClick={(e) => { e.stopPropagation(); sys.unlock(); }}>
          {t.os.lock.login} <Glyph name="chevron" size={14} />
        </button>
        <small>{t.os.lock.enter}</small>
      </motion.div>
    </motion.div>
  );
}
