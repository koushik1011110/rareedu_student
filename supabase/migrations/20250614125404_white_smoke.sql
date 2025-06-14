/*
  # Fix verify_student_login function type mismatch

  1. Function Updates
    - Drop and recreate the verify_student_login function
    - Fix the return type mismatch for column 2 (username)
    - Change character varying(50) to text to match expected type

  2. Security
    - Maintain existing function permissions and security
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS verify_student_login(text, text);

-- Recreate the function with correct return types
CREATE OR REPLACE FUNCTION verify_student_login(
  input_username text,
  input_password text
)
RETURNS TABLE (
  student_id integer,
  username text,
  first_name text,
  last_name text,
  email text,
  admission_number text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    sc.username::text,
    s.first_name,
    s.last_name,
    s.email,
    s.admission_number
  FROM students s
  JOIN student_credentials sc ON s.id = sc.student_id
  WHERE sc.username = input_username 
    AND sc.password = input_password;
END;
$$;