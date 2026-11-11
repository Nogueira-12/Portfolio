import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSystem } from '../os/system.jsx';
import { CARHELP } from '../data.js';
import { Btn, PlayStore, Rich } from './ui.jsx';

export default function CarHelp() {
  const sys = useSystem();
  const { t } = sys;
  const c = t.carhelp;
  const [step, setStep] = useState(0);
  const s = t.carhelpSteps[step];

  return (
    <div className="app carhelp">
      <section className="ch-hero">
        <div className="ch-glow" aria-hidden="true" />
        <img className="ch-icon" src={CARHELP.icon} alt="" />
        <p className="kicker">{c.eyebrow}</p>
        <h1 className="ch-title">CarHelp</h1>
        <p className="ch-lede"><Rich text={c.lede} /></p>
        <div className="ch-badges">
          <span className="pill pill-live"><i className="dot-live" />{c.live}</span>
          <span className="pill pill-live"><i className="dot-live" />{c.soon}</span>
        </div>
        <div className="ch-actions">
          <Btn variant="primary" href={CARHELP.url} external icon="external">{c.visit}</Btn>
          <Btn onClick={() => sys.open('project', { id: 'carhelp-app' })} icon="chevron">{c.caseStudy}</Btn>
          <a className="gplay" href={CARHELP.playStore || CARHELP.url} target="_blank" rel="noopener noreferrer" aria-label={c.gplayAria}>
            <PlayStore size={20} /><span><small>{c.gplaySmall}</small>Google Play</span>
          </a>
        </div>
      </section>

      <section className="ch-steps">
        <div className="ch-tabs" role="tablist">
          {t.carhelpSteps.map((x, i) => (
            <button key={x.key} role="tab" aria-selected={i === step} className={i === step ? 'is-on' : ''} onClick={() => setStep(i)}>
              <span className="ch-tab-n">0{i + 1}</span>{x.label}
            </button>
          ))}
        </div>
        <div className="ch-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.key}
              className="ch-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="ch-phone"><img src={s.img} alt={`${c.screen} — ${s.label}`} /></div>
              <div className="ch-copy">
                <p className="kicker">{s.label}</p>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="ch-facts">
        {c.facts.map((f) => (
          <div key={f.label} className="ch-fact">
            <strong>{f.value}<span>{f.unit}</span></strong>
            <span>{f.label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
