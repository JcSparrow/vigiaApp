/*
  # Add comment likes and reports system

  1. New Tables
    - comment_likes: Track likes on comments
    - comment_reports: Track reported comments
  
  2. Functions
    - increment_comment_likes: Safely increment comment likes
    
  3. Security
    - RLS policies for new tables
    - Only authenticated users can like/report
*/

-- Add likes column to case_comments
ALTER TABLE case_comments ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;

-- Create comment_likes table
CREATE TABLE comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES case_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Create comment_reports table
CREATE TABLE comment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES case_comments(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, reporter_id)
);

ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;

-- Function to increment comment likes
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE case_comments
  SET likes = likes + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies

-- Comment likes policies
CREATE POLICY "Users can like comments"
  ON comment_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see likes"
  ON comment_likes
  FOR SELECT
  TO authenticated
  USING (true);

-- Comment reports policies
CREATE POLICY "Users can report comments"
  ON comment_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Moderators can view reports"
  ON comment_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('moderator', 'admin')
    )
  );

-- Indexes for better performance
CREATE INDEX idx_comment_likes ON comment_likes(comment_id, user_id);
CREATE INDEX idx_comment_reports ON comment_reports(comment_id, reporter_id);