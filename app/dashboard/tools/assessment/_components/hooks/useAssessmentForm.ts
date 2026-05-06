import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { assessmentReducer, initialState } from "../store/assessmentReducer";
import { questionsByLevel, ProficiencyLevel } from "../questions";
import { submitAssessment } from "../actions/submitAssessment";

export function useAssessmentForm() {
  const router = useRouter();
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  const {
    step,
    proficiency,
    answers,
    behavioralScore,
    urlScore,
    isSubmitting,
    finalScore,
    riskLevel,
    aiGuidance,
  } = state;

  const MAX_QUESTIONS = 15;
  const activeQuestions = proficiency
    ? questionsByLevel[proficiency].slice(0, MAX_QUESTIONS)
    : [];

  const handleAnswer = (questionId: string, score: number) => {
    dispatch({ type: "ANSWER_QUESTION", payload: { questionId, score } });

    if (step < activeQuestions.length) {
      dispatch({ type: "SET_STEP", payload: step + 1 });
    } else if (step === activeQuestions.length) {
      submitAssessment({
        answers: { ...answers, [questionId]: score },
        activeQuestionsLength: activeQuestions.length,
        dispatch,
        router,
      });
    }
  };



  const setProficiency = (level: ProficiencyLevel) => {
    dispatch({ type: "SET_PROFICIENCY", payload: level });
  };



  return {
    state,
    activeQuestions,
    handleAnswer,
    setProficiency,
  };
}
