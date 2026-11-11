import About from '../apps/About.jsx';
import Projects, { ProjectView } from '../apps/Projects.jsx';
import CarHelp from '../apps/CarHelp.jsx';
import Experience from '../apps/Experience.jsx';
import Skills from '../apps/Skills.jsx';
import Terminal from '../apps/Terminal.jsx';
import Mail from '../apps/Mail.jsx';
import Collaborate from '../apps/Collaborate.jsx';
import Resume from '../apps/Resume.jsx';
import Settings from '../apps/Settings.jsx';
import Readme from '../apps/Readme.jsx';

export const APP_COMPONENTS = {
  about: About,
  projects: Projects,
  project: ProjectView,
  carhelp: CarHelp,
  experience: Experience,
  skills: Skills,
  terminal: Terminal,
  contact: Mail,
  collaborate: Collaborate,
  cv: Resume,
  settings: Settings,
  readme: Readme,
};

/* title shown in the window bar and the menu bar */
export function appTitle(win, t) {
  if (win.app === 'project') {
    const p = t.projects.find((x) => x.id === win.props?.id);
    return p ? `${p.title} — ${p.subtitle}` : t.os.apps.project;
  }
  return t.os.apps[win.app] ?? win.app;
}

/* icon shown in the window bar */
export function appIconId(win) {
  if (win.app === 'project') return win.props?.id === 'sportx' ? 'sportx' : win.props?.id?.startsWith('carhelp') ? 'carhelp' : 'projects';
  return win.app;
}
