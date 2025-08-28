import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

type LoginFormInputs = {
  username: string;
  password: string;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setError('');
      setLoading(true);
      await login(data.username, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <span className="flex items-center justify-center w-12 h-12 bg-primary-500 rounded-xl text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-600">Sign in to your student portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 border-l-4 border-error-500 text-error-700 flex items-start">
              <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  className={`input pl-10 ${errors.username ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your username"
                  {...register('username', { 
                    required: 'Username is required'
                  })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-error-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`input pl-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', { 
                    required: 'Password is required'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
            
            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                  Apply now
                </Link>
              </p>
            </div>
          </form>
          
          {/* Demo credentials info */}
          <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">For approved students:</p>
            <p className="text-sm text-gray-600 mt-1">Use your generated username and password</p>
            <p className="text-sm text-gray-600">Check your email or contact admin for credentials</p>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Image/Branding */}
      <div className="hidden md:block md:w-1/2 bg-primary-500 text-white p-10">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold">Student Portal</h2>
            <p className="mt-2 text-skyblue-100">Your academic journey, simplified</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-primary-600/30 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-white">Track Your Progress</h3>
              <p className="mt-2 text-skyblue-200">
                Monitor your admission status, visa information, and academic achievements in one place.
              </p>
            </div>
            
            <div className="bg-primary-600/30 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-white">Manage Documents</h3>
              <p className="mt-2 text-skyblue-200">
                Access and download important documents anytime, anywhere.
              </p>
            </div>
            
            <div className="bg-primary-600/30 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-white">My Account</h3>
              <p className="mt-2 text-skyblue-200">
                Track payments, view fee structure, and manage your account with ease.
              </p>
            </div>
          </div>
          
          <div className="text-sm text-skyblue-200">
            © 2025 Student Portal. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;