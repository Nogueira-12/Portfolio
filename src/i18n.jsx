import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildContent } from './data.js';

const LangContext = createContext(null);

/* ?lang=en|pt in the URL wins (shareable links), then the saved choice, then the browser language */
function initialLang() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'en' || q === 'pt') return q;
    const saved = localStorage.getItem('tn-lang');
    if (saved === 'en' || saved === 'pt') return saved;
  } catch { /* storage blocked */ }
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  return langs.some((l) => l?.toLowerCase().startsWith('pt')) ? 'pt' : 'en';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const t = useMemo(() => buildContent(lang), [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('tn-lang', l); } catch { /* storage blocked */ }
    // keep the URL in sync so the current version can be shared
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState(null, '', url);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [lang, t]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
