/**
 * Request body only contains initials and score (uid comes from JWT)
 * @param initials Initials
 * @param score Score
 */
export interface HighScoreRequest {
  initials: string;
  score: number;
}

/**
 * Validates that the request body contains valid high score data
 * @param data Request body to validate
 * @returns true if the request body is valid, false otherwise
 */
export function isValidHighScore(data: unknown): data is HighScoreRequest {
  if (!data || typeof data !== "object") return false;

  const { initials, score } = data as Record<string, unknown>;
  return (
    typeof initials === "string" &&
    initials.length === 3 &&
    /^[A-Za-z0-9]{3}$/.test(initials) && // 3 alphanumeric characters
    typeof score === "number" &&
    score >= 0 &&
    Number.isInteger(score) // Ensure it's an integer
  );
}
