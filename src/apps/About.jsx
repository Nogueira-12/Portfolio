import { useSystem, useNow } from '../os/system.jsx';
import { CLIENTS, PROFILE, SOCIALS, STATS } from '../data.js';
import { Glyph, SocialIcon } from '../os/icons.jsx';
import { Btn, Rich } from './ui.jsx';

export default function About() {
  const sys = useSystem();
  const { t, lang } = sys;
  const a = t.about;
  const now = useNow(15000);
  const time = new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' }).format(now);

  return (
    <div className="app about">
      <aside className="about-side">
        <div className="about-photo"><img src={PROFILE.photo} alt={a.photoAlt} /></div>
        <h1 className="about-name">{PROFILE.name}</h1>
        <p className="about-role">{t.nav.role}</p>
        <span className="pill pill-live"><i className="dot-live" />{t.contact.statusValue}</span>
        <div className="about-actions">
          <Btn variant="primary" onClick={() => sys.open('contact')} icon="send">{a.contact}</Btn>
          <Btn href={PROFILE.cv} download icon="download">{a.cv}</Btn>
        </div>
        <dl className="about-meta">
          <div><dt><Glyph name="pin" size={13} /></dt><dd>{t.contact.locationValue}</dd></div>
          <div><dt><Glyph name="clock" size={13} /></dt><dd>{time} · {t.contact.time}</dd></div>
          <div><dt><Glyph name="copy" size={13} /></dt><dd><button className="linkish" onClick={sys.copyEmail}>{PROFILE.email}</button></dd></div>
        </dl>
        <div className="about-socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}><SocialIcon name={s.label} size={17} /></a>
          ))}
        </div>
      </aside>

      <div className="about-main">
        <p className="kicker">{a.title} · {a.note}</p>
        <p className="about-statement"><Rich text={a.statement} /></p>
        <p className="about-p">
          {a.p[0]}
          <button className="linkish accent" onClick={() => sys.open('carhelp')}>{a.p[1]}</button>
          {a.p[2]}<strong>{a.p[3]}</strong>{a.p[4]}
        </p>

        <div className="stats">
          {STATS.map((s, i) => (
            <div className="stat" key={i}>
              <strong>{s.value}<span>{s.suffix}</span></strong>
              <span>{a.stats[i]}</span>
            </div>
          ))}
        </div>

        <p className="kicker">{t.clients.label}</p>
        <div className="clients" aria-label={t.clients.aria}>
          {CLIENTS.map((c) => (
            <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" title={c.name} className={c.raw ? 'is-raw' : ''}>
              <img src={c.logo} alt={c.name} loading="lazy" />
            </a>
          ))}
        </div>

        <div className="about-next">
          <button onClick={() => sys.open('experience')}><span>{t.os.apps.experience}</span><Glyph name="chevron" size={14} /></button>
          <button onClick={() => sys.open('projects')}><span>{t.os.apps.projects}</span><Glyph name="chevron" size={14} /></button>
          <button onClick={() => sys.open('skills')}><span>{t.os.apps.skills}</span><Glyph name="chevron" size={14} /></button>
        </div>
      </div>
    </div>
  );
}
