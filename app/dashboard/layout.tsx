import { ReactNode } from "react";
import { getAuthUser } from "@/lib/auth";
import { getChatSessions } from "@/app/actions/chat";
import DashboardLayoutClient from "./_components/DashboardLayoutClient";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getAuthUser();

  if (user?.dbUser && !user.dbUser.finishedTutorial) {
    redirect("/tutorial");
  }

  const chatHistory = user?.dbUser ? await getChatSessions(user.dbUser.id) : [];

  return (
    <DashboardLayoutClient 
      user={user} 
      chatHistory={chatHistory}
    >
      {children}
    </DashboardLayoutClient>
  );
}
