import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Compass, AlertCircle, CheckCircle, FileText, ArrowRight, Download } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Types for the data structures
type VisaData = {
  id: number;
  visa_type: string;
  visa_status: string;
  visa_number: string;
  issue_date: string;
  expiration_date: string;
  entry_type: string;
  application_date: string;
  interview_date: string;
  approval_date: string;
};

type ResidencyData = {
  id: number;
  registration_status: string;
  registration_deadline: string;
  current_address: string;
  local_id_number: string;
  registration_date: string;
};

type DeadlineData = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  deadline_type: string;
  is_completed: boolean;
};

type DocumentData = {
  id: number;
  document_name: string;
  is_available: boolean;
  document_url: string;
};

const Visa = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [visaData, setVisaData] = useState<VisaData | null>(null);
  const [residencyData, setResidencyData] = useState<ResidencyData | null>(null);
  const [deadlines, setDeadlines] = useState<DeadlineData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  // Fetch visa and residency data
  useEffect(() => {
    const fetchVisaData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch visa information
        const { data: visaInfo, error: visaError } = await supabase
          .from('student_visa')
          .select('*')
          .eq('student_id', parseInt(user.id))
          .single();

        if (visaError && visaError.code !== 'PGRST116') {
          console.error('Error fetching visa data:', visaError);
        } else if (visaInfo) {
          setVisaData(visaInfo);
        }

        // Fetch residency information
        const { data: residencyInfo, error: residencyError } = await supabase
          .from('student_residency')
          .select('*')
          .eq('student_id', parseInt(user.id))
          .single();

        if (residencyError && residencyError.code !== 'PGRST116') {
          console.error('Error fetching residency data:', residencyError);
        } else if (residencyInfo) {
          setResidencyData(residencyInfo);
        }

        // Fetch deadlines
        const { data: deadlinesData, error: deadlinesError } = await supabase
          .from('visa_deadlines')
          .select('*')
          .eq('student_id', parseInt(user.id))
          .order('due_date', { ascending: true });

        if (deadlinesError) {
          console.error('Error fetching deadlines:', deadlinesError);
        } else {
          setDeadlines(deadlinesData || []);
        }

        // Fetch documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('visa_documents')
          .select('*')
          .eq('student_id', parseInt(user.id));

        if (documentsError) {
          console.error('Error fetching documents:', documentsError);
        } else {
          setDocuments(documentsData || []);
        }

      } catch (error) {
        console.error('Error fetching visa data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisaData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="pb-20 md:pb-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  // Calculate days remaining until visa expiration
  const daysUntilExpiration = visaData?.expiration_date 
    ? differenceInDays(new Date(visaData.expiration_date), new Date())
    : 0;
  
  // Calculate days remaining until registration deadline
  const daysUntilRegistration = residencyData?.registration_deadline 
    ? differenceInDays(new Date(residencyData.registration_deadline), new Date())
    : 0;

  // Create timeline events from the visa data
  const timelineEvents = [
    {
      title: 'Visa Application Submitted',
      date: visaData?.application_date ? new Date(visaData.application_date) : null,
      status: 'completed',
      description: 'Application submitted to embassy'
    },
    {
      title: 'Visa Interview',
      date: visaData?.interview_date ? new Date(visaData.interview_date) : null,
      status: 'completed',
      description: 'Interview completed at embassy'
    },
    {
      title: 'Visa Approved',
      date: visaData?.approval_date ? new Date(visaData.approval_date) : null,
      status: 'completed',
      description: 'Visa approved and issued'
    },
    {
      title: 'Residency Registration',
      date: residencyData?.registration_deadline ? new Date(residencyData.registration_deadline) : null,
      status: residencyData?.registration_status === 'Registered' ? 'completed' : 'upcoming',
      description: 'Register with local authorities'
    }
  ].filter(event => event.date); // Filter out events without dates
  
  return (
    <div className="pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visa & Residency</h1>
            <p className="text-gray-600">Track your visa status and residency requirements</p>
          </div>
        </div>
        
        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-100 rounded-full opacity-50"></div>
            
            <div className="relative">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Compass size={20} className="mr-2 text-primary-500" />
                  Visa Status
                </h2>
                <span className={`status-badge ${
                  visaData?.visa_status === 'Approved' ? 'status-approved' :
                  visaData?.visa_status === 'Pending' ? 'status-pending' :
                  'status-rejected'
                }`}>
                  {visaData?.visa_status || 'No Data'}
                </span>
              </div>
              
              {visaData ? (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{visaData.visa_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Visa Number</p>
                      <p className="font-medium">{visaData.visa_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="font-medium">
                        {visaData.issue_date ? format(new Date(visaData.issue_date), 'MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiration Date</p>
                      <p className="font-medium">
                        {visaData.expiration_date ? format(new Date(visaData.expiration_date), 'MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {visaData.expiration_date && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Validity Period</span>
                        <span className="text-sm font-medium">
                          {daysUntilExpiration} days remaining
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-500 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.max(
                              5,
                              100 - (daysUntilExpiration / 365) * 100
                            )}%` 
                          }}
                        ></div>
                      </div>
                      
                      {daysUntilExpiration <= 90 && (
                        <div className="mt-4 p-3 bg-warning-50 text-warning-800 rounded-lg flex items-start">
                          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Visa Expiration Alert</p>
                            <p className="text-sm mt-1">
                              Your visa will expire in {daysUntilExpiration} days. Please start the renewal process at least 60 days before expiration.
                            </p>
                            <button className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                              Start renewal process <ArrowRight size={14} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">No visa information available</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-100 rounded-full opacity-50"></div>
            
            <div className="relative">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar size={20} className="mr-2 text-secondary-700" />
                  Residency Status
                </h2>
                <span className={`status-badge ${
                  residencyData?.registration_status === 'Registered' ? 'status-approved' :
                  residencyData?.registration_status === 'Pending Registration' ? 'status-pending' :
                  'status-expired'
                }`}>
                  {residencyData?.registration_status || 'No Data'}
                </span>
              </div>
              
              {residencyData ? (
                <>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Registration Deadline</p>
                      <p className="font-medium">
                        {residencyData.registration_deadline ? format(new Date(residencyData.registration_deadline), 'MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Address</p>
                      <p className="font-medium">{residencyData.current_address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Local ID Number</p>
                      <p className="font-medium">{residencyData.local_id_number}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    {daysUntilRegistration <= 30 && daysUntilRegistration > 0 ? (
                      <div className="p-3 bg-warning-50 text-warning-800 rounded-lg flex items-start">
                        <Clock size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Registration Deadline Approaching</p>
                          <p className="text-sm mt-1">
                            You must complete local residency registration within {daysUntilRegistration} days.
                          </p>
                          <button className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                            View registration guide <ArrowRight size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-skyblue-50 text-skyblue-800 rounded-lg flex items-start">
                        <CheckCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Residency Registration</p>
                          <p className="text-sm mt-1">
                            {residencyData.registration_status === 'Registered' 
                              ? 'Your residency registration is complete.'
                              : 'You will need to complete your residency registration after arrival. Instructions will be provided during orientation.'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">No residency information available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'deadlines'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Deadlines & Requirements
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
        </div>
        
        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Visa Timeline</h2>
                
                {timelineEvents.length > 0 ? (
                  <div className="relative pb-12">
                    <div className="absolute h-full w-0.5 bg-gray-200 left-6 top-0"></div>
                    
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="relative flex items-start mb-8 last:mb-0">
                        <div className={`absolute h-4 w-4 rounded-full border-2 border-white left-4 mt-1.5 ${
                          event.status === 'completed' ? 'bg-success-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="ml-12">
                          <span className={`status-badge mb-1 ${
                            event.status === 'completed' ? 'status-approved' : 'status-pending'
                          }`}>
                            {event.status === 'completed' ? 'Completed' : 'Upcoming'}
                          </span>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            {event.date ? format(event.date, 'MMMM d, yyyy') : 'Date TBD'}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Calendar size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Timeline Data</h3>
                    <p className="mt-1 text-gray-500">
                      Visa timeline information will appear here once available.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Contacts</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium">International Student Office</p>
                    <p className="text-sm text-gray-500 mt-1">For visa and residency inquiries</p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm">Email: international@university.edu</p>
                      <p className="text-sm">Phone: +1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium">Immigration Advisor</p>
                    <p className="text-sm text-gray-500 mt-1">For immigration-related questions</p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm">Book an appointment:</p>
                      <button className="mt-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                        Schedule consultation →
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium">Emergency Contacts</p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm">University Security: +1 (555) 987-6543</p>
                      <p className="text-sm">Emergency Services: 911</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'deadlines' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines & Requirements</h2>
            
            {deadlines.length > 0 ? (
              <div className="space-y-4">
                {deadlines.map((deadline) => {
                  const daysRemaining = differenceInDays(new Date(deadline.due_date), new Date());
                  const isUrgent = daysRemaining <= 14;
                  
                  return (
                    <div 
                      key={deadline.id} 
                      className={`p-4 rounded-lg border-l-4 ${
                        deadline.is_completed 
                          ? 'bg-gray-50 border-gray-300' 
                          : isUrgent
                          ? 'bg-warning-50 border-warning-500'
                          : deadline.deadline_type === 'mandatory'
                          ? 'bg-skyblue-50 border-skyblue-500'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            {deadline.deadline_type === 'mandatory' && !deadline.is_completed && (
                              <span className="text-xs font-medium bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full mr-2">
                                Mandatory
                              </span>
                            )}
                            <h3 className="font-medium text-gray-900">{deadline.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{deadline.description}</p>
                          <p className="text-sm font-medium mt-2">
                            Due: {format(new Date(deadline.due_date), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        
                        <div>
                          {deadline.is_completed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              <CheckCircle size={14} className="mr-1" />
                              Completed
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isUrgent 
                                ? 'bg-warning-100 text-warning-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <Clock size={14} className="mr-1" />
                              {daysRemaining} days left
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!deadline.is_completed && (
                        <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                          View details <ArrowRight size={14} className="ml-1" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Clock size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Deadlines</h3>
                <p className="mt-1 text-gray-500">
                  Your upcoming deadlines will appear here.
                </p>
              </div>
            )}
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-4">Important Regulations</h3>
              
              <div className="bg-skyblue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-skyblue-900">Study Requirements</h4>
                <ul className="mt-2 text-sm text-skyblue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-skyblue-200 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </span>
                    Maintain full-time enrollment (minimum 12 credit hours per semester)
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-skyblue-200 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </span>
                    Make satisfactory academic progress
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-skyblue-200 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </span>
                    Limited work permission (max 20 hours/week on-campus during semester)
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-medium text-primary-900">Reporting Requirements</h4>
                <ul className="mt-2 text-sm text-primary-800 space-y-2">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary-200 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </span>
                    Report any change of address within 10 days
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary-200 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </span>
                    Notify of any program changes or extensions
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary-200 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </span>
                    Request authorization for any employment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visa & Residency Documents</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Available Documents</h3>
                <div className="space-y-3">
                  {documents.filter(doc => doc.is_available).map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText size={20} className="text-primary-700" />
                        </div>
                        <span className="font-medium">{doc.document_name}</span>
                      </div>
                      <button className="btn btn-primary">
                        <Download size={16} />
                        <span className="hidden sm:inline ml-1">Download</span>
                      </button>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-medium text-gray-900 mt-6 mb-3">Pending Documents</h3>
                <div className="space-y-3">
                  {documents.filter(doc => !doc.is_available).map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <FileText size={20} className="text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-700">{doc.document_name}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>

                {documents.length === 0 && (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Documents</h3>
                    <p className="mt-1 text-gray-500">
                      Your visa documents will appear here once available.
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <div className="card">
                  <h3 className="font-medium text-gray-900 mb-4">Visa Information</h3>
                  
                  <div className="p-4 bg-primary-50 rounded-lg mb-6">
                    <h4 className="font-medium text-primary-800 mb-2">Important Reminders</h4>
                    <ul className="text-sm text-primary-700 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                        Always carry your passport and I-20/DS-2019 when traveling internationally
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                        Maintain full-time enrollment to keep your visa status valid
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                        Start visa renewal process at least 3 months before expiration
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-skyblue-50 rounded-lg">
                    <h4 className="font-medium text-skyblue-800 mb-2">Residency Registration Process</h4>
                    <ol className="text-sm text-skyblue-700 space-y-3">
                      <li className="flex">
                        <span className="h-5 w-5 rounded-full bg-skyblue-200 flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs font-medium">1</span>
                        </span>
                        <div>
                          <p className="font-medium">Arrive at University</p>
                          <p className="text-xs">Expected: September 1, 2025</p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="h-5 w-5 rounded-full bg-skyblue-200 flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs font-medium">2</span>
                        </span>
                        <div>
                          <p className="font-medium">Attend International Student Orientation</p>
                          <p className="text-xs">September 3-4, 2025</p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="h-5 w-5 rounded-full bg-skyblue-200 flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs font-medium">3</span>
                        </span>
                        <div>
                          <p className="font-medium">Complete Residency Registration</p>
                          <p className="text-xs">Deadline: September 15, 2025</p>
                        </div>
                      </li>
                    </ol>
                    <button className="mt-4 w-full btn btn-primary">
                      View Complete Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Visa;