/**
 * Implements Exponential Backoff with Jitter for LLM API calls.
 *
 * This utility catches 429 (Rate Limit) and retryable errors and retries
 * with increasing delays. It also respects the `retryDelay` hint from the
 * Google API response body when available.
 */

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 10000, // 10 second base (Google free-tier needs ~30s)
): Promise<T> {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      // The Vercel AI SDK wraps errors as AI_APICallError with statusCode
      const status =
        error?.statusCode || error?.status || error?.response?.status;
      const isRetryable = status === 429 || error?.isRetryable === true;

      // If it's not retryable, or we've exhausted retries, surface the error
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      // Try to parse the server-suggested retry delay from the response body
      let serverDelay: number | null = null;
      try {
        if (error?.responseBody) {
          const body =
            typeof error.responseBody === "string"
              ? JSON.parse(error.responseBody)
              : error.responseBody;
          const retryInfo = body?.error?.details?.find(
            (d: any) =>
              d["@type"] === "type.googleapis.com/google.rpc.RetryInfo",
          );
          if (retryInfo?.retryDelay) {
            // Parse "31s" or "27s" format
            const seconds = parseInt(retryInfo.retryDelay, 10);
            if (!isNaN(seconds)) {
              serverDelay = seconds * 1000;
            }
          }
        }
      } catch {
        // Ignore parse errors, fall back to exponential backoff
      }

      // Use server-suggested delay if available, otherwise exponential backoff
      // Attempt 0: 10s, Attempt 1: 20s, Attempt 2: 40s
      const delay = serverDelay ?? Math.pow(2, attempt) * baseDelay;

      // Jitter: adds a random fluctuation (0-1000ms) to prevent "thundering herd"
      const jitter = Math.random() * 1000;
      const totalWait = delay + jitter;

      console.warn(
        `[AI-Retry] Rate limit (429) hit. ${serverDelay ? "Using server-suggested delay." : "Using exponential backoff."} Retrying in ${Math.round(totalWait / 1000)}s (Attempt ${attempt + 1}/${maxRetries})...`,
      );

      await new Promise((resolve) => setTimeout(resolve, totalWait));
      attempt++;
    }
  }

  throw new Error("Max retries exceeded for LLM API call.");
}
