"use client";

import {
  ShieldCheck,
  ChevronRight,
  Activity,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssessmentForm } from "./hooks/useAssessmentForm";
// import AssessmentChat from "./AssessmentChat";

export default function AssessmentForm() {
  const {
    state: {
      step,
      behavioralScore,
      urlScore,
      isSubmitting,
      finalScore,
      riskLevel,
      aiGuidance,
    },
    activeQuestions,
    handleAnswer,
    setProficiency,
  } = useAssessmentForm();

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
          Select your proficiency level to begin the risk assessment and test
          your daily password.
        </CardDescription>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              setProficiency("BEGINNER");
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
      <Card className="w-full max-w-xl mx-auto py-12 flex flex-col items-center justify-center animate-in fade-in duration-500 bg-transparent border-0 shadow-none">
        <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mb-6" />
        <CardTitle className="text-xl font-bold mb-2">
          Analyzing Security Metrics
        </CardTitle>
        <CardDescription className="animate-pulse">
          Evaluating risk factors...
        </CardDescription>
      </Card>
    );
  }



  return null;
}
