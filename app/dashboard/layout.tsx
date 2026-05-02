import { ReactNode } from "react";
import { getAuthUser } from "@/lib/auth";
import { getChatSessions } from "@/app/actions/chat";
import DashboardLayoutClient from "./_components/DashboardLayoutClient";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getAuthUser();
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
