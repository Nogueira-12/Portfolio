import { useState } from 'react';
import { useSystem } from '../os/system.jsx';
import { AppIcon, Glyph } from '../os/icons.jsx';
import { Btn, Cover, Tags } from './ui.jsx';

const FILTERS = ['all', 'live', 'maintenance', 'done'];

/* Finder-like browser of the projects */
export default function Projects() {
  const sys = useSystem();
  const { t } = sys;
  const f = t.os.finder;
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [q, setQ] = useState('');

  const query = q.trim().toLowerCase();
  const list = t.projects.filter((p) =>
    (filter === 'all' || p.status === filter) &&
    (!query || `${p.title} ${p.subtitle} ${p.tags.join(' ')}`.toLowerCase().includes(query))
  );
  const count = (k) => (k === 'all' ? t.projects.length : t.projects.filter((p) => p.status === k).length);
  const openP = (p) => sys.open('project', { id: p.id });

  return (
    <div className="app finder">
      <aside className="finder-side">
        <span className="side-t">{f.favorites}</span>
        {FILTERS.map((k) => (
          <button key={k} className={`side-row${filter === k ? ' is-on' : ''}`} onClick={() => setFilter(k)}>
            <span className={`side-dot dot-${k}`} />
            <span>{f[k]}</span>
            <span className="side-n">{count(k)}</span>
          </button>
        ))}
        <span className="side-t">{t.os.apps.carhelp}</span>
        <button className="side-row" onClick={() => sys.open('carhelp')}>
          <AppIcon id="carhelp" size={16} /><span>CarHelp</span>
        </button>
      </aside>

      <div className="finder-main">
        <div className="toolbar">
          <strong className="toolbar-t">{f[filter]}</strong>
          <div className="seg seg-sm" role="group">
            <button className={view === 'grid' ? 'is-on' : ''} onClick={() => setView('grid')} aria-label={f.grid} title={f.grid}><Glyph name="grid" size={13} /></button>
            <button className={view === 'list' ? 'is-on' : ''} onClick={() => setView('list')} aria-label={f.list} title={f.list}><Glyph name="list" size={13} /></button>
          </div>
          <label className="search">
            <Glyph name="search" size={13} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={f.search} aria-label={f.search} />
          </label>
        </div>

        <div className="finder-content">
          {list.length === 0 && <p className="empty">{f.empty}</p>}
          {view === 'grid' ? (
            <div className="pgrid">
              {list.map((p) => (
                <button key={p.id} className="pcard" onClick={() => openP(p)}>
                  <Cover p={p} />
                  <div className="pcard-meta">
                    <strong>{p.title}</strong>
                    <span>{p.subtitle} · {p.year}</span>
                  </div>
                  <span className={`chip chip-${p.status}`}>{f[p.status]}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="plist" role="table">
              <div className="plist-row plist-head" role="row">
                <span role="columnheader">{f.name}</span><span role="columnheader">{f.kind}</span><span role="columnheader">{f.year}</span><span role="columnheader">{f.status}</span>
              </div>
              {list.map((p) => (
                <button key={p.id} className="plist-row" role="row" onClick={() => openP(p)}>
                  <span role="cell" className="plist-name"><AppIcon id={p.id === 'sportx' ? 'sportx' : p.id.startsWith('carhelp') ? 'carhelp' : 'projects'} size={18} />{p.title}</span>
                  <span role="cell">{p.subtitle}</span>
                  <span role="cell">{p.year}</span>
                  <span role="cell"><span className={`chip chip-${p.status}`}>{f[p.status]}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="statusbar">{f.items(list.length)} · {f.hint}</div>
      </div>
    </div>
  );
}

/* one project, in its own window */
export function ProjectView({ id }) {
  const sys = useSystem();
  const { t } = sys;
  const p = t.projects.find((x) => x.id === id);
  if (!p) return null;
  const pr = t.os.project;

  return (
    <div className="app project">
      <div className="project-hero">
        {p.video ? (
          <div className="video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${p.video}?rel=0`}
              title={`${p.title} — ${pr.video}`}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : <Cover p={p} large />}
      </div>
      <div className="project-body">
        <div className="project-head">
          <div>
            <p className="kicker">{p.subtitle} · {p.year}</p>
            <h1 className="project-title">{p.title}</h1>
          </div>
          <span className={`chip chip-${p.status}`}>{p.statusLabel}</span>
        </div>
        <p className="project-summary">{p.summary}</p>
        <div className="project-cols">
          <div className="project-text">
            {p.body.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="project-aside">
            <span className="kicker">{pr.stack}</span>
            <Tags items={p.tags} />
            <span className="kicker">{pr.links}</span>
            <div className="project-links">
              {p.links.map((l) => <Btn key={l.href} href={l.href} external icon="external" variant="primary">{l.label}</Btn>)}
              {p.id === 'carhelp-app' && <Btn onClick={() => sys.open('carhelp')} icon="chevron">{t.os.apps.carhelp}</Btn>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
