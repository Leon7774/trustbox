import { Dispatch } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { submitAssessmentAction } from "@/app/actions/assessment";
import { AssessmentAction } from "../store/assessmentReducer";

export interface SubmitAssessmentParams {
  answers: Record<string, number>;
  activeQuestionsLength: number;

  dispatch: Dispatch<AssessmentAction>;
  router: AppRouterInstance;
}

export const submitAssessment = async ({
  answers,
  activeQuestionsLength,

  dispatch,
  router,
}: SubmitAssessmentParams) => {
  dispatch({
    type: "START_SUBMISSION",
    payload: { step: activeQuestionsLength + 1 },
  });

  const rawBScore =
    Object.values(answers).reduce((acc, curr) => acc + curr, 0) /
    activeQuestionsLength;
  const bScore = Math.round(rawBScore);
  const pScore = 0;
  const uScore = 0; 

  const tScore = Math.min(
    100,
    Math.round(bScore),
  );

  let risk: "Low" | "Medium" | "High" = "High";
  if (tScore >= 75) risk = "Low";
  else if (tScore >= 45) risk = "Medium";

  dispatch({
    type: "SET_SUBMISSION_RESULTS",
    payload: {
      behavioralScore: bScore,
      urlScore: uScore,
      finalScore: tScore,
      riskLevel: risk,
    },
  });

  const res = await submitAssessmentAction({
    behavioralScore: bScore,
    totalScore: tScore,
    riskLevel: risk,
    rawResponses: answers,
  });

  let newGuidance = "";
  if (res.recommendations) {
    newGuidance = res.recommendations;
  } else {
    newGuidance =
      "- Enable Multi-Factor Authentication immediately.\n- Adopt a dedicated password manager.\n- Hover and inspect URLs thoroughly before clicking.";
  }

  dispatch({
    type: "FINISH_SUBMISSION",
    payload: {
      aiGuidance: newGuidance,
      step: res.success && res.assessmentId ? undefined : activeQuestionsLength + 1,
    },
  });

  if (res.success && res.assessmentId) {
    router.push(`/dashboard/trustie/${res.assessmentId}`);
  }
};
