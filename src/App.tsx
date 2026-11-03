/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Leaf, 
  Sprout, 
  CloudRain, 
  Calculator, 
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Mail,
  Phone,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Factory,
  ShieldCheck,
  Settings,
  FileText,
  Download,
  Sparkles,
  BarChart3,
  TrendingUp,
  Calendar,
  RotateCcw,
  Plus,
  Trash2,
  Layers,
  Info,
  Rotate3d,
  Atom,
  LogIn,
  LogOut as LogOutIcon,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import GreenCarbonHub from './GreenCarbonHub';
import PyrolysisLab3D from './components/PyrolysisLab3D';
import SoilScienceLab from './components/SoilScienceLab';
import VerifiedBatchLedger from './components/VerifiedBatchLedger';
import GeminiAssistantModal from './components/GeminiAssistantModal';
import { auth, signInWithGoogle, logOut, type User } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// --- Types ---
type FeedstockType = 'wood' | 'crop_waste' | 'husks' | 'other';

interface CalculationResult {
  biochar: number;
  co2: number;
}

export interface MonthlyHistoricalRecord {
  id: string;
  month: string;
  biomass: number; // in kg
  feedstock: FeedstockType;
  notes?: string;
}

// --- Constants ---
const FEEDSTOCK_YIELDS: Record<FeedstockType, number> = {
  wood: 0.35,
  crop_waste: 0.25,
  husks: 0.30,
  other: 0.20
};

const CO2_FACTOR = 2.8; // Approx tonnes of CO2 per tonne of biochar

const INITIAL_MONTHLY_HISTORY: MonthlyHistoricalRecord[] = [
  { id: '1', month: 'Jul', biomass: 450, feedstock: 'crop_waste', notes: 'Post-wheat residue' },
  { id: '2', month: 'Aug', biomass: 620, feedstock: 'crop_waste', notes: 'Maize stover baling' },
  { id: '3', month: 'Sep', biomass: 850, feedstock: 'other', notes: 'Water hyacinth clearance' },
  { id: '4', month: 'Oct', biomass: 1050, feedstock: 'husks', notes: 'Coffee & rice husks' },
  { id: '5', month: 'Nov', biomass: 1300, feedstock: 'crop_waste', notes: 'Dry season crop clearing' },
  { id: '6', month: 'Dec', biomass: 1650, feedstock: 'other', notes: 'Lake Victoria hyacinth harvest' }
];

