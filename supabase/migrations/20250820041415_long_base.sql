/*
  # Fix hostel registration workflow to require admin approval

  1. Database Changes
    - Ensure hostel registrations start as 'pending' and require admin approval
    - Prevent automatic approval of student-submitted registrations
    - Only admin-approved registrations should create hostel assignments

  2. Security
    - Maintain existing RLS policies
    - Ensure proper workflow separation between student requests and admin approvals
*/

-- Drop any existing triggers that might auto-approve registrations
DROP TRIGGER IF EXISTS auto_approve_hostel_registration ON hostel_registrations;
DROP FUNCTION IF EXISTS auto_approve_hostel_registration();

-- Create a function to handle hostel assignment only after admin approval
CREATE OR REPLACE FUNCTION handle_approved_hostel_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create hostel assignment when status changes to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Insert into student_hostel_assignments
    INSERT INTO student_hostel_assignments (
      student_id,
      hostel_id,
      assigned_date,
      status
    ) VALUES (
      NEW.student_id,
      NEW.hostel_id,
      CURRENT_DATE,
      'Active'
    )
    ON CONFLICT (student_id) 
    DO UPDATE SET 
      hostel_id = NEW.hostel_id,
      assigned_date = CURRENT_DATE,
      status = 'Active',
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for approved registrations
CREATE TRIGGER trigger_handle_approved_hostel_registration
  AFTER UPDATE ON hostel_registrations
  FOR EACH ROW
  EXECUTE FUNCTION handle_approved_hostel_registration();

-- Ensure default status is 'pending' for new registrations
ALTER TABLE hostel_registrations 
ALTER COLUMN status SET DEFAULT 'pending';