"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, ShieldCheck, Key, Globe, Brain, CheckCircle2, LayoutDashboard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const tools = [
    {
      title: "Initial Assessment",
      description: "Establish your baseline security score with our comprehensive behavioral assessment. Start here to personalize your TrustBox experience.",
      icon: <Brain className="w-8 h-8 text-white" />,
      href: "/dashboard/assessment",
      highlight: true,
      color: "from-trust-blue to-blue-600",
      buttonText: "Start Assessment",
    },
    {
      title: "Password Strength",
      description: "Analyze password length, entropy, and complexity locally. Your credentials never leave your device.",
      icon: <Key className="w-8 h-8 text-white" />,
      href: "/dashboard/tools/password",
      highlight: false,
      color: "from-trust-teal to-emerald-600",
      buttonText: "Test Password",
    },
    {
      title: "URL Analyzer",
      description: "Scan links for structural anomalies and potential phishing indicators before you interact with them.",
      icon: <Globe className="w-8 h-8 text-white" />,
      href: "/dashboard/tools/url",
      highlight: false,
      color: "from-indigo-500 to-purple-600",
      buttonText: "Analyze URL",
    },
    {
      title: "AI Chatbot",
      description: "Get personalized security advice and actionable tips from our intelligent security assistant.",
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      href: "/dashboard",
      highlight: false,
      color: "from-orange-500 to-red-600",
      buttonText: "Ask for Advice",
    }
  ];

  return (
    <div className="min-h-screen bg-trust-dark flex flex-col relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-trust-blue/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-trust-teal/10 blur-[120px]" />
      </div>

      <header className="px-8 py-6 flex items-center justify-between relative z-10 border-b border-trust-border/50 bg-trust-dark/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-blue to-trust-teal flex items-center justify-center text-white shadow-lg shadow-trust-blue/20">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">TrustBox</h1>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-300 hover:text-white gap-2">
            Skip Tutorial <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-trust-blue/10 text-trust-blue text-sm font-medium mb-6 border border-trust-blue/20 shadow-inner shadow-trust-blue/10">
            <CheckCircle2 className="w-4 h-4" /> Welcome to your security journey
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-blue to-trust-teal">Cyber Security</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            TrustBox provides a suite of interactive tools to evaluate, improve, and monitor your personal security posture. Let&apos;s get you started.
          </p>
        </motion.div>

        <div className="w-full max-w-2xl mx-auto relative min-h-[420px] lg:min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`absolute inset-0 rounded-3xl p-[1px] ${
                tools[currentStep].highlight 
                  ? "bg-gradient-to-b from-trust-blue to-trust-blue/10 shadow-2xl shadow-trust-blue/20" 
                  : "bg-trust-border border-trust-border"
              }`}
            >
              <div className="bg-trust-surface/80 backdrop-blur-md h-full rounded-3xl p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
                {tools[currentStep].highlight && (
                  <div className="absolute top-0 right-0 p-6">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trust-blue opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-trust-blue"></span>
                    </span>
                  </div>
                )}
                
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${tools[currentStep].color} flex items-center justify-center mb-8 shadow-xl`}>
                  {tools[currentStep].icon}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">{tools[currentStep].title}</h3>
                <p className="text-slate-400 mb-10 text-lg md:text-xl leading-relaxed max-w-lg">{tools[currentStep].description}</p>
                
                <div className="mt-auto w-full flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Link href={tools[currentStep].href} className="w-full sm:w-auto">
                    <Button 
                      variant={tools[currentStep].highlight ? "default" : "outline"}
                      className={`w-full transition-all gap-2 py-6 px-8 text-lg ${
                        tools[currentStep].highlight 
                          ? "bg-trust-blue hover:bg-trust-blue/90 text-white shadow-lg shadow-trust-blue/20" 
                          : "border-trust-border bg-trust-surface text-slate-300 hover:text-white"
                      }`}
                    >
                      {tools[currentStep].buttonText}
                    </Button>
                  </Link>

                  {currentStep < tools.length - 1 ? (
                    <Button 
                      variant="ghost"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="w-full sm:w-auto py-6 px-8 text-lg text-slate-400 hover:text-white gap-2 bg-trust-dark/50 border border-transparent hover:border-trust-border"
                    >
                      Next Tool <ArrowRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button 
                        variant="ghost"
                        className="w-full py-6 px-8 text-lg text-slate-400 hover:text-white gap-2 bg-trust-dark/50 border border-transparent hover:border-trust-border"
                      >
                        Finish Tutorial <CheckCircle2 className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-3 mt-16 relative z-10">
          {tools.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                idx === currentStep ? "bg-trust-blue w-10 shadow-lg shadow-trust-blue/50" : "bg-trust-border w-3 hover:bg-slate-500"
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
