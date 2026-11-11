import { useEffect, useRef, useState } from 'react';
import { useSystem } from '../os/system.jsx';
import { DOCK_ORDER } from '../os/meta.js';
import { PROFILE, SOCIALS } from '../data.js';
import { OS_TEXT } from '../data.os.js';

const PROMPT = 'visitor@nogueira-os';
const OPENABLE = [...DOCK_ORDER, 'readme'];

const LOGO = [
  '  ████████ ███    ██ ',
  '     ██    ████   ██ ',
  '     ██    ██ ██  ██ ',
  '     ██    ██  ██ ██ ',
  '     ██    ██   ████ ',
];

export default function Terminal({ win }) {
  const sys = useSystem();
  const { t, lang } = sys;
  const tt = t.os.terminal;
  const [lines, setLines] = useState(() => tt.welcome.map((text) => ({ kind: 'dim', text })));
  const [input, setInput] = useState('');
  const [hist, setHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [lines]);
  useEffect(() => { if (sys.focusedId === win.id) inputRef.current?.focus({ preventScroll: true }); }, [sys.focusedId, win.id]);

  const out = (items) => setLines((l) => [...l, ...items.map((x) => (typeof x === 'string' ? { kind: 'out', text: x } : x))]);

  const run = (raw) => {
    const cmdline = raw.trim();
    setLines((l) => [...l, { kind: 'in', text: cmdline }]);
    if (!cmdline) return;
    setHist((h) => [...h, cmdline]);
    setHIdx(-1);
    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        out(Object.entries(tt.help).map(([k, v]) => ({ kind: 'out', text: `${k.padEnd(12)}${v}`, cmd: k })));
        break;
      case 'whoami':
        out([{ kind: 'accent', text: PROFILE.name }, t.nav.role + ' · Porto, PT']);
        break;
      case 'about':
        out([t.about.statement.replace(/\*/g, ''), '', t.about.p.join('')]);
        break;
      case 'ls':
      case 'projects':
        out(t.projects.map((p) => `${p.status === 'live' ? '●' : p.status === 'maintenance' ? '◐' : '○'} ${p.title.padEnd(14)}${p.subtitle.padEnd(22)}${p.year}`));
        out([{ kind: 'dim', text: lang === 'pt' ? '→ “open projects” para os ver' : '→ “open projects” to browse them' }]);
        break;
      case 'open':
      case 'cd': {
        const target = arg.toLowerCase().replace(/\.(app|txt|pdf)$/, '');
        const alias = { me: 'about', mail: 'contact', email: 'contact', resume: 'cv', work: 'projects', 'leia-me': 'readme' }[target] ?? target;
        if (OPENABLE.includes(alias)) { out([tt.opening(t.os.apps[alias])]); sys.open(alias); }
        else {
          const p = t.projects.find((x) => x.id === alias || x.title.toLowerCase() === alias);
          if (p) { out([tt.opening(p.title)]); sys.open('project', { id: p.id }); }
          else out([{ kind: 'dim', text: `${tt.openUsage} ${OPENABLE.join(', ')}` }]);
        }
        break;
      }
      case 'skills':
      case 'stack':
        out(t.stack.map((g) => `${g.level.padEnd(20)}${g.items.join(', ')}`));
        break;
      case 'experience':
        out(t.experienceItems.map((x) => `${x.current ? '●' : '○'} ${x.role} — ${x.company} (${x.period})`));
        break;
      case 'contact':
        out(tt.contactLines(PROFILE.email, PROFILE.whatsapp));
        break;
      case 'hire':
      case 'hire-me':
        out([{ kind: 'accent', text: tt.hire }]);
        sys.open('contact');
        break;
      case 'cv':
        out([tt.downloading]);
        window.open(PROFILE.cv, '_blank', 'noopener');
        break;
      case 'social':
        out(SOCIALS.map((s) => `${s.label.padEnd(12)}${s.href}`));
        break;
      case 'neofetch':
        out(LOGO.map((row, i) => ({
          kind: 'neo',
          logo: row,
          text: [
            `${PROMPT}`,
            `OS: ${t.os.name} ${t.os.version}`,
            `Host: ${PROFILE.name}`,
            `Shell: tn-sh · ${lang.toUpperCase()}`,
            `Uptime: 18 ${lang === 'pt' ? 'anos' : 'years'}`,
          ][i],
        })));
        out([`Stack: React · Vite · Motion`, `Wallpaper: ${t.os.settings.wallpapers[sys.wallpaper]}`]);
        break;
      case 'lang':
        if (arg === 'pt' || arg === 'en') { sys.setLang(arg); out([{ kind: 'accent', text: `✓ ${OS_TEXT[arg].terminal.langSet}` }]); }
        else out([{ kind: 'dim', text: 'lang pt | lang en' }]);
        break;
      case 'date':
        out([new Date().toLocaleString(lang === 'pt' ? 'pt-PT' : 'en-GB')]);
        break;
      case 'echo':
        out([arg]);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        sys.close(win.id);
        break;
      case 'sudo':
        out([{ kind: 'err', text: tt.sudo }]);
        break;
      case 'rm':
        out([{ kind: 'err', text: tt.rm }]);
        break;
      default:
        out([{ kind: 'err', text: tt.notFound(cmd) }]);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter') { run(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!hist.length) return;
      const i = hIdx === -1 ? hist.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(i); setInput(hist[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx === -1) return;
      const i = hIdx + 1;
      if (i >= hist.length) { setHIdx(-1); setInput(''); } else { setHIdx(i); setInput(hist[i]); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.split(' ');
      const pool = parts.length > 1 ? OPENABLE : [...Object.keys(tt.help), 'ls', 'hire'];
      const last = parts[parts.length - 1].toLowerCase();
      const hits = pool.filter((c) => c.startsWith(last));
      if (hits.length === 1) { parts[parts.length - 1] = hits[0]; setInput(parts.join(' ') + (parts.length === 1 ? ' ' : '')); }
      else if (hits.length > 1) out([{ kind: 'dim', text: hits.join('  ') }]);
    } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  return (
    <div className="app term" onClick={() => window.getSelection()?.isCollapsed && inputRef.current?.focus({ preventScroll: true })}>
      {lines.map((l, i) => (
        <div key={i} className={`term-line term-${l.kind}`}>
          {l.kind === 'in' ? <><span className="term-prompt">{PROMPT} <b>~</b> %</span> {l.text}</>
            : l.kind === 'neo' ? <><span className="term-logo">{l.logo}</span>  {l.text}</>
            : l.cmd ? <button className="term-cmd" onClick={(e) => { e.stopPropagation(); run(l.cmd); }}>{l.text}</button>
            : l.text || ' '}
        </div>
      ))}
      <div className="term-line term-input" ref={endRef}>
        <span className="term-prompt">{PROMPT} <b>~</b> %</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal"
        />
      </div>
    </div>
  );
}
