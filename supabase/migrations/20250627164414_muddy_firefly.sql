/*
  # Add visa step completion tracking columns

  1. New Columns
    - `application_step_completed` (boolean) - tracks if application step is completed
    - `interview_step_completed` (boolean) - tracks if interview step is completed  
    - `approval_step_completed` (boolean) - tracks if approval step is completed
    - `residency_step_completed` (boolean) - tracks if residency step is completed

  2. Data Updates
    - Set completion status based on existing boolean flags from the database schema
    - Use COALESCE to handle NULL values properly

  3. Security
    - Enable realtime publication for student_visa table with error handling
*/

-- Add step completion tracking columns to student_visa table
ALTER TABLE IF EXISTS student_visa
ADD COLUMN IF NOT EXISTS application_step_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS interview_step_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_step_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS residency_step_completed BOOLEAN DEFAULT false;

-- Update existing records to set completion status based on existing boolean columns
UPDATE student_visa
SET 
  application_step_completed = COALESCE(application_submitted, false),
  interview_step_completed = COALESCE(visa_interview, false),
  approval_step_completed = COALESCE(visa_approved, false),
  residency_step_completed = COALESCE(residency_registration, false);

-- Enable realtime for the table (with error handling)
DO $$
BEGIN
  -- Try to add the table to realtime publication
  ALTER publication supabase_realtime ADD TABLE student_visa;
EXCEPTION
  WHEN duplicate_object THEN
    -- Table already exists in publication, ignore error
    NULL;
  WHEN others THEN
    -- Log other errors but don't fail the migration
    RAISE NOTICE 'Could not add student_visa to realtime publication: %', SQLERRM;
END $$;