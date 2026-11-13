import { useEffect, useRef } from 'react';
import { motion, useAnimationControls, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useSystem } from './system.jsx';
import { DOCK_MOBILE, DOCK_ORDER, dockIdOf } from './meta.js';
import { AppIcon } from './icons.jsx';
import { useLiquidGlass } from './liquid.js';

const BASE = 50;
const MAX = 78;
const RANGE = 150;

export default function Dock() {
  const sys = useSystem();
  const mouseX = useMotionValue(Infinity);
  const apps = sys.mobile ? DOCK_MOBILE : DOCK_ORDER;
  const glass = useLiquidGlass({ depth: 26, strength: 34, aberration: 0.16 });

  const running = new Set(sys.windows.map((w) => dockIdOf(w.app)));
  const focusedApp = sys.windows.find((w) => w.id === sys.focusedId);

  return (
    <nav className="dock-wrap" aria-label={sys.t.os.dock.aria}>
      <motion.div
        ref={glass}
        className="dock lg lg-i"
        onMouseMove={(e) => !sys.mobile && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {apps.map((id, i) => (
          <DockItem
            key={id}
            id={id}
            mouseX={mouseX}
            label={sys.t.os.apps[id]}
            running={running.has(id)}
            active={focusedApp && dockIdOf(focusedApp.app) === id}
            onClick={() => sys.launch(id)}
            divider={!sys.mobile && i === apps.length - 2}
            mobile={sys.mobile}
          />
        ))}
      </motion.div>
    </nav>
  );
}

function DockItem({ id, mouseX, label, running, active, onClick, divider, mobile }) {
  const ref = useRef(null);
  const bounce = useAnimationControls();
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const sizeRaw = useTransform(dist, [-RANGE, 0, RANGE], [BASE, MAX, BASE]);
  const size = useSpring(sizeRaw, { stiffness: 380, damping: 28, mass: 0.3 });

  /* bounce once when the app starts */
  const was = useRef(running);
  useEffect(() => {
    if (running && !was.current) bounce.start({ y: [0, -16, 0, -6, 0], transition: { duration: 0.7, ease: 'easeOut' } });
    was.current = running;
  }, [running, bounce]);

  return (
    <>
      {divider && <span className="dock-divider" aria-hidden="true" />}
      <motion.button
        ref={ref}
        className={`dock-item${active ? ' is-active' : ''}`}
        style={mobile ? undefined : { width: size, height: size }}
        onClick={onClick}
        aria-label={label}
        data-dock-id={id}
        whileTap={{ scale: 0.9 }}
      >
        <span className="dock-tip" role="tooltip">{label}</span>
        <motion.span className="dock-icon" animate={bounce}>
          <AppIcon id={id} size={mobile ? 54 : MAX} />
        </motion.span>
        {running && <span className="dock-dot" aria-hidden="true" />}
      </motion.button>
    </>
  );
}
