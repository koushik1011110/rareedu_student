import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not set
let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not configured. Using mock client.",
  );

  // Create a mock supabase client for development with sample data
  const mockVisaData = {
    id: 1,
    student_id: 1,
    visa_type: "F-1 Student Visa",
    visa_status: "Approved",
    visa_number: "F1234567890",
    issue_date: "2024-06-15",
    expiration_date: "2026-06-15",
    entry_type: "Multiple Entry",
    application_date: "2024-03-01",
    interview_date: "2024-05-15",
    approval_date: "2024-06-01",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    application_submitted: true,
    visa_interview: true,
    visa_approved: true,
    residency_registration: false,
  };

  // Residency data is now fetched from the student_visa table
  const mockResidencyData = {
    id: 1,
    student_id: 1,
    registration_status: "Pending Registration",
    registration_deadline: "2025-09-15",
    current_address: "123 University Ave, College Town, ST 12345",
    local_id_number: null,
    registration_date: null,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  };

  const mockDeadlines = [
    {
      id: 1,
      student_id: 1,
      title: "Complete Residency Registration",
      description: "Register with local authorities within 30 days of arrival",
      due_date: "2025-09-15",
      deadline_type: "mandatory",
      is_completed: false,
      created_at: "2024-06-01T00:00:00Z",
      updated_at: "2024-06-01T00:00:00Z",
    },
    {
      id: 2,
      student_id: 1,
      title: "Visa Renewal Application",
      description: "Submit visa renewal application 90 days before expiration",
      due_date: "2026-03-15",
      deadline_type: "important",
      is_completed: false,
      created_at: "2024-06-01T00:00:00Z",
      updated_at: "2024-06-01T00:00:00Z",
    },
  ];

  const mockDocuments = [
    {
      id: 1,
      student_id: 1,
      document_name: "Visa Approval Letter",
      is_available: true,
      document_url: "#",
      created_at: "2024-06-01T00:00:00Z",
      updated_at: "2024-06-01T00:00:00Z",
    },
    {
      id: 2,
      student_id: 1,
      document_name: "I-20 Form",
      is_available: true,
      document_url: "#",
      created_at: "2024-06-01T00:00:00Z",
      updated_at: "2024-06-01T00:00:00Z",
    },
    {
      id: 3,
      student_id: 1,
      document_name: "Residency Registration Certificate",
      is_available: false,
      document_url: null,
      created_at: "2024-06-01T00:00:00Z",
      updated_at: "2024-06-01T00:00:00Z",
    },
  ];

  supabase = {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => {
            if (table === "student_visa") {
              return Promise.resolve({ data: mockVisaData, error: null });
            } else if (table === "student_residency") {
              return Promise.resolve({ data: mockResidencyData, error: null });
            }
            return Promise.resolve({ data: null, error: { code: "PGRST116" } });
          },
          order: (column: string, options?: any) => {
            if (table === "visa_deadlines") {
              return Promise.resolve({ data: mockDeadlines, error: null });
            }
            return Promise.resolve({ data: [], error: null });
          },
        }),
        order: (column: string, options?: any) => {
          if (table === "visa_deadlines") {
            return Promise.resolve({ data: mockDeadlines, error: null });
          }
          return Promise.resolve({ data: [], error: null });
        },
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      eq: function (column: string, value: any) {
        if (table === "student_visa") {
          return {
            single: () => Promise.resolve({ data: mockVisaData, error: null }),
          };
        } else if (table === "visa_deadlines") {
          return {
            order: (column: string, options?: any) =>
              Promise.resolve({ data: mockDeadlines, error: null }),
          };
        } else if (table === "visa_documents") {
          return Promise.resolve({ data: mockDocuments, error: null });
        }
        return Promise.resolve({ data: [], error: null });
      },
    }),
    rpc: () =>
      Promise.resolve({
        data: [],
        error: new Error("Mock client - configure Supabase credentials"),
      }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

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
      student_visa: {
        Row: {
          id: number;
          student_id: number;
          visa_type: string;
          visa_status: string;
          visa_number: string;
          issue_date: string | null;
          expiration_date: string | null;
          entry_type: string | null;
          application_date: string | null;
          interview_date: string | null;
          approval_date: string | null;
          created_at: string | null;
          updated_at: string | null;
          application_submitted: boolean;
          visa_interview: boolean;
          visa_approved: boolean;
          residency_registration: boolean;
        };
        Insert: {
          id?: number;
          student_id: number;
          visa_type: string;
          visa_status: string;
          visa_number: string;
          issue_date?: string | null;
          expiration_date?: string | null;
          entry_type?: string | null;
          application_date?: string | null;
          interview_date?: string | null;
          approval_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          application_submitted?: boolean;
          visa_interview?: boolean;
          visa_approved?: boolean;
          residency_registration?: boolean;
        };
        Update: {
          id?: number;
          student_id?: number;
          visa_type?: string;
          visa_status?: string;
          visa_number?: string;
          issue_date?: string | null;
          expiration_date?: string | null;
          entry_type?: string | null;
          application_date?: string | null;
          interview_date?: string | null;
          approval_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          application_submitted?: boolean;
          visa_interview?: boolean;
          visa_approved?: boolean;
          residency_registration?: boolean;
        };
      };
      student_residency: {
        Row: {
          id: number;
          student_id: number;
          registration_status: string;
          registration_deadline: string | null;
          current_address: string | null;
          local_id_number: string | null;
          registration_date: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          student_id: number;
          registration_status: string;
          registration_deadline?: string | null;
          current_address?: string | null;
          local_id_number?: string | null;
          registration_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          student_id?: number;
          registration_status?: string;
          registration_deadline?: string | null;
          current_address?: string | null;
          local_id_number?: string | null;
          registration_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      visa_deadlines: {
        Row: {
          id: number;
          student_id: number;
          title: string;
          description: string | null;
          due_date: string;
          deadline_type: string;
          is_completed: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          student_id: number;
          title: string;
          description?: string | null;
          due_date: string;
          deadline_type: string;
          is_completed?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          student_id?: number;
          title?: string;
          description?: string | null;
          due_date?: string;
          deadline_type?: string;
          is_completed?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      visa_documents: {
        Row: {
          id: number;
          student_id: number;
          document_name: string;
          is_available: boolean;
          document_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          student_id: number;
          document_name: string;
          is_available?: boolean;
          document_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          student_id?: number;
          document_name?: string;
          is_available?: boolean;
          document_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
};
