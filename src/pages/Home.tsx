import { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { common, contact, home, photos, stats, statsSince, video } from '../content';
import { useLang } from '../site/lang';
import { pathFor } from '../site/router';
import { Container, Eyebrow, Photo, PrimaryLink, SecondaryLink } from '../site/ui';

/** Loads the YouTube player only when tapped, to save mobile data. */
function VideoFacade() {
  const { t } = useLang();
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-charcoal">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
          title={t(video.title)}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group h-full w-full" aria-label={`${t(common.playVideo)}: ${t(video.title)}`}>
          <img
            src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-80"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ember text-char transition-transform group-hover:scale-105">
              <Play className="ml-1 h-7 w-7" aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const shownStats = stats.filter((s) => s.value !== null);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-rule">
        <Container className="grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <Eyebrow>{t(home.hero.eyebrow)}</Eyebrow>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">{t(home.hero.title)}</h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{t(home.hero.body)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink href={pathFor('how')}>
                {t(home.hero.primary)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </PrimaryLink>
              <SecondaryLink href={contact.whatsapp} external>
                {t(common.whatsappCta)}
              </SecondaryLink>
            </div>
          </div>
          <Photo src={photos.production.src} alt={photos.production.alt} caption={photos.production.caption} />
        </Container>
      </section>

      {/* What biochar is */}
      <section>
        <Container className="py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{t(home.what.title)}</h2>
            <p className="text-lg text-muted">{t(home.what.body)}</p>
          </div>
          <ol className="mt-12 grid gap-8 border-t border-rule pt-10 md:grid-cols-3">
            {home.what.points.map((p, i) => (
              <li key={i}>
                <p className="text-sm font-semibold text-soil">0{i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold">{t(p.title)}</h3>
                <p className="mt-2 text-muted">
                  {t(p.body)}{' '}
                  {'source' in p && p.source && (
                    <a href={p.source.href} target="_blank" rel="noopener noreferrer" className="text-sm text-leaf underline underline-offset-2">
                      {p.source.label}
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Feedstock and our numbers (dark band) */}
      <section className="bg-char text-ash">
        <Container className="grid gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{t(home.feedstock.title)}</h2>
            <ul className="mt-8 divide-y divide-charcoal border-y border-charcoal">
              {home.feedstock.items.map((item, i) => (
                <li key={i} className="py-3.5 text-lg">{t(item)}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-2xl font-semibold leading-snug text-husk sm:text-3xl">{t(home.feedstock.ruleOfThumb)}</p>
            {shownStats.length > 0 && (
              <div className="mt-10">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sprout">
                  {t(home.feedstock.numbersTitle)}
                  {statsSince && ` · ${t(common.since)} ${t(statsSince)}`}
                </p>
                <dl className="mt-4 space-y-4">
                  {shownStats.map((s, i) => (
                    <div key={i} className="flex items-baseline gap-3">
                      <dt className="text-4xl font-bold tabular-nums">
                        {s.value!.toLocaleString()}
                        {s.unit && <span className="ml-1 text-xl font-semibold">{t(s.unit)}</span>}
                      </dt>
                      <dd className="text-muted-dark">{t(s.label)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Photos */}
      <section>
        <Container className="py-16 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(home.photosTitle)}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[photos.production, photos.application, photos.crops].map((p) => (
              <div key={p.src}>
                <Photo src={p.src} alt={p.alt} caption={p.caption} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Video */}
      <section className="bg-ash-deep">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1fr_1.6fr] md:py-24">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(home.videoTitle)}</h2>
            <p className="mt-4 text-lg text-muted">{t(home.videoBody)}</p>
          </div>
          <VideoFacade />
        </Container>
      </section>

      {/* Steps */}
      <section>
        <Container className="py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(home.steps.title)}</h2>
            <a href={pathFor('how')} className="inline-flex items-center gap-1.5 font-semibold text-leaf hover:underline">
              {t(home.steps.link)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <ol className="mt-10 grid gap-x-6 gap-y-6 border-t-2 border-char pt-6 sm:grid-cols-5">
            {home.steps.items.map((s, i) => (
              <li key={i} className="flex gap-3 sm:block">
                <span className="w-7 shrink-0 text-3xl font-bold text-soil sm:w-auto sm:text-4xl">{i + 1}</span>
                <p className="mt-1 font-medium">{t(s)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Two paths */}
      <section className="border-t border-rule bg-ash-deep">
        <Container className="grid md:grid-cols-2">
          {[
            { p: home.paths.farmers, href: pathFor('join'), accent: 'text-leaf' },
            { p: home.paths.investors, href: pathFor('investors'), accent: 'text-lake' },
          ].map(({ p, href, accent }, i) => (
            <div key={i} className={`py-14 md:py-20 ${i === 0 ? 'md:pr-12' : 'border-t border-rule md:border-l md:border-t-0 md:pl-12'}`}>
              <h2 className={`text-2xl font-bold sm:text-3xl ${accent}`}>{t(p.title)}</h2>
              <p className="mt-3 max-w-md text-lg text-muted">{t(p.body)}</p>
              <a href={href} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-char hover:underline">
                {t(p.cta)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
