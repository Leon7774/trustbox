import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkUrlReputationAction } from "@/app/actions/url";

describe("checkUrlReputationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return dangerous if Google API finds a match", async () => {
    // Mock global fetch
    const mockResponse = {
      matches: [
        {
          threatType: "MALWARE",
          platformType: "ANY_PLATFORM",
          threatEntryType: "URL",
          threat: { url: "http://malware.testing.google.test/testing/malware/" },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    process.env.GOOGLE_SAFE_BROWSING_API_KEY = "mock-key";

    const result = await checkUrlReputationAction(
      "http://malware.testing.google.test/testing/malware/",
    );

    expect(result.success).toBe(true);
    expect(result.isDangerous).toBe(true);
    expect(result.threatType).toBe("MALWARE");
  });

  it("should return safe if Google API finds no match", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    process.env.GOOGLE_SAFE_BROWSING_API_KEY = "mock-key";

    const result = await checkUrlReputationAction("https://google.com");

    expect(result.success).toBe(true);
    expect(result.isDangerous).toBe(false);
    expect(result.threatType).toBe(null);
  });
});
