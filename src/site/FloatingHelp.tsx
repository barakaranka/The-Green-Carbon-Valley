import { MessageCircle, HelpCircle } from 'lucide-react';
import { common, contact } from '../content';
import { useLang } from './lang';

/** Bottom-right: WhatsApp (people) and the AI assistant (labelled as AI). */
export default function FloatingHelp({ onAsk }: { onAsk: () => void }) {
  const { t } = useLang();
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6">
      <a
        href={contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t(common.whatsappCta)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-ash/40 bg-leaf text-ash shadow-lg transition-colors hover:bg-leaf-dark"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={onAsk}
        className="flex h-12 items-center gap-2 rounded-full border border-muted-dark/50 bg-char pl-4 pr-3 text-ash shadow-lg transition-colors hover:bg-charcoal"
      >
        <HelpCircle className="h-5 w-5" aria-hidden="true" />
        <span className="font-semibold">{t(common.askCta)}</span>
        <span className="rounded bg-charcoal px-1.5 py-0.5 text-xs font-semibold text-husk">AI</span>
      </button>
    </div>
  );
}
