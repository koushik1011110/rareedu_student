import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { 
  Home, 
  Utensils, 
  MapPin, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  Send
} from 'lucide-react';

// Types
type HostelRegistration = {
  id: number;
  student_id: number;
  hostel_id: number;
  status: 'pending' | 'approved' | 'rejected';
  requested_by: string;
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
  notes: string | null;
};

type Hostel = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  current_occupancy: number;
  monthly_rent: number;
  facilities: string;
  status: string;
};

type HostelApplicationForm = {
  hostel_id: number;
  notes: string;
};

const Services = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [existingRegistration, setExistingRegistration] = useState<HostelRegistration | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<HostelApplicationForm>();

  // Fetch hostels and existing registration
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const studentId = parseInt(user.id);

        // Fetch available hostels
        const { data: hostelsData, error: hostelsError } = await supabase
          .from('hostels')
          .select('*')
          .eq('status', 'Active')
          .order('name');

        if (hostelsError) {
          console.error('Error fetching hostels:', hostelsError);
        } else {
          setHostels(hostelsData || []);
        }

        // Check for existing registration
        const { data: registrationData, error: registrationError } = await supabase
          .from('hostel_registrations')
          .select('*')
          .eq('student_id', studentId)
          .in('status', ['pending', 'approved'])
          .order('requested_at', { ascending: false })
          .limit(1);

        if (registrationError) {
          console.error('Error fetching registration:', registrationError);
        } else if (registrationData && registrationData.length > 0) {
          setExistingRegistration(registrationData[0]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const onSubmit = async (data: HostelApplicationForm) => {
    if (!user?.id) return;

    try {
      setSubmitting(true);
      const studentId = parseInt(user.id);

      const { error } = await supabase
        .from('hostel_registrations')
        .insert([{
          student_id: studentId,
          hostel_id: data.hostel_id,
          status: 'pending',
          requested_by: 'student',
          notes: data.notes || null
        }]);

      if (error) {
        throw error;
      }

      setSubmitSuccess(true);
      reset();
      
      // Refresh the page data
      window.location.reload();

    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-20 md:pb-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600">Apply for student services and accommodations</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hostel & Mess Application */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Home size={24} className="text-primary-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Hostel & Mess</h2>
                <p className="text-gray-600">Apply for on-campus accommodation and dining</p>
              </div>
            </div>

            {existingRegistration ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-l-4 ${
                  existingRegistration.status === 'approved' 
                    ? 'border-success-500 bg-success-50' 
                    : existingRegistration.status === 'pending'
                    ? 'border-warning-500 bg-warning-50'
                    : 'border-error-500 bg-error-50'
                }`}>
                  <div className="flex items-center">
                    {existingRegistration.status === 'approved' && (
                      <CheckCircle size={20} className="text-success-600 mr-2" />
                    )}
                    {existingRegistration.status === 'pending' && (
                      <Clock size={20} className="text-warning-600 mr-2" />
                    )}
                    {existingRegistration.status === 'rejected' && (
                      <XCircle size={20} className="text-error-600 mr-2" />
                    )}
                    <div>
                      <p className="font-medium">
                        Application {existingRegistration.status === 'approved' ? 'Approved' : 
                                 existingRegistration.status === 'pending' ? 'Under Review' : 'Rejected'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Submitted on {new Date(existingRegistration.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {existingRegistration.status === 'pending' && (
                    <p className="text-sm mt-2">
                      Your hostel application is being reviewed by the administration. 
                      You will be notified once a decision is made.
                    </p>
                  )}
                  
                  {existingRegistration.status === 'approved' && (
                    <p className="text-sm mt-2">
                      Congratulations! Your hostel application has been approved. 
                      You will receive further instructions via email.
                    </p>
                  )}
                  
                  {existingRegistration.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm text-gray-600">{existingRegistration.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {submitSuccess && (
                  <div className="p-4 bg-success-50 border-l-4 border-success-500 text-success-700">
                    <div className="flex items-center">
                      <CheckCircle size={20} className="mr-2" />
                      <p className="font-medium">Application submitted successfully!</p>
                    </div>
                    <p className="text-sm mt-1">
                      Your hostel application has been submitted and is under review. 
                      You will be notified once a decision is made.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="hostel_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Hostel *
                    </label>
                    <select
                      id="hostel_id"
                      className={`input ${errors.hostel_id ? 'border-error-500 focus:ring-error-500' : ''}`}
                      {...register('hostel_id', { 
                        required: 'Please select a hostel',
                        valueAsNumber: true 
                      })}
                    >
                      <option value="">Choose a hostel</option>
                      {hostels.map((hostel) => (
                        <option key={hostel.id} value={hostel.id}>
                          {hostel.name} - {hostel.location} (${hostel.monthly_rent}/month)
                        </option>
                      ))}
                    </select>
                    {errors.hostel_id && (
                      <p className="mt-1 text-sm text-error-600">{errors.hostel_id.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="input"
                      placeholder="Any special requirements or additional information..."
                      {...register('notes')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full btn btn-primary ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Application...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send size={18} className="mr-2" />
                        Submit Application
                      </span>
                    )}
                  </button>
                </form>

                {hostels.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Available Hostels</h3>
                    <div className="space-y-3">
                      {hostels.map((hostel) => (
                        <div key={hostel.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{hostel.name}</h4>
                            <span className="text-lg font-bold text-primary-600">
                              ${hostel.monthly_rent}/month
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2" />
                              {hostel.location}
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-2" />
                              {hostel.current_occupancy}/{hostel.capacity} occupied
                            </div>
                          </div>
                          {hostel.facilities && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                <strong>Facilities:</strong> {hostel.facilities}
                              </p>
                            </div>
                          )}
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full" 
                                style={{ 
                                  width: `${(hostel.current_occupancy / hostel.capacity) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {hostel.capacity - hostel.current_occupancy} spots available
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coming Soon Services */}
          <div className="space-y-6">
            <div className="card opacity-60">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Utensils size={24} className="text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-500">Meal Plans</h2>
                  <p className="text-gray-400">Customize your dining preferences</p>
                </div>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">Coming Soon</p>
                <p className="text-sm text-gray-400 mt-1">
                  Additional meal plan options will be available here
                </p>
              </div>
            </div>

            <div className="card opacity-60">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar size={24} className="text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-500">Event Registration</h2>
                  <p className="text-gray-400">Register for campus events and activities</p>
                </div>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">Coming Soon</p>
                <p className="text-sm text-gray-400 mt-1">
                  Event registration system will be available here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 card bg-skyblue-50 border border-skyblue-200">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-skyblue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-skyblue-900">Important Information</h3>
              <div className="mt-2 text-sm text-skyblue-800 space-y-1">
                <p>• All service applications are subject to availability and approval</p>
                <p>• Hostel applications will be reviewed within 3-5 business days</p>
                <p>• You will receive email notifications about your application status</p>
                <p>• For urgent requests, please contact the student services office directly</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Services;