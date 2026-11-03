import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  co2PerKgBiochar,
  feedstocks,
  HYACINTH_WATER,
  RANGE,
  results,
  type FeedstockId,
} from '../content';
import { auth, logOut, saveBiocharBatch, signInWithGoogle, subscribeToBatches, type BiocharBatchRecord, type User } from '../firebase';
import { useLang } from '../site/lang';
import { Container } from '../site/ui';

const fmt = (n: number) => Math.round(n).toLocaleString();

function feedstockLabel(id: string, t: (s: { en: string; sw: string }) => string) {
  const f = feedstocks.find((x) => x.id === id);
  return f ? t(f.label).split(',')[0] : id; // older records may hold free text
}

/** CO2 estimate for a logged batch: falls back to the crop-residue factor for unknown feedstock text. */
function batchCo2(b: BiocharBatchRecord) {
  const f = feedstocks.find((x) => x.id === b.feedstock) ?? feedstocks[0];
  return b.biocharKg * co2PerKgBiochar(f.carbon);
}

// ---------------------------------------------------------------------------
// Calculator
// ---------------------------------------------------------------------------
function Calculator() {
  const { t } = useLang();
  const [id, setId] = useState<FeedstockId>('crop');
  const [kg, setKg] = useState<string>('100');
  const [fresh, setFresh] = useState(false);

  const f = feedstocks.find((x) => x.id === id)!;
  const amount = Math.max(0, Number(kg) || 0);
  const dryKg = id === 'hyacinth' && fresh ? amount * (1 - HYACINTH_WATER) : amount;
  const biochar = dryKg * f.yield;
  const co2 = biochar * co2PerKgBiochar(f.carbon);
  const range = (v: number) => (v > 0 ? `${fmt(v * (1 - RANGE))}–${fmt(v * (1 + RANGE))} kg` : '0 kg');
  const bags = biochar / 50;

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <label className="block">
          <span className="font-semibold">{t(results.calc.feedstock)}</span>
          <select
            value={id}
            onChange={(e) => setId(e.target.value as FeedstockId)}
            className="mt-2 w-full rounded-md border border-char/25 bg-ash px-3 py-3 text-base"
          >
            {feedstocks.map((x) => (
              <option key={x.id} value={x.id}>{t(x.label)}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-semibold">{t(results.calc.amount)}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="mt-2 w-full rounded-md border border-char/25 bg-ash px-3 py-3 text-base tabular-nums"
          />
          {id !== 'hyacinth' && <span className="mt-2 block text-sm text-muted">{t(results.calc.dryNote)}</span>}
        </label>
        {id === 'hyacinth' && (
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={fresh} onChange={(e) => setFresh(e.target.checked)} className="mt-1 h-5 w-5 accent-leaf" />
            <span>{t(results.calc.freshHyacinth)}</span>
          </label>
        )}
      </div>

      <div className="rounded-md bg-char p-6 text-ash sm:p-8" aria-live="polite">
        <p className="text-muted-dark">{t(results.calc.biochar)}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-husk sm:text-4xl">{range(biochar)}</p>
        {bags >= 1 && <p className="mt-1 text-muted-dark">{t(results.calc.bags).replace('{n}', String(Math.round(bags)))}</p>}
        <p className="mt-6 text-muted-dark">{t(results.calc.co2)}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-sprout sm:text-4xl">{range(co2)}</p>
        <p className="mt-6 border-t border-charcoal pt-4 text-sm text-muted-dark">{t(results.calc.caveat)}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Batch log form (group leaders, signed in)
// ---------------------------------------------------------------------------
function BatchForm({ user, onDone }: { user: User; onDone: (msg: string) => void }) {
  const { t, lang } = useLang();
  const f = results.form;
  const [name, setName] = useState(user.displayName?.split(' ')[0] ?? '');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [feedstock, setFeedstock] = useState<FeedstockId>('crop');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [kilnIdx, setKilnIdx] = useState(0);
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const inKg = Number(input);
    const outKg = Number(output);
    if (outKg > inKg) {
      setError(t(f.outputTooHigh));
      return;
    }
    setBusy(true);
    setError(null);
    const fs = feedstocks.find((x) => x.id === feedstock)!;
    try {
      await saveBiocharBatch({
        userId: user.uid,
        farmerName: name.trim(),
        location: place.trim(),
        date,
        feedstock,
        biomassKg: inKg,
        biocharKg: outKg,
        co2eKg: Math.round(outKg * co2PerKgBiochar(fs.carbon)),
        retortMethod: f.kilnOptions[kilnIdx].en,
        notes: notes.trim(),
        consentPublic: consent,
      });
      onDone(t(f.saved));
    } catch {
      setError(t(f.failed));
    } finally {
      setBusy(false);
    }
  };

  const field = 'mt-1.5 w-full rounded-md border border-char/25 bg-ash px-3 py-2.5 text-base';
  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 border-t border-rule pt-6 sm:grid-cols-2" lang={lang}>
      <label>
        <span className="text-sm font-semibold">{t(f.name)}</span>
        <input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </label>
      <label>
        <span className="text-sm font-semibold">{t(f.place)}</span>
        <input required maxLength={80} value={place} onChange={(e) => setPlace(e.target.value)} className={field} />
      </label>
      <label>
        <span className="text-sm font-semibold">{t(f.date)}</span>
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
      </label>
      <label>
        <span className="text-sm font-semibold">{t(f.feedstock)}</span>
        <select value={feedstock} onChange={(e) => setFeedstock(e.target.value as FeedstockId)} className={field}>
          {feedstocks.map((x) => (
            <option key={x.id} value={x.id}>{t(x.label)}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="text-sm font-semibold">{t(f.input)}</span>
        <input required type="number" min={1} max={100000} inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value)} className={field} />
      </label>
      <label>
        <span className="text-sm font-semibold">{t(f.output)}</span>
        <input required type="number" min={0} inputMode="numeric" value={output} onChange={(e) => setOutput(e.target.value)} className={field} />
      </label>
      <label>
        <span className="text-sm font-semibold">{t(f.kiln)}</span>
        <select value={kilnIdx} onChange={(e) => setKilnIdx(Number(e.target.value))} className={field}>
          {f.kilnOptions.map((k, i) => (
            <option key={i} value={i}>{t(k)}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="text-sm font-semibold">{t(f.notes)}</span>
        <input maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} className={field} />
      </label>
      <label className="flex items-start gap-3 sm:col-span-2">
        <input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-leaf" />
        <span>{t(f.consent)}</span>
      </label>
      {error && <p className="text-soil sm:col-span-2" role="alert">{error}</p>}
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className="rounded-md bg-ember px-5 py-3 font-semibold text-char hover:bg-ember-light disabled:opacity-60">
          {busy ? t(f.saving) : t(f.save)}
        </button>
        <button type="button" onClick={() => onDone('')} className="rounded-md border border-char/30 px-5 py-3 font-semibold">
          {t(f.cancel)}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Results() {
  const { t } = useLang();
  const [batches, setBatches] = useState<BiocharBatchRecord[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    let received = false;
    // On a very weak connection the database may never answer; say so instead of spinning.
    const timer = window.setTimeout(() => {
      if (!received) setLoadError(true);
    }, 12000);
    const unsub = subscribeToBatches(
      (list, fromCache) => {
        // An empty answer from the phone's cache doesn't mean the log is empty.
        if (fromCache && list.length === 0) return;
        received = true;
        setBatches(list.filter((b) => b.consentPublic === true));
        setLoadError(false);
      },
      () => setLoadError(true),
    );
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, []);

  const totals = useMemo(() => {
    const list = batches ?? [];
    return {
      count: list.length,
      biochar: list.reduce((a, b) => a + (b.biocharKg || 0), 0),
      co2: list.reduce((a, b) => a + batchCo2(b), 0),
    };
  }, [batches]);

  const cols = results.log.cols;

  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-14 md:py-20">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{t(results.title)}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">{t(results.intro)}</p>
        </Container>
      </section>

      {/* Totals from the live log, shown only once there is data */}
      {totals.count > 0 && (
        <section className="bg-char text-ash">
          <Container className="grid gap-8 py-12 sm:grid-cols-3">
            {[
              { v: totals.count, l: results.totals.batches },
              { v: totals.biochar, l: results.totals.biochar },
              { v: totals.co2, l: results.totals.co2 },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-4xl font-bold tabular-nums text-husk">{fmt(s.v)}</p>
                <p className="mt-1 text-muted-dark">{t(s.l)}</p>
              </div>
            ))}
          </Container>
        </section>
      )}

      {/* Batch log */}
      <section>
        <Container className="py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight">{t(results.log.title)}</h2>
            {user ? (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted">{t(results.form.signedInAs)} {user.displayName ?? user.email}</span>
                {!formOpen && (
                  <button type="button" onClick={() => { setFormOpen(true); setMessage(''); }} className="rounded-md bg-ember px-4 py-2.5 font-semibold text-char hover:bg-ember-light">
                    {t(results.form.open)}
                  </button>
                )}
                <button type="button" onClick={logOut} className="font-semibold underline underline-offset-2">{t(results.form.signOut)}</button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted">{t(results.form.signInFirst)}</span>
                <button type="button" onClick={signInWithGoogle} className="rounded-md border border-char/30 px-4 py-2.5 font-semibold hover:border-char">
                  {t(results.form.signIn)}
                </button>
              </div>
            )}
          </div>

          {message && <p className="mt-4 font-semibold text-leaf" role="status">{message}</p>}
          {user && formOpen && <BatchForm user={user} onDone={(msg) => { setFormOpen(false); setMessage(msg); }} />}

          <div className="mt-8">
            {loadError ? (
              <p className="text-muted">{t(results.log.loadError)}</p>
            ) : batches === null ? (
              <p className="text-muted">…</p>
            ) : batches.length === 0 ? (
              <p className="border-y border-rule py-8 text-lg text-muted">{t(results.log.empty)}</p>
            ) : (
              <div className="-mx-4 overflow-x-auto px-4">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b-2 border-char text-sm">
                      {[cols.date, cols.who, cols.where, cols.feedstock].map((c, i) => (
                        <th key={i} className="py-3 pr-4 font-semibold">{t(c)}</th>
                      ))}
                      {[cols.input, cols.output, cols.co2].map((c, i) => (
                        <th key={i} className="py-3 pl-4 text-right font-semibold">{t(c)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((b) => (
                      <tr key={b.id} className="border-b border-rule">
                        <td className="whitespace-nowrap py-3 pr-4 tabular-nums">{b.date}</td>
                        <td className="py-3 pr-4">{b.farmerName}</td>
                        <td className="py-3 pr-4">{b.location}</td>
                        <td className="py-3 pr-4">{feedstockLabel(b.feedstock, t)}</td>
                        <td className="py-3 pl-4 text-right tabular-nums">{fmt(b.biomassKg)}</td>
                        <td className="py-3 pl-4 text-right tabular-nums">{fmt(b.biocharKg)}</td>
                        <td className="py-3 pl-4 text-right tabular-nums">{fmt(batchCo2(b))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-4 text-sm text-muted">{t(results.log.note)}</p>
          </div>
        </Container>
      </section>

      {/* Calculator */}
      <section className="border-t border-rule bg-ash-deep">
        <Container className="py-14 md:py-20">
          <h2 className="text-3xl font-bold tracking-tight">{t(results.calc.title)}</h2>
          <p className="mb-8 mt-3 max-w-2xl text-lg text-muted">{t(results.calc.intro)}</p>
          <Calculator />
        </Container>
      </section>

      {/* Method */}
      <section>
        <Container className="py-14 md:py-20">
          <h2 className="text-2xl font-bold tracking-tight">{t(results.method.title)}</h2>
          <p className="mt-3 max-w-3xl text-muted">{t(results.method.body)}</p>
          <div className="-mx-4 mt-8 overflow-x-auto px-4">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-char">
                  <th className="py-3 pr-4 font-semibold">{t(results.method.cols.feedstock)}</th>
                  <th className="py-3 px-4 text-right font-semibold">{t(results.method.cols.yield)}</th>
                  <th className="py-3 px-4 text-right font-semibold">{t(results.method.cols.carbon)}</th>
                  <th className="py-3 px-4 text-right font-semibold">{t(results.method.cols.co2)}</th>
                  <th className="py-3 pl-4 font-semibold">{t(results.method.cols.basis)}</th>
                </tr>
              </thead>
              <tbody>
                {feedstocks.map((f) => (
                  <tr key={f.id} className="border-b border-rule align-top">
                    <td className="py-3 pr-4">{t(f.label)}{f.assumption ? ' *' : ''}</td>
                    <td className="py-3 px-4 text-right tabular-nums">{Math.round(f.yield * 100)} kg</td>
                    <td className="py-3 px-4 text-right tabular-nums">{f.carbon.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right tabular-nums">{co2PerKgBiochar(f.carbon).toFixed(2)} kg</td>
                    <td className="py-3 pl-4 text-sm text-muted">{f.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mt-10 font-semibold">{t(results.sourcesTitle)}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {results.sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-leaf underline underline-offset-2">{s.label}</a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
