import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AssessmentChat from "./_components/AssessmentChat";
import { ShieldAlert, ShieldCheck, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { questionsByLevel } from "../../_components/questions";
import { getAuthUser } from "@/lib/auth";
import { getChatSession } from "@/app/actions/chat";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const allQuestions = Object.values(questionsByLevel).flat();
  const authUser = await getAuthUser();

  // Developer Bypass if Supabase is asleep
  let assessment;
  if (id === "mock-dev-id" && process.env.NODE_ENV === "development") {
    assessment = {
      id: 99999,
      userId: authUser?.dbUser?.id || 1,
      behavioralScore: 85,
      totalScore: 85,
      riskLevel: "Low",
      rawResponses: {
        B1: 100,
        B2: 75,
        B3: 100,
        B4: 50,
      },
    };
  } else {
    assessment = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, parseInt(id)))
      .then((res) => res[0]);
  }

  if (!assessment) return notFound();

  // Fetch existing chat session if any
  const chatSession = authUser?.dbUser
    ? await getChatSession(authUser.dbUser.id, assessment.id)
    : null;
  const initialMessages = chatSession ? (chatSession.messages as any[]) : [];

  return (
    <div className="w-[calc(100%+4rem)] -m-8 h-[calc(100vh-16)] flex flex-col animate-in fade-in duration-700 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full shrink-0 flex flex-col items-center pt-8 md:pt-12 px-4 z-10 ">
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
            <div className="p-6 border-t border-white/10 bg-background/30 space-y-4 animate-in slide-in-from-top-4 duration-300">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider opacity-50 mb-4">
                Detailed Response Breakdown
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(
                  (assessment.rawResponses as Record<string, number>) || {},
                ).map(([qId, score]) => {
                  const question = allQuestions.find((q) => q.id === qId);
                  return (
                    <div
                      key={qId}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex-1 mr-4">
                        <p className="text-slate-200 text-sm font-medium">
                          {question?.text || qId}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                          {question?.construct || "Behavioral Metric"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden hidden md:block">
                          <div
                            className={`h-full transition-all duration-1000 ${
                              score >= 75
                                ? "bg-green-500"
                                : score >= 45
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span
                          className={`text-sm font-bold min-w-[3ch] text-right ${
                            score >= 75
                              ? "text-green-500"
                              : score >= 45
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        >
                          {score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* AI Streamed Chat Base */}
      <div className="w-[calc(100%+4rem)] -m-8 h-[calc(100vh-4rem)] md:h-[calc(100vh-64px)] flex flex-col animate-in fade-in duration-700 relative overflow-hidden bg-background">
        <AssessmentChat
          assessmentData={assessment}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
