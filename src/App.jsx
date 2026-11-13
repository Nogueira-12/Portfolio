import { AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { SystemProvider, useSystem } from './os/system.jsx';
import { Boot, Lock } from './os/BootLock.jsx';
import Desktop from './os/Desktop.jsx';

function Screen() {
  const { phase, wallpaper } = useSystem();
  return (
    <div className={`os wp-${wallpaper}`}>
      <div className="wallpaper" aria-hidden="true"><i /><i /><i /></div>
      <AnimatePresence mode="wait">
        {phase === 'boot' && <Boot key="boot" />}
        {phase === 'lock' && <Lock key="lock" />}
      </AnimatePresence>
      {phase === 'desktop' && <Desktop />}
    </div>
  );
}

// Vercel Analytics only exists on Vercel; elsewhere (GitHub Pages) its script would 404
const onVercel = typeof window !== 'undefined' && !window.location.hostname.endsWith('github.io');

export default function App() {
  return (
    <SystemProvider>
      <Screen />
      {onVercel && <><Analytics /><SpeedInsights /></>}
    </SystemProvider>
  );
}
