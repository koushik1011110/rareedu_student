import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, User, Hash, AlertCircle, 
  Phone, MapPin, Calendar, GraduationCap, Upload, FileText 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type RegisterFormInputs = {
  // Personal Information
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  
  // Address Information
  address: string;
  city: string;
  country: string;
  
  // Academic Information
  university_id: number;
  course_id: number;
  academic_session_id: number;
  twelfth_marks: number;
  seat_number: string;
  scores: string;
  
  // Identity Documents
  aadhaar_number: string;
  passport_number: string;
  
  // Document Uploads
  photo_url: string;
  passport_copy_url: string;
  aadhaar_copy_url: string;
  twelfth_certificate_url: string;
  
  // Authentication
  password: string;
  confirmPassword: string;
};

type University = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  name: string;
};

type AcademicSession = {
  id: number;
  session_name: string;
  is_active: boolean;
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
    trigger
  } = useForm<RegisterFormInputs>();

  const password = watch('password');

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesRes, coursesRes, sessionsRes] = await Promise.all([
          supabase.from('universities').select('id, name'),
          supabase.from('courses').select('id, name'),
          supabase.from('academic_sessions').select('id, session_name, is_active').eq('is_active', true)
        ]);

        if (universitiesRes.data) setUniversities(universitiesRes.data);
        if (coursesRes.data) setCourses(coursesRes.data);
        if (sessionsRes.data) setAcademicSessions(sessionsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Prepare application data (excluding password fields)
      const { password: _, confirmPassword: __, ...applicationData } = data;
      
      // Insert into apply_students table
      const { error: insertError } = await supabase
        .from('apply_students')
        .insert([{
          ...applicationData,
          status: 'pending',
          application_status: 'pending'
        }]);

      if (insertError) {
        throw insertError;
      }

      // Show success message and redirect
      alert('Application submitted successfully! You will receive an email notification once your application is reviewed.');
      navigate('/login');
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getFieldsForStep = (step: number): (keyof RegisterFormInputs)[] => {
    switch (step) {
      case 1:
        return ['first_name', 'last_name', 'father_name', 'mother_name', 'date_of_birth', 'phone_number', 'email'];
      case 2:
        return ['address', 'city', 'country', 'aadhaar_number', 'passport_number'];
      case 3:
        return ['university_id', 'course_id', 'academic_session_id', 'twelfth_marks', 'seat_number'];
      case 4:
        return ['password', 'confirmPassword'];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="first_name"
                    type="text"
                    className={`input pl-10 ${errors.first_name ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter your first name"
                    {...register('first_name', { required: 'First name is required' })}
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-error-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="last_name"
                    type="text"
                    className={`input pl-10 ${errors.last_name ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter your last name"
                    {...register('last_name', { required: 'Last name is required' })}
                  />
                </div>
                {errors.last_name && (
                  <p className="mt-1 text-sm text-error-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name *
                </label>
                <input
                  id="father_name"
                  type="text"
                  className={`input ${errors.father_name ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter father's name"
                  {...register('father_name', { required: 'Father\'s name is required' })}
                />
                {errors.father_name && (
                  <p className="mt-1 text-sm text-error-600">{errors.father_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Name *
                </label>
                <input
                  id="mother_name"
                  type="text"
                  className={`input ${errors.mother_name ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter mother's name"
                  {...register('mother_name', { required: 'Mother\'s name is required' })}
                />
                {errors.mother_name && (
                  <p className="mt-1 text-sm text-error-600">{errors.mother_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    id="date_of_birth"
                    type="date"
                    className={`input pl-10 ${errors.date_of_birth ? 'border-error-500 focus:ring-error-500' : ''}`}
                    {...register('date_of_birth', { required: 'Date of birth is required' })}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="mt-1 text-sm text-error-600">{errors.date_of_birth.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    id="phone_number"
                    type="tel"
                    className={`input pl-10 ${errors.phone_number ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter your phone number"
                    {...register('phone_number', { required: 'Phone number is required' })}
                  />
                </div>
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-error-600">{errors.phone_number.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`input pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your email address"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { 
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address & Identity Information</h3>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <textarea
                  id="address"
                  rows={3}
                  className={`input pl-10 ${errors.address ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your complete address"
                  {...register('address', { required: 'Address is required' })}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  className={`input ${errors.city ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your city"
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-error-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  id="country"
                  type="text"
                  className={`input ${errors.country ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your country"
                  {...register('country', { required: 'Country is required' })}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-error-600">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="aadhaar_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Hash size={18} />
                  </div>
                  <input
                    id="aadhaar_number"
                    type="text"
                    maxLength={12}
                    className={`input pl-10 ${errors.aadhaar_number ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter 12-digit Aadhaar number"
                    {...register('aadhaar_number', {
                      pattern: {
                        value: /^\d{12}$/,
                        message: 'Aadhaar number must be 12 digits'
                      }
                    })}
                  />
                </div>
                {errors.aadhaar_number && (
                  <p className="mt-1 text-sm text-error-600">{errors.aadhaar_number.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="passport_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Passport Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Hash size={18} />
                  </div>
                  <input
                    id="passport_number"
                    type="text"
                    className={`input pl-10 ${errors.passport_number ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter passport number"
                    {...register('passport_number')}
                  />
                </div>
                {errors.passport_number && (
                  <p className="mt-1 text-sm text-error-600">{errors.passport_number.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="university_id" className="block text-sm font-medium text-gray-700 mb-1">
                  University *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <GraduationCap size={18} />
                  </div>
                  <select
                    id="university_id"
                    className={`input pl-10 ${errors.university_id ? 'border-error-500 focus:ring-error-500' : ''}`}
                    {...register('university_id', { 
                      required: 'Please select a university',
                      valueAsNumber: true 
                    })}
                  >
                    <option value="">Select University</option>
                    {universities.map((university) => (
                      <option key={university.id} value={university.id}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.university_id && (
                  <p className="mt-1 text-sm text-error-600">{errors.university_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <select
                  id="course_id"
                  className={`input ${errors.course_id ? 'border-error-500 focus:ring-error-500' : ''}`}
                  {...register('course_id', { 
                    required: 'Please select a course',
                    valueAsNumber: true 
                  })}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {errors.course_id && (
                  <p className="mt-1 text-sm text-error-600">{errors.course_id.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="academic_session_id" className="block text-sm font-medium text-gray-700 mb-1">
                Academic Session *
              </label>
              <select
                id="academic_session_id"
                className={`input ${errors.academic_session_id ? 'border-error-500 focus:ring-error-500' : ''}`}
                {...register('academic_session_id', { 
                  required: 'Please select an academic session',
                  valueAsNumber: true 
                })}
              >
                <option value="">Select Academic Session</option>
                {academicSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.session_name}
                  </option>
                ))}
              </select>
              {errors.academic_session_id && (
                <p className="mt-1 text-sm text-error-600">{errors.academic_session_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twelfth_marks" className="block text-sm font-medium text-gray-700 mb-1">
                  12th Grade Marks (%) *
                </label>
                <input
                  id="twelfth_marks"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className={`input ${errors.twelfth_marks ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your 12th grade percentage"
                  {...register('twelfth_marks', { 
                    required: '12th grade marks are required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Marks cannot be negative' },
                    max: { value: 100, message: 'Marks cannot exceed 100%' }
                  })}
                />
                {errors.twelfth_marks && (
                  <p className="mt-1 text-sm text-error-600">{errors.twelfth_marks.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="seat_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Number
                </label>
                <input
                  id="seat_number"
                  type="text"
                  className={`input ${errors.seat_number ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter seat number (if applicable)"
                  {...register('seat_number')}
                />
                {errors.seat_number && (
                  <p className="mt-1 text-sm text-error-600">{errors.seat_number.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="scores" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Scores/Achievements
              </label>
              <textarea
                id="scores"
                rows={3}
                className={`input ${errors.scores ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="Enter any additional test scores, achievements, or qualifications"
                {...register('scores')}
              />
              {errors.scores && (
                <p className="mt-1 text-sm text-error-600">{errors.scores.message}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`input pl-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Create a password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { 
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input pl-10 ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value) => 
                      value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="mt-6 p-4 bg-skyblue-50 rounded-lg">
              <h4 className="font-medium text-skyblue-900 mb-2">Application Review Process</h4>
              <ul className="text-sm text-skyblue-800 space-y-1">
                <li>• Your application will be reviewed within 3-5 business days</li>
                <li>• You will receive email notifications about status updates</li>
                <li>• Once approved, you can access the full student portal</li>
                <li>• Keep your application number safe for future reference</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Registration form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
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
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Student Application</h1>
            <p className="mt-2 text-gray-600">Apply for admission to our programs</p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Personal</span>
              <span>Address</span>
              <span>Academic</span>
              <span>Security</span>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-error-50 border-l-4 border-error-500 text-error-700 flex items-start">
              <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary ml-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Application...
                    </span>
                  ) : 'Submit Application'}
                </button>
              )}
            </div>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
      
      {/* Right side - Image/Branding */}
      <div className="hidden md:block md:w-1/2 bg-primary-500 text-white p-10">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold">Join Our Academic Community</h2>
            <p className="mt-2 text-skyblue-100">Start your educational journey with us</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-primary-600/30 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-white">Comprehensive Application</h3>
              <p className="mt-2 text-skyblue-200">
                Complete application process with document management and status tracking.
              </p>
            </div>
            
            <div className="bg-primary-600/30 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-white">Quick Review Process</h3>
              <p className="mt-2 text-skyblue-200">
                Fast application review with email notifications for status updates.
              </p>
            </div>
            
            <div className="bg-primary-600/30 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-white">Student Portal Access</h3>
              <p className="mt-2 text-skyblue-200">
                Once approved, get full access to student services and resources.
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

export default Register;