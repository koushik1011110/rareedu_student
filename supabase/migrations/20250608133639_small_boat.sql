/*
  # Add application_status column to apply_students table

  1. Changes
    - Add `application_status` column to `apply_students` table
    - Set default value to 'pending'
    - Add check constraint for valid status values

  2. Security
    - No RLS changes needed as table already has RLS enabled
*/

-- Add application_status column to apply_students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apply_students' AND column_name = 'application_status'
  ) THEN
    ALTER TABLE apply_students ADD COLUMN application_status text DEFAULT 'pending'::text;
  END IF;
END $$;

-- Add check constraint for valid application status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'apply_students_application_status_check'
  ) THEN
    ALTER TABLE apply_students ADD CONSTRAINT apply_students_application_status_check 
    CHECK (application_status = ANY (ARRAY['pending'::text, 'approved'::text, 'cancelled'::text, 'rejected'::text]));
  END IF;
END $$;