const PRESET_SCENARIOS: Record<string, { name: string; description: string; data: MonthlyHistoricalRecord[] }> = {
  baseline: {
    name: 'Makongi Pilot Baseline',
    description: 'Realistic farm records from Makongi smallholder partnership',
    data: [
      { id: '1', month: 'Jul', biomass: 450, feedstock: 'crop_waste', notes: 'Post-wheat residue' },
      { id: '2', month: 'Aug', biomass: 620, feedstock: 'crop_waste', notes: 'Maize stover baling' },
      { id: '3', month: 'Sep', biomass: 850, feedstock: 'other', notes: 'Water hyacinth clearance' },
      { id: '4', month: 'Oct', biomass: 1050, feedstock: 'husks', notes: 'Coffee & rice husks' },
      { id: '5', month: 'Nov', biomass: 1300, feedstock: 'crop_waste', notes: 'Dry season crop clearing' },
      { id: '6', month: 'Dec', biomass: 1650, feedstock: 'other', notes: 'Lake Victoria hyacinth harvest' }
    ]
  },
  hyacinth: {
    name: 'Water Hyacinth Ramp-Up',
    description: 'Aggressive invasive weed harvesting and lake ecosystem restoration',
    data: [
      { id: '1', month: 'Jul', biomass: 800, feedstock: 'other', notes: 'Winam Gulf manual harvesting' },
      { id: '2', month: 'Aug', biomass: 1100, feedstock: 'other', notes: 'Shoreline weed aggregation' },
      { id: '3', month: 'Sep', biomass: 1450, feedstock: 'other', notes: 'Sun-drying & retort processing' },
      { id: '4', month: 'Oct', biomass: 1800, feedstock: 'other', notes: 'Expanded community collection' },
      { id: '5', month: 'Nov', biomass: 2100, feedstock: 'other', notes: 'Mobile skid-mounted retorts' },
      { id: '6', month: 'Dec', biomass: 2500, feedstock: 'other', notes: 'Peak season invasive removal' }
    ]
  },
  harvest: {
    name: 'Peak Crop Residue Season',
    description: 'Maize stover, wheat straw, and coffee husk valorization',
    data: [
      { id: '1', month: 'Jul', biomass: 300, feedstock: 'wood', notes: 'Orchard prunings' },
      { id: '2', month: 'Aug', biomass: 550, feedstock: 'husks', notes: 'Early harvest coffee husks' },
      { id: '3', month: 'Sep', biomass: 1200, feedstock: 'crop_waste', notes: 'Maize harvesting peak' },
      { id: '4', month: 'Oct', biomass: 1750, feedstock: 'crop_waste', notes: 'Stover collection across 40 farms' },
      { id: '5', month: 'Nov', biomass: 1400, feedstock: 'husks', notes: 'Rice husk mill residues' },
      { id: '6', month: 'Dec', biomass: 950, feedstock: 'wood', notes: 'Boundary agroforestry prunings' }
    ]
  }
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  dataKey: string;
  color: string;
  payload: {
    month: string;
    biomass: number;
    feedstock: FeedstockType;
    biochar: number;
    co2: number;
    cumulativeCO2?: number;
    trees: number;
    notes?: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomHistoricalTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 text-xs backdrop-blur-md min-w-[240px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="font-bold text-sm text-emerald-400">{label} Historical Input</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
            {data.feedstock.replace('_', ' ')}
          </span>
        </div>
        {data.notes && (
          <p className="text-slate-400 text-[11px] mb-2.5 italic">"{data.notes}"</p>
        )}
        <div className="space-y-1.5 font-mono">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Biomass Input:</span>
            <span className="text-white font-bold">{data.biomass.toLocaleString()} kg</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-emerald-300 font-medium">Monthly CO₂:</span>
            <span className="text-emerald-400 font-bold">{data.co2.toLocaleString()} kg CO₂e</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sky-300 font-medium">Biochar Output:</span>
            <span className="text-sky-400 font-bold">{data.biochar.toLocaleString()} kg</span>
          </div>
          {typeof data.cumulativeCO2 === 'number' && (
            <div className="flex justify-between gap-4 pt-1.5 border-t border-slate-800 text-amber-300">
              <span className="font-semibold flex items-center gap-1 text-amber-400">
                <TrendingUp className="w-3 h-3 text-amber-400" /> Cumulative CO₂ Growth:
              </span>
              <span className="text-amber-300 font-bold">
                {data.cumulativeCO2.toLocaleString()} kg CO₂e
                <span className="text-[10px] text-amber-400/70 ml-1">
                  ({(data.cumulativeCO2 / 1000).toFixed(2)} t)
                </span>
              </span>
            </div>
          )}
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-4 text-emerald-200">
            <span>Annual Tree Eq:</span>
            <span className="font-bold">~{data.trees} trees</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [biomass, setBiomass] = useState<number>(0);
  const [feedstock, setFeedstock] = useState<FeedstockType>('wood');
  const [result, setResult] = useState<CalculationResult>({ biochar: 0, co2: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentView, setCurrentView] = useState<'landing' | 'hub'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Historical Monthly Inputs & Dynamic Bar Chart State
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyHistoricalRecord[]>(INITIAL_MONTHLY_HISTORY);
  const [selectedMonthId, setSelectedMonthId] = useState<string>('6'); // Default to Dec
  const [chartMetricView, setChartMetricView] = useState<'both' | 'co2' | 'biochar'>('both');
  const [activePreset, setActivePreset] = useState<string>('baseline');
  const [showAddMonthModal, setShowAddMonthModal] = useState<boolean>(false);
  const [newMonthName, setNewMonthName] = useState<string>('Jan');
  const [newMonthBiomass, setNewMonthBiomass] = useState<number>(1000);
  const [newMonthFeedstock, setNewMonthFeedstock] = useState<FeedstockType>('crop_waste');

  const slides = [
    { img: "https://barakaranka.github.io/green-carbon-valley/farmer_1.png", title: "Local Production" },
    { img: "https://barakaranka.github.io/green-carbon-valley/farmer_2.png", title: "Soil Application" },
    { img: "https://barakaranka.github.io/green-carbon-valley/farmer_3.png", title: "Healthy Crops" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const yield_val = FEEDSTOCK_YIELDS[feedstock];
    const biochar = biomass * yield_val;
    const co2 = biochar * CO2_FACTOR;
    setResult({ biochar, co2 });
  }, [biomass, feedstock]);

  // Derived historical calculations
  const historicalChartData = useMemo(() => {
    let runningCumulativeCO2 = 0;
    return monthlyRecords.map((item) => {
      const yieldFactor = FEEDSTOCK_YIELDS[item.feedstock] || 0.25;
      const biochar = Math.round(item.biomass * yieldFactor);
      const co2 = Number((biochar * CO2_FACTOR).toFixed(1));
      runningCumulativeCO2 = Number((runningCumulativeCO2 + co2).toFixed(1));
      return {
        id: item.id,
        month: item.month,
        biomass: item.biomass,
        feedstock: item.feedstock,
        notes: item.notes,
        biochar,
        co2,
        cumulativeCO2: runningCumulativeCO2,
        trees: Math.round(co2 / 20)
      };
    });
  }, [monthlyRecords]);

  const activeMonthRecord = useMemo(() => {
    return monthlyRecords.find((r) => r.id === selectedMonthId) || monthlyRecords[monthlyRecords.length - 1] || null;
  }, [monthlyRecords, selectedMonthId]);

  const totalHistoricalCO2 = useMemo(() => {
    return historicalChartData.reduce((acc, curr) => acc + curr.co2, 0);
  }, [historicalChartData]);

  const totalHistoricalBiochar = useMemo(() => {
    return historicalChartData.reduce((acc, curr) => acc + curr.biochar, 0);
  }, [historicalChartData]);

  const totalHistoricalBiomass = useMemo(() => {
    return historicalChartData.reduce((acc, curr) => acc + curr.biomass, 0);
  }, [historicalChartData]);

  const avgMonthlyCO2 = useMemo(() => {
    if (historicalChartData.length === 0) return 0;
    return Math.round(totalHistoricalCO2 / historicalChartData.length);
  }, [totalHistoricalCO2, historicalChartData]);

  const handleUpdateMonthBiomass = (id: string, newBiomass: number) => {
    setMonthlyRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, biomass: Math.max(0, newBiomass) } : r))
    );
  };

  const handleUpdateMonthFeedstock = (id: string, newFeedstock: FeedstockType) => {
    setMonthlyRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, feedstock: newFeedstock } : r))
    );
  };

  const handleSyncCurrentBatchToActiveMonth = () => {
    if (!activeMonthRecord) return;
    const batchBiomass = biomass > 0 ? biomass : 500;
    setMonthlyRecords((prev) =>
      prev.map((r) =>
        r.id === activeMonthRecord.id
          ? { ...r, biomass: batchBiomass, feedstock, notes: `Synced from batch calculator (${batchBiomass} kg)` }
          : r
      )
    );
  };

  const handleApplyPreset = (key: string) => {
    if (PRESET_SCENARIOS[key]) {
      setMonthlyRecords(PRESET_SCENARIOS[key].data);
      setSelectedMonthId(PRESET_SCENARIOS[key].data[0].id);
      setActivePreset(key);
    }
  };

  const handleAddMonth = () => {
    const nextId = String(Date.now());
    const newRecord: MonthlyHistoricalRecord = {
      id: nextId,
      month: newMonthName.trim() || 'New',
      biomass: newMonthBiomass,
      feedstock: newMonthFeedstock,
      notes: 'Added to trajectory'
    };
    setMonthlyRecords((prev) => [...prev, newRecord]);
    setSelectedMonthId(nextId);
    setShowAddMonthModal(false);
  };

  const handleDeleteMonth = (id: string) => {
    if (monthlyRecords.length <= 2) return;
    const filtered = monthlyRecords.filter((r) => r.id !== id);
    setMonthlyRecords(filtered);
    if (selectedMonthId === id && filtered.length > 0) {
      setSelectedMonthId(filtered[0].id);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  if (currentView === 'hub') {
    return <GreenCarbonHub onBackToLanding={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-emerald-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">Green Carbon Valley</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-5">
              <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors text-xs xl:text-sm">What is Biochar?</button>
              <button onClick={() => scrollToSection('mass-production')} className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors text-xs xl:text-sm">Mass Production</button>
              <button onClick={() => scrollToSection('retort-lab')} className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors text-xs xl:text-sm flex items-center gap-1">
                <Rotate3d className="w-3.5 h-3.5" /> 3D Lab
              </button>
              <button onClick={() => scrollToSection('soil-science')} className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors text-xs xl:text-sm flex items-center gap-1">
                <Atom className="w-3.5 h-3.5" /> Soil Science
              </button>
              <button onClick={() => scrollToSection('calculator')} className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors text-xs xl:text-sm">Calculator</button>
              <button onClick={() => scrollToSection('ledger')} className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors text-xs xl:text-sm">Ledger</button>

              <button 
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition-all text-xs font-bold border border-emerald-500/30 shadow-sm"
                title="Ask AI Agronomist / Uliza Mtaalamu wa Kilimo (English & Kiswahili)"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Ask AI</span>
                <span className="text-[10px] font-mono bg-emerald-600/15 text-emerald-800 px-1 py-0.2 rounded">
                  EN|SW
                </span>
              </button>

              <button 
                onClick={() => setCurrentView('hub')} 
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-emerald-400 hover:bg-slate-800 transition-all text-xs font-semibold border border-slate-700 shadow-sm"
                title="Open Platform Engineering & Valley Engine Hub"
              >
                <span>Platform Hub</span>
              </button>

              {/* Firebase Auth button / status */}
              {currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-7 h-7 rounded-full border border-emerald-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="hidden xl:block text-left">
                    <span className="text-[11px] font-bold text-slate-800 block truncate max-w-[90px]">
                      {currentUser.displayName || 'Farmer'}
                    </span>
                  </div>
                  <button
                    onClick={() => logOut()}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOutIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { signInWithGoogle().catch(() => {}); }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all border border-slate-200"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsAiModalOpen(true)}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI</span>
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                <button onClick={() => scrollToSection('about')} className="block w-full text-left text-base font-semibold text-slate-600">What is Biochar?</button>
                <button onClick={() => scrollToSection('mass-production')} className="block w-full text-left text-base font-semibold text-slate-600">Mass Production</button>
                <button onClick={() => scrollToSection('retort-lab')} className="block w-full text-left text-base font-bold text-emerald-700 flex items-center gap-2">
                  <Rotate3d className="w-4 h-4" /> 3D Retort Lab
                </button>
                <button onClick={() => scrollToSection('soil-science')} className="block w-full text-left text-base font-semibold text-slate-600 flex items-center gap-2">
                  <Atom className="w-4 h-4" /> Soil Science & Inoculation
                </button>
                <button onClick={() => scrollToSection('calculator')} className="block w-full text-left text-base font-semibold text-slate-600">Calculator</button>
                <button onClick={() => scrollToSection('ledger')} className="block w-full text-left text-base font-semibold text-slate-600">Verified Ledger</button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-base font-semibold text-slate-600">Contact</button>
                <button 
                  onClick={() => { setIsAiModalOpen(true); setIsMenuOpen(false); }} 
                  className="flex items-center justify-between w-full text-left text-sm font-semibold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Ask AI Agronomist / Uliza AI</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                    EN / SW
                  </span>
                </button>
                <button 
                  onClick={() => { setCurrentView('hub'); setIsMenuOpen(false); }} 
                  className="flex items-center gap-2 w-full text-left text-sm font-semibold text-slate-800 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200"
                >
                  <span>Platform Hub & Valley Engine</span>
                </button>

                {currentUser ? (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{currentUser.displayName || currentUser.email}</span>
                    <button
                      onClick={() => logOut()}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { signInWithGoogle().catch(() => {}); setIsMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-emerald-400" /> Sign In with Google
                  </button>
                )}
                <button onClick={() => scrollToSection('join')} className="block w-full text-center bg-emerald-600 text-white py-3 rounded-xl font-bold">Join the Movement</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                Turn Farm Waste Into <br />
                <span className="text-emerald-600">Wealth & Carbon Capture</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Learn how to produce biochar at home, improve your soil fertility, and fight climate change with simple, local solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => scrollToSection('how-to')}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 group"
                >
                  Learn How to Make Biochar
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('calculator')}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all"
                >
                  Calculate Your Carbon Impact
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://barakaranka.github.io/green-carbon-valley/farmer_1.png" 
                alt="Farmer with Biochar" 
                className="rounded-[40px] shadow-2xl w-full object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/farmer1/800/600";
                }}
              />
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl -z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Biochar Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Green sprout growing from biochar" 
                className="rounded-[40px] shadow-2xl w-full object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/biochar-sprout/800/600";
                }}
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">What is Biochar?</h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Biochar is a carbon-rich charcoal made from agricultural waste through a process called pyrolysis. It's a powerful tool for soil health and climate action.
              </p>
              <ul className="space-y-4">
                {[
                  "Locks carbon in soil for centuries",
                  "Improves water retention and nutrient levels",
                  "Reduces the need for chemical fertilizers",
                  "Made from waste materials like husks and wood"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-semibold text-slate-700">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section id="benefits" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 tracking-tight">Why It Matters</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Soil Fertility", desc: "Biochar creates a permanent home for beneficial microbes and holds onto nutrients.", icon: <Sprout className="w-10 h-10 text-emerald-600" /> },
              { title: "Water Security", desc: "It acts like a sponge, helping crops survive droughts by holding more water in the soil.", icon: <CloudRain className="w-10 h-10 text-blue-600" /> },
              { title: "Climate Action", desc: "Every tonne of biochar produced removes nearly 3 tonnes of CO2 from the atmosphere.", icon: <Leaf className="text-emerald-600 w-10 h-10" /> }
            ].map((benefit, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-slate-100">
                <div className="mb-6 flex justify-center">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Impact Section (Moved to Gallery Position) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Real Impact</h2>
            <p className="text-xl text-slate-600 mb-12">Watch how biochar is transforming farms and capturing carbon in real-world applications.</p>
            
            <div className="max-w-4xl mx-auto bg-slate-100 rounded-[40px] overflow-hidden aspect-video shadow-2xl border-8 border-white">
              <iframe 
                src="https://www.youtube.com/embed/33CBOYVyb6g" 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Biochar Real Impact Video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Make Biochar Section */}
      <section id="how-to" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">How to Make Biochar</h2>
            <p className="text-xl text-slate-600">A simple, step-by-step guide to local production.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Collect Waste", desc: "Gather dry agricultural waste like maize cobs, rice husks, or wood scraps." },
                { step: "02", title: "Pyrolysis Process", desc: "Heat the biomass in a low-oxygen environment using a simple retort kiln." },
                { step: "03", title: "Quench & Apply", desc: "Cool the biochar with water and mix it with compost before applying to soil." }
              ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
                  <span className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-200">{s.step}</span>
                  <h4 className="text-xl font-bold text-slate-900 mt-4 mb-4">{s.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mass Production & Accessibility Section */}
      <section id="mass-production" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6">
                  <Factory className="w-4 h-4" />
                  Industrial Scale Solutions
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Mass Production & Accessibility</h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  We aim to mass-produce biochar and supply it to farmers at an affordable cost, ensuring accessibility even for those unable to produce it themselves. Our focus is to address agriculture waste and invasive weeds such as <span className="text-emerald-600 font-bold underline decoration-emerald-200 underline-offset-4">water hyacinth</span> to turn them into Biochar for carbon sequestration.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Settings className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Modular Design</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">Skid-mounted double drum retort system designed for rapid deployment and decentralized production.</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Safety Certified</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">Equipped with explosion relief panels, flame arrestors, and pressure relief valves for maximum reliability.</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
                <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-6">Technical Specifications</h4>
                <div className="space-y-4">
                  {[
                    { label: "Batch Capacity", value: "100 kg (Typical Batch)" },
                    { label: "Operating Temperature", value: "450 – 550°C" },
                    { label: "Production Cycle", value: "2 – 4 Hours" },
                    { label: "Expected Biochar Yield", value: "25% – 35% by Mass" }
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                      <span className="text-slate-400 text-sm">{spec.label}</span>
                      <span className="font-mono font-bold text-emerald-400">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Reference Documents</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <a href="#" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Technical Specs</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">PDF • 2.4 MB</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Retort Kiln Guide</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">PDF • 1.8 MB</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative lg:sticky lg:top-32"
            >
              <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Project Reference</span>
                    <span className="text-xs font-bold text-slate-900">GCV-RETORT-V1</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-8">Engineering Blueprint</h3>
                
                {/* Technical Drawing Visualization */}
                <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  
                  {/* Retort Drawing */}
                  <div className="relative w-48 h-64">
                    {/* Outer Drum */}
                    <div className="absolute inset-0 border-4 border-slate-400 rounded-full flex items-center justify-center">
                      <div className="absolute -top-4 w-2 h-8 bg-slate-400" />
                      <div className="absolute top-1/4 w-full h-px bg-slate-200" />
                      <div className="absolute bottom-1/4 w-full h-px bg-slate-200" />
                    </div>
                    {/* Inner Drum */}
                    <div className="absolute inset-4 border-2 border-emerald-500 rounded-full flex items-center justify-center bg-emerald-50/30">
                      <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Inner Retort</div>
                    </div>
                    {/* Dimensions */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-full flex flex-col items-center justify-center">
                      <div className="w-px h-full bg-slate-300 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-px bg-slate-300" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-px bg-slate-300" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 rotate-270 mt-2">1500mm</span>
                    </div>
                    <div className="absolute -bottom-10 left-0 w-full flex flex-col items-center">
                      <div className="w-full h-px bg-slate-300 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2 bg-slate-300" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-2 bg-slate-300" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">Ø800mm</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Outer Furnace</p>
                    <p className="text-sm font-bold text-slate-900">6-8mm Mild Steel</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Inner Retort</p>
                    <p className="text-sm font-bold text-slate-900">5-6mm Carbon Steel</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <p className="text-xs font-bold text-blue-700">Skid-mounted for rapid transport to remote farms.</p>
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-50 rounded-full blur-3xl opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>


      {/* Calculator Section */}
      <section id="calculator" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight text-center lg:text-left">Carbon Impact Calculator</h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed text-center lg:text-left">
                Estimate how much biochar you can produce and the CO2 you'll sequester.
              </p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Feedstock Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(Object.keys(FEEDSTOCK_YIELDS) as FeedstockType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFeedstock(type)}
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                          feedstock === type 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-500'
                        }`}
                      >
                        {type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Biomass Amount (kg)</label>
                  <input 
                    type="number" 
                    value={biomass || ''}
                    onChange={(e) => setBiomass(Number(e.target.value))}
                    placeholder="e.g. 500"
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-2xl font-bold focus:border-emerald-600 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl">
              <div className="space-y-10">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Biochar Produced</p>
                    <p className="text-5xl font-black text-slate-900">{result.biochar.toFixed(1)} <span className="text-2xl font-bold text-slate-400">kg</span></p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Leaf className="text-emerald-600 w-8 h-8" />
                  </div>
                </div>
                
                <div className="h-px bg-slate-100" />
                
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">CO₂ Captured</p>
                    <p className="text-5xl font-black text-emerald-600">{result.co2.toFixed(1)} <span className="text-2xl font-bold text-emerald-900/30">kg</span></p>
                  </div>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <CloudRain className="text-blue-600 w-8 h-8" />
                  </div>
                </div>

                <div className="bg-emerald-600 p-8 rounded-3xl text-center text-white shadow-lg shadow-emerald-200">
                  <p className="font-bold text-lg mb-1">Equivalent to</p>
                  <p className="text-4xl font-black">{(result.co2 / 20).toFixed(1)} Trees</p>
                  <p className="text-sm font-medium opacity-80">growing for a whole year!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Monthly Inputs & Dynamic Bar Chart Section */}
          <div className="mt-20 pt-16 border-t border-slate-200">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                  <BarChart3 className="w-4 h-4 text-emerald-600" /> Dynamic Monthly Sequestration
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Historical Monthly Sequestration Potential
                </h3>
                <p className="text-slate-600 mt-2 max-w-2xl text-base">
                  Visualize and model CO₂ sequestration potential and biochar yields based on monthly historical inputs.
                  Select any month or scenario below to tweak biomass feedstocks and observe instant dynamic recalculation.
                </p>
              </div>

              {/* View Switcher Controls & Action */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
                  <button
                    onClick={() => setChartMetricView('both')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      chartMetricView === 'both' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                    }`}
                  >
                    All Metrics
                  </button>
                  <button
                    onClick={() => setChartMetricView('co2')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      chartMetricView === 'co2' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:text-emerald-700'
                    }`}
                  >
                    CO₂ Only
                  </button>
                  <button
                    onClick={() => setChartMetricView('biochar')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      chartMetricView === 'biochar' ? 'bg-sky-600 text-white shadow-sm' : 'hover:text-sky-700'
                    }`}
                  >
                    Biochar Only
                  </button>
                </div>

                <button
                  onClick={() => setShowAddMonthModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add Month
                </button>
              </div>
            </div>

            {/* Historical KPI Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total CO₂ Sequestered</span>
                  <CloudRain className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {(totalHistoricalCO2 / 1000).toFixed(2)} <span className="text-sm font-bold text-emerald-600">tCO₂e</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 font-mono">
                  {totalHistoricalCO2.toLocaleString()} kg cumulative
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Biochar</span>
                  <Leaf className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {totalHistoricalBiochar.toLocaleString()} <span className="text-sm font-bold text-slate-400">kg</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  from {totalHistoricalBiomass.toLocaleString()} kg total biomass
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Annual Tree Eq.</span>
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  ~{Math.round(totalHistoricalCO2 / 20).toLocaleString()} <span className="text-sm font-bold text-slate-400">trees</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  1 tree ≈ 20 kg CO₂ absorption/yr
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Monthly Average</span>
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {avgMonthlyCO2.toLocaleString()} <span className="text-sm font-bold text-slate-400">kg/mo</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 font-mono">
                  across {monthlyRecords.length} recorded months
                </p>
              </div>
            </div>

            {/* Presets & Scenario Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Scenario Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRESET_SCENARIOS).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => handleApplyPreset(key)}
                      className={`text-xs px-3 py-1 rounded-lg font-bold transition-all border ${
                        activePreset === key
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleApplyPreset('baseline')}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors"
                title="Reset to default baseline records"
              >
                <RotateCcw className="w-3 h-3" /> Reset Baseline
              </button>
            </div>

            {/* Main Interactive Workstation: Chart & Active Month Tuner */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Dynamic Recharts Composed Chart Card (8 cols) */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" /> CO₂ & Biochar Yield Trajectory
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visualizing monthly outputs alongside cumulative CO₂ sequestration growth across the season.
                    </p>
                  </div>

                  {/* Filter and series badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <button
                      onClick={() => setChartMetricView('both')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all border ${
                        chartMetricView === 'both'
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All Series
                    </button>
                    <button
                      onClick={() => setChartMetricView('co2')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all border ${
                        chartMetricView === 'co2'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      CO₂ & Cumulative
                    </button>
                    <button
                      onClick={() => setChartMetricView('biochar')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all border ${
                        chartMetricView === 'biochar'
                          ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Biochar Only
                    </button>
                  </div>
                </div>

                {/* Legend badges summary */}
                <div className="flex flex-wrap items-center gap-3 pb-3 mb-2 border-b border-slate-100 text-xs">
                  {chartMetricView !== 'biochar' && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-3 h-3 rounded-sm bg-emerald-600" /> Monthly CO₂ (kg CO₂e)
                    </span>
                  )}
                  {chartMetricView !== 'co2' && (
                    <span className="inline-flex items-center gap-1.5 text-sky-700 font-semibold">
                      <span className="w-3 h-3 rounded-sm bg-sky-600" /> Monthly Biochar (kg)
                    </span>
                  )}
                  {chartMetricView !== 'biochar' && (
                    <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <span className="w-3 h-1 bg-amber-500 rounded-full" /> Cumulative CO₂ Growth (kg CO₂e)
                    </span>
                  )}
                </div>

                {/* The Dynamic Recharts Composed Chart with Bar & Cumulative Line Series */}
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={historicalChartData}
                      margin={{ top: 16, right: 20, left: -4, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis
                        dataKey="month"
                        stroke="#94A3B8"
                        tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#94A3B8"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickLine={false}
                        axisLine={false}
                        unit=" kg"
                      />
                      {chartMetricView !== 'biochar' && (
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#F59E0B"
                          tick={{ fontSize: 11, fill: '#D97706', fontWeight: 600 }}
                          tickLine={false}
                          axisLine={false}
                          unit=" kg"
                        />
                      )}
                      <Tooltip content={<CustomHistoricalTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} />
                      <Legend wrapperStyle={{ paddingTop: 14, fontSize: 12 }} />
                      
                      {chartMetricView !== 'biochar' && (
                        <Bar
                          yAxisId="left"
                          dataKey="co2"
                          name="Monthly CO₂ (kg CO₂e)"
                          fill="#059669"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={44}
                          animationDuration={800}
                        />
                      )}
                      
                      {chartMetricView !== 'co2' && (
                        <Bar
                          yAxisId="left"
                          dataKey="biochar"
                          name="Biochar Output (kg)"
                          fill="#0284c7"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={44}
                          animationDuration={800}
                        />
                      )}

                      {chartMetricView !== 'biochar' && (
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="cumulativeCO2"
                          name="Cumulative CO₂ Growth (kg CO₂e)"
                          stroke="#F59E0B"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: '#D97706', stroke: '#FFFFFF', strokeWidth: 2 }}
                          animationDuration={1000}
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Left axis: Monthly batch yields. Right axis (gold line): Cumulative CO₂ sequestered over trajectory.</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    Standard: 2.8 tCO₂e per tonne biochar (IPCC & IBI)
                  </span>
                </div>
              </div>

              {/* Monthly Inputs Tuner (4 cols) */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" /> Select Month to Tune
                    </h4>
                    {activeMonthRecord && monthlyRecords.length > 2 && (
                      <button
                        onClick={() => handleDeleteMonth(activeMonthRecord.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title={`Remove ${activeMonthRecord.month}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Month Selection Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {monthlyRecords.map((record) => {
                      const isSelected = selectedMonthId === record.id;
                      return (
                        <button
                          key={record.id}
                          onClick={() => setSelectedMonthId(record.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {record.month}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeMonthRecord && (
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Month</p>
                        <p className="text-xl font-black text-slate-900">{activeMonthRecord.month}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated CO₂</p>
                        <p className="text-lg font-black text-emerald-600">
                          {Math.round(activeMonthRecord.biomass * (FEEDSTOCK_YIELDS[activeMonthRecord.feedstock] || 0.25) * CO2_FACTOR).toLocaleString()} kg
                        </p>
                      </div>
                    </div>

                    {/* Biomass Input & Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Biomass Input (kg)
                        </label>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {activeMonthRecord.biomass.toLocaleString()} kg
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="3000"
                        step="50"
                        value={activeMonthRecord.biomass}
                        onChange={(e) => handleUpdateMonthBiomass(activeMonthRecord.id, Number(e.target.value))}
                        className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>50 kg</span>
                        <span>1,500 kg</span>
                        <span>3,000 kg</span>
                      </div>
                    </div>

                    {/* Feedstock Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Feedstock for {activeMonthRecord.month}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(FEEDSTOCK_YIELDS) as FeedstockType[]).map((type) => (
                          <button
                            key={type}
                            onClick={() => handleUpdateMonthFeedstock(activeMonthRecord.id, type)}
                            className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all border text-center ${
                              activeMonthRecord.feedstock === type
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {type.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sync Current Single Batch Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleSyncCurrentBatchToActiveMonth}
                        className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                        Apply Batch ({biomass || 0} kg) to {activeMonthRecord.month}
                      </button>
                    </div>

                    {/* Month Summary Pill */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1 font-mono">
                      <div className="flex justify-between text-slate-500">
                        <span>Biochar Output:</span>
                        <span className="font-bold text-slate-800">
                          {Math.round(activeMonthRecord.biomass * (FEEDSTOCK_YIELDS[activeMonthRecord.feedstock] || 0.25))} kg
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Tree Offset Equiv:</span>
                        <span className="font-bold text-emerald-700">
                          ~{Math.round((activeMonthRecord.biomass * (FEEDSTOCK_YIELDS[activeMonthRecord.feedstock] || 0.25) * CO2_FACTOR) / 20)} trees/yr
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal for Adding a Month */}
            {showAddMonthModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-600" /> Add Monthly Input Record
                    </h4>
                    <button
                      onClick={() => setShowAddMonthModal(false)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Month Name / Code
                    </label>
                    <input
                      type="text"
                      value={newMonthName}
                      onChange={(e) => setNewMonthName(e.target.value)}
                      placeholder="e.g. Jan, Feb, Q1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Biomass Quantity (kg)
                    </label>
                    <input
                      type="number"
                      value={newMonthBiomass}
                      onChange={(e) => setNewMonthBiomass(Number(e.target.value))}
                      placeholder="e.g. 1000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Primary Feedstock
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(FEEDSTOCK_YIELDS) as FeedstockType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewMonthFeedstock(type)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                            newMonthFeedstock === type
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {type.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddMonthModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddMonth}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                    >
                      Add to Timeline
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partnership Slideshow Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-[40px] shadow-2xl aspect-[16/9] bg-slate-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slides[currentSlide].img}
                  alt={slides[currentSlide].title}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/farmer${currentSlide}/1200/800`;
                  }}
                />
              </AnimatePresence>
              
              {/* Slideshow Controls */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentSlide === i ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-2xl font-bold text-slate-800 italic">Our campaign and partnership with Makongi farmers on Biochar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Retort Simulation & Interactive Lab */}
      <section id="retort-lab" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Rotate3d className="w-4 h-4" /> Three.js Interactive Engineering
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Skid-Mounted Double Drum Retort 3D Simulator
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Experience the exact thermodynamics of the decentralized retort system engineered for smallholder clusters. Fire a test batch, balance syngas combustion, and prevent ash burnout.
            </p>
          </div>
          <PyrolysisLab3D />
        </div>
      </section>

      {/* Soil Biochemistry & Science Lab */}
      <section id="soil-science" className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Atom className="w-4 h-4" /> Agro-Ecological Bioscience
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Soil Biochemistry & Biochar Kinetics
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Explore pore size hierarchy, biological nitrogen buffering, and calculate tailor-made biochar prescriptions for acidic sub-Saharan soils.
            </p>
          </div>
          <SoilScienceLab />
        </div>
      </section>

      {/* Verified Production Ledger & Cloud Firestore */}
      <section id="ledger" className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" /> MRV Audit Trail & Firestore
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Decentralized Smallholder Production Ledger
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Live records of batches converted by Makongi farmers, Lake Victoria weed removal teams, and rural cooperatives. Stored securely on Google Cloud Firestore.
            </p>
          </div>
          <VerifiedBatchLedger />
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-24 bg-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to Capture Carbon?</h2>
          <p className="text-xl text-emerald-50 mb-12 leading-relaxed">
            Join hundreds of farmers turning waste into wealth. Get our free guide on building your own retort kiln and starting your biochar journey.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-emerald-200 outline-none focus:bg-white/20 transition-all font-bold"
            />
            <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-xl">
              Get the Guide
            </button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Get in Touch</h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Have questions about biochar or want to collaborate? Reach out to us directly.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-lg font-bold text-slate-900">+254 797 129 778</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-lg font-bold text-slate-900">kevinbaraka52@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">LinkedIn</p>
                    <a 
                      href="https://www.linkedin.com/in/baraka-kevin-9375371a4"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      Baraka Kevin
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
              <form action="https://formspree.io/f/mdalwyla" method="POST" className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                  <textarea 
                    name="message"
                    rows={4}
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600 transition-all font-semibold"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf className="text-white w-6 h-6" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight">Green Carbon Valley</span>
              </div>
              <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
                Empowering farmers to turn waste into wealth and capture carbon from the atmosphere.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-emerald-400 transition-colors">What is Biochar?</button></li>
                <li><button onClick={() => scrollToSection('benefits')} className="hover:text-emerald-400 transition-colors">Why It Matters</button></li>
                <li><button onClick={() => scrollToSection('how-to')} className="hover:text-emerald-400 transition-colors">How to Make It</button></li>
                <li><button onClick={() => scrollToSection('mass-production')} className="hover:text-emerald-400 transition-colors">Mass Production</button></li>
                <li><button onClick={() => scrollToSection('calculator')} className="hover:text-emerald-400 transition-colors">Calculator</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Connect</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="https://www.linkedin.com/in/baraka-kevin-9375371a4" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn</a></li>
                <li><a href="mailto:kevinbaraka52@gmail.com" className="hover:text-emerald-400 transition-colors">kevinbaraka52@gmail.com</a></li>
                <li><a href="tel:+254797129778" className="hover:text-emerald-400 transition-colors">+254 797 129 778</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
            <p>© 2026 Green Carbon Valley. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Ask AI Button */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 group transition-all hover:scale-105 border-2 border-emerald-300"
        title="Consult Valley AI Agronomist / Uliza Mtaalamu wa Kilimo (English & Kiswahili)"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-white" />
        <span className="font-bold text-sm hidden sm:inline">Ask AI Agronomist</span>
        <span className="text-[10px] font-mono bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded-full font-bold">
          EN | SW
        </span>
      </button>

      {/* Gemini AI Assistant Modal */}
      <GeminiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
