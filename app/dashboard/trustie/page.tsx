import { db } from "@/db";
import { assessments, chatSessions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchGeneralChatSession } from "@/lib/chat-db";
import GeneralChat from "./_components/GeneralChat";

export default async function TrustieAdvicePage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { sessionId } = await searchParams;
  const authUser = await getAuthUser();

  if (!authUser?.dbUser) {
    redirect("/login");
  }

  const userId = authUser.dbUser.id;

  // Fetch assessments and chat session in parallel
  const [allUserAssessments, chatSession] = await Promise.all([
    db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt)),
    sessionId
      ? db
          .select()
          .from(chatSessions)
          .where(and(eq(chatSessions.userId, userId), eq(chatSessions.id, parseInt(sessionId))))
          .limit(1)
          .then((res) => res[0])
      : fetchGeneralChatSession(userId),
  ]);
  const initialMessages = chatSession ? (chatSession.messages as any[]) : [];

  const firstName = authUser.dbUser.fullName?.split(" ")[0] || "User";

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col animate-in fade-in duration-700 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <GeneralChat
        allAssessments={allUserAssessments}
        initialMessages={initialMessages}
        userId={authUser.dbUser.id}
        firstName={firstName}
      />
    </div>
  );
}
