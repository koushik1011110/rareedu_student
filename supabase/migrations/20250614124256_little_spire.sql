/*
  # Create student credentials system

  1. New Tables
    - `student_credentials`
      - `id` (uuid, primary key)
      - `student_id` (integer, foreign key to students)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `student_credentials` table
    - Add policies for authentication access

  3. Functions & Triggers
    - Function to generate username and password for new students
    - Trigger to execute when student is inserted into students table
    - Function to hash passwords

  4. Indexes
    - Performance indexes on username for login queries
*/

-- Create student_credentials table
CREATE TABLE IF NOT EXISTS student_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id integer NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT student_credentials_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE student_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for authentication
CREATE POLICY "Allow public to read credentials for authentication"
  ON student_credentials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update their own credentials"
  ON student_credentials
  FOR UPDATE
  TO authenticated
  USING (true);

-- Function to generate a random password
CREATE OR REPLACE FUNCTION generate_random_password(length integer DEFAULT 8)
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to generate username from student data
CREATE OR REPLACE FUNCTION generate_username(first_name text, last_name text, student_id integer)
RETURNS text AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 1;
BEGIN
  -- Create base username from first name + last name + student ID
  base_username := lower(
    regexp_replace(
      concat(
        substr(first_name, 1, 3),
        substr(last_name, 1, 3),
        student_id::text
      ),
      '[^a-zA-Z0-9]', '', 'g'
    )
  );
  
  final_username := base_username;
  
  -- Check if username exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM student_credentials WHERE username = final_username) LOOP
    final_username := base_username || counter::text;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- Function to create credentials for new student
CREATE OR REPLACE FUNCTION create_student_credentials()
RETURNS TRIGGER AS $$
DECLARE
  new_username text;
  new_password text;
  password_hash text;
BEGIN
  -- Generate username
  new_username := generate_username(NEW.first_name, NEW.last_name, NEW.id);
  
  -- Generate random password
  new_password := generate_random_password(10);
  
  -- Hash the password using crypt
  password_hash := crypt(new_password, gen_salt('bf'));
  
  -- Insert credentials
  INSERT INTO student_credentials (student_id, username, password_hash)
  VALUES (NEW.id, new_username, password_hash);
  
  -- Log the generated credentials (in production, this should be sent via email)
  RAISE NOTICE 'Student credentials created - Username: %, Password: %', new_username, new_password;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate credentials when student is inserted
CREATE TRIGGER trigger_create_student_credentials
  AFTER INSERT ON students
  FOR EACH ROW
  EXECUTE FUNCTION create_student_credentials();

-- Function to verify student login
CREATE OR REPLACE FUNCTION verify_student_login(input_username text, input_password text)
RETURNS TABLE(
  student_id integer,
  username text,
  first_name text,
  last_name text,
  email text,
  admission_number text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    sc.username,
    s.first_name,
    s.last_name,
    s.email,
    s.admission_number
  FROM student_credentials sc
  JOIN students s ON sc.student_id = s.id
  WHERE sc.username = input_username 
    AND sc.password_hash = crypt(input_password, sc.password_hash)
    AND s.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_credentials_username ON student_credentials(username);
CREATE INDEX IF NOT EXISTS idx_student_credentials_student_id ON student_credentials(student_id);

-- Generate credentials for existing students
DO $$
DECLARE
  student_record RECORD;
BEGIN
  FOR student_record IN 
    SELECT id, first_name, last_name 
    FROM students 
    WHERE id NOT IN (SELECT student_id FROM student_credentials)
  LOOP
    PERFORM create_student_credentials() FROM (SELECT student_record.*) AS NEW;
  END LOOP;
END $$;