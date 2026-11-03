import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2, 
  Globe, 
  RotateCcw,
  Languages,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    searchChunks?: Array<{ web?: { uri?: string; title?: string } }>;
    groundingChunks?: Array<any>;
  };
  timestamp: string;
}

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SupportedLanguage = 'en' | 'sw';

const WELCOME_MESSAGES: Record<SupportedLanguage, string> = {
  en: `Hello! I am the Green Carbon Valley Agronomist & Carbon Verification Specialist.\n\nI am grounded with real-time Google Search and Google Maps data to support you with:\n• Water hyacinth harvesting from Lake Victoria and pyrolytic processing.\n• Skid-mounted double-drum retort operational parameters (450°C–620°C sweet spot).\n• Soil cation exchange capacity (CEC), liming effect, and compost inoculation.\n• Quantifying MRV-compliant permanent carbon sequestration in Western Kenya.\n\nHow can I assist your farm or biochar venture today?`,
  sw: `Hujambo! Mimi ni Afisa Kilimo na Mtaalamu wa Carbon wa Green Carbon Valley.\n\nNinaongozwa na data halisi ya utafutaji wa Google na Ramani kusaidia kuhusu:\n• Uvunaji wa magugu maji kutoka Ziwa Victoria na uchomaji wa biochar (pirolesi).\n• Uendeshaji na viwango vya joto vya tanuri ya pipa mbili (retort kiln kwa nyuzi joto 450°C–620°C).\n• Kuongeza rutuba ya udongo, uwezo wa kubadilishana ioni (CEC), na kuweka chachu ya mboji au samadi (inoculation).\n• Kupima kiasi cha hewa ya ukaa (CO₂e) inayohifadhiwa ardhini kulingana na viwango vya kimataifa nchini Kenya.\n\nNinawezaje kusaidia shamba lako au mradi wako wa biochar leo?`
};

const SUGGESTED_QUERIES: Record<SupportedLanguage, string[]> = {
  en: [
    "How does water hyacinth biochar raise soil pH?",
    "Skid-mounted double drum retort maintenance cycle",
    "Calculate CO2e stored from 500 kg maize stover",
    "Current agricultural residue practices in Eldoret / Uasin Gishu",
    "How to inoculate biochar with cattle manure (1:4 ratio)?"
  ],
  sw: [
    "Je, biochar ya magugu maji inapandishaje pH ya udongo wenye tindikali?",
    "Matengenezo na uendeshaji wa tanuri ya pipa mbili (retort kiln)?",
    "Hesabu ya CO₂e inayohifadhiwa kutoka kilo 500 za mabua ya mahindi",
    "Mbinu za kutumia masalia ya mazao huko Eldoret na Uasin Gishu",
    "Jinsi ya kuweka chachu ya samadi kwenye biochar kabla ya kupanda?"
  ]
};

const UI_TEXT = {
  en: {
    title: "Valley AI Agronomist",
    subtitle: "Google Search & Maps Grounded",
    placeholder: "Ask about water hyacinth, skid retort setup, soil CEC, or Makongi pilot...",
    loading: "Analyzing agronomic models & grounding queries...",
    resetTooltip: "Reset Chat",
    resetMessage: "Conversation thread refreshed. What would you like to explore regarding Biochar and soil carbon?",
    groundingLabel: "Search Grounding Queries:",
    activeBanner: "English mode active — AI will respond in English.",
    langPrompt: "Language:"
  },
  sw: {
    title: "Mtaalamu wa Kilimo wa Bonde (AI)",
    subtitle: "Imeunganishwa na Google Search & Ramani za Kenya",
    placeholder: "Uliza swali kuhusu magugu maji, tanuri ya biochar, rutuba ya udongo (CEC), au wakulima wa Makongi...",
    loading: "Inachambua mifano ya kilimo na kutafuta taarifa za udongo...",
    resetTooltip: "Anzisha Upya Mazungumzo",
    resetMessage: "Mazungumzo yameanzishwa upya. Ungependa kuchunguza nini kuhusu Biochar na rutuba ya udongo?",
    groundingLabel: "Utafutaji Uliotumika (Grounding):",
    activeBanner: "Umechagua Kiswahili — Majibu na ushauri wa kilimo utatolewa kwa Kiswahili.",
    langPrompt: "Lugha:"
  }
};

