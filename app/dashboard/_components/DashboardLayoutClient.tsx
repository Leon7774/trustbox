"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavButtons from "./NavButtons";
import ChatHistorySidebar from "./ChatHistorySidebar";
import UserNav from "@/components/UserNav";
import { AppUser } from "@/components/providers/UserProvider";
import { ChatSession } from "@/db/schema";

interface DashboardLayoutClientProps {
  children: ReactNode;
  user: AppUser | null;
  chatHistory: ChatSession[];
  topBar?: ReactNode;
}

export default function DashboardLayoutClient({
  children,
  user,
  chatHistory,
  topBar,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const isResultsPage =
    pathname.includes("/tools/assessment/results/") ||
    pathname === "/dashboard/trustie";

  return (
    <div className="flex min-h-screen bg-transparent font-sans antialiased">
      {/* Sidebar - Fixed width for consistency */}
      <aside className="fixed w-64 border-r h-screen border-trust-border bg-trust-surface/30 backdrop-blur-xl flex flex-col z-20">
        <div className="p-6 h-16 flex items-center border-b border-trust-border">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-trust-blue to-trust-teal flex items-center justify-center text-white shadow-lg shadow-trust-blue/20 group-hover:shadow-trust-blue/40 transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              TrustBox
            </h1>
          </Link>
        </div>

        {/* Sidebar Buttons */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {isResultsPage && user?.dbUser ? (
            <ChatHistorySidebar
              userId={user.dbUser.id}
              initialSessions={chatHistory}
            />
          ) : (
            <NavButtons />
          )}
        </nav>

        <div className="flex border-t border-trust-border">
          <Button
            variant="ghost"
            className="flex-1 rounded-none py-8 hover:bg-destructive/40 gap-2"
          >
            <LogOut size={16}></LogOut>
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex z-10 flex-1 flex-col relative ml-64">
        {/* Header / Top Bar */}
        <header className="flex h-16 z-10 items-center justify-between border-b border-trust-border bg-trust-surface z-10 backdrop-blur-2xl px-8 sticky top-0">
          {topBar || (
            <div className="text-sm font-medium text-slate-400">Overview</div>
          )}
          <div className="flex items-center gap-4">
            <button className="relative rounded-full bg-trust-surface border border-trust-border p-2 text-slate-400 hover:text-white hover:border-trust-blue/50 transition-all group">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-trust-blue border-2 border-trust-dark" />
              <Bell className="w-4 h-4 group-hover:animate-pulse" />
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-trust-blue to-trust-teal p-[1px] cursor-pointer hover:scale-105 transition-transform">
              <UserNav></UserNav>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
