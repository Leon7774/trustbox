import { ShieldCheck } from "lucide-react";
import AssessmentForm from "@/components/AssessmentForm";

export default function AssessmentPage() {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center animate-in fade-in duration-700">
      <div className="w-full bg-trust-surface border border-trust-border rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-trust-blue/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full mb-8 flex flex-col items-center border-b border-trust-border/50 pb-8 rounded-t-xl text-center">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-trust-blue to-trust-teal bg-clip-text text-transparent">Behavioral Risk Assessment</h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Understanding your personal cybersecurity posture based on Health Belief and Protection Motivation theories.
            </p>
        </div>

        <div className="relative z-10 w-full min-h-[400px] flex items-center justify-center">
          <AssessmentForm />
        </div>
      </div>
    </div>
  );
}
