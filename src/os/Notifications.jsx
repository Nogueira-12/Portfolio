import { AnimatePresence, motion } from 'motion/react';
import { useSystem } from './system.jsx';
import { AppIcon, Glyph } from './icons.jsx';
import { useLiquidGlass } from './liquid.js';

export default function Notifications() {
  const sys = useSystem();
  return (
    <div className="notes" aria-live="polite">
      <AnimatePresence initial={false}>
        {sys.notes.map((n) => <Note key={n.id} n={n} />)}
      </AnimatePresence>
    </div>
  );
}

function Note({ n }) {
  const sys = useSystem();
  const glass = useLiquidGlass({ depth: 16, strength: 12 });
  return (
    <motion.div
      ref={glass}
      layout
      className={`note lg lg-i${n.onClick ? ' is-clickable' : ''}`}
      initial={{ opacity: 0, x: 60, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      onClick={() => { if (n.onClick) { n.onClick(); sys.dismiss(n.id); } }}
    >
      <AppIcon id={n.icon ?? 'readme'} size={34} />
      <div className="note-body">
        <div className="note-head"><strong>{n.title}</strong><span>{sys.t.os.notify.now}</span></div>
        {n.text && <p>{n.text}</p>}
      </div>
      <button className="note-x" onClick={(e) => { e.stopPropagation(); sys.dismiss(n.id); }} aria-label={sys.t.os.notify.close}>
        <Glyph name="close" size={10} stroke={2} />
      </button>
    </motion.div>
  );
}
