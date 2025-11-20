-- RLS policies for sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions can view own session" 
  ON sessions
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Sessions can update own session" 
  ON sessions
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Sessions can delete own session" 
  ON sessions
  FOR DELETE 
  USING (auth.uid() = id);