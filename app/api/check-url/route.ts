// app/api/check-url/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_SAFE_BROWSING_KEY; 
    
    // 1. Log if the API key isn't loaded from your .env file
    if (!GOOGLE_API_KEY) {
      console.error("CRITICAL ERROR: GOOGLE_SAFE_BROWSING_KEY is missing from environment variables!");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Call Google Safe Browsing API
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            clientId: "your-app-name", // Change this to your actual app name
            clientVersion: "1.0.0",
          },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      }
    );

    // 2. Catch HTTP errors from Google and log the exact response body
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`--- GOOGLE API ERROR ---`);
      console.error(`Status: ${response.status} ${response.statusText}`);
      console.error(`Response Body: ${errorText}`);
      console.error(`------------------------`);
      
      return NextResponse.json(
        { error: `Upstream API rejected the request (${response.status})` }, 
        { status: 502 }
      );
    }

    const data = await response.json();

    // If matches array exists, the URL is malicious
    const isMalicious = !!(data.matches && data.matches.length > 0);
    
    return NextResponse.json({ 
      isMalicious,
      threatScore: isMalicious ? 100 : 0 
    });

  } catch (error) {
    // 3. Log native Node/Network errors (e.g., DNS resolution failed)
    console.error("Network or Parsing Error analyzing URL:", error);
    return NextResponse.json({ error: "Failed to analyze URL" }, { status: 500 });
  }
}