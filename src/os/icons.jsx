/* All the icons of the system, drawn as inline SVG (no icon library needed). */

const G = {
  folder: (
    <>
      <path d="M3 7.2A1.7 1.7 0 0 1 4.7 5.5h4.1l2 2h8.5A1.7 1.7 0 0 1 21 9.2v8.6a1.7 1.7 0 0 1-1.7 1.7H4.7A1.7 1.7 0 0 1 3 17.8z" fill="currentColor" opacity=".55" />
      <path d="M3 10.2A1.7 1.7 0 0 1 4.7 8.5h14.6A1.7 1.7 0 0 1 21 10.2v7.6a1.7 1.7 0 0 1-1.7 1.7H4.7A1.7 1.7 0 0 1 3 17.8z" fill="currentColor" />
    </>
  ),
  briefcase: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2.2" />
      <path d="M9 7V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6V7M3 12.5h18M12 11.5v2" />
    </g>
  ),
  layers: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 3.5l8.5 4.6L12 12.7 3.5 8.1z" fill="currentColor" fillOpacity=".35" />
      <path d="M3.5 12.1l8.5 4.6 8.5-4.6M3.5 16.1l8.5 4.6 8.5-4.6" />
    </g>
  ),
  mail: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" fill="currentColor" fillOpacity=".18" />
      <path d="M3.8 7.2l8.2 6 8.2-6" />
    </g>
  ),
  spark: (
    <g fill="currentColor">
      <path d="M11 3.5l1.8 5.2 5.2 1.8-5.2 1.8L11 17.5l-1.8-5.2L4 10.5l5.2-1.8z" />
      <path d="M18 14.5l.8 2.2 2.2.8-2.2.8L18 20.5l-.8-2.2-2.2-.8 2.2-.8z" opacity=".7" />
    </g>
  ),
  gear: (
    <g fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="7.6" strokeWidth="3" strokeDasharray="2.75 3.22" />
      <circle cx="12" cy="12" r="5.2" strokeWidth="2.4" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  doc: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4M9 11h6M9 14h6M9 17h4" />
    </g>
  ),
  user: (
    <g fill="currentColor">
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20c.8-4 3.8-6.2 7.5-6.2s6.7 2.2 7.5 6.2z" />
    </g>
  ),
  terminal: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8l4 4-4 4M11.5 16.5H18" />
    </g>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
};

/* A rounded "app" tile: a gradient + a glyph (or an image). */
const TILES = {
  about: { img: 'assets/profile_picture.jpg' },
  projects: { bg: 'linear-gradient(160deg,#6cb6ff,#2563eb 60%,#1e3a8a)', glyph: 'folder', color: '#e8f2ff' },
  project: { bg: 'linear-gradient(160deg,#6cb6ff,#2563eb 60%,#1e3a8a)', glyph: 'folder', color: '#e8f2ff' },
  carhelp: { img: 'carhelp/app-icon.png' },
  experience: { bg: 'linear-gradient(160deg,#ffcf6b,#f59e0b 55%,#b45309)', glyph: 'briefcase', color: '#fff8e8' },
  skills: { bg: 'linear-gradient(160deg,#b69bff,#7c3aed 55%,#4c1d95)', glyph: 'layers', color: '#f3edff' },
  terminal: { bg: 'linear-gradient(160deg,#2a2a30,#0c0c0f)', glyph: 'terminal', color: '#d7ff3f', ring: true },
  contact: { bg: 'linear-gradient(160deg,#7dd3fc,#0ea5e9 55%,#0369a1)', glyph: 'mail', color: '#ffffff' },
  collaborate: { bg: 'linear-gradient(160deg,#ffb199,#ff5f6d 55%,#c2185b)', glyph: 'spark', color: '#fff5f2' },
  cv: { bg: 'linear-gradient(180deg,#ffffff,#e9e9ee)', glyph: 'doc', color: '#3b3b44', tag: 'PDF' },
  settings: { bg: 'linear-gradient(160deg,#a1a1aa,#52525b 60%,#27272a)', glyph: 'gear', color: '#f4f4f5' },
  readme: { bg: 'linear-gradient(180deg,#fffbe6,#fde68a)', glyph: 'doc', color: '#7c5a10' },
  sportx: { bg: 'linear-gradient(160deg,#ffb347,#ff6a00 55%,#b83a00)', glyph: 'play', color: '#fff' },
};

export function AppIcon({ id, size = 48, className = '' }) {
  const tile = TILES[id] || TILES.projects;
  const style = { width: size, height: size, background: tile.bg, '--s': size };
  return (
    <span className={`app-icon ${tile.ring ? 'app-icon-ring' : ''} ${className}`} style={style} aria-hidden="true">
      {tile.img ? (
        <img src={tile.img} alt="" draggable="false" />
      ) : (
        <svg viewBox="0 0 24 24" style={{ color: tile.color }}>
          {G[tile.glyph]}
        </svg>
      )}
      {tile.tag && <span className="app-icon-tag">{tile.tag}</span>}
    </span>
  );
}

