import Link from 'next/link';
import { ShieldCheck, Key, Link as LinkIcon, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center gap-12 animate-in fade-in duration-1000">
      
      <section className="text-center space-y-4 max-w-3xl mt-12 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-trust-surface border border-trust-border text-xs font-medium text-trust-teal mb-4 backdrop-blur-md">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Behavioral-Based Cyber Risk Scoring</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Quantify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-blue to-trust-teal font-extrabold pb-2">Cyber Resilience</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          TrustBox integrates behavioral assessment with password and URL analysis to generate your Personal Cyber Risk Score and provide personalized AI security guidance.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
        {/* Assessment Card */}
        <Link href="/assessment" className="group relative overflow-hidden rounded-2xl bg-trust-surface border border-trust-border backdrop-blur-xl shadow-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)] hover:border-trust-blue/50">
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
            <ShieldCheck className="w-64 h-64 text-trust-blue transform rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-trust-blue/20 to-trust-blue/5 border border-trust-blue/20 flex items-center justify-center text-trust-blue mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-white tracking-tight">Risk Assessment</h2>
            <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
              Evaluate your cybersecurity behavior based on proven psychological models (HBM & PMT) to reveal hidden vulnerabilities.
            </p>
            <div className="mt-auto flex items-center text-trust-blue font-medium text-sm">
              <span className="group-hover:mr-2 transition-all">Start Assessment</span>
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span>
            </div>
          </div>
        </Link>
        
        {/* Password Checker Card */}
        <Link href="/tools/password" className="group relative overflow-hidden rounded-2xl bg-trust-surface border border-trust-border backdrop-blur-xl shadow-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(20,184,166,0.15)] hover:border-trust-teal/50">
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
            <Key className="w-64 h-64 text-trust-teal transform -rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-trust-teal/20 to-trust-teal/5 border border-trust-teal/20 flex items-center justify-center text-trust-teal mb-6 group-hover:scale-110 transition-transform duration-300">
              <Key className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-white tracking-tight">Password Strength</h2>
            <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
              Analyze password length, entropy, and complexity locally. Your credentials never leave your device.
            </p>
            <div className="mt-auto flex items-center text-trust-teal font-medium text-sm">
              <span className="group-hover:mr-2 transition-all">Test Password</span>
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span>
            </div>
          </div>
        </Link>

        {/* URL Checker Card */}
        <Link href="/tools/url" className="group relative overflow-hidden rounded-2xl bg-trust-surface border border-trust-border backdrop-blur-xl shadow-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(129,140,248,0.15)] hover:border-indigo-400/50">
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
            <LinkIcon className="w-64 h-64 text-indigo-400 transform rotate-45" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <LinkIcon className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-white tracking-tight">URL Analyzer</h2>
            <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
              Scan links for structural anomalies and potential phishing indicators before you interact with them.
            </p>
            <div className="mt-auto flex items-center text-indigo-400 font-medium text-sm">
              <span className="group-hover:mr-2 transition-all">Analyze URL</span>
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
