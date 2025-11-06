// Request body only contains initials and score (uid comes from JWT)
type HighScoreRequest = {
  initials: string;
  score: number;
};

export function isValidHighScore(data: unknown): data is HighScoreRequest {
  if (!data || typeof data !== "object") return false;

  const { initials, score } = data as Record<string, unknown>;
  return (
    typeof initials === "string" &&
    initials.length === 3 &&
    /^[A-Za-z0-9]{3}$/.test(initials) && // Exactly 3 alphanumeric characters
    typeof score === "number" &&
    score >= 0 &&
    Number.isInteger(score) // Ensure it's an integer
  );
}