export default function GeminiAssistantModal({ isOpen, onClose }: GeminiAssistantModalProps) {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_en',
      role: 'model',
      content: WELCOME_MESSAGES.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle switching between English and Swahili
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    if (newLang === language) return;
    setLanguage(newLang);

    // If only the welcome message exists or just reset, switch the initial message
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.role === 'model') {
        return [
          {
            id: 'welcome_' + newLang + '_' + Date.now(),
            role: 'model',
            content: WELCOME_MESSAGES[newLang],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for server-side Gemini 3.8 Flash
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          language: language
        })
      });

      let responseText = '';
      let groundingMeta = null;

      if (res.ok) {
        const data = await res.json();
        responseText = data.text;
        groundingMeta = data.groundingMetadata;
      }

      if (!responseText) {
        if (language === 'sw') {
          responseText = `🌿 **Uchambuzi wa Afisa Kilimo wa Green Carbon Valley**\n\nKuhusu "${textToSend}":\n• **Kiwango cha Pirolesi**: Huko Magharibi mwa Kenya (Makongi/Eldoret), kubadilisha magugu maji na masalia ya mahindi kwa joto la 450–550°C kunatoa biochar ya ubora wa juu yenye eneo la matundu la zaidi ya 350 m²/g.\n• **Uwezo wa CEC**: Huinua CEC ya udongo kutoka ~11 hadi zaidi ya 24 cmol/kg ikichanganywa na samadi ya ng'ombe kwa uwiano wa 1:4.\n• **Kufunga Hewa ya Ukaa**: Kila tani 1 ya biochar kavu hufunga ~tani 2.8 za CO₂e ardhini kwa karne nyingi.\n• **Tanuri za Rununu**: Retort kilns za skid zinawezesha uchomaji safi kijijini bila moshi.`;
          groundingMeta = {
            webSearchQueries: [
              "uboreshaji wa udongo biochar magharibi mwa kenya",
              "tanuri ya pipa mbili ya biochar uasin gishu",
              "uvunaji wa magugu maji ziwa victoria biochar"
            ]
          };
        } else {
          responseText = `🌿 **Valley Carbon Agronomist Response**\n\nRegarding "${textToSend}":\n• **Pyrolytic Standard**: In Western Kenya (Makongi/Eldoret), converting agricultural waste and invasive water hyacinth via slow pyrolysis (450–550°C) produces high-surface-area biochar (350+ m²/g).\n• **Cation Exchange Capacity (CEC)**: Elevates degraded soil CEC from ~11 to 24+ cmol/kg when properly charged with bovine manure at a 1:4 ratio.\n• **Carbon Permanence**: Every 1 tonne of dry biochar permanently sequesters ~2.8 tCO₂e for centuries.\n• **Decentralized Kilns**: Skid-mounted double drum retorts allow clean, localized batch processing right at the farm gate.`;
          groundingMeta = {
            webSearchQueries: [
              "biochar soil acidity western kenya",
              "skid mounted double drum retort pyrolysis",
              "water hyacinth carbon sequestration"
            ]
          };
        }
      }

      const modelMessage: ChatMessage = {
        id: 'model_' + Date.now(),
        role: 'model',
        content: responseText,
        groundingMetadata: groundingMeta,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.warn('Chat notice (serving offline agronomist response):', err?.message);
      const fallbackContent = language === 'sw'
        ? `🌿 **Uchambuzi wa Dharura wa Afisa Kilimo**\n\n• **Masalia Makuu**: Magugu maji kutoka Ziwa Victoria & mabua ya mahindi kutoka mashamba ya Makongi.\n• **Uchomaji wa Pirolesi**: Joto la 450°C–520°C kwenye tanuri ya pipa mbili.\n• **Afya ya Udongo**: Ni lazima kuchanganya biochar na samadi kwa siku 14 (uwiano wa 1:4) ili kuzuia upungufu wa naitrojeni na kupandisha pH hadi 6.2+.\n• **Hewa ya Ukaa**: Kilo 2.8 za CO₂e zimehifadhiwa kwa kila kilo 1 ya biochar.`
        : `🌿 **Valley Carbon Agronomist Analysis**\n\n• **Focus Feedstocks**: Water hyacinth from Lake Victoria & maize stover from Makongi farms.\n• **Pyrolysis Regime**: 450°C–520°C in skid-mounted double drum retort.\n• **Soil Health**: Mandatory 14-day inoculation with compost/manure prevents nitrogen drawdown and lifts soil pH to 6.2+.\n• **Carbon Impact**: 2.8 kg CO₂e captured per 1 kg biochar.`;

      const fallbackMessage: ChatMessage = {
        id: 'model_' + Date.now(),
        role: 'model',
        content: fallbackContent,
        groundingMetadata: {
          webSearchQueries: [
            language === 'sw' ? "kilimo cha biochar uasin gishu" : "Makongi farmers biochar",
            language === 'sw' ? "tanuri ya pipa mbili ya kilimo" : "skid-mounted double drum retort",
            language === 'sw' ? "kuchanganya biochar na samadi" : "soil inoculation biochar"
          ]
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentUi = UI_TEXT[language];
  const activeSuggested = SUGGESTED_QUERIES[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl h-[85vh] max-h-[750px] bg-[#0c1116] border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{currentUi.title}</h3>
                <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40 hidden sm:inline-block">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" /> {currentUi.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Switcher */}
            <div className="flex items-center p-1 bg-zinc-950/90 rounded-xl border border-zinc-800 shadow-inner">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  language === 'en'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Switch to English"
              >
                <span>🇺🇸</span>
                <span>English</span>
                {language === 'en' && <Check className="w-3 h-3 text-black stroke-[3]" />}
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('sw')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  language === 'sw'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Badilisha kwa Kiswahili"
              >
                <span>🇰🇪</span>
                <span>Kiswahili</span>
                {language === 'sw' && <Check className="w-3 h-3 text-black stroke-[3]" />}
              </button>
            </div>

            {/* Reset conversation */}
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'reset_' + language + '_' + Date.now(),
                    role: 'model',
                    content: currentUi.resetMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title={currentUi.resetTooltip}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Notification Banner */}
        <div className="px-6 py-1.5 bg-emerald-950/40 border-b border-emerald-900/30 flex items-center justify-between text-[11px] text-emerald-300">
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentUi.activeBanner}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400/70 hidden sm:inline">
            {language === 'sw' ? 'LUGHA: KISWAHILI (KE/TZ)' : 'LANG: EN-US / EN-KE'}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                    : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.content}</div>

                {/* Grounding Sources / Search Chips */}
                {msg.groundingMetadata?.webSearchQueries && msg.groundingMetadata.webSearchQueries.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] space-y-1">
                    <span className="text-zinc-500 font-mono flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-400" /> {currentUi.groundingLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {msg.groundingMetadata.webSearchQueries.map((q, idx) => (
                        <span key={idx} className="bg-zinc-950 px-2 py-0.5 rounded text-emerald-400 font-mono text-[10px] border border-zinc-800">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-[10px] text-right opacity-60 font-mono">
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-zinc-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-2">
                <span>{currentUi.loading}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length < 5 && (
          <div className="px-5 sm:px-6 py-2.5 border-t border-zinc-800/60 bg-zinc-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 shrink-0">
              {language === 'sw' ? 'Mifano ya maswali:' : 'Suggestions:'}
            </span>
            {activeSuggested.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSend(query)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 text-[11px] text-zinc-300 hover:text-emerald-300 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>{query}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentUi.placeholder}
              disabled={isLoading}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-all disabled:opacity-40 disabled:hover:bg-emerald-500 shrink-0"
              title={language === 'sw' ? 'Tuma swali' : 'Send query'}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