/* Small interface glyphs */
const UI = {
  close: 'M4 4l8 8M12 4l-8 8',
  min: 'M3.5 8h9',
  max: 'M5 3.5h7.5V11M11 5L4 12',
  search: 'M7 12.2A5.2 5.2 0 1 0 7 1.8a5.2 5.2 0 0 0 0 10.4zM10.8 10.8L14.5 14.5',
  chevron: 'M6 3.5L10.5 8 6 12.5',
  back: 'M10 3.5L5.5 8l4.5 4.5',
  grid: 'M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z',
  list: 'M2.5 4h11M2.5 8h11M2.5 12h11',
  external: 'M9.5 2.5h4v4M13.5 2.5L7 9M12 9.5v3.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5H7',
  download: 'M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10',
  copy: 'M5.5 5.5h7v7h-7zM3.5 10.5v-7h7',
  check: 'M3 8.5l3.2 3L13 4.5',
  globe: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13zM1.5 8h13M8 1.5c1.8 1.9 2.6 4 2.6 6.5S9.8 12.6 8 14.5C6.2 12.6 5.4 10.5 5.4 8S6.2 3.4 8 1.5',
  lock: 'M4 7.5h8v6.5H4zM5.5 7.5V5.2a2.5 2.5 0 0 1 5 0v2.3',
  power: 'M8 1.8v5.5M4.6 3.9a5.5 5.5 0 1 0 6.8 0',
  phone: 'M5 1.5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zM7 12.2h2',
  pin: 'M8 14.5s4.5-4.3 4.5-7.8a4.5 4.5 0 0 0-9 0c0 3.5 4.5 7.8 4.5 7.8zM8 8.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z',
  clock: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13zM8 4.5V8l2.5 1.5',
  send: 'M14 2L7 9M14 2l-4.5 12L7 9 2 6.5z',
  sliders: 'M2.5 4.5h6M11.5 4.5h2M2.5 11.5h2M7.5 11.5h6M10 3v3M6 10v3',
  wifi: 'M1.8 6.2a9 9 0 0 1 12.4 0M4 8.5a5.8 5.8 0 0 1 8 0M6.2 10.8a2.6 2.6 0 0 1 3.6 0M8 13.2h.01',
  star: 'M8 1.8l1.9 4 4.3.5-3.2 2.9.9 4.3L8 11.3l-3.9 2.2.9-4.3L1.8 6.3l4.3-.5z',
};

export function Glyph({ name, size = 16, stroke = 1.6, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={UI[name]} />
    </svg>
  );
}

export function Battery() {
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
      <rect x=".75" y=".75" width="20" height="10.5" rx="2.6" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.2" />
      <rect x="2.4" y="2.4" width="13.5" height="7.2" rx="1.4" fill="currentColor" />
      <path d="M22.4 4.2v3.6" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="currentColor" fillOpacity=".12" />
      <text x="30" y="42" textAnchor="middle" fontFamily="Geist Variable, Arial, sans-serif" fontWeight="700" fontSize="27" letterSpacing="-1" fill="currentColor">TN</text>
      <circle cx="50" cy="15" r="5.5" fill="#d7ff3f" />
    </svg>
  );
}

const SOCIAL = {
  GitHub: 'M16,2.345c7.735,0,14,6.265,14,14-.002,6.015-3.839,11.359-9.537,13.282-.7,.14-.963-.298-.963-.665,0-.473,.018-1.978,.018-3.85,0-1.312-.437-2.152-.945-2.59,3.115-.35,6.388-1.54,6.388-6.912,0-1.54-.543-2.783-1.435-3.762,.14-.35,.63-1.785-.14-3.71,0,0-1.173-.385-3.85,1.435-1.12-.315-2.31-.472-3.5-.472s-2.38,.157-3.5,.472c-2.677-1.802-3.85-1.435-3.85-1.435-.77,1.925-.28,3.36-.14,3.71-.892,.98-1.435,2.24-1.435,3.762,0,5.355,3.255,6.563,6.37,6.913-.403,.35-.77,.963-.893,1.872-.805,.368-2.818,.963-4.077-1.155-.263-.42-1.05-1.452-2.152-1.435-1.173,.018-.472,.665,.017,.927,.595,.332,1.277,1.575,1.435,1.978,.28,.787,1.19,2.293,4.707,1.645,0,1.173,.018,2.275,.018,2.607,0,.368-.263,.787-.963,.665-5.719-1.904-9.576-7.255-9.573-13.283,0-7.735,6.265-14,14-14Z',
  LinkedIn: 'M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z',
  Instagram: 'M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0',
  YouTube: 'M29.41,9.26a3.5,3.5,0,0,0-2.47-2.47C24.76,6.2,16,6.2,16,6.2s-8.76,0-10.94.59A3.5,3.5,0,0,0,2.59,9.26,36.13,36.13,0,0,0,2,16a36.13,36.13,0,0,0,.59,6.74,3.5,3.5,0,0,0,2.47,2.47C7.24,25.8,16,25.8,16,25.8s8.76,0,10.94-.59a3.5,3.5,0,0,0,2.47-2.47A36.13,36.13,0,0,0,30,16,36.13,36.13,0,0,0,29.41,9.26ZM13.2,20.2V11.8L20.47,16Z',
  WhatsApp: 'M16 3C8.8 3 3 8.7 3 15.8c0 2.3.6 4.5 1.8 6.4L3 29l7-1.8c1.8 1 3.9 1.5 6 1.5 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.3 10 10.1 5.3 16 5.3s10.7 4.7 10.7 10.5S21.9 26.4 16 26.4zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 2.9 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z',
};

export function SocialIcon({ name, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d={SOCIAL[name]} fillRule="evenodd" />
    </svg>
  );
}
