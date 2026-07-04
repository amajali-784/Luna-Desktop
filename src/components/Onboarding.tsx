import React, { useState } from 'react';
import { UserConfig } from '../types';
import { Cpu, Monitor, Sparkles, User, Settings, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: (config: UserConfig) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('Alex');
  const [assistantName, setAssistantName] = useState('Luna');
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('cosmic');
  const [selectedModel, setSelectedModel] = useState('Llama-3.2-3B-Instruct (Local)');
  const [personality, setPersonality] = useState('warm');

  const models = [
    { name: 'Llama-3.2-3B-Instruct (Local)', size: '3.2B', desc: 'Fast, efficient, excellent for standard automated desktop operations on consumer laptops.' },
    { name: 'Gemma-2-2B-IT (Local)', size: '2.6B', desc: 'Google-optimized lightweight instruction model. High reasoning quality with minimal memory footprint.' },
    { name: 'Qwen-2.5-Coder-7B (Local)', size: '7.2B', desc: 'Optimized for desktop script generations, automations, and markdown parsing tasks.' },
    { name: 'Phi-4-Mini-3.8B (Local)', size: '3.8B', desc: 'Microsoft research grade, exceptional for logic, smart JSON structuring, and memory operations.' }
  ];

  const handleFinish = () => {
    onComplete({
      userName,
      assistantName,
      language,
      theme,
      selectedModel,
      personality,
      voiceEnabled: true,
      textToSpeech: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-white tracking-tight">Luna Desktop</h1>
              <p className="text-xs text-slate-400 font-mono">ONBOARDING PIPELINE</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className={`w-8 h-1 rounded-full transition-all duration-300 ${
                  step === num ? 'bg-blue-500 w-12' : step > num ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME & PRIVACY VISION */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center py-4">
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                Privacy-First, Local-First AI
              </h2>
              <p className="text-slate-300 mt-2 text-sm max-w-lg mx-auto">
                Welcome to your ultimate desktop companion. Luna runs advanced open-source models natively, keeping your workspace conversations, notes, and file automations completely private.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold">Zero Cloud Leakage</h4>
                  <p className="text-slate-400 text-xs mt-1">Files, documents, and transcripts are indexed locally and never sold to advertisers.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold">Native Task Automation</h4>
                  <p className="text-slate-400 text-xs mt-1">Directly draft emails, organize downloaded files, create notes, and trigger IoT devices safely.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">i</div>
              <p className="text-blue-200/80 text-xs leading-relaxed">
                Luna utilizes advanced server proxy mechanisms for high-fidelity prototype rendering, simulating local LLM performance, latency metrics, and hardware pipelines.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                id="onboard-next-1"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
              >
                Configure Settings <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PERSONALIZATION & THEMES */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center py-2">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Setup Your Persona</h2>
              <p className="text-slate-400 text-sm mt-1">Luna adapts to your personal style and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Name input */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-mono uppercase block">Your Identity Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    id="setup-username"
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Assistant Name input */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-mono uppercase block">Assistant Name</label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    id="setup-assistantname"
                    type="text" 
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-mono uppercase block">System Language</label>
                <select 
                  id="setup-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="English">English (US)</option>
                  <option value="Spanish">Español (ES)</option>
                  <option value="German">Deutsch (DE)</option>
                  <option value="French">Français (FR)</option>
                  <option value="Hindi">हिन्दी (IN)</option>
                </select>
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-mono uppercase block">Visual Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cosmic', label: 'Cosmic Slate', color: 'bg-slate-900 border-indigo-600' },
                    { id: 'polar', label: 'Polar Light', color: 'bg-zinc-900 border-cyan-600' },
                    { id: 'cyber', label: 'Classic Cyber', color: 'bg-zinc-950 border-emerald-600' }
                  ].map((t) => (
                    <button
                      id={`theme-select-${t.id}`}
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`py-2 px-3 text-xs rounded-xl border font-medium cursor-pointer transition-all ${
                        theme === t.id 
                          ? `${t.color} text-white shadow-md` 
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assistant Personality */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs text-slate-400 font-mono uppercase block">Luna's Personality Tone</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'warm', label: 'Warm & Encouraging' },
                    { id: 'professional', label: 'Professional Executive' },
                    { id: 'geeky', label: 'Geeky & Technical' },
                    { id: 'witty', label: 'Witty & Conversational' }
                  ].map((p) => (
                    <button
                      id={`personality-select-${p.id}`}
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={`py-2 px-3 text-xs rounded-xl border font-medium cursor-pointer transition-all ${
                        personality === p.id 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button 
                id="onboard-back-2"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Back
              </button>
              <button 
                id="onboard-next-2"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                Local Model Choice <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: MODEL CONFIGURATION */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center py-2">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Select Local Open-Source AI</h2>
              <p className="text-slate-400 text-sm mt-1">Select the model size matching your device's hardware specs</p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {models.map((model) => (
                <div 
                  key={model.name}
                  onClick={() => setSelectedModel(model.name)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedModel === model.name 
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10' 
                      : 'bg-slate-850/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${selectedModel === model.name ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-white text-sm font-semibold">{model.name}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 font-semibold">{model.size}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">{model.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl flex gap-3">
              <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 text-sm font-mono font-bold">!</div>
              <div className="text-xs text-amber-200/80 leading-relaxed">
                <strong>Hardware Recommendation:</strong> 3B - 4B models require ~8GB of RAM. 7B models require 16GB+ RAM and a dedicated graphics processing pipeline for optimal execution speed.
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button 
                id="onboard-back-3"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Back
              </button>
              <button 
                id="onboard-finish"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Deploy Companion <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
