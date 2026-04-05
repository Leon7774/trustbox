"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Activity,
  Zap,
} from "lucide-react";
import { submitAssessmentAction } from "@/app/actions/assessment";
import zxcvbn from "zxcvbn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { questions } from "./questions";

export default function AssessmentForm() {
  // Tracks the current stage of the assessment
  const [step, setStep] = useState(0);
  
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [behavioralScore, setBehavioralScore] = useState(0);
  const [passwordScore, setPasswordScore] = useState(0);
  const [urlScore, setUrlScore] = useState(100);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">(
    "Medium",
  );
  const [aiGuidance, setAiGuidance] = useState("");

  const [testPassword, setTestPassword] = useState("");

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));

    if (step <= questions.length) {
      setStep(step + 1);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsSubmitting(true);
    setStep(5);

    const bScore =
      Object.values(answers).reduce((acc, curr) => acc + curr, 0) /
      questions.length;
    const pwResult = zxcvbn(testPassword);
    const pScore = (pwResult.score / 4) * 100;
    const uScore = answers["q2"] || 50;

    setBehavioralScore(bScore);
    setPasswordScore(pScore);
    setUrlScore(uScore);

    const tScore = Math.min(
      100,
      Math.round(bScore * 0.4 + pScore * 0.3 + uScore * 0.3),
    );
    setFinalScore(tScore);

    let risk: "Low" | "Medium" | "High" = "High";
    if (tScore >= 75) risk = "Low";
    else if (tScore >= 45) risk = "Medium";

    setRiskLevel(risk);

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
      setAiGuidance(
        "- Enable Multi-Factor Authentication immediately.\n- Adopt a dedicated password manager.\n- Hover and inspect URLs thoroughly before clicking.",
      );
    }

    setIsSubmitting(false);
    setStep(6);
  };

  if (step === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-transparent border-0 shadow-none animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold text-white mb-4">
          Discover Your Risk Profile
        </CardTitle>
        <CardDescription className="text-slate-400 mb-8 max-w-md mx-auto text-base">
          Answer a few behavioral questions and test your daily password.
          TrustBox will calculate your Personal Cyber Risk Score.
        </CardDescription>
        <Button
          size="lg"
          onClick={() => setStep(1)}
          className="hover:cursor-pointer group rounded-full bg-brand-primary text-black hover:from-primary/90 hover:to-secondary/90 transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
        >
          Begin Evaluation
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Card>
    );
  }

  if (step > 0 && step <= questions.length) {
    const q = questions[step - 1];
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl animate-in slide-in-from-right-8 fade-in duration-500">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className=" text-sm font-medium">
              Question {step} of {questions.length}
            </span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-border"}`}
                />
              ))}
              <div className={`h-1.5 w-6 rounded-full bg-border`} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white leading-tight">
            {q.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3">
          {q.options.map((opt, i) => (
            <Button
              key={i}
              variant="outline"
              onClick={() => handleAnswer(q.id, opt.score)}
              className="w-full h-auto text-left p-4 justify-between group whitespace-normal text-slate-300 hover:text-white"
            >
              <span>{opt.text}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-primary shrink-0" />
            </Button>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (step === questions.length + 1) {
    return (
      <Card className="w-full max-w-xl mx-auto shadow-xl animate-in slide-in-from-right-8 fade-in duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-2">
            Final Step: Password Verification
          </CardTitle>
          <CardDescription>
            Type the password you use most frequently. It is evaluated entirely
            locally to determine entropy and structure. Nothing is saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-md relative mb-8">
            <Input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Enter a typical password..."
              className="py-6 text-lg"
            />
          </div>
          <Button
            size="lg"
            onClick={handlePasswordSubmit}
            disabled={!testPassword || isSubmitting}
            className="group rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
          >
            Calculate Risk Score
            <Zap className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 5) {
    return (
      <Card className="w-full max-w-xl mx-auto py-12 flex flex-col items-center justify-center animate-in fade-in duration-500 bg-transparent border-0 shadow-none">
        <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mb-6" />
        <CardTitle className="text-xl font-bold mb-2">
          Analyzing Behavioral Metrics
        </CardTitle>
        <CardDescription className="animate-pulse">
          Running HBM & PMT models...
        </CardDescription>
      </Card>
    );
  }

  if (step === 6) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-1000 bg-transparent border-0 shadow-none">
        <div
          className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-6 shadow-[0_0_60px_-15px_currentColor] ${
            riskLevel === "Low"
              ? "border-secondary text-secondary"
              : riskLevel === "Medium"
                ? "border-yellow-500 text-yellow-500"
                : "border-red-500 text-red-500"
          }`}
        >
          <span className="text-5xl font-black">{finalScore}</span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          Your Risk Level is{" "}
          <span
            className={
              riskLevel === "Low"
                ? "text-secondary"
                : riskLevel === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {riskLevel}
          </span>
        </h2>
        <p className="text-slate-400 mb-8 max-w-lg">
          We aggregated your Behavioral Assessment ({behavioralScore.toFixed(0)}
          ), Password Strength ({passwordScore.toFixed(0)}), and URL Awareness (
          {urlScore.toFixed(0)}).
        </p>

        <Card className="w-full text-left mb-6 shadow-xl bg-surface">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              AI Security Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-p:text-slate-300 prose-li:text-slate-300 max-w-none text-sm space-y-2">
              {aiGuidance
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 fade-in slide-in-from-bottom-2 animate-in fill-mode-both"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <span className="leading-relaxed text-gray-300">
                      {line.replace(/^[-*]\s*/, "")}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Button
          variant="link"
          onClick={() => window.location.reload()}
          className="text-slate-400 hover:text-white"
        >
          Retake Assessment
        </Button>
      </Card>
    );
  }

  return null;
}
