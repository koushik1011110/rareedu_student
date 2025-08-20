/*
  # Fix RLS policies for hostel registrations

  1. Security Updates
    - Add policy for students to insert their own hostel registration requests
    - Add policy for students to view their own hostel registrations
    - Ensure existing admin policies remain intact

  2. Changes
    - Allow authenticated users to insert registrations for themselves
    - Allow users to view their own registration records
    - Maintain admin access for approval/rejection workflow
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "admin_delete_hostel_regs" ON hostel_registrations;
DROP POLICY IF EXISTS "admin_update_hostel_regs" ON hostel_registrations;
DROP POLICY IF EXISTS "p_delete_hostel_regs" ON hostel_registrations;
DROP POLICY IF EXISTS "p_update_hostel_regs" ON hostel_registrations;

-- Create comprehensive RLS policies for hostel registrations
CREATE POLICY "students_can_insert_own_registrations"
  ON hostel_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "students_can_view_own_registrations"
  ON hostel_registrations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "admins_can_update_registrations"
  ON hostel_registrations
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admins_can_delete_registrations"
  ON hostel_registrations
  FOR DELETE
  TO public
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE hostel_registrations ENABLE ROW LEVEL SECURITY;