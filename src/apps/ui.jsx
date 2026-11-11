import { Glyph } from '../os/icons.jsx';

/* "*word*" in the texts is rendered in the italic serif accent */
export function Rich({ text }) {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? <em key={i} className="serif">{part.slice(1, -1)}</em> : part
  );
}

export function Btn({ href, onClick, children, variant = 'ghost', icon, download, external, className = '' }) {
  const cls = `btn btn-${variant} ${className}`;
  const inner = <>{children}{icon && <Glyph name={icon} size={14} />}</>;
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick} download={download} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return <button type="button" className={cls} onClick={onClick}>{inner}</button>;
}

export function Tags({ items }) {
  return <ul className="tags">{items.map((x) => <li key={x}>{x}</li>)}</ul>;
}

/* project covers: a phone mock-up, a website screenshot or a coloured banner */
export function Cover({ p, large = false }) {
  const c = p.cover;
  if (c.type === 'shot') {
    return <div className={`cover cover-shot tone-${c.tone}`}><img src={c.img} alt="" loading="lazy" draggable="false" /></div>;
  }
  if (c.type === 'phone') {
    return <div className={`cover cover-phone tone-${c.tone}`}><img src={c.img} alt="" loading="lazy" draggable="false" /></div>;
  }
  return (
    <div className={`cover cover-banner tone-${c.tone}${large ? ' is-large' : ''}`}>
      <span className="cover-word">{p.title}</span>
      {p.video && <span className="cover-play"><svg viewBox="0 0 24 24" width="40%" height="40%"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg></span>}
    </div>
  );
}

export function PlayStore({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#00d7fe" d="M3.6 2.3c-.3.3-.4.7-.4 1.3v16.8c0 .6.1 1 .4 1.3l9.3-9.7z" />
      <path fill="#ffce00" d="M16 15.2l-3.1-3.2L16 8.8l3.7 2.1c1.1.6 1.1 1.6 0 2.2z" />
      <path fill="#ff3a44" d="M16 15.2L12.9 12l-9.3 9.7c.3.4.9.4 1.6.1z" />
      <path fill="#00f076" d="M16 8.8L5.2 2.2c-.7-.4-1.3-.3-1.6.1l9.3 9.7z" />
    </svg>
  );
}
