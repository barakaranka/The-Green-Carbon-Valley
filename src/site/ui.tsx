import { useState, type ReactNode } from 'react';
import { Leaf } from 'lucide-react';
import { common, type T } from '../content';
import { useLang } from './lang';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/** The leaf mark and name from the previous site, recoloured to the new palette. */
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-leaf">
        <Leaf className="h-5 w-5 text-ash" aria-hidden="true" />
      </span>
      <span className={`text-lg font-bold tracking-tight ${dark ? 'text-ash' : 'text-char'}`}>{common.siteName}</span>
    </span>
  );
}

/** Small uppercase label above a heading. */
export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.12em] ${dark ? 'text-sprout' : 'text-leaf'}`}>
      {children}
    </p>
  );
}

/** Main action button: ember with black text (5.8:1 contrast). Used sparingly. */
export function PrimaryLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 font-semibold text-char transition-colors hover:bg-ember-light"
    >
      {children}
    </a>
  );
}

export function SecondaryLink({ href, children, external = false, dark = false }: { href: string; children: ReactNode; external?: boolean; dark?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-semibold transition-colors ${
        dark ? 'border-muted-dark text-ash hover:border-ash' : 'border-char/30 text-char hover:border-char'
      }`}
    >
      {children}
    </a>
  );
}

/** Photo that falls back to a plain charcoal panel if the image cannot load. */
export function Photo({ src, alt, caption, className = '' }: { src: string; alt: T; caption?: T; className?: string }) {
  const { t } = useLang();
  const [failed, setFailed] = useState(false);
  return (
    <figure className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-charcoal">
        {failed ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-dark">{t(common.photoMissing)}</div>
        ) : (
          <img src={src} alt={t(alt)} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        )}
      </div>
      {caption && <figcaption className="mt-2 text-sm text-muted">{t(caption)}</figcaption>}
    </figure>
  );
}
