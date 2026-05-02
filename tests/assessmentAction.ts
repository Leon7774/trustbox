import { submitAssessmentAction } from "@/app/actions/assessment";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function runTest() {
  console.log("🚀 Running test for submitAssessmentAction...");

  const mockData = {
    behavioralScore: 85,
    totalScore: 85,
    riskLevel: "Low" as const,
    rawResponses: {
      "q1": 100,
      "q2": 75,
      "q3": 50,
      "q4": 100,
      "q5": 100,
    },
  };

  try {
    const result = await submitAssessmentAction(mockData);

    if (result.success) {
      console.log("✅ Successfully saved assessment to DB!");
      console.log("Result:", result);
    } else {
      console.error("❌ Failed to save assessment.");
      console.error("Error:", result.error);
    }
  } catch (error) {
    console.error("💥 Unexpected error occurred during test:", error);
  }
  
  process.exit(0);
}

runTest();
