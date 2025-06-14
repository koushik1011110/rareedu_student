/*
  # Create apply_students table for student applications

  1. New Tables
    - `apply_students`
      - Same structure as `students` table plus `status` and `application_status` columns
      - Used for storing student applications before approval
      - Automatically moves data to `students` table when approved

  2. Security
    - Enable RLS on `apply_students` table
    - Add policies for public insert/read and authenticated update access

  3. Functions & Triggers
    - Function to automatically move approved applications to students table
    - Trigger to execute the function on status update

  4. Indexes
    - Performance indexes on commonly queried columns
*/

-- Create sequence first
CREATE SEQUENCE IF NOT EXISTS apply_students_id_seq;

-- Create apply_students table with same structure as students plus status
CREATE TABLE IF NOT EXISTS apply_students (
  id integer PRIMARY KEY DEFAULT nextval('apply_students_id_seq'::regclass),
  first_name text NOT NULL,
  last_name text NOT NULL,
  father_name text NOT NULL,
  mother_name text NOT NULL,
  date_of_birth date NOT NULL,
  phone_number text,
  email text,
  university_id integer,
  course_id integer,
  academic_session_id integer,
  status text DEFAULT 'pending'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  admission_number text,
  city character varying(100),
  country character varying(100),
  address text,
  aadhaar_number character varying(12),
  passport_number character varying(20),
  twelfth_marks numeric(5,2),
  seat_number character varying(50),
  scores text,
  photo_url text,
  passport_copy_url text,
  aadhaar_copy_url text,
  twelfth_certificate_url text,
  application_status text DEFAULT 'pending'::text,
  
  -- Constraints
  CONSTRAINT apply_students_status_check CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'cancelled'::text])),
  CONSTRAINT apply_students_application_status_check CHECK (application_status = ANY (ARRAY['pending'::text, 'approved'::text, 'cancelled'::text, 'rejected'::text]))
);

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'apply_students_academic_session_id_fkey'
  ) THEN
    ALTER TABLE apply_students 
    ADD CONSTRAINT apply_students_academic_session_id_fkey 
    FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'apply_students_course_id_fkey'
  ) THEN
    ALTER TABLE apply_students 
    ADD CONSTRAINT apply_students_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES courses(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'apply_students_university_id_fkey'
  ) THEN
    ALTER TABLE apply_students 
    ADD CONSTRAINT apply_students_university_id_fkey 
    FOREIGN KEY (university_id) REFERENCES universities(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE apply_students ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'apply_students' AND policyname = 'Allow public to insert applications'
  ) THEN
    CREATE POLICY "Allow public to insert applications"
      ON apply_students
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'apply_students' AND policyname = 'Allow public to read applications'
  ) THEN
    CREATE POLICY "Allow public to read applications"
      ON apply_students
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'apply_students' AND policyname = 'Allow authenticated users to update applications'
  ) THEN
    CREATE POLICY "Allow authenticated users to update applications"
      ON apply_students
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Function to move approved application to students table
CREATE OR REPLACE FUNCTION move_approved_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Insert into students table
    INSERT INTO students (
      first_name, last_name, father_name, mother_name, date_of_birth,
      phone_number, email, university_id, course_id, academic_session_id,
      status, city, country, address, aadhaar_number, passport_number,
      twelfth_marks, seat_number, scores, photo_url, passport_copy_url,
      aadhaar_copy_url, twelfth_certificate_url
    ) VALUES (
      NEW.first_name, NEW.last_name, NEW.father_name, NEW.mother_name, NEW.date_of_birth,
      NEW.phone_number, NEW.email, NEW.university_id, NEW.course_id, NEW.academic_session_id,
      'active', NEW.city, NEW.country, NEW.address, NEW.aadhaar_number, NEW.passport_number,
      NEW.twelfth_marks, NEW.seat_number, NEW.scores, NEW.photo_url, NEW.passport_copy_url,
      NEW.aadhaar_copy_url, NEW.twelfth_certificate_url
    );
    
    -- Delete from apply_students table
    DELETE FROM apply_students WHERE id = NEW.id;
    
    -- Return NULL to prevent the update (since we deleted the row)
    RETURN NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_move_approved_application'
  ) THEN
    CREATE TRIGGER trigger_move_approved_application
      BEFORE UPDATE ON apply_students
      FOR EACH ROW
      EXECUTE FUNCTION move_approved_application();
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apply_students_email ON apply_students(email);
CREATE INDEX IF NOT EXISTS idx_apply_students_status ON apply_students(status);
CREATE INDEX IF NOT EXISTS idx_apply_students_university_id ON apply_students(university_id);
CREATE INDEX IF NOT EXISTS idx_apply_students_course_id ON apply_students(course_id);
CREATE INDEX IF NOT EXISTS idx_apply_students_academic_session_id ON apply_students(academic_session_id);