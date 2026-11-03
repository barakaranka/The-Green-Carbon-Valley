import React, { useState } from 'react';
import { 
  Atom, 
  Layers, 
  FlaskConical, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  Bug, 
  Sprout, 
  CheckCircle2, 
  Send, 
  Loader2,
  HelpCircle
} from 'lucide-react';

export default function SoilScienceLab() {
  const [activeTab, setActiveTab] = useState<'pores' | 'cec' | 'inoculation' | 'prescription'>('pores');
  
  // Soil Prescription Form State
  const [soilType, setSoilType] = useState('Ferralsol (Acidic Red Clay - Eldoret / Makongi)');
  const [crop, setCrop] = useState('Maize & Climbing Bean Intercrop');
  const [currentPh, setCurrentPh] = useState('5.1');
  const [landAreaAcres, setLandAreaAcres] = useState('2.5');
  const [prescriptionLang, setPrescriptionLang] = useState<'en' | 'sw'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [prescriptionResult, setPrescriptionResult] = useState<string | null>(null);

  const handleGeneratePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrescriptionResult(null);

    try {
      const response = await fetch('/api/soil-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilType,
          crop,
          currentPh,
          landAreaAcres,
          language: prescriptionLang
        })
      });

      const data = await response.json();
      if (data.prescription) {
        setPrescriptionResult(data.prescription);
      } else {
        setPrescriptionResult(
          prescriptionLang === 'sw'
            ? 'Hitilafu wakati wa kupata maagizo: ' + (data.error || 'Hitilafu ya seva')
            : 'Error retrieving prescription: ' + (data.error || 'Server error')
        );
      }
    } catch (err: any) {
      if (prescriptionLang === 'sw') {
        setPrescriptionResult('Haiwezi kuunganishwa kwenye seva ya udongo. Mwongozo wa kikanda: Tani 1.5 - 2.0 za biochar kwa hekta iliyochanganywa na samadi ya ng\'ombe (uwiano wa 1:4) huinua CEC kutoka 12 hadi 24 cmol/kg.');
      } else {
        setPrescriptionResult('Could not connect to Soil Science Engine. Showing calibrated regional standard: 1.5 - 2.0 t/ha biochar co-composted at 1:4 with bovine manure elevates CEC from 12 to 24 cmol/kg.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50 mb-2">
            <Atom className="w-3.5 h-3.5" /> Soil Biochemistry & Agronomy Lab
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Biochar Pore Architecture & Soil Chemistry
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Understanding the biophysical mechanisms that turn agricultural waste and water hyacinth into multi-century fertility and recalcitrant carbon sinks.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('pores')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'pores'
                ? 'bg-emerald-500 text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pore Hierarchy
          </button>
          <button
            onClick={() => setActiveTab('cec')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'cec'
                ? 'bg-emerald-500 text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            CEC & pH Liming
          </button>
          <button
            onClick={() => setActiveTab('inoculation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'inoculation'
                ? 'bg-emerald-500 text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Inoculation "Charging"
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'prescription'
                ? 'bg-emerald-500 text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI Soil Prescription
          </button>
        </div>
      </div>

      {/* TAB 1: PORE HIERARCHY */}
      {activeTab === 'pores' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bug className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-white">Macropores</h4>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                &gt; 50 nm
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Acts as a sheltered sanctuary for beneficial soil microorganisms. Protects mycorrhizal fungi hyphae, rhizobia, and actinomycetes from protozoan predation while promoting aerobic respiration.
            </p>
            <div className="pt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60">
              Biomass Source: Stems of maize stover & dried water hyacinth runners.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-blue-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-white">Mesopores</h4>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                2 nm - 50 nm
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The primary engine of plant-available water retention. Capillary forces store dissolved nitrate (NO₃⁻) and phosphate ions without letting them leach into Lake Victoria runoff.
            </p>
            <div className="pt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60">
              Drought resilience: Increases soil moisture holding capacity by 22% - 38%.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Atom className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-white">Micropores</h4>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                &lt; 2 nm
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Provides an immense internal surface area of 300 to 650 m² per single gram of biochar. Creates electrostatic negative charges that hold cations like Ca²⁺, K⁺, and Mg²⁺.
            </p>
            <div className="pt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60">
              Carbon Stability: Highly aromatic rings resistant to microbial decay for 100+ years.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CEC & PH LIMING */}
      {activeTab === 'cec' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                Cation Exchange Capacity (CEC) Rejuvenation
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Many soils in Western Kenya and the Rift Valley (Ferralsols, Acrisols) suffer from heavy leaching and low organic matter, giving them an impoverished CEC of only 8–14 cmol/kg.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Untreated Acidic Soil:</span>
                  <span className="text-rose-400 font-bold">11 cmol/kg (Nutrient Leaching)</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[25%]" />
                </div>

                <div className="flex justify-between text-xs font-mono pt-2">
                  <span className="text-zinc-400">With 2 t/ha Charged Biochar:</span>
                  <span className="text-emerald-400 font-bold">26 cmol/kg (+136% Nutrient Hold)</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[68%]" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Natural Liming & Acid Neutralization
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Water hyacinth biochar has an alkaline ash content (pH 8.5–9.8) rich in exchangeable potassium and calcium carbonate equivalents, eliminating the need for expensive synthetic agricultural lime (CaCO3).
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">Aluminium Toxicity</span>
                  <span className="text-emerald-400 font-semibold">Reduced by 74%</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">Fertilizer Efficiency</span>
                  <span className="text-cyan-400 font-semibold">+35% NPK Uptake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INOCULATION / CHARGING */}
      {activeTab === 'inoculation' && (
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-white">
                The Golden Rule: Never Apply Raw "Uncharged" Biochar
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Freshly pyrolyzed biochar is ultra-dry and sterile. If put raw into planting furrows, its empty micropores will initially absorb existing soil moisture and nitrogen, causing temporary crop yellowing (nitrogen drawdown).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-xs font-semibold text-emerald-400">Step 1: Biochar Milling</div>
              <p className="text-xs text-zinc-400">
                Crush biochar to 2mm–5mm granules to maximize surface contact with root zones. Avoid pulverizing into dust.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-xs font-semibold text-emerald-400">Step 2: Inoculation Blend</div>
              <p className="text-xs text-zinc-400">
                Mix 1 part biochar with 4 parts aged cattle or poultry manure, compost tea, or fermented water hyacinth extract.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-xs font-semibold text-emerald-400">Step 3: 14-Day Incubation</div>
              <p className="text-xs text-zinc-400">
                Keep the blend moist (50% moisture) under shade for 10–14 days. Pores fill with active mycorrhizal biology and nutrients.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI SOIL PRESCRIPTION */}
      {activeTab === 'prescription' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="text-xs text-zinc-400">
              {prescriptionLang === 'sw'
                ? 'Kokotoa kiwango sahihi cha biochar na samadi kwa Kiswahili au Kiingereza'
                : 'Calculate optimal biochar & manure charging ratios in English or Kiswahili'}
            </div>
            <div className="flex items-center p-0.5 bg-zinc-900 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setPrescriptionLang('en')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  prescriptionLang === 'en'
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇺🇸 English
              </button>
              <button
                type="button"
                onClick={() => setPrescriptionLang('sw')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  prescriptionLang === 'sw'
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇰🇪 Kiswahili
              </button>
            </div>
          </div>

          <form onSubmit={handleGeneratePrescription} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                {prescriptionLang === 'sw' ? 'Aina ya Udongo' : 'Soil Classification'}
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Ferralsol (Acidic Red Clay - Eldoret / Makongi)">Ferralsol (Acidic Red Clay - Eldoret/Makongi)</option>
                <option value="Acrisol (Weathered Loam - Kakamega / Vihiga)">Acrisol (Weathered Loam - Western)</option>
                <option value="Vertisol (Black Cotton Clay - Lake Shore)">Vertisol (Black Cotton Clay - Kisumu)</option>
                <option value="Andosol (Volcanic Ash Loam - Rift Valley)">Andosol (Volcanic Ash - Nakuru/Naivasha)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                {prescriptionLang === 'sw' ? 'Zao Lililokusudiwa' : 'Target Crop System'}
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Maize & Climbing Bean Intercrop">Maize & Bean Intercrop</option>
                <option value="Tea Bushes & Agroforestry">Tea & Agroforestry</option>
                <option value="Sorghum & Finger Millet">Sorghum & Millet (Drought-tolerant)</option>
                <option value="Horticulture (Tomatoes, Kales, Onions)">Horticulture (Vegetables)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                {prescriptionLang === 'sw' ? 'Kiwango cha pH ya Udongo: ' : 'Current Soil pH: '}{currentPh}
              </label>
              <input
                type="range"
                min="4.0"
                max="7.5"
                step="0.1"
                value={currentPh}
                onChange={(e) => setCurrentPh(e.target.value)}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer mt-3"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {prescriptionLang === 'sw' ? 'Inakokotoa...' : 'Computing...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> {prescriptionLang === 'sw' ? 'Tengeneza Maagizo' : 'Generate Prescription'}
                  </>
                )}
              </button>
            </div>
          </form>

          {prescriptionResult && (
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> AI Agro-Ecological Prescription
              </div>
              <div className="text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-sans">
                {prescriptionResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
