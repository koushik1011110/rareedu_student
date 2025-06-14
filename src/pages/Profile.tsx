import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Mail, User, Phone, Home, MapPin, GraduationCap, Calendar, Edit2 } from 'lucide-react';

type ProfileFormInputs = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  program: string;
  applicationNumber: string;
};

// Mock data for profile
const profileData = {
  phone: '+1 (555) 987-6543',
  address: '123 Student Ave',
  city: 'University City',
  country: 'United States',
  program: 'Master of Computer Science',
  startDate: new Date('2025-09-01'),
  expectedGraduation: new Date('2027-06-01'),
  academicStatus: 'Full-time',
};

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      country: profileData.country,
      program: profileData.program,
      applicationNumber: user?.applicationNumber || '',
    }
  });
  
  const onSubmit = (data: ProfileFormInputs) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Updated profile:', data);
      setLoading(false);
      setEditing(false);
    }, 1500);
  };
  
  return (
    <div className="pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">View and manage your personal information</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="mt-4 md:mt-0 btn btn-outline"
          >
            {editing ? 'Cancel' : (
              <>
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Profile summary and photo */}
          <div className="md:col-span-1">
            <div className="card">
              <div className="flex flex-col items-center pb-6">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{profileData.program}</p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {profileData.academicStatus}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      {profileData.address}, {profileData.city}, {profileData.country}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm">{user?.applicationNumber}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Program Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="text-sm font-medium">
                        {profileData.startDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Expected Graduation</p>
                      <p className="text-sm font-medium">
                        {profileData.expectedGraduation.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Edit profile form or profile details */}
          <div className="md:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {editing ? 'Edit Profile' : 'Profile Information'}
              </h2>
              
              {editing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <User size={18} />
                        </div>
                        <input
                          id="name"
                          type="text"
                          className={`input pl-10 ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
                          {...register('name', { required: 'Name is required' })}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input
                          id="email"
                          type="email"
                          className="input pl-10 bg-gray-100"
                          {...register('email')}
                          disabled
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone size={18} />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          className={`input pl-10 ${errors.phone ? 'border-error-500 focus:ring-error-500' : ''}`}
                          {...register('phone', { required: 'Phone number is required' })}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Home size={18} />
                        </div>
                        <input
                          id="address"
                          type="text"
                          className={`input pl-10 ${errors.address ? 'border-error-500 focus:ring-error-500' : ''}`}
                          {...register('address', { required: 'Address is required' })}
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        className={`input ${errors.city ? 'border-error-500 focus:ring-error-500' : ''}`}
                        {...register('city', { required: 'City is required' })}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-error-600">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        className={`input ${errors.country ? 'border-error-500 focus:ring-error-500' : ''}`}
                        {...register('country', { required: 'Country is required' })}
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-error-600">{errors.country.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
                        Program
                      </label>
                      <input
                        id="program"
                        type="text"
                        className="input bg-gray-100"
                        {...register('program')}
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Contact administration to change program</p>
                    </div>
                    
                    <div>
                      <label htmlFor="applicationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Application Number
                      </label>
                      <input
                        id="applicationNumber"
                        type="text"
                        className="input bg-gray-100"
                        {...register('applicationNumber')}
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Application number cannot be changed</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`btn btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                      <div className="mt-3 space-y-4">
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="font-medium">{profileData.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address Information</h3>
                      <div className="mt-3 space-y-4">
                        <div>
                          <p className="text-xs text-gray-500">Street Address</p>
                          <p className="font-medium">{profileData.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">City</p>
                          <p className="font-medium">{profileData.city}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Country</p>
                          <p className="font-medium">{profileData.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Academic Information</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500">Application Number</p>
                        <p className="font-medium">{user?.applicationNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Program</p>
                        <p className="font-medium">{profileData.program}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="font-medium">
                          {profileData.startDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expected Graduation</p>
                        <p className="font-medium">
                          {profileData.expectedGraduation.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">Account Security</h3>
                      <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                        Change Password
                      </button>
                    </div>
                    <div className="mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Password</p>
                        <p className="font-medium">••••••••</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;