import { AlertTriangle } from 'lucide-react';
import { common, contact, feedstocks, how } from '../content';
import { useLang } from '../site/lang';
import { pathFor } from '../site/router';
import { Container, PrimaryLink, SecondaryLink } from '../site/ui';

export default function HowWeMakeIt() {
  const { t } = useLang();
  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-14 md:py-20">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{t(how.title)}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">{t(how.intro)}</p>
        </Container>
      </section>

      {/* Steps */}
      <section>
        <Container className="py-14 md:py-20">
          <ol className="divide-y divide-rule border-y border-rule">
            {how.steps.map((s, i) => (
              <li key={i} className="grid gap-3 py-8 md:grid-cols-[80px_1fr_2fr] md:gap-8">
                <span className="text-4xl font-bold text-soil">{i + 1}</span>
                <h2 className="text-2xl font-semibold">{t(s.title)}</h2>
                <p className="text-lg text-muted">{t(s.body)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Safety */}
      <section className="bg-char text-ash">
        <Container className="grid gap-8 py-14 md:grid-cols-[1fr_2fr] md:py-16">
          <h2 className="flex items-center gap-3 text-3xl font-bold">
            <AlertTriangle className="h-7 w-7 text-ember" aria-hidden="true" />
            {t(how.safety.title)}
          </h2>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {how.safety.items.map((item, i) => (
              <li key={i} className="border-l-2 border-ember pl-4 text-lg">{t(item)}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Yields */}
      <section>
        <Container className="py-14 md:py-20">
          <h2 className="text-3xl font-bold tracking-tight">{t(how.yieldsTitle)}</h2>
          <p className="mt-3 max-w-2xl text-muted">{t(how.yieldsNote)}</p>
          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            {feedstocks.map((f) => (
              <div key={f.id} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-lg">{t(f.label)}{f.assumption ? ' *' : ''}</dt>
                <dd className="shrink-0 text-xl font-semibold tabular-nums">≈ {Math.round(f.yield * 100)} kg</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-muted">{t(how.assumptionNote)}</p>
          <a href={pathFor('results')} className="mt-4 inline-block font-semibold text-leaf hover:underline">
            {t({ en: 'Work it out for your farm →', sw: 'Hesabu kwa shamba lako →' })}
          </a>
        </Container>
      </section>

      {/* Ask */}
      <section className="border-t border-rule bg-ash-deep">
        <Container className="flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{t(how.askTitle)}</h2>
            <p className="mt-2 text-lg text-muted">{t(how.askBody)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PrimaryLink href={contact.whatsapp} external>{t(common.whatsappCta)}</PrimaryLink>
            <SecondaryLink href={pathFor('kiln')}>{t({ en: 'See our kiln', sw: 'Ona tanuri letu' })}</SecondaryLink>
          </div>
        </Container>
      </section>
    </>
  );
}
