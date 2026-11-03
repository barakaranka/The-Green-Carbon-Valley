import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { common, routes, type RouteKey } from '../content';
import { useLang } from './lang';
import { Container, Logo } from './ui';

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t(common.langLabel)} className="flex overflow-hidden rounded-md border border-char/25 text-sm font-semibold">
      {(['en', 'sw'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1.5 uppercase ${lang === l ? 'bg-char text-ash' : 'text-char hover:bg-ash-deep'}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Header({ route }: { route: RouteKey }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const navItems = routes.filter((r) => r.inNav && r.key !== 'home');

  useEffect(() => setOpen(false), [route]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ash/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#/" aria-label={common.siteName}>
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map((r) => (
            <a
              key={r.key}
              href={r.path}
              aria-current={route === r.key ? 'page' : undefined}
              className={`rounded-md px-3 py-2 text-[15px] font-medium transition-colors ${
                route === r.key ? 'text-leaf underline decoration-2 underline-offset-8' : 'text-char hover:text-leaf'
              }`}
            >
              {t(r.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch />
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? t(common.close) : t(common.menu)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-rule bg-ash lg:hidden" aria-label="Main">
          <Container className="py-2">
            {routes
              .filter((r) => r.inNav)
              .map((r) => (
                <a
                  key={r.key}
                  href={r.path}
                  aria-current={route === r.key ? 'page' : undefined}
                  className={`block border-b border-rule py-3.5 text-lg font-medium last:border-0 ${route === r.key ? 'text-leaf' : 'text-char'}`}
                >
                  {t(r.label)}
                </a>
              ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
