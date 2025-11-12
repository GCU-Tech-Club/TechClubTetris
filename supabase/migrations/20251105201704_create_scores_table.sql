-- Drop the old high_scores table
DROP TABLE IF EXISTS high_scores;

-- Create the new scores table
CREATE TABLE IF NOT EXISTS scores (
  id BIGSERIAL PRIMARY KEY,
  uid UUID NOT NULL,
  initials CHAR(3) NOT NULL,
  score BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on the score column for faster ordering
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);

-- Grant permissions to the scores table
GRANT ALL ON scores TO authenticated;
GRANT ALL ON scores TO service_role;
GRANT SELECT ON scores TO anon;

