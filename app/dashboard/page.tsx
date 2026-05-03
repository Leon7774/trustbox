import Link from "next/link";
import {
  ShieldCheck,
  Key,
  Link as LinkIcon,
  Activity,
  GraduationCap,
} from "lucide-react";
import DashboardCard, { DashboardCardProps } from "./_components/DashboardCard";
import { Item } from "@radix-ui/react-radio-group";
import { getAuthUser } from "@/lib/auth";

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

export default async function Home() {
  const authUser = await getAuthUser();
  const latestScore = authUser?.dbUser?.latestSecurityScore;

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
        <div className="">
          <Link
            href="/tutorial"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-trust-border bg-trust-surface text-slate-200 hover:text-white hover:border-trust-blue/50 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            Open Tutorial
          </Link>
        </div>
      </section>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl ">
        {/* Assessment Card */}
        {dashboardCards.map((card) => {
          return <DashboardCard key={card.title} {...card}></DashboardCard>;
        })}
      </div>
      <section className="w-full max-w-5xl mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-trust-border bg-trust-surface/70 backdrop-blur-md p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
              Your Last Personal Risk Score
            </p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">
                {latestScore != null ? Math.round(latestScore) : "--"}
              </span>
              <span className="text-slate-400 mb-1">/100</span>
            </div>
            <p className="text-sm text-slate-500 mt-3">
              {latestScore != null
                ? "Based on your most recent assessment."
                : "Take your first assessment to generate a score."}
            </p>
          </div>

          <div className="rounded-2xl border border-trust-blue/30 bg-trust-blue/10 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-trust-blue mb-2">
                AI Guidance
              </p>
              <h3 className="text-xl font-semibold text-white">
                Get AI Advice Now
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                Ask Trustie for personalized next steps based on your latest
                security profile.
              </p>
            </div>
            <Link
              href="/dashboard/trustie"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-trust-blue hover:bg-trust-blue/90 text-white px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Get AI Advice Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
