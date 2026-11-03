import { common, contact, routes } from '../content';
import { useLang } from './lang';
import { Container, Logo } from './ui';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-char text-ash">
      <Container className="grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-sm text-muted-dark">{t(common.tagline)}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-2.5">
            {routes.filter((r) => r.inNav).map((r) => (
              <li key={r.key}>
                <a href={r.path} className="text-muted-dark hover:text-ash">{t(r.label)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="space-y-2.5 text-muted-dark">
          <li><a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-ash">WhatsApp</a></li>
          <li><a href={`tel:${contact.phoneTel}`} className="hover:text-ash">{contact.phoneDisplay}</a></li>
          <li><a href={`mailto:${contact.email}`} className="break-all hover:text-ash">{contact.email}</a></li>
          <li><a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ash">LinkedIn</a></li>
        </ul>
      </Container>
      <Container>
        <div className="flex flex-col gap-3 border-t border-charcoal py-6 text-sm text-muted-dark sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {common.siteName}. {t(common.rights)}</p>
        <a href="#/privacy" className="hover:text-ash">{t(routes.find((r) => r.key === 'privacy')!.label)}</a>
        </div>
      </Container>
    </footer>
  );
}
