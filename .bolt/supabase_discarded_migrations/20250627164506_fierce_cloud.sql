/*
  # Create visa deadlines and documents tables

  1. New Tables
    - `visa_deadlines`
      - `id` (integer, primary key)
      - `student_id` (integer, foreign key to students)
      - `title` (text)
      - `description` (text, nullable)
      - `due_date` (date)
      - `deadline_type` (varchar, default 'important')
      - `is_completed` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `visa_documents`
      - `id` (integer, primary key)
      - `student_id` (integer, foreign key to students)
      - `document_name` (text)
      - `is_available` (boolean, default false)
      - `document_url` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (matching existing pattern)

  3. Indexes
    - Add indexes for student_id columns for better query performance
    - Add index for due_date on visa_deadlines for sorting
*/

-- Create visa_deadlines table
CREATE TABLE IF NOT EXISTS visa_deadlines (
  id integer PRIMARY KEY DEFAULT nextval('visa_deadlines_id_seq'::regclass),
  student_id integer NOT NULL,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  deadline_type character varying(50) DEFAULT 'important'::character varying NOT NULL,
  is_completed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sequence for visa_deadlines if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'visa_deadlines_id_seq') THEN
    CREATE SEQUENCE visa_deadlines_id_seq;
    ALTER TABLE visa_deadlines ALTER COLUMN id SET DEFAULT nextval('visa_deadlines_id_seq'::regclass);
  END IF;
END $$;

-- Create visa_documents table
CREATE TABLE IF NOT EXISTS visa_documents (
  id integer PRIMARY KEY DEFAULT nextval('visa_documents_id_seq'::regclass),
  student_id integer NOT NULL,
  document_name text NOT NULL,
  is_available boolean DEFAULT false NOT NULL,
  document_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sequence for visa_documents if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'visa_documents_id_seq') THEN
    CREATE SEQUENCE visa_documents_id_seq;
    ALTER TABLE visa_documents ALTER COLUMN id SET DEFAULT nextval('visa_documents_id_seq'::regclass);
  END IF;
END $$;

-- Add foreign key constraints
ALTER TABLE visa_deadlines 
ADD CONSTRAINT IF NOT EXISTS visa_deadlines_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

ALTER TABLE visa_documents 
ADD CONSTRAINT IF NOT EXISTS visa_documents_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visa_deadlines_student_id ON visa_deadlines(student_id);
CREATE INDEX IF NOT EXISTS idx_visa_deadlines_due_date ON visa_deadlines(due_date);
CREATE INDEX IF NOT EXISTS idx_visa_deadlines_is_completed ON visa_deadlines(is_completed);
CREATE INDEX IF NOT EXISTS idx_visa_documents_student_id ON visa_documents(student_id);

-- Add check constraints
ALTER TABLE visa_deadlines 
ADD CONSTRAINT IF NOT EXISTS visa_deadlines_deadline_type_check 
CHECK (deadline_type IN ('mandatory', 'important', 'optional'));

-- Enable RLS
ALTER TABLE visa_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_documents ENABLE ROW LEVEL SECURITY;

-- Add RLS policies (following the pattern from existing tables)
CREATE POLICY IF NOT EXISTS "Allow all operations on visa_deadlines"
  ON visa_deadlines
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on visa_documents"
  ON visa_documents
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_visa_deadlines_updated_at
  BEFORE UPDATE ON visa_deadlines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_visa_documents_updated_at
  BEFORE UPDATE ON visa_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();