import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Lang, T } from '../content';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

function readSaved(): Lang {
  try {
    const v = localStorage.getItem('gcv-lang');
    return v === 'sw' ? 'sw' : 'en';
  } catch {
    return 'en';
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSaved);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('gcv-lang', l);
    } catch {
      /* storage unavailable: keep the choice for this visit only */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

/** Returns the current language and a `t` helper that picks the right string. */
export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const t = (s: T) => s[lang];
  return { lang, setLang, t };
}
