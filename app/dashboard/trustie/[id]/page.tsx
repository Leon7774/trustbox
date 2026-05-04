import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AssessmentChat from "../_components/AssessmentChat";
import { getAuthUser } from "@/lib/auth";
import { fetchChatSession } from "@/lib/chat-db";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AssessmentChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Parallelize Auth and Assessment fetch
  const [authUser, assessment] = await Promise.all([
    getAuthUser(),
    id === "mock-dev-id" && process.env.NODE_ENV === "development"
      ? Promise.resolve({
          id: 99999,
          userId: 1, // Will be updated below if authUser exists
          behavioralScore: 85,
          totalScore: 85,
          riskLevel: "Low",
          rawResponses: { B1: 100, B2: 75, B3: 100, B4: 50 },
        })
      : db
          .select()
          .from(assessments)
          .where(eq(assessments.id, parseInt(id)))
          .then((res) => res[0]),
  ]);

  if (!assessment) return notFound();

  // If mock, ensure userId matches authUser
  if (id === "mock-dev-id" && authUser?.dbUser) {
    (assessment as any).userId = authUser.dbUser.id;
  }

  // Fetch existing chat session if any
  const chatSession = authUser?.dbUser
    ? await fetchChatSession(authUser.dbUser.id, assessment.id)
    : null;
  const initialMessages = chatSession ? (chatSession.messages as any[]) : [];

  return (
    <div className="w-full p-8 h-[calc(100vh-64px)] flex flex-col animate-in fade-in duration-700 relative overflow-hidden">
      {/* Back link */}
      <div className="shrink-0 px-4 pb-2 border-b border-white/10 flex items-center gap-2 z-10">
        <Link
          href={`/dashboard/tools/assessment/results/${id}`}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Results
        </Link>
        <span className="text-white/20 text-sm">·</span>
        <span className="text-sm text-slate-500">
          Risk Level:{" "}
          <span
            className={
              assessment.riskLevel === "Low"
                ? "text-green-400"
                : assessment.riskLevel === "High"
                  ? "text-red-400"
                  : "text-yellow-400"
            }
          >
            {assessment.riskLevel}
          </span>{" "}
          · Score:{" "}
          <span className="text-white">{assessment.totalScore}/100</span>
        </span>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-h-0">
        <AssessmentChat
          assessmentData={assessment}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
