import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitAssessmentAction } from "@/app/actions/assessment";
import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";

// Mock the Next.js/Supabase server client to bypass cookies/auth issues in tests
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: { id: "test-mock-user-id" },
        },
      }),
    },
  }),
}));

describe("submitAssessmentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save assessment to the database successfully", async () => {
    // 1. Setup mock data
    const mockData = {
      behavioralScore: 85,
      totalScore: 85,
      riskLevel: "Low" as const,
      rawResponses: { q1: 100, q2: 70 },
    };

    // 2. Execute the server action
    const result = await submitAssessmentAction(mockData);

    // 3. Verify it was successful
    expect(result.success).toBe(true);
    expect(result.assessmentId).toBeDefined();

    // 4. Verify it was actually saved in the DB
    const savedAssessment = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, result.assessmentId as number));

    expect(savedAssessment.length).toBe(1);
    expect(savedAssessment[0].behavioralScore).toBe(85);
    expect(savedAssessment[0].totalScore).toBe(85);
    expect(savedAssessment[0].riskLevel).toBe("Low");
    expect(savedAssessment[0].rawResponses).toEqual({ q1: 100, q2: 70 });
  });
});
