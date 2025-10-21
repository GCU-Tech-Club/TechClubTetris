import { HighScore } from "@shared/types/highScore.ts";

type HighScoreRequest = Omit<HighScore, "created_at">;

export function isValidHighScore(data: unknown): data is HighScoreRequest {
  if (!data || typeof data !== "object") return false;

  const { user_id, score } = data as Record<string, unknown>;
  return typeof user_id === "string" &&
    typeof score === "number" &&
    user_id.length > 0 &&
    score >= 0;
}
