import { getAuthUser } from "@/lib/auth";
import { BotIcon, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TrustieAdvicePage() {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect("/login");
  }

  const firstName = authUser.dbUser?.fullName?.split(" ")[0] || "User";

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center animate-in fade-in duration-700 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full text-center px-4 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-trust-blue to-trust-teal rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-trust-blue/30 mx-auto mb-8 animate-bounce-subtle">
          <BotIcon className="w-10 h-10" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Hello, {firstName}!
        </h1>
        <p className="text-xl text-slate-400 mb-12">
          How can I assist you today with your security posture?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-surface border border-white/10 rounded-2xl text-left hover:border-trust-blue/50 transition-all cursor-pointer group">
            <ShieldCheck className="w-6 h-6 text-trust-blue mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold mb-2">Review Vulnerabilities</h3>
            <p className="text-sm text-slate-500">Pick a previous assessment from the sidebar to dive back into specific advice.</p>
          </div>
          <div className="p-6 bg-surface border border-white/10 rounded-2xl text-left hover:border-trust-blue/50 transition-all cursor-pointer group">
            <BotIcon className="w-6 h-6 text-trust-teal mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold mb-2">Security Best Practices</h3>
            <p className="text-sm text-slate-500">I can explain complex security concepts in simple terms. Select a session to start chatting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
