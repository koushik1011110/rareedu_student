import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Calendar, BookOpen, CreditCard, Compass, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const admissionStatus = {
  status: 'Approved',
  lastUpdated: new Date('2025-02-15'),
  program: 'Master of Computer Science',
  startDate: new Date('2025-09-01'),
  nextStep: 'Complete visa application',
};

const recentPayments = [
  {
    id: 1,
    description: 'Tuition Fee - Semester 1',
    amount: 4500,
    date: new Date('2025-02-01'),
    status: 'Paid',
  },
  {
    id: 2,
    description: 'Application Fee',
    amount: 150,
    date: new Date('2024-12-15'),
    status: 'Paid',
  }
];

const upcomingDeadlines = [
  {
    id: 1,
    title: 'Visa Application Deadline',
    date: new Date('2025-05-15'),
    type: 'visa',
  },
  {
    id: 2,
    title: 'Tuition Fee Payment - Semester 2',
    date: new Date('2025-08-01'),
    type: 'payment',
  },
  {
    id: 3,
    title: 'Student ID Card Collection',
    date: new Date('2025-09-05'),
    type: 'document',
  }
];

const quickLinks = [
  {
    title: 'Download Admission Letter',
    icon: <FileText size={18} />,
    path: '/documents',
    color: 'bg-skyblue-100 text-skyblue-800'
  },
  {
    title: 'My Account',
    icon: <CreditCard size={18} />,
    path: '/finances',
    color: 'bg-secondary-100 text-secondary-800'
  },
  {
    title: 'Check Visa Status',
    icon: <Compass size={18} />,
    path: '/visa',
    color: 'bg-primary-100 text-primary-800'
  },
  {
    title: 'Submit Query',
    icon: <AlertCircle size={18} />,
    path: '/support',
    color: 'bg-success-100 text-success-800'
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-block bg-secondary-100 text-secondary-800 rounded-full px-3 py-1 text-sm font-medium">
              {admissionStatus.program}
            </div>
          </div>
        </div>
        
        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`card flex flex-col items-center text-center p-4 ${link.color} border border-transparent hover:border-primary-200`}
            >
              <span className="p-3 rounded-full bg-white mb-2">
                {link.icon}
              </span>
              <span className="text-sm font-medium">{link.title}</span>
            </Link>
          ))}
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admission Status */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Admission Status</h2>
              <span className="status-badge status-approved">
                {admissionStatus.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <BookOpen size={18} className="text-primary-500 mr-2" />
                <span className="text-gray-600">Program: </span>
                <span className="ml-2 font-medium">{admissionStatus.program}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={18} className="text-primary-500 mr-2" />
                <span className="text-gray-600">Start Date: </span>
                <span className="ml-2 font-medium">
                  {admissionStatus.startDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Next Step:</h3>
                <p className="flex items-center mt-1">
                  <AlertCircle size={16} className="text-warning-500 mr-2" />
                  <span>{admissionStatus.nextStep}</span>
                </p>
              </div>
              
              <div className="pt-2 text-right">
                <span className="text-xs text-gray-500">
                  Last updated: {formatDistanceToNow(admissionStatus.lastUpdated, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Recent Payments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
              <Link to="/finances" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-500">
                      {payment.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                    <p className="text-xs px-2 py-0.5 rounded-full bg-success-100 text-success-800 inline-block">
                      {payment.status}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="font-bold">${recentPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Deadlines */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            </div>
            
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const daysLeft = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 7;
                
                let typeIcon;
                let typeBg;
                
                switch(deadline.type) {
                  case 'visa':
                    typeIcon = <Compass size={16} />;
                    typeBg = 'bg-primary-100 text-primary-700';
                    break;
                  case 'payment':
                    typeIcon = <CreditCard size={16} />;
                    typeBg = 'bg-secondary-100 text-secondary-700';
                    break;
                  case 'document':
                    typeIcon = <FileText size={16} />;
                    typeBg = 'bg-skyblue-100 text-skyblue-700';
                    break;
                  default:
                    typeIcon = <Calendar size={16} />;
                    typeBg = 'bg-gray-100 text-gray-700';
                }
                
                return (
                  <div 
                    key={deadline.id}
                    className={`p-3 rounded-lg border ${isUrgent ? 'border-warning-300 bg-warning-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <span className={`p-1.5 rounded-md mr-2 ${typeBg}`}>
                          {typeIcon}
                        </span>
                        <div>
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm text-gray-500">
                            {deadline.date.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          isUrgent ? 'bg-warning-100 text-warning-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Application Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Application Progress</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-semibold">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-600">Application Submitted</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-600">Documents Verified</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-600">Application Approved</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-warning-100 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-600">Visa Application (in progress)</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                    <span className="text-gray-500 text-xs">5</span>
                  </div>
                  <span className="text-gray-400">Arrival and Registration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;