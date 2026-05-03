import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ShieldAlert, ShieldCheck, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { questionsByLevel } from "../../_components/questions";
import { getAuthUser } from "@/lib/auth";

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

  const riskColor =
    assessment.riskLevel === "Low"
      ? "border-green-500 text-green-500 shadow-green-500/20"
      : assessment.riskLevel === "High"
        ? "border-red-500 text-red-500 shadow-red-500/20"
        : "border-yellow-500 text-yellow-500 shadow-yellow-500/20";

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center border-b border-white/10 pb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Assessment Results
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Completed on{" "}
          {"createdAt" in assessment
            ? new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date((assessment as any).createdAt))
            : "just now"}
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div
          className={`w-24 h-24 shrink-0 rounded-full border-4 flex items-center justify-center shadow-[0_0_30px_-5px_currentColor] ${riskColor}`}
        >
          {assessment.riskLevel === "High" ? (
            <ShieldAlert className="w-10 h-10" />
          ) : (
            <ShieldCheck className="w-10 h-10" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">
            Risk Level
          </p>
          <h2 className="text-4xl font-bold text-white mb-2">
            {assessment.riskLevel}
          </h2>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  assessment.riskLevel === "Low"
                    ? "bg-green-500"
                    : assessment.riskLevel === "High"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
                style={{ width: `${assessment.totalScore}%` }}
              />
            </div>
            <span className="text-white font-bold text-lg">
              {assessment.totalScore}
              <span className="text-slate-500 font-normal text-sm">/100</span>
            </span>
          </div>
        </div>
        <Link href={`/dashboard/trustie/${id}`}>
          <Button
            size="lg"
            className="bg-trust-blue hover:bg-trust-blue/90 text-white gap-2 rounded-xl shadow-lg shadow-trust-blue/20 transition-all hover:shadow-trust-blue/40 hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            Get AI Advice
          </Button>
        </Link>
      </div>

      {/* Response Breakdown */}
      <div>
        <h3 className="text-white font-bold text-sm uppercase tracking-wider opacity-50 mb-4">
          Detailed Response Breakdown
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(
            (assessment.rawResponses as Record<string, number>) || {},
          ).map(([qId, score]) => {
            const question = allQuestions.find((q) => q.id === qId);
            const scoreColor =
              score >= 75
                ? "text-green-500"
                : score >= 45
                  ? "text-yellow-500"
                  : "text-red-500";
            const barColor =
              score >= 75
                ? "bg-green-500"
                : score >= 45
                  ? "bg-yellow-500"
                  : "bg-red-500";

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
                      className={`h-full transition-all duration-1000 ${barColor}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold min-w-[3ch] text-right ${scoreColor}`}>
                    {score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center pt-4">
        <Link href={`/dashboard/trustie/${id}`}>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-trust-blue/30 text-trust-blue hover:bg-trust-blue/10"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with Trustie AI about your results
          </Button>
        </Link>
      </div>
    </div>
  );
}
