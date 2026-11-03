import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import { assistant, common, contact } from '../content';
import { useLang } from '../site/lang';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

/** Minimal formatting for AI replies: paragraphs, bullet lines and **bold**. */
function Formatted({ text }: { text: string }) {
  const bold = (line: string): ReactNode[] =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
    );
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        const isList = lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l));
        if (isList) {
          return (
            <ul key={i} className="my-2 list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{bold(l.replace(/^\s*([-*•]|\d+\.)\s+/, ''))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="my-2 first:mt-0 last:mb-0">
            {lines.map((l, j) => (
              <span key={j}>
                {bold(l)}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

export default function GeminiAssistantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const history = messages;
    setMessages([...history, { role: 'user', content: question }]);
    setInput('');
    setBusy(true);
    let reply = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history, language: lang }),
      });
      if (res.ok) reply = (await res.json()).text ?? '';
    } catch {
      /* handled below */
    }
    setMessages((m) => [...m, { role: 'model', content: reply || t(assistant.unavailable) }]);
    setBusy(false);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-char/50 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t(assistant.title)}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-lg bg-ash shadow-2xl sm:h-[640px] sm:rounded-lg"
      >
        {/* Header */}
        <div className="border-b border-rule px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              {t(assistant.title)} <span className="ml-1 rounded bg-char px-1.5 py-0.5 align-middle text-xs font-semibold text-husk">AI</span>
            </h2>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button type="button" onClick={() => setMessages([])} className="rounded-md p-2 hover:bg-ash-deep" aria-label={t(assistant.restart)} title={t(assistant.restart)}>
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={onClose} className="rounded-md p-2 hover:bg-ash-deep" aria-label={t(common.close)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted">{t(assistant.label)}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
          <div className="max-w-[90%] rounded-lg bg-ash-deep px-4 py-3">{t(assistant.welcome)}</div>
          {messages.length === 0 && (
            <div className="flex flex-col items-start gap-2">
              {assistant.suggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => ask(t(s))} className="rounded-full border border-char/25 px-3.5 py-2 text-left text-sm hover:border-char">
                  {t(s)}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="ml-auto max-w-[85%] rounded-lg bg-char px-4 py-3 text-ash">{m.content}</div>
            ) : (
              <div key={i} className="max-w-[90%] rounded-lg bg-ash-deep px-4 py-3">
                <Formatted text={m.content} />
              </div>
            ),
          )}
          {busy && <p className="text-sm text-muted">{t(assistant.thinking)}</p>}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={submit} className="border-t border-rule p-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t(assistant.placeholder)}
              maxLength={1000}
              className="min-w-0 flex-1 rounded-md border border-char/25 bg-ash px-3 py-3 text-base"
            />
            <button type="submit" disabled={busy || !input.trim()} className="rounded-md bg-ember px-4 font-semibold text-char hover:bg-ember-light disabled:opacity-50" aria-label={t(assistant.send)}>
              <Send className="h-5 w-5" />
            </button>
          </div>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:underline">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> {t(common.whatsappCta)}
          </a>
        </form>
      </div>
    </div>
  );
}
