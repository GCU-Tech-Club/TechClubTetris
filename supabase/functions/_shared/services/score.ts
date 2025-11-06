import { createSupabaseClient } from "../utils/supabase.ts";
import { HighScore } from "../types/highScore.ts";

/**
 * Score creation data (HighScore without created_at, which is generated server-side)
 */
export type ScoreCreationData = Omit<HighScore, "created_at">;

/**
 * Retrieves the top N scores from the scores table
 * @param limit Maximum number of scores to retrieve (default: 10)
 * @returns Array of scores ordered by score descending
 * @throws Error if database query fails
 */
export async function getTopScores(limit: number = 10): Promise<HighScore[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to retrieve scores: ${error.message}`);

  return (data || []) as HighScore[];
}

/**
 * Saves a new score to the scores table
 * @param scoreData Score data to save (uid, initials, score)
 * @returns Created score record
 * @throws Error if database operation fails
 */
export async function saveScore(
  scoreData: ScoreCreationData
): Promise<HighScore> {
  const supabase = createSupabaseClient();

  const score: Omit<HighScore, "id"> = {
    uid: scoreData.uid,
    initials: scoreData.initials,
    score: scoreData.score,
    created_at: new Date(),
  };

  const { data, error } = await supabase
    .from("scores")
    .insert(score)
    .select()
    .single();

  if (error) throw new Error(`Failed to save score: ${error.message}`);

  return data as HighScore;
}
