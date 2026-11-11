/* Layout constants and per-app window defaults. */

export const MENU_H = 30; // menu bar height
export const DOCK_SPACE = 92; // space kept free above the bottom of the screen for the dock
export const MOBILE_QUERY = '(max-width: 720px)';

/* order of the apps in the dock */
export const DOCK_ORDER = ['about', 'projects', 'carhelp', 'experience', 'skills', 'terminal', 'contact', 'collaborate', 'cv', 'settings'];
/* the shorter dock on phones (everything else is on the home screen) */
export const DOCK_MOBILE = ['about', 'projects', 'contact', 'terminal'];

/*
 * size: preferred [width, height] when the window opens
 * min:  smallest [width, height] it can be resized to
 * dock: which dock icon the window belongs to (minimise animation + "running" dot); null = none
 */
export const APP_META = {
  about: { size: [860, 580], min: [380, 340] },
  projects: { size: [880, 580], min: [420, 320] },
  project: { size: [820, 640], min: [380, 340], dock: 'projects' },
  carhelp: { size: [960, 660], min: [400, 380] },
  experience: { size: [780, 620], min: [380, 340] },
  skills: { size: [660, 540], min: [360, 320] },
  terminal: { size: [700, 450], min: [360, 240] },
  contact: { size: [800, 620], min: [380, 420] },
  collaborate: { size: [860, 620], min: [380, 360] },
  cv: { size: [780, 820], min: [380, 380] },
  settings: { size: [720, 520], min: [440, 380] },
  readme: { size: [580, 600], min: [340, 300], dock: null },
};

export const dockIdOf = (app) => (APP_META[app]?.dock === undefined ? app : APP_META[app].dock);

export const WALLPAPERS = ['aurora', 'porto', 'grafite', 'oceano'];

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
