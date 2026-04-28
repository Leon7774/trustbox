"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { questionsByLevel, ProficiencyLevel } from "./questions";
// import AssessmentChat from "./AssessmentChat";

export default function AssessmentForm() {
  const router = useRouter();
  // Tracks the current stage of the assessment
  const [step, setStep] = useState(0);
  const [proficiency, setProficiency] = useState<ProficiencyLevel | null>(null);

  const activeQuestions = proficiency ? questionsByLevel[proficiency] : [];
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

    if (step <= activeQuestions.length) {
      setStep(step + 1);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsSubmitting(true);
    setStep(activeQuestions.length + 2);

    const bScore =
      Object.values(answers).reduce((acc, curr) => acc + curr, 0) /
      activeQuestions.length;
    const pwResult = zxcvbn(testPassword);
    const pScore = (pwResult.score / 4) * 100;
    const uScore = 50; // default for now, since q2 URL specific question is gone

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

    if (res.recommendations) {
      setAiGuidance(res.recommendations);
    } else {
      setAiGuidance(
        "- Enable Multi-Factor Authentication immediately.\n- Adopt a dedicated password manager.\n- Hover and inspect URLs thoroughly before clicking.",
      );
    }

    setIsSubmitting(false);
    if (res.success && res.assessmentId) {
      router.push(`/tools/assessment/results/${res.assessmentId}`);
    } else {
      setStep(activeQuestions.length + 3);
    }
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
          Select your proficiency level to begin the behavioral assessment and
          test your daily password.
        </CardDescription>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              setProficiency("BEGINNER");
              setStep(1);
            }}
            className="hover:border-primary hover:text-primary transition-all text-lg py-6"
          >
            I am a Beginner
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              setProficiency("INTERMEDIATE");
              setStep(1);
            }}
            className="hover:border-primary hover:text-primary transition-all text-lg py-6"
          >
            I am Intermediate
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              setProficiency("ADVANCED");
              setStep(1);
            }}
            className="hover:border-primary hover:text-primary transition-all text-lg py-6"
          >
            I am Advanced
          </Button>
        </div>
      </Card>
    );
  }

  if (step > 0 && step <= activeQuestions.length) {
    const q = activeQuestions[step - 1];
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl animate-in slide-in-from-right-8 fade-in duration-500">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className=" text-sm font-medium">
              Question {step} of {activeQuestions.length}
            </span>
            <div className="flex gap-1 overflow-hidden max-w-[200px]">
              {/* Show limited progress indicators to avoid overflow with many questions */}
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(step / activeQuestions.length) * 100}%` }}
                />
              </div>
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

  if (step === activeQuestions.length + 1) {
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

  if (step === activeQuestions.length + 2) {
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

  if (step === activeQuestions.length + 3) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 animate-in zoom-in-95 fade-in duration-1000">
        <Card className="w-full p-4 md:p-8 flex flex-col items-center text-center bg-transparent border-0 shadow-none">
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
            We aggregated your Behavioral Assessment (
            {behavioralScore.toFixed(0)}
            ), Password Strength ({passwordScore.toFixed(0)}), and URL Awareness
            ({urlScore.toFixed(0)}).
          </p>

          <Card className="w-full text-left mb-6 shadow-xl bg-surface">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                AI Security Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-p:text-slate-300 prose-li:text-slate-300 max-w-none space-y-2">
                {aiGuidance}
              </div>
            </CardContent>
          </Card>
        </Card>

        {/* ChatGPT Style Assessment Chat */}
        <AssessmentChat
          assessmentData={{
            behavioralScore,
            passwordScore,
            urlScore,
            finalScore,
            riskLevel,
          }}
        />

        <div className="flex justify-center pb-12 pt-4">
          <Button
            variant="link"
            onClick={() => window.location.reload()}
            className="text-slate-400 hover:text-white"
          >
            Retake Assessment
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
