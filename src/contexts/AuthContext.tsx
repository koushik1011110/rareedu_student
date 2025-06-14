import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  applicationNumber: string;
  profileImage?: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (applicationNumber: string, email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Call the verify_student_login function
      const { data, error } = await supabase.rpc('verify_student_login', {
        input_username: username,
        input_password: password
      });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid username or password');
      }

      const studentData = data[0];
      
      const userWithoutPassword = {
        id: studentData.student_id.toString(),
        name: `${studentData.first_name} ${studentData.last_name}`,
        email: studentData.email || '',
        applicationNumber: studentData.admission_number || '',
        username: studentData.username,
        profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      };

      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const register = async (
    applicationNumber: string, 
    email: string, 
    password: string, 
    name: string
  ) => {
    // This function is kept for backward compatibility but not used
    // Registration now happens through the apply_students form
    throw new Error('Please use the application form to register');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};