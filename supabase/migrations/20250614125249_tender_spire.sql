/*
  # Fix verify_student_login RPC function

  1. Function Updates
    - Create or replace the `verify_student_login` function
    - Fix column reference from `password_hash` to `password`
    - Return student data with credentials for authentication

  2. Security
    - Function uses SECURITY DEFINER to access student_credentials table
    - Returns only necessary data for authentication
*/

-- Create or replace the verify_student_login function
CREATE OR REPLACE FUNCTION verify_student_login(
  input_username TEXT,
  input_password TEXT
)
RETURNS TABLE(
  student_id INTEGER,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  admission_number TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as student_id,
    sc.username,
    s.first_name,
    s.last_name,
    s.email,
    s.admission_number
  FROM student_credentials sc
  JOIN students s ON sc.student_id = s.id
  WHERE sc.username = input_username 
    AND sc.password = input_password;
END;
$$;