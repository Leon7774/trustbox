import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAssessmentsAction } from "@/app/actions/assessment";
import { db } from "@/db";
import { users, assessments } from "@/db/schema";
import { eq } from "drizzle-orm";

// Mock the Next.js/Supabase server client
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: { id: "test-history-user-id" },
        },
      }),
    },
  }),
}));

describe("getAssessmentsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch paginated assessments for the logged-in user", async () => {
    // 1. Ensure test user exists
    let dbUser = await db
      .select()
      .from(users)
      .where(eq(users.anonymousId, "test-history-user-id"))
      .then((res) => res[0]);

    if (!dbUser) {
      dbUser = await db
        .insert(users)
        .values({ anonymousId: "test-history-user-id" })
        .returning()
        .then((res) => res[0]);
    }

    // 2. Insert mock assessments
    await db.insert(assessments).values([
      {
        userId: dbUser.id,
        behavioralScore: 30,
        totalScore: 30,
        riskLevel: "High",
      },
      {
        userId: dbUser.id,
        behavioralScore: 85,
        totalScore: 85,
        riskLevel: "Low",
      },
    ]);

    // 3. Execute the server action
    const result = await getAssessmentsAction(1, 10);

    // 4. Verify success
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.assessments.length).toBeGreaterThanOrEqual(2);
      expect(result.totalCount).toBeGreaterThanOrEqual(2);
      expect(result.totalPages).toBeGreaterThanOrEqual(1);
    }
  });

  it("should return error for unauthenticated users", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    (createClient as any).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    const result = await getAssessmentsAction(1, 10);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });
});
