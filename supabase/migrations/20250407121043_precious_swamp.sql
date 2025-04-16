/*
  # Add notification preferences and verification system

  1. New Tables
    - notification_preferences: Stores user notification settings
    - notifications: Stores user notifications
    - case_verifications: Tracks verification requests and status
    
  2. Changes
    - Add verification trigger to update case status
    - Add trigger to create notification preferences for new users
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for user access control
*/

-- Notification Preferences Table
CREATE TABLE notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  location_radius integer DEFAULT 10,
  location_lat decimal,
  location_lng decimal,
  notify_new_cases boolean DEFAULT true,
  notify_updates boolean DEFAULT true,
  notify_vehicle_only boolean DEFAULT false,
  notify_person_only boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Notifications Table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL,
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Case Verifications Table
CREATE TABLE case_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  requester_id uuid REFERENCES auth.users(id),
  verifier_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  verification_type text NOT NULL,
  evidence text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (status IN ('pending', 'approved', 'rejected'))
);

ALTER TABLE case_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verifications"
  ON case_verifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can request verification"
  ON case_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Moderators can update verifications"
  ON case_verifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('moderator', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role IN ('moderator', 'admin')
    )
  );

-- Function to update case verification status
CREATE OR REPLACE FUNCTION update_case_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cases
  SET verification_status = 
    CASE 
      WHEN NEW.status = 'approved' THEN 'verified'
      WHEN NEW.status = 'rejected' THEN 'false_info'
      ELSE 'in_review'
    END
  WHERE id = NEW.case_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid conflicts
DROP TRIGGER IF EXISTS case_verification_status_update ON case_verifications;

CREATE TRIGGER case_verification_status_update
  AFTER INSERT OR UPDATE ON case_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_case_verification_status();

-- Function to create notification preferences on user creation
CREATE OR REPLACE FUNCTION create_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid conflicts
DROP TRIGGER IF EXISTS create_user_notification_preferences ON auth.users;

CREATE TRIGGER create_user_notification_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_preferences();

-- Indexes for better query performance
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);
CREATE INDEX idx_verifications_case ON case_verifications(case_id, status);