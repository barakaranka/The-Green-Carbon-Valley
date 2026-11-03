import { createElement, useState } from 'react';
import { Box } from 'lucide-react';
import { kiln, photos } from '../content';
import { useLang } from '../site/lang';
import { Container, Photo } from '../site/ui';

/**
 * Shows the kiln photo first. Once a web model (kiln.glbUrl) is set in content.ts,
 * a button loads Google's model-viewer on tap, so phones don't download 3D unless asked.
 */
function KilnViewer() {
  const { t } = useLang();
  const [state, setState] = useState<'photo' | 'loading' | 'ready'>('photo');

  const open3d = async () => {
    setState('loading');
    await import('@google/model-viewer');
    setState('ready');
  };

  return (
    <div>
      {state === 'ready' && kiln.glbUrl ? (
        <div className="aspect-[4/3] overflow-hidden rounded-md bg-ash-deep">
          {createElement(
            'model-viewer',
            {
              src: kiln.glbUrl,
              alt: t(kiln.title),
              'camera-controls': '',
              ar: '',
              'shadow-intensity': '1',
              style: { width: '100%', height: '100%' },
            },
            kiln.hotspots.map((h, i) => (
              <button
                key={i}
                slot={`hotspot-${i}`}
                data-position={h.position}
                data-normal={h.normal}
                className="rounded-full bg-ember px-2.5 py-1 text-sm font-semibold text-char shadow"
              >
                {i + 1}. {t(h.label)}
              </button>
            )),
          )}
        </div>
      ) : (
        <Photo src={photos.production.src} alt={photos.production.alt} caption={kiln.photoCaption} />
      )}
      {kiln.glbUrl && state !== 'ready' && (
        <button
          type="button"
          onClick={open3d}
          disabled={state === 'loading'}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-char/30 px-4 py-2.5 font-semibold hover:border-char disabled:opacity-60"
        >
          <Box className="h-4 w-4" aria-hidden="true" />
          {state === 'loading' ? t(kiln.loading3d) : t(kiln.view3d)}
        </button>
      )}
      {state === 'ready' && <p className="mt-2 text-sm text-muted">{t(kiln.view3dHint)}</p>}
    </div>
  );
}

export default function OurKiln() {
  const { t } = useLang();
  return (
    <>
      <section className="border-b border-rule">
        <Container className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{t(kiln.title)}</h1>
            <p className="mt-5 text-lg text-muted">{t(kiln.intro)}</p>
          </div>
          <KilnViewer />
        </Container>
      </section>

      {/* Three stages */}
      <section className="bg-char text-ash">
        <Container className="py-14 md:py-20">
          <h2 className="text-3xl font-bold tracking-tight">{t(kiln.stagesTitle)}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {kiln.stages.map((s, i) => (
              <li key={i} className="border-t-4 pt-5" style={{ borderColor: ['#D8C18A', '#E4772B', '#8A857A'][i] }}>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-dark">{i + 1}</p>
                <h3 className="mt-1 text-2xl font-semibold">{t(s.name)}</h3>
                <p className="mt-2 text-muted-dark">{t(s.body)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Specs */}
      <section>
        <Container className="grid gap-10 py-14 md:grid-cols-[1fr_1.6fr] md:py-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t(kiln.specsTitle)}</h2>
            <p className="mt-3 text-muted">{t(kiln.specsNote)}</p>
          </div>
          <dl className="divide-y divide-rule border-y border-rule">
            {kiln.specs.map((s, i) => (
              <div key={i} className="grid gap-1 py-4 sm:grid-cols-2 sm:gap-6">
                <dt className="text-muted">{t(s.label)}</dt>
                <dd className="font-semibold">{t(s.value)}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {kiln.safetyFeatures.length > 0 && (
        <section className="border-t border-rule bg-ash-deep">
          <Container className="py-14">
            <h2 className="text-2xl font-bold">{t(kiln.safetyTitle)}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {kiln.safetyFeatures.map((f, i) => (
                <li key={i} className="border-l-2 border-leaf pl-4">{t(f)}</li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
