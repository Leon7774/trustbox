import { ShieldCheck } from "lucide-react";
import AssessmentForm from "@/app/dashboard/tools/assessment/_components/AssessmentForm";

export default function AssessmentPage() {
  return (
    <>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full mb-8 flex flex-col items-center border-b border-border/50 pb-8 rounded-t-xl text-center">
        <h1 className="text-3xl font-bold mb-2">Behavioral Risk Assessment</h1>
        <p className="text-slate-400 text-sm max-w-lg">
          Understanding your personal cybersecurity posture based on Health
          Belief and Protection Motivation theories.
        </p>
      </div>

      <div className="relative z-10 w-full  flex items-center justify-center">
        <AssessmentForm />
      </div>
    </>
  );
}
