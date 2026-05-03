"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  MessageSquare,
  Trash2,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getChatSessions, deleteChatSession } from "@/app/actions/chat";
import { ChatSession } from "@/db/schema";
import { formatDistanceToNow } from "date-fns";

export default function ChatHistorySidebar({ 
  userId,
  initialSessions = []
}: { 
  userId: number;
  initialSessions?: ChatSession[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this chat history?")) {
      const result = await deleteChatSession(id);
      if (result.success) {
        setSessions(sessions.filter((s) => s.id !== id));
        // If we are currently on this chat's page, we might want to stay there but it won't have history anymore
      }
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-left duration-300">
      <div className="px-2 mb-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-400 hover:text-white mb-2"
          onClick={() => router.push("/dashboard")}
        >
          <ChevronLeft className="w-4 h-4" />
          Main Dashboard
        </Button>
        
        <div className="h-px bg-trust-border my-4" />
        
        <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Recent Advice
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No chat history yet.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = pathname === `/dashboard/trustie/${session.assessmentId}`;

            return (
              <Link
                key={session.id}
                href={`/dashboard/trustie/${session.assessmentId}`}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-trust-blue/10 border border-trust-blue/20 text-white shadow-[0_0_15px_-5px_rgba(0,163,255,0.2)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className={`shrink-0 w-2 h-2 rounded-full ${isActive ? "bg-trust-blue shadow-[0_0_8px_rgba(0,163,255,0.8)]" : "bg-slate-700"}`} />
                
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{session.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Link>
            );
          })
        )}
      </div>

      <div className="mt-auto p-4 bg-trust-blue/5 border border-trust-blue/10 rounded-2xl m-2">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-trust-blue" />
          <span className="text-[11px] font-bold uppercase tracking-tighter text-trust-blue">Trustie Premium</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Your security advisor remembers your context across sessions.
        </p>
      </div>
    </div>
  );
}
