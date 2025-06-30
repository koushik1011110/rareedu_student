-- Add step completion tracking columns to student_visa table
ALTER TABLE IF EXISTS student_visa
ADD COLUMN IF NOT EXISTS application_step_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS interview_step_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_step_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS residency_step_completed BOOLEAN DEFAULT false;

-- Update existing records to set completion status based on dates
UPDATE student_visa
SET 
  application_step_completed = (application_date IS NOT NULL),
  interview_step_completed = (interview_date IS NOT NULL),
  approval_step_completed = (approval_date IS NOT NULL AND visa_status = 'Approved');

-- Enable realtime for the table
alter publication supabase_realtime add table student_visa;