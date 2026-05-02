import Link from "next/link";
import { ShieldCheck, Key, Link as LinkIcon, Activity } from "lucide-react";
import DashboardCard, { DashboardCardProps } from "./_components/DashboardCard";
import { Item } from "@radix-ui/react-radio-group";

const dashboardCards: DashboardCardProps[] = [
  {
    title: "Risk Assessment",
    href: "/dashboard/tools/assessment",
    icon: ShieldCheck,
    description:
      "Evaluate your digital habits and security posture to reveal hidden vulnerabilities.",
    callToAction: "Start Assessment",
  },
  {
    title: "Password Strength",
    description:
      "Analyze password length, entropy, and complexity locally. Your credentials never leave your device.",
    callToAction: "Test Password",
    href: "/dashboard/tools/password",
    icon: Key,
  },
  {
    title: "URL Analyzer",
    description:
      "Scan links for structural anomalies and potential phishing indicators before you interact with them.",
    href: "/dashboard/tools/url",
    callToAction: "Analyze URL",
    icon: LinkIcon,
  },
];

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center gap-12 animate-in fade-in duration-1000">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mt-12 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-trust-surface border border-trust-border text-xs font-medium text-trust-teal mb-4 backdrop-blur-md">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Interactive Cyber Risk Scoring</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Quantify Your{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-trust-blue to-trust-teal font-extrabold pb-2">
            Cyber Resilience
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          TrustBox integrates risk assessment with password and URL analysis to
          generate your Personal Cyber Risk Score and provide personalized AI
          security guidance.
        </p>
      </section>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8 mb-24">
        {/* Assessment Card */}
        {dashboardCards.map((card) => {
          return <DashboardCard key={card.title} {...card}></DashboardCard>;
        })}
      </div>
    </div>
  );
}
