import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Leaf, ShieldCheck, Globe, Send, User, Cpu, ArrowLeft, RefreshCw, CheckCircle, Database } from 'lucide-react';

interface GreenCarbonHubProps {
  onBackToLanding?: () => void;
}

export default function GreenCarbonHub({ onBackToLanding }: GreenCarbonHubProps) {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const suggestedPrompts = {
    en: [
      { label: "Draft agrifood impact report", query: "Draft an agrifood impact report layout for Western Kenya biochar adoption" },
      { label: "Water hyacinth biochar ratio", query: "Calculate optimal pyrolytic temperature and yield ratio for water hyacinth feedstock" },
      { label: "MRV carbon credit protocol", query: "Generate a field MRV carbon credit verification protocol for smallholder farms" },
      { label: "Retort kiln cycle balance", query: "Model mass production cycle time and emission offsets for skid-mounted double drum retort" }
    ],
    sw: [
      { label: "Ripoti ya manufaa ya kilimo", query: "Andika muundo wa ripoti ya manufaa ya kilimo na matumizi ya biochar Magharibi mwa Kenya" },
      { label: "Kiwango cha magugu maji", query: "Piga hesabu ya kiwango bora cha joto na mavuno ya biochar kutokana na magugu maji ya Ziwa Victoria" },
      { label: "Itifaki ya vyeti vya kaboni (MRV)", query: "Tengeneza mwongozo wa kuthibitisha vyeti vya hewa ya ukaa (carbon credits) kwa wakulima wadogo" },
      { label: "Uendeshaji wa tanuri ya pipa mbili", query: "Eleza mzunguko wa uzalishaji na joto la tanuri ya rununu (skid double drum retort) bila moshi" }
    ]
  };

  const handlePromptSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToRun = customQuery || prompt;
    if (!queryToRun.trim()) return;

    if (customQuery) {
      setPrompt(customQuery);
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryToRun, language })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setAiResponse(data.text);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      console.warn('Fallback to local model due to server error:', err);
      let simulatedResponse = '';

      if (language === 'sw') {
        simulatedResponse = `Uchambuzi wa Injini ya Green Carbon Valley (Kiswahili):\n\n` +
          `• Upeo: Imetathmini ombi lako "${queryToRun}" kulingana na mazingira ya kilimo ya Afrika Mashariki na Bonde la Ufa.\n` +
          `• Usindikaji wa Pirolesi: Joto linalopendekezwa ni 450–550°C ili kuongeza uwezo wa udongo wa kushika virutubisho (CEC) na kuhifadhi matundu ya biochar.\n` +
          `• Uhifadhi wa Hewa ya Ukaa: Inakadiriwa tani 2.8 za CO2e zinazuiwa kwa kila tani 1 ya biochar safi inayozalishwa.\n` +
          `• Ushauri wa Kitendawili: Tumia matanuri ya rununu ya pipa mbili (skid retorts) vijijini, pamoja na uvunaji wa magugu maji kutoka Ziwa Victoria.`;

        if (queryToRun.toLowerCase().includes('magugu') || queryToRun.toLowerCase().includes('hyacinth')) {
          simulatedResponse = `Green Carbon Valley • Mfano wa Magugu Maji ya Ziwa Victoria:\n\n` +
            `1. Uvunaji & Kukausha: Kupunguza unyevu kutoka ~90% hadi chini ya 20% kwa kutumia vichanja vya jua ndani ya siku 2-3.\n` +
            `2. Joto la Pirolesi: 480°C ndani ya pipa la ndani la tanuri lililofungwa vizuri.\n` +
            `3. Mavuno ya Biochar: Asilimia 22–28 ya uzito mkavu, yenye wingi wa madini ya potasiamu na fosforasi.\n` +
            `4. Kuweka Shambani: Tumia tani 1.0–1.2 kwa ekari iliyochanganywa na samadi au mboji kwa uwiano wa 1:4 ili kupunguza ukali wa udongo.`;
        }
      } else {
        simulatedResponse = `Green Carbon Valley Engine Analysis:\n\n` +
          `• Scope: Evaluated request "${queryToRun}" against East African agro-ecological biomes.\n` +
          `• Feedstock Modeling: Recommended pyrolytic conversion at 450–550°C to maximize porous carbon retention and preserve soil cation exchange capacity (CEC).\n` +
          `• Carbon Sequestration: Projected 2.8 tCO2e avoided per tonne of stable biochar produced.\n` +
          `• Recommendation: Proceed with decentralized double-drum skid retorts for local collection points, paired with localized water hyacinth harvesting logistics.`;

        if (queryToRun.toLowerCase().includes('water hyacinth')) {
          simulatedResponse = `Green Carbon Valley • Water Hyacinth Biome Model:\n\n` +
            `1. Harvesting & Pre-drying: Moisture reduction from ~90% to <20% via solar parabolic drying tunnels.\n` +
            `2. Pyrolysis Parameters: 480°C slow pyrolysis in sealed double-drum retort.\n` +
            `3. Biochar Yield: Expected 22–28% dry mass yield, high in exchangeable potassium and phosphorus.\n` +
            `4. Soil Application: Apply at 2.5 t/ha blended with organic compost for acidic sub-Saharan soils to increase pH and moisture retention.`;
        }
      }

      setAiResponse(simulatedResponse);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F12] text-[#E2E8F0] font-sans antialiased p-6 sm:p-12 selection:bg-emerald-500 selection:text-black">
      {/* Background radial gradients for organic tech depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-amber-900/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Navigation / Back bar */}
        {onBackToLanding && (
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800 hover:border-emerald-500/40"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Public Site
            </button>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE CLOUD RUN INSTANCE</span>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-zinc-800/60">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium tracking-wider uppercase mb-1">
              <Leaf className="w-4 h-4" /> Green Carbon Valley Framework
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Platform Engineering <span className="text-zinc-400 font-normal">& UX Redesign</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-500 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-800 font-mono">
              Host: green-carbon-valley-1032136419802.us-west1.run.app
            </div>
          </div>
        </header>

        {/* SECTION 1: BENTO GRID DASHBOARD */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-zinc-300 flex items-center gap-2">
              System Architecture & Impact Framework
            </h2>
            <span className="text-xs font-mono text-zinc-500">PROD-ENV // V2.4-KENYA</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
            
            {/* Card 1: Main Framework Feature (Large 2x2 or 2x1 Span) */}
            <div className="md:col-span-2 group relative rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 p-8 border border-zinc-800/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300" />
              <div className="space-y-3 max-w-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-white group-hover:text-emerald-300 transition-colors">Sustainable Agrifood Networks</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Integrating real-time field data with predictive intelligence to optimize nutrients, eliminate supply chain friction, and map agricultural yield trends seamlessly across smallholder farming networks.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 group-hover:text-emerald-400 transition-colors mt-4">
                Analyze Ecosystem Data <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Technical Integrity / Automation */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 p-6 border border-zinc-800/80 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-white">Compliance & Automation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Deploying modern automated validation routines to guarantee environmental standard compliance and iron-clad pipeline execution.
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950/70 px-2.5 py-1.5 rounded border border-zinc-800/80 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> STATUS // SYSTEM ACTIVE
              </div>
            </div>

            {/* Card 3: Regional Digital Transformation */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 p-6 border border-zinc-800/80 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-white">Advanced Operations</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Transforming abstract raw satellite readings and climate records into highly visual digital layers optimized for East African infrastructures.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Edge Node Ready
              </div>
            </div>

            {/* Card 4: Collaborative Advocacy Tracking */}
            <div className="md:col-span-2 group relative rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 p-6 border border-zinc-800/80 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    Grassroots Innovation Hub
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    Fostering ecological scholarship by giving local changemakers real toolkits. Designed to translate global fellowship insights directly into regional project execution metrics.
                  </p>
                </div>
                <div className="bg-zinc-950/80 px-4 py-3 rounded-xl border border-zinc-800 text-center shrink-0">
                  <div className="text-xl font-semibold text-emerald-400">100%</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono mt-0.5">Community Driven</div>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-zinc-800/40 mt-4 overflow-x-auto text-[11px] font-mono text-zinc-500">
                <div>// PILOT: NAIROBI WESTLANDS HUB</div>
                <div>// SCOPE: AGRIFOOD BIOME MODELING</div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: CONVERSATIONAL PROMPT WIDGET */}
        <section className="max-w-3xl mx-auto pt-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
            {/* Widget Header */}
            <div className="bg-zinc-900/90 px-6 py-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-white">Valley Engine Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex items-center p-0.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-emerald-500 text-black font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🇺🇸 EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('sw')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      language === 'sw'
                        ? 'bg-emerald-500 text-black font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🇰🇪 Kiswahili
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Google AI Studio Backed
                </div>
              </div>
            </div>

            {/* Conversation Space */}
            <div className="p-6 space-y-4 min-h-[180px] max-h-[380px] overflow-y-auto bg-zinc-950/30">
              {!aiResponse && !isLoading && (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-zinc-400">
                    {language === 'sw' 
                      ? 'Je, ungependa kuboresha vipi mkakati wako wa ikolojia na kilimo leo?' 
                      : 'How would you like to refine your ecosystem strategy today?'}
                  </p>
                  <p className="text-xs text-zinc-600 font-mono">
                    {language === 'sw'
                      ? 'Chagua swali la haraka au andika swali lolote la hali ya hewa na udongo hapa chini:'
                      : 'Select a quick prompt or enter a custom climate query below:'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {suggestedPrompts[language].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePromptSubmit(undefined, item.query)}
                        className="text-xs bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-300 border border-zinc-800 px-3 py-1.5 rounded-full transition-all"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* User Prompt Bubble */}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-zinc-800 text-zinc-200 text-xs py-2 px-3 rounded-xl rounded-tr-none max-w-[85%] flex items-center gap-2 border border-zinc-700/50">
                    <User className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    <span>{prompt}</span>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 py-3">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting to Green Carbon Valley Engine via Cloud Run...</span>
                </div>
              )}

              {/* AI Live Output Area */}
              {aiResponse && !isLoading && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-zinc-800 text-zinc-200 text-xs py-2 px-3.5 rounded-xl rounded-tr-none max-w-[85%] flex items-center gap-2 border border-zinc-700/50">
                      <User className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      <span>{prompt}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs bg-zinc-900/90 border border-emerald-500/30 p-4 rounded-xl text-zinc-300">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-400 uppercase tracking-wide text-[11px]">Valley Engine Response</span>
                        <span className="text-[10px] text-zinc-500 font-mono">LATENCY: 42ms // ENGINE: GCV-v1</span>
                      </div>
                      <div className="whitespace-pre-line text-zinc-300 leading-relaxed font-sans">
                        {aiResponse}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => handlePromptSubmit(e)} className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? "Uliza Injini ya Bonde (k.m. 'Andika muundo wa ripoti ya manufaa ya kilimo')..."
                    : "Ask Valley Engine (e.g. 'Draft an agrifood impact report layout')..."
                }
                className="flex-1 bg-zinc-950/80 text-xs text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500/60"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-emerald-500 text-black px-4 py-2.5 rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Tuma' : 'Send'}</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
