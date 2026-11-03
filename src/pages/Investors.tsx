import { ArrowRight } from 'lucide-react';
import { common, contact, investors as inv } from '../content';
import { useLang } from '../site/lang';
import { pathFor } from '../site/router';
import { Container, Eyebrow, PrimaryLink, SecondaryLink } from '../site/ui';

export default function Investors() {
  const { t } = useLang();
  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-14 md:py-20">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{t(inv.title)}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">{t(inv.lead)}</p>
        </Container>
      </section>

      {/* Problem */}
      <section>
        <Container className="grid gap-10 py-14 md:grid-cols-[1fr_2fr] md:py-20">
          <h2 className="text-3xl font-bold tracking-tight">{t(inv.problemTitle)}</h2>
          <ul className="divide-y divide-rule border-y border-rule">
            {inv.problems.map((p, i) => (
              <li key={i} className="py-5 text-lg">{t(p)}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Model */}
      <section className="bg-char text-ash">
        <Container className="py-14 md:py-20">
          <h2 className="text-3xl font-bold tracking-tight">{t(inv.modelTitle)}</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {inv.model.map((m, i) => (
              <li key={i} className="border-t-2 border-sprout pt-5">
                <p className="text-sm font-semibold text-sprout">0{i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold">{t(m.title)}</h3>
                <p className="mt-2 text-muted-dark">{t(m.body)}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-2xl border-l-2 border-husk pl-4 text-muted-dark">{t(inv.carbonNote)}</p>
        </Container>
      </section>

      {/* Where we are + targets */}
      <section>
        <Container className="grid gap-14 py-14 md:grid-cols-2 md:py-20">
          {inv.stage.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t(inv.stageTitle)}</h2>
              <ul className="mt-6 divide-y divide-rule border-y border-rule">
                {inv.stage.map((s, i) => (
                  <li key={i} className="py-4">{t(s)}</li>
                ))}
              </ul>
              <a href={pathFor('results')} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-leaf hover:underline">
                {t(inv.seeResults)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          )}
          {inv.targets.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t(inv.targetsTitle)}</h2>
              <p className="mt-2 text-muted">{t(inv.targetsNote)}</p>
              <dl className="mt-6 space-y-6">
                {inv.targets.map((g, i) => (
                  <div key={i} className="flex items-baseline gap-4 border-b border-rule pb-6">
                    <dt className="w-24 shrink-0 text-4xl font-bold tabular-nums text-lake">{g.value}</dt>
                    <dd className="text-lg">{t(g.label)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </Container>
      </section>

      {(inv.backing.length > 0 || inv.ask) && (
        <section className="border-t border-rule">
          <Container className="grid gap-14 py-14 md:grid-cols-2">
            {inv.backing.length > 0 && (
              <div>
                <Eyebrow>{t(inv.backingTitle)}</Eyebrow>
                <ul className="space-y-2 text-lg">
                  {inv.backing.map((b, i) => (
                    <li key={i}>{t(b)}</li>
                  ))}
                </ul>
              </div>
            )}
            {inv.ask && (
              <div>
                <Eyebrow>{t(inv.askTitle)}</Eyebrow>
                <p className="text-lg">{t(inv.ask)}</p>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Contact */}
      <section className="border-t border-rule bg-ash-deep">
        <Container className="flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{t(inv.contactTitle)}</h2>
            <p className="mt-2 max-w-xl text-lg text-muted">{t(inv.contactBody)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PrimaryLink href={`mailto:${contact.email}`}>{contact.email}</PrimaryLink>
            <SecondaryLink href={contact.whatsapp} external>{t(common.whatsappCta)}</SecondaryLink>
          </div>
        </Container>
      </section>
    </>
  );
}
