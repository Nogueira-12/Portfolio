import { useEffect, useState } from 'react';
import { useSystem } from '../os/system.jsx';
import { WALLPAPERS } from '../os/meta.js';
import { Glyph, Logo } from '../os/icons.jsx';
import { PROFILE } from '../data.js';

const TABS = ['general', 'appearance', 'about'];
const TAB_ICON = { general: 'globe', appearance: 'star', about: 'sliders' };

export default function Settings({ tab: wantTab, win }) {
  const sys = useSystem();
  const { t } = sys;
  const s = t.os.settings;
  const [tab, setTab] = useState(wantTab ?? 'general');
  useEffect(() => { if (wantTab) setTab(wantTab); }, [wantTab, win.propsKey]);

  return (
    <div className="app settings">
      <aside className="finder-side">
        {TABS.map((k) => (
          <button key={k} className={`side-row${tab === k ? ' is-on' : ''}`} onClick={() => setTab(k)}>
            <Glyph name={TAB_ICON[k]} size={14} /><span>{s[k]}</span>
          </button>
        ))}
      </aside>
      <div className="settings-main">
        {tab === 'general' && (
          <>
            <h2 className="h2">{s.general}</h2>
            <div className="set-card">
              <div className="set-row">
                <div><strong>{s.language}</strong><span>{s.languageHint}</span></div>
                <div className="seg">
                  {['pt', 'en'].map((l) => (
                    <button key={l} className={sys.lang === l ? 'is-on' : ''} onClick={() => sys.setLang(l)}>{l === 'pt' ? 'Português' : 'English'}</button>
                  ))}
                </div>
              </div>
            </div>
            <h3 className="set-sub">{s.system}</h3>
            <div className="set-card">
              <button className="set-row set-action" onClick={sys.resetIcons}><strong>{s.resetIcons}</strong><Glyph name="chevron" size={14} /></button>
              <button className="set-row set-action" onClick={sys.lock}><strong>{s.lockNow}</strong><Glyph name="lock" size={14} /></button>
              <button className="set-row set-action" onClick={sys.restart}><strong>{s.restart}</strong><Glyph name="power" size={14} /></button>
            </div>
          </>
        )}
        {tab === 'appearance' && (
          <>
            <h2 className="h2">{s.appearance}</h2>
            <h3 className="set-sub">{s.wallpaper}</h3>
            <div className="walls">
              {WALLPAPERS.map((w) => (
                <button key={w} className={`wall-card${sys.wallpaper === w ? ' is-on' : ''}`} onClick={() => sys.setWallpaper(w)}>
                  <span className={`wall-thumb wp-${w}`} />
                  <span>{s.wallpapers[w]}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {tab === 'about' && (
          <div className="set-about">
            <Logo size={88} />
            <h2>{t.os.name}</h2>
            <p className="muted">{s.version} {t.os.version}</p>
            <dl>
              <div><dt>{s.author}</dt><dd>{PROFILE.name}</dd></div>
              <div><dt>{s.builtWith}</dt><dd>{s.builtValue}</dd></div>
            </dl>
            <p className="muted">{s.made}</p>
          </div>
        )}
      </div>
    </div>
  );
}
