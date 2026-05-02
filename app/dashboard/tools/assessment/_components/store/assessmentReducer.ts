import { ProficiencyLevel } from "../questions";

export interface AssessmentState {
  step: number;
  proficiency: ProficiencyLevel | null;
  answers: Record<string, number>;
  behavioralScore: number;
  urlScore: number;
  isSubmitting: boolean;
  finalScore: number;
  riskLevel: "Low" | "Medium" | "High";
  aiGuidance: string;
}

export const initialState: AssessmentState = {
  step: 0,
  proficiency: null,
  answers: {},
  behavioralScore: 0,
  urlScore: 100,
  isSubmitting: false,
  finalScore: 0,
  riskLevel: "Medium",
  aiGuidance: "",
};

export type AssessmentAction =
  | { type: "SET_PROFICIENCY"; payload: ProficiencyLevel }
  | { type: "ANSWER_QUESTION"; payload: { questionId: string; score: number } }
  | { type: "SET_STEP"; payload: number }
  | { type: "START_SUBMISSION"; payload: { step: number } }
  | {
      type: "SET_SUBMISSION_RESULTS";
      payload: {
        behavioralScore: number;
        urlScore: number;
        finalScore: number;
        riskLevel: "Low" | "Medium" | "High";
      };
    }
  | { type: "FINISH_SUBMISSION"; payload: { aiGuidance: string; step?: number } }
  | { type: "RESET" };

export function assessmentReducer(
  state: AssessmentState,
  action: AssessmentAction,
): AssessmentState {
  switch (action.type) {
    case "SET_PROFICIENCY":
      return { ...state, proficiency: action.payload, step: 1 };
    case "ANSWER_QUESTION":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.score,
        },
      };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "START_SUBMISSION":
      return { ...state, isSubmitting: true, step: action.payload.step };
    case "SET_SUBMISSION_RESULTS":
      return {
        ...state,
        behavioralScore: action.payload.behavioralScore,
        urlScore: action.payload.urlScore,
        finalScore: action.payload.finalScore,
        riskLevel: action.payload.riskLevel,
      };
    case "FINISH_SUBMISSION":
      return {
        ...state,
        isSubmitting: false,
        aiGuidance: action.payload.aiGuidance,
        step:
          action.payload.step !== undefined ? action.payload.step : state.step,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
