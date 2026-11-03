import { privacy } from '../content';
import { useLang } from '../site/lang';
import { Container } from '../site/ui';

export default function Privacy() {
  const { t } = useLang();
  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <h1 className="text-4xl font-bold tracking-tight">{t(privacy.title)}</h1>
      <p className="mt-2 text-sm text-muted">{t(privacy.updated)}</p>
      <div className="mt-10 space-y-8">
        {privacy.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl font-semibold">{t(s.title)}</h2>
            <p className="mt-2 text-muted">{t(s.body)}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
