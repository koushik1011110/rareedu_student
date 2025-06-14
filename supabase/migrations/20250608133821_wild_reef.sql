/*
  # Fix RLS policy for apply_students table

  1. Security Changes
    - Update INSERT policy to allow anonymous users to submit applications
    - Keep existing SELECT and UPDATE policies for authenticated users
    - Ensure data security while allowing registration

  This change allows unauthenticated users to submit their applications through the registration form,
  while maintaining security for viewing and updating applications.
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Allow authenticated users to insert applications" ON apply_students;

-- Create a new policy that allows anonymous users to insert applications
CREATE POLICY "Allow anonymous users to submit applications"
  ON apply_students
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Keep the existing policies for authenticated users to view and update
-- (These should already exist based on the schema, but ensuring they're correct)
DROP POLICY IF EXISTS "Allow authenticated users to view applications" ON apply_students;
CREATE POLICY "Allow authenticated users to view applications"
  ON apply_students
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to update applications" ON apply_students;
CREATE POLICY "Allow authenticated users to update applications"
  ON apply_students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);