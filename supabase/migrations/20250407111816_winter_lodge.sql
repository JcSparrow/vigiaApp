/*
  # Cases and Comments System Setup

  1. New Tables
    - cases
      - Store missing persons and stolen vehicle cases
      - Support for multiple photos
      - Verification and moderation status
      - Location tracking
    - case_comments
      - Restricted commenting system
      - Role-based permissions
      - Moderation flags
    - case_followers
      - Track users following cases
      - Enable notification subscriptions
  
  2. Enums
    - case_type: Define valid case types
    - user_role: Define user permission levels
  
  3. Security
    - RLS enabled on all tables
    - Role-based access control
    - Moderation capabilities
*/

-- Create case types enum
CREATE TYPE case_type AS ENUM ('person', 'vehicle');

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('user', 'family', 'authority', 'moderator', 'admin');

-- Add role column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user'::user_role;

-- Cases Table
CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type case_type NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  photos text[] NOT NULL DEFAULT '{}',
  location_lat decimal NOT NULL,
  location_lng decimal NOT NULL,
  location_city text NOT NULL,
  location_state text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes text,
  
  -- Vehicle specific fields
  vehicle_make text,
  vehicle_model text,
  vehicle_year integer,
  vehicle_color text,
  vehicle_plate text,
  vehicle_vin text,
  
  -- Person specific fields
  person_name text,
  person_age integer,
  person_gender text,
  person_height decimal,
  person_weight decimal,
  person_characteristics text,
  last_seen_at timestamptz,
  last_seen_location text,
  
  -- Moderation fields
  is_approved boolean DEFAULT false,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  
  -- Verification fields (previously added)
  verification_status text DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'in_review', 'verified', 'false_info')),
  ai_moderation_flag boolean DEFAULT false,
  ai_moderation_score decimal DEFAULT 0
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Case Comments Table
CREATE TABLE case_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content text NOT NULL,
  is_official boolean DEFAULT false,
  is_hidden boolean DEFAULT false,
  hidden_reason text,
  hidden_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_comments ENABLE ROW LEVEL SECURITY;

-- Case Followers Table
CREATE TABLE case_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(case_id, user_id)
);

ALTER TABLE case_followers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Cases policies
CREATE POLICY "Anyone can read cases"
  ON cases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authorized users can create cases"
  ON cases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('family', 'authority', 'moderator', 'admin')
    )
  );

CREATE POLICY "Authorized users can update cases"
  ON cases
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        role IN ('moderator', 'admin') OR
        (role IN ('family', 'authority') AND created_by = auth.uid())
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        role IN ('moderator', 'admin') OR
        (role IN ('family', 'authority') AND created_by = auth.uid())
      )
    )
  );

-- Comments policies
CREATE POLICY "Anyone can read comments"
  ON case_comments
  FOR SELECT
  TO authenticated
  USING (NOT is_hidden OR 
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Authorized users can create comments"
  ON case_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('family', 'authority', 'moderator', 'admin')
    )
  );

CREATE POLICY "Users can update own comments"
  ON case_comments
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('moderator', 'admin')
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('moderator', 'admin')
    )
  );

-- Followers policies
CREATE POLICY "Users can see own follows"
  ON case_followers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can follow cases"
  ON case_followers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unfollow cases"
  ON case_followers
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Functions

-- Function to update case timestamps
CREATE OR REPLACE FUNCTION update_case_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update comment timestamps
CREATE OR REPLACE FUNCTION update_comment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers

-- Update case timestamps
CREATE TRIGGER update_case_timestamp
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_case_timestamp();

-- Update comment timestamps
CREATE TRIGGER update_comment_timestamp
  BEFORE UPDATE ON case_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_timestamp();

-- Indexes for better query performance
CREATE INDEX idx_cases_type ON cases(type);
CREATE INDEX idx_cases_location ON cases(location_city, location_state);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX idx_cases_verification ON cases(verification_status);
CREATE INDEX idx_comments_case_id ON case_comments(case_id);
CREATE INDEX idx_followers_case_user ON case_followers(case_id, user_id);