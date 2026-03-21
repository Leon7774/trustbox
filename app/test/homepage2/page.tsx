import React from 'react';
import Head from 'next/head';

// Extracted data to keep JSX clean
const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', active: false },
  { icon: 'security', label: 'Assessment', active: true },
  { icon: 'construction', label: 'Toolkit', active: false },
  { icon: 'analytics', label: 'Risk Report', active: false },
  { icon: 'library_books', label: 'Resources', active: false },
];

const QUIZ_OPTIONS = [
  "Click the link immediately to secure my account.",
  "Hover over the link to verify the true URL destination.",
  "Mark as spam and navigate to the official portal manually.",
  "Ignore the email as I haven't logged in recently."
];

export default function SecurityAssessment() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-body">
      <Head>
        <title>TrustBox | Cybersecurity Assessment</title>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </Head>

      {/* Sidebar */}
      <aside className="fixed left-0 top-15 h-screen w-64 bg-surface dark:bg-slate-950 flex flex-col py-8 px-4 transition-transform duration-300 ease-in-out border-r border-outline-variant/10">
        <div className="mb-12 px-4">
          <div className="text-2xl font-bold tracking-tighter text-blue-700 dark:text-blue-400">TrustBox</div>
          <div className="text-[0.6875rem] uppercase tracking-[0.05em] font-semibold text-slate-500 mt-1">Cybersecurity Assessment</div>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active 
                  ? 'relative text-primary dark:text-blue-400 bg-primary/5 dark:bg-blue-900/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              {item.active && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"></div>}
              <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className={`text-[0.6875rem] uppercase tracking-[0.05em] ${item.active ? 'font-extrabold' : 'font-semibold'}`}>
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-outline-variant/10 pt-6">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-blue-600 transition-all" href="#">
            <span className="material-symbols-outlined">help_outline</span>
            <span className="text-[0.6875rem] uppercase tracking-[0.05em] font-semibold">Help Center</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-blue-600 transition-all" href="#">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-[0.6875rem] uppercase tracking-[0.05em] font-semibold">Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 min-h-screen relative flex flex-col">
        {/* Header */}
        <header className="fixed top-12 right-0 left-64 z-40 h-16 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-end items-center px-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors active:scale-95 duration-200">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
            </div>
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors active:scale-95 duration-200">settings</span>
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant/20">
              <img alt="User profile avatar" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=SecurityPro" />
            </div>
          </div>
        </header>

        <section className="mt-16 p-12 max-w-5xl mx-auto w-full flex-1">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-[0.6875rem] uppercase tracking-[0.05em] font-bold text-primary">Cybersecurity</span>
            <span className="text-outline-variant text-[0.6875rem]">•</span>
            <span className="text-[0.6875rem] uppercase tracking-[0.05em] font-semibold text-on-surface-variant">Behavioral Assessment</span>
          </div>

          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-8">
              <h2 className="text-[3.5rem] font-extrabold tracking-tight leading-tight text-on-surface mb-4">
                The Digital <span className="text-primary-container">Vigilance</span> Test
              </h2>
              <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Assess your instinctive reactions to common digital threats. This scenario-based evaluation measures your defensive posture in high-pressure situations.
              </p>
            </div>
            <div className="col-span-4 flex flex-col justify-end items-end">
              <div className="text-right">
                <div className="text-[0.6875rem] uppercase tracking-[0.05em] font-bold text-on-surface-variant mb-2">Completion Progress</div>
                <div className="text-4xl font-extrabold text-primary">25%</div>
              </div>
            </div>
          </div>

          <div className="w-full h-1 bg-surface-container-high rounded-full mb-16 overflow-hidden">
            <div className="h-full w-[25%] bg-gradient-to-r from-primary to-primary-container rounded-full"></div>
          </div>

          {/* Assessment Module */}
          <div className="relative mb-12">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-fixed/30 blur-3xl rounded-full -z-10"></div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-10 flex flex-col md:flex-row gap-12 relative z-0">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">Q4</span>
                  <span className="text-[0.6875rem] uppercase tracking-[0.05em] font-bold text-tertiary">Urgent Scenario</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-6 leading-snug">
                  You receive an email from "System Security" claiming an unauthorized login. It includes a button labeled "Review Activity Now" pointing to a link that looks slightly altered (e.g., <span className="italic text-primary-container">trust-box.secure-auth.com</span>).
                </h3>
                <div className="aspect-video w-full rounded-lg bg-surface-container-low flex items-center justify-center overflow-hidden border border-outline-variant/10">
                  <img alt="Email scenario visual" className="w-full h-full object-cover opacity-80 mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" />
                </div>
              </div>

              <div className="w-full md:w-80 flex flex-col justify-center">
                <div className="space-y-4">
                  {QUIZ_OPTIONS.map((option, idx) => (
                    <label key={idx} className="group flex items-start gap-4 p-4 rounded-lg border border-outline-variant/15 bg-surface-container-low hover:bg-surface-container-lowest hover:border-primary/50 transition-all cursor-pointer">
                      <input className="mt-1 w-4 h-4 text-primary focus:ring-primary-container border-outline-variant" name="assessment" type="radio" />
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-12 flex justify-between items-center">
                  <button className="text-on-surface-variant font-semibold text-sm hover:underline transition-all">Previous</button>
                  <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded text-sm font-bold shadow-sm active:scale-95 duration-200 flex items-center gap-2">
                    Next
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Guidance */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl p-8 border border-white/10 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Personalized AI Guidance</h4>
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-widest">Powered by TrustBox AI</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                      <p className="text-sm text-blue-100 italic leading-relaxed">
                        "Based on your previous choices in the 'Social Engineering' section, you tend to prioritize speed over verification. For this specific scenario, remember that urgent tone is a classic phishing indicator."
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-green-400 text-sm mt-1">check_circle</span>
                      <p className="text-xs text-slate-300">Your defensive score is currently 15% higher than your peer group average in URL detection.</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Recommended Action</div>
                    <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-100 flex items-center gap-3">
                      <span className="material-symbols-outlined text-blue-400">psychology</span>
                      Always verify the Top-Level Domain (TLD) before interacting with security-themed links.
                    </div>
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors self-start">
                      LEARN WHY <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="bg-tertiary px-4 py-1.5 rounded flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-[1rem]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-white">TrustBox Verified Assessment</span>
            </div>
          </div>
        </section>

        <footer className="mt-auto px-12 py-8 bg-surface-container-low flex justify-between items-center">
          <div className="flex gap-4 text-[0.6875rem] font-semibold text-outline tracking-wider uppercase">
            <span>Est. Completion: 8 mins</span>
            <span>•</span>
            <span>Category: Phishing Defense</span>
            <span>•</span>
            <span>Ref ID: TB-2024-001</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-outline-variant">lock_open</span>
            <span className="text-[0.6875rem] text-on-surface-variant italic font-medium">Session secured with end-to-end encryption.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}