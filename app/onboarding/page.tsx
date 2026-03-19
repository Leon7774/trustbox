"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { beginnerQuestions, intermediateQuestions, advancedQuestions, Question } from "@/data/survey"

export default function OnboardingPage() {
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [expertise, setExpertise] = useState<"beginner" | "intermediate" | "advanced" | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)

  // Step 1 handler
  const handleExpertiseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (expertise) {
      setStep(2)
    }
  }

  // Step 2 handler
  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Mock save delay
    setTimeout(() => {
      setSubmitting(false)
      setStep(3)
    }, 1000)
  }

  // Get current questions block
  let currentQuestions: Question[] = []
  if (expertise === "beginner") currentQuestions = beginnerQuestions
  if (expertise === "intermediate") currentQuestions = intermediateQuestions
  if (expertise === "advanced") currentQuestions = advancedQuestions

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {step === 1 && (
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Welcome to TrustBox</CardTitle>
            <CardDescription>
              To personalize your experience, please tell us about your cybersecurity expertise.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleExpertiseSubmit}>
            <CardContent>
              <RadioGroup 
                value={expertise || ""} 
                onValueChange={(val) => setExpertise(val as any)}
                className="space-y-4 mt-4"
              >
                <div className="flex items-center space-x-3 rounded-lg border border-[var(--color-trust-border)] p-4 transition-colors hover:bg-[var(--color-trust-surface)]/50">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="flex-1 cursor-pointer text-base">
                    <span className="font-semibold block text-white">Beginner</span>
                    <span className="text-gray-400 font-normal">I have basic knowledge and want to learn more.</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 rounded-lg border border-[var(--color-trust-border)] p-4 transition-colors hover:bg-[var(--color-trust-surface)]/50">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="flex-1 cursor-pointer text-base">
                    <span className="font-semibold block text-white">Intermediate</span>
                    <span className="text-gray-400 font-normal">I actively protect myself but occasionally face doubts.</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 rounded-lg border border-[var(--color-trust-border)] p-4 transition-colors hover:bg-[var(--color-trust-surface)]/50">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced" className="flex-1 cursor-pointer text-base">
                    <span className="font-semibold block text-white">Advanced</span>
                    <span className="text-gray-400 font-normal">I am highly confident in identifying and handling threats.</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!expertise}>
                Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full max-w-3xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Cybersecurity Awareness Survey</CardTitle>
            <CardDescription>
              Please rate your agreement with the following statements (1 = Strongly Disagree, 5 = Strongly Agree). 
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSurveySubmit}>
            <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {currentQuestions.map((q, index) => (
                <div key={q.id} className="space-y-3 pb-4 border-b border-[var(--color-trust-border)] last:border-0 last:pb-0">
                  <Label className="text-base font-medium text-gray-200 leading-relaxed">
                    {index + 1}. {q.text}
                  </Label>
                  <RadioGroup 
                    className="flex justify-between max-w-md pt-2"
                    value={answers[q.id]?.toString()}
                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: parseInt(val) }))}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex flex-col items-center space-y-2">
                        <Label htmlFor={`${q.id}-${num}`} className="text-xs text-gray-400 cursor-pointer">{num}</Label>
                        <RadioGroupItem value={num.toString()} id={`${q.id}-${num}`} />
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-6 flex justify-between">
              <Button variant="outline" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" disabled={submitting || Object.keys(answers).length < currentQuestions.length}>
                {submitting ? "Saving..." : "Complete Setup"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === 3 && (
        <Card className="w-full max-w-md text-center py-8 px-4">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold">You're All Set!</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you for completing the setup. TrustBox is now tailored to your expertise.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-8">
            <Button onClick={() => router.push("/")} size="lg">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
