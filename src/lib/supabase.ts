import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      apply_students: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          father_name: string;
          mother_name: string;
          date_of_birth: string;
          phone_number: string | null;
          email: string | null;
          university_id: number | null;
          course_id: number | null;
          academic_session_id: number | null;
          status: string;
          created_at: string | null;
          updated_at: string | null;
          admission_number: string | null;
          city: string | null;
          country: string | null;
          address: string | null;
          aadhaar_number: string | null;
          passport_number: string | null;
          twelfth_marks: number | null;
          seat_number: string | null;
          scores: string | null;
          photo_url: string | null;
          passport_copy_url: string | null;
          aadhaar_copy_url: string | null;
          twelfth_certificate_url: string | null;
          application_status: string;
        };
        Insert: {
          id?: number;
          first_name: string;
          last_name: string;
          father_name: string;
          mother_name: string;
          date_of_birth: string;
          phone_number?: string | null;
          email?: string | null;
          university_id?: number | null;
          course_id?: number | null;
          academic_session_id?: number | null;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
          admission_number?: string | null;
          city?: string | null;
          country?: string | null;
          address?: string | null;
          aadhaar_number?: string | null;
          passport_number?: string | null;
          twelfth_marks?: number | null;
          seat_number?: string | null;
          scores?: string | null;
          photo_url?: string | null;
          passport_copy_url?: string | null;
          aadhaar_copy_url?: string | null;
          twelfth_certificate_url?: string | null;
          application_status?: string;
        };
        Update: {
          id?: number;
          first_name?: string;
          last_name?: string;
          father_name?: string;
          mother_name?: string;
          date_of_birth?: string;
          phone_number?: string | null;
          email?: string | null;
          university_id?: number | null;
          course_id?: number | null;
          academic_session_id?: number | null;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
          admission_number?: string | null;
          city?: string | null;
          country?: string | null;
          address?: string | null;
          aadhaar_number?: string | null;
          passport_number?: string | null;
          twelfth_marks?: number | null;
          seat_number?: string | null;
          scores?: string | null;
          photo_url?: string | null;
          passport_copy_url?: string | null;
          aadhaar_copy_url?: string | null;
          twelfth_certificate_url?: string | null;
          application_status?: string;
        };
      };
      students: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          father_name: string;
          mother_name: string;
          date_of_birth: string;
          phone_number: string | null;
          email: string | null;
          university_id: number | null;
          course_id: number | null;
          academic_session_id: number | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
          admission_number: string | null;
          city: string | null;
          country: string | null;
          address: string | null;
          aadhaar_number: string | null;
          passport_number: string | null;
          twelfth_marks: number | null;
          seat_number: string | null;
          scores: string | null;
          photo_url: string | null;
          passport_copy_url: string | null;
          aadhaar_copy_url: string | null;
          twelfth_certificate_url: string | null;
        };
      };
      student_credentials: {
        Row: {
          id: number;
          student_id: number;
          username: string;
          password: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          student_id: number;
          username: string;
          password: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          student_id?: number;
          username?: string;
          password?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      universities: {
        Row: {
          id: number;
          name: string;
          created_at: string | null;
        };
      };
      courses: {
        Row: {
          id: number;
          name: string;
          created_at: string | null;
        };
      };
      academic_sessions: {
        Row: {
          id: number;
          session_name: string;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean | null;
          created_at: string | null;
        };
      };
    };
  };
};