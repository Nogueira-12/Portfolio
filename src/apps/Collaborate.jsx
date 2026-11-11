import { useSystem } from '../os/system.jsx';
import { Glyph } from '../os/icons.jsx';
import { Rich, Tags } from './ui.jsx';

export default function Collaborate() {
  const sys = useSystem();
  const { t } = sys;
  const c = t.collab;
  const pitch = (subject) => sys.open('contact', { subject });

  return (
    <div className="app collab">
      <p className="kicker">{c.title} · {c.note}</p>
      <h1 className="collab-h"><Rich text={c.headline} /></h1>
      <p className="collab-side">{c.side}</p>

      <div className="collab-grid">
        {t.collabTypes.map((x, i) => (
          <article key={x.key} className="collab-card">
            <span className="collab-n">0{i + 1}</span>
            <h3>{x.title}</h3>
            <p>{x.text}</p>
            <Tags items={x.tags} />
            <button className="btn btn-ghost btn-sm" onClick={() => pitch(x.subject)}>{c.cta}<Glyph name="chevron" size={13} /></button>
          </article>
        ))}
      </div>

      <h2 className="h2">{c.stepsTitle}</h2>
      <ol className="collab-steps">
        {c.steps.map((s, i) => (
          <li key={s.title}>
            <span className="collab-step-n">{i + 1}</span>
            <div><strong>{s.title}</strong><p>{s.text}</p></div>
          </li>
        ))}
      </ol>
      <p className="collab-not"><span>{c.notNowLabel}:</span> {c.notNow.join(', ')}</p>
    </div>
  );
}
