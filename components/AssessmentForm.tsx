"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Activity, Zap } from "lucide-react";
import { submitAssessmentAction } from "@/app/actions/assessment";
import zxcvbn from "zxcvbn";

const questions = [
  {
    id: "q1",
    text: "How often do you use the same password across multiple accounts?",
    options: [
      { text: "Always", score: 0 },
      { text: "Mostly", score: 25 },
      { text: "Rarely", score: 75 },
      { text: "Never", score: 100 },
    ],
    trait: "Behavioral",
  },
  {
    id: "q2",
    text: "Before clicking a link in an unexpected email, what do you usually do?",
    options: [
      { text: "Click immediately to see what it is", score: 0 },
      { text: "Check if the sender name looks familiar", score: 30 },
      { text: "Hover over the link to reveal the actual URL", score: 80 },
      { text: "Verify with the sender via a different channel", score: 100 },
    ],
    trait: "Behavioral",
  },
  {
    id: "q3",
    text: "If a highly sensitive account requires 2-Factor Authentication (2FA), how do you typically feel?",
    options: [
      { text: "I find it annoying and try to bypass it", score: 0 },
      { text: "I do it because I have to, but I dislike it", score: 40 },
      { text: "I appreciate the extra security layer", score: 90 },
      { text: "I proactively enable 2FA on all my accounts", score: 100 },
    ],
    trait: "Behavioral",
  },
];

export default function AssessmentForm() {
  const [step, setStep] = useState(0); // 0 = start, 1-3 = questions, 4 = password, 5 = loading, 6 = results
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Sub-scores
  const [behavioralScore, setBehavioralScore] = useState(0);
  const [passwordScore, setPasswordScore] = useState(0);
  const [urlScore, setUrlScore] = useState(100); // We'll simplify and infer URL score from Question 2 for the flow, or set a default.
  
  // Final Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">("Medium");
  const [aiGuidance, setAiGuidance] = useState("");

  const [testPassword, setTestPassword] = useState("");

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    
    if (step < questions.length) {
      setStep(step + 1);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsSubmitting(true);
    setStep(5); // Loading stage
    
    // 1. Calculate Behavioral Score from Qs
    const bScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0) / questions.length;
    
    // 2. Calculate Password Score via zxcvbn
    const pwResult = zxcvbn(testPassword);
    const pScore = (pwResult.score / 4) * 100;

    // 3. Assume URL score based on Q2 (id: q2)
    const uScore = answers["q2"] || 50;

    setBehavioralScore(bScore);
    setPasswordScore(pScore);
    setUrlScore(uScore);

    // 4. Calculate Final Aggregated Cyber Risk Score (Weighted: 40% Behavior, 30% Password, 30% URL)
    const tScore = Math.min(100, Math.round((bScore * 0.4) + (pScore * 0.3) + (uScore * 0.3)));
    setFinalScore(tScore);

    let risk: "Low" | "Medium" | "High" = "High";
    if (tScore >= 75) risk = "Low";
    else if (tScore >= 45) risk = "Medium";

    setRiskLevel(risk);

    // 5. Submit to DB & AI
    const res = await submitAssessmentAction({
      behavioralScore: bScore,
      passwordScore: pScore,
      urlScore: uScore,
      totalScore: tScore,
      riskLevel: risk,
      rawResponses: answers,
    });

    if (res.success && res.recommendations) {
      setAiGuidance(res.recommendations);
    } else {
      setAiGuidance("- Enable Multi-Factor Authentication immediately.\n- Adopt a dedicated password manager.\n- Hover and inspect URLs thoroughly before clicking.");
    }

    setIsSubmitting(false);
    setStep(6); // Results
  };

  if (step === 0) {
    return (
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-full bg-trust-blue/10 border border-trust-blue/20 flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-trust-blue" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Discover Your Risk Profile</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Answer a few behavioral questions and test your daily password. TrustBox will calculate your Personal Cyber Risk Score.
        </p>
        <button
          onClick={() => setStep(1)}
          className="group flex items-center gap-2 bg-gradient-to-r from-trust-blue to-trust-teal text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
        >
          Begin Evaluation
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  if (step > 0 && step <= questions.length) {
    const q = questions[step - 1];
    return (
      <div className="w-full flex flex-col animate-in slide-in-from-right-8 fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <span className="text-trust-teal text-sm font-medium">Question {step} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < step ? "bg-trust-teal" : "bg-trust-border"}`} />
            ))}
            <div className={`h-1.5 w-6 rounded-full bg-trust-border`} /> {/* Password step */}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-6 leading-tight max-w-2xl">{q.text}</h3>
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(q.id, opt.score)}
              className="w-fulltext-left p-4 rounded-xl border border-trust-border bg-trust-dark/50 hover:bg-trust-surface hover:border-trust-blue/50 transition-all text-slate-300 hover:text-white flex items-center justify-between group"
            >
              <span>{opt.text}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-trust-blue" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === questions.length + 1) {
    return (
      <div className="w-full flex flex-col items-center text-center animate-in slide-in-from-right-8 fade-in duration-500">
        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Final Step: Password Verification</h3>
        <p className="text-slate-400 mb-8 max-w-md text-sm">
          Type the password you use most frequently. It is evaluated entirely locally to determine entropy and structure. Nothing is saved.
        </p>
        <div className="w-full max-w-md relative mb-6">
          <input
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Enter a typical password..."
            className="w-full bg-trust-dark border border-trust-border rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-trust-teal"
          />
        </div>
        <button
          onClick={handlePasswordSubmit}
          disabled={!testPassword || isSubmitting}
          className="group flex items-center gap-2 bg-gradient-to-r from-trust-blue to-trust-teal text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] disabled:opacity-50"
        >
          Calculate Risk Score
          <Zap className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
        <div className="w-16 h-16 border-4 border-trust-border border-t-trust-blue rounded-full animate-spin mb-6" />
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Behavioral Metrics</h3>
        <p className="text-slate-400 text-sm animate-pulse">Running HBM & PMT models...</p>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="w-full flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-1000">
        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-6 shadow-[0_0_60px_-15px_currentColor] ${
          riskLevel === "Low" ? "border-trust-teal text-trust-teal" :
          riskLevel === "Medium" ? "border-yellow-500 text-yellow-500" :
          "border-red-500 text-red-500"
        }`}>
          <span className="text-5xl font-black">{finalScore}</span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">
          Your Risk Level is <span className={
            riskLevel === "Low" ? "text-trust-teal" :
            riskLevel === "Medium" ? "text-yellow-500" :
            "text-red-500"
          }>{riskLevel}</span>
        </h2>
        <p className="text-slate-400 mb-8 max-w-lg">
          We aggregated your Behavioral Assessment ({(behavioralScore).toFixed(0)}), Password Strength ({(passwordScore).toFixed(0)}), and URL Awareness ({(urlScore).toFixed(0)}).
        </p>

        <div className="w-full bg-trust-surface border border-trust-border rounded-xl p-6 text-left mb-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-trust-blue" />
            AI Security Guidance
          </h3>
          <div className="prose prose-invert prose-p:text-slate-300 prose-li:text-slate-300 max-w-none text-sm">
            {aiGuidance.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-trust-teal mt-0.5 shrink-0" />
                <span>{line.replace(/^[-*]\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="text-slate-400 hover:text-white transition-colors text-sm underline underline-offset-4"
        >
          Retake Assessment
        </button>
      </div>
    );
  }

  return null;
}
