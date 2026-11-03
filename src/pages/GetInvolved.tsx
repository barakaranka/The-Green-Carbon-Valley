import { useState, type FormEvent } from 'react';
import { Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import { contact, join } from '../content';
import { useLang } from '../site/lang';
import { pathFor } from '../site/router';
import { Container } from '../site/ui';

function ContactForm() {
  const { t } = useLang();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState('sending');
    try {
      const res = await fetch(contact.formspree, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState('sent');
    } catch {
      setState('failed');
    }
  };

  const field = 'mt-1.5 w-full rounded-md border border-char/25 bg-ash px-3 py-3 text-base';
  if (state === 'sent') return <p className="text-lg font-semibold text-leaf" role="status">{t(join.sent)}</p>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="font-semibold">{t(join.name)}</span>
        <input name="name" required maxLength={80} className={field} />
      </label>
      <label className="block">
        <span className="font-semibold">{t(join.phoneOrEmail)}</span>
        <input name="contact" required maxLength={120} className={field} />
      </label>
      <label className="block">
        <span className="font-semibold">{t(join.place)}</span>
        <input name="place" maxLength={80} className={field} />
      </label>
      <label className="block">
        <span className="font-semibold">{t(join.message)}</span>
        <textarea name="message" required rows={4} maxLength={2000} className={field} />
      </label>
      {state === 'failed' && <p className="text-soil" role="alert">{t(join.failed)}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === 'sending'} className="rounded-md bg-ember px-6 py-3 font-semibold text-char hover:bg-ember-light disabled:opacity-60">
          {state === 'sending' ? t(join.sending) : t(join.send)}
        </button>
        <span className="text-sm text-muted">
          {t(join.privacyNote)} <a href={pathFor('privacy')} className="underline underline-offset-2">{t({ en: 'Privacy', sw: 'Faragha' })}</a>
        </span>
      </div>
    </form>
  );
}

export default function GetInvolved() {
  const { t } = useLang();
  const direct = [
    { icon: MessageCircle, label: 'WhatsApp', value: contact.phoneDisplay, href: contact.whatsapp, external: true },
    { icon: Phone, label: t({ en: 'Phone', sw: 'Simu' }), value: contact.phoneDisplay, href: `tel:${contact.phoneTel}` },
    { icon: Mail, label: t({ en: 'Email', sw: 'Barua pepe' }), value: contact.email, href: `mailto:${contact.email}` },
    { icon: Linkedin, label: 'LinkedIn', value: contact.linkedinName, href: contact.linkedin, external: true },
  ];

  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-14 md:py-20">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{t(join.title)}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">{t(join.lead)}</p>
          <ul className="mt-12 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {join.ways.map((w, i) => (
              <li key={i}>
                <h2 className="text-xl font-semibold">{t(w.title)}</h2>
                <p className="mt-2 text-muted">{t(w.body)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section>
        <Container className="grid gap-14 py-14 md:grid-cols-[1.4fr_1fr] md:py-20">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">{t(join.formTitle)}</h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-bold">{t(join.directTitle)}</h2>
            <ul className="divide-y divide-rule border-y border-rule">
              {direct.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center gap-4 py-4 hover:text-leaf"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />
                    <span>
                      <span className="block text-sm text-muted">{label}</span>
                      <span className="break-all font-semibold">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
