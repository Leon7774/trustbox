import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AssessmentChat from "./_components/AssessmentChat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ChevronDown } from "lucide-react";
import Link from "next/link";

export default async function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Developer Bypass if Supabase is asleep
  let assessment;
  if (id === "mock-dev-id" && process.env.NODE_ENV === "development") {
    assessment = {
      id: 99999,
      behavioralScore: 85,
      passwordScore: 40,
      urlScore: 65,
      totalScore: 63,
      riskLevel: "Medium",
    };
  } else {
    assessment = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, parseInt(id)))
      .then((res) => res[0]);
  }

  if (!assessment) return notFound();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col animate-in fade-in duration-700 relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full shrink-0 flex flex-col items-center pt-8 md:pt-12 px-4 z-10  bg-background">
        {/* Header Options */}
        <div className="mb-8 border-b border-white/10 pb-6 w-full max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Your TrustBox Results
          </h1>
          <p className="text-slate-400 mt-2">
            Interact with your personalized AI guidance below.
          </p>
        </div>

        {/* Collapsible Score Container */}
        <div className="w-full max-w-4xl relative">
          <details className="w-full group bg-surface border border-white/10 rounded-2xl mb-8 overflow-hidden shadow-2xl [&_summary::-webkit-details-marker]:hidden">
            <summary className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors outline-none list-none">
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-[0_0_20px_-5px_currentColor] 
                ${
                  assessment.riskLevel === "Low"
                    ? "border-green-500 text-green-500"
                    : assessment.riskLevel === "High"
                      ? "border-red-500 text-red-500"
                      : "border-yellow-500 text-yellow-500"
                }`}
                >
                  {assessment.riskLevel === "High" ? (
                    <ShieldAlert className="w-6 h-6" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-white">
                    Risk Level: {assessment.riskLevel}
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Final Score: {assessment.totalScore}/100 —{" "}
                    <span className="text-brand-primary">
                      Tap to expand details
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </summary>
            <div className="p-6 border-t border-white/10 bg-background/30 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
              <Card className="bg-surface/50 border-white/5">
                <CardContent className="p-5 flex flex-col items-center">
                  <span className="text-3xl font-bold text-white mb-2">
                    {assessment.behavioralScore}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Behavioral Score
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-surface/50 border-white/5">
                <CardContent className="p-5 flex flex-col items-center">
                  <span className="text-3xl font-bold text-white mb-2">
                    {assessment.passwordScore}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Password Score
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-surface/50 border-white/5">
                <CardContent className="p-5 flex flex-col items-center">
                  <span className="text-3xl font-bold text-white mb-2">
                    {assessment.urlScore}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    URL Score
                  </span>
                </CardContent>
              </Card>
            </div>
          </details>
        </div>
      </div>

      {/* AI Streamed Chat Base */}
      <div className="w-full flex-1 flex flex-col relative z-20">
        <AssessmentChat assessmentData={assessment} />
      </div>

      <div className="w-full shrink-0 bg-background flex justify-center py-6 border-t border-white/10 z-20">
        <Link href="/tools/assessment">
          <Button variant="link" className="text-slate-400 hover:text-white">
            ← Take Another Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
}
