"use server";

export async function checkUrlReputationAction(url: string) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_SAFE_BROWSING_API_KEY is not set");
    return { success: false, error: "API key missing" };
  }

  try {
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: {
            clientId: "trustbox",
            clientVersion: "1.0.0",
          },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // If matches is present and not empty, the URL is considered dangerous
    const isDangerous = !!(data.matches && data.matches.length > 0);
    const threatType = isDangerous ? data.matches[0].threatType : null;

    return {
      success: true,
      isDangerous,
      threatType,
    };
  } catch (error) {
    console.error("Safe Browsing API error:", error);
    return { success: false, error: "Failed to check URL reputation" };
  }
}
