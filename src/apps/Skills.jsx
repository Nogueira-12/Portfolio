import { useSystem } from '../os/system.jsx';

/* stack grouped by level; the meter shows how far along each level is */
export default function Skills() {
  const { t } = useSystem();
  const levels = t.stack.length;
  return (
    <div className="app skills">
      <p className="kicker">{t.experience.stackTitle}</p>
      <h1 className="h1">{t.os.apps.skills}</h1>
      <div className="skill-groups">
        {t.stack.map((g, i) => {
          const learning = i === levels - 1;
          return (
            <section key={g.level} className={`skill-group${learning ? ' is-learning' : ''}`}>
              <header>
                <strong>{g.level}</strong>
                <span className="meter" aria-hidden="true">
                  {Array.from({ length: 4 }, (_, k) => <i key={k} className={k < 4 - i ? 'on' : ''} />)}
                </span>
              </header>
              <ul>
                {g.items.map((s) => <li key={s}>{learning && <i className="dot-soon" />}{s}</li>)}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
