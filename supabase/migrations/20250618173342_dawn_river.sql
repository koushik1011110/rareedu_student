/*
  # Add visa step completion tracking columns

  1. Changes
    - Add step completion tracking columns to student_visa table
    - Update existing records based on existing boolean columns
    - Enable realtime for the table

  2. Security
    - No RLS changes needed as table already has RLS enabled
*/

-- Add step completion tracking columns to student_visa table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_visa' AND column_name = 'application_step_completed'
  ) THEN
    ALTER TABLE student_visa ADD COLUMN application_step_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_visa' AND column_name = 'interview_step_completed'
  ) THEN
    ALTER TABLE student_visa ADD COLUMN interview_step_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_visa' AND column_name = 'approval_step_completed'
  ) THEN
    ALTER TABLE student_visa ADD COLUMN approval_step_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_visa' AND column_name = 'residency_step_completed'
  ) THEN
    ALTER TABLE student_visa ADD COLUMN residency_step_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update existing records to set completion status based on existing boolean columns
UPDATE student_visa
SET 
  application_step_completed = COALESCE(application_submitted, false),
  interview_step_completed = COALESCE(visa_interview, false),
  approval_step_completed = COALESCE(visa_approved, false),
  residency_step_completed = COALESCE(residency_registration, false)
WHERE application_step_completed IS NULL 
   OR interview_step_completed IS NULL 
   OR approval_step_completed IS NULL 
   OR residency_step_completed IS NULL;

-- Enable realtime for the table if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'student_visa'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE student_visa;
  END IF;
EXCEPTION
  WHEN others THEN
    -- Table might already be in publication, ignore error
    NULL;
END $$;