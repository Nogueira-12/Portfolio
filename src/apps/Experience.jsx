import { useSystem } from '../os/system.jsx';

export default function Experience() {
  const { t } = useSystem();
  const e = t.experience;
  const current = t.experienceItems.filter((x) => x.current).length;

  return (
    <div className="app exp">
      <header className="exp-head">
        <div>
          <p className="kicker">{e.note(current)}</p>
          <h1 className="h1">{e.title}</h1>
        </div>
      </header>

      <ol className="timeline">
        {t.experienceItems.map((x) => (
          <li key={x.company} className={`tl-item${x.current ? ' is-now' : ''}`}>
            <span className="tl-dot" aria-hidden="true" />
            <div className="tl-card">
              <div className="tl-top">
                <span className="tl-logo"><img src={x.logo} alt="" loading="lazy" /></span>
                <div className="tl-id">
                  <strong>{x.role}</strong>
                  <span>{x.company}</span>
                </div>
                {x.current && <span className="chip chip-live">{e.now}</span>}
              </div>
              <div className="tl-when"><span>{x.period}</span><span>{x.place}</span></div>
              <p>{x.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="h2">{e.educationTitle}</h2>
      <div className="edu">
        {e.education.map((x) => (
          <div key={x.school} className="edu-card">
            <span className="edu-period">{x.period}</span>
            <strong>{x.school}</strong>
            <p>{x.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
