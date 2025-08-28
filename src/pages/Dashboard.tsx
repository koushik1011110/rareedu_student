import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Calendar, BookOpen, CreditCard, Compass, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

// Admission status (static for now)
const admissionStatus = {
  status: 'Approved',
  lastUpdated: new Date('2025-02-15'),
  program: 'Master of Computer Science',
  startDate: new Date('2025-09-01'),
  nextStep: 'Complete visa application',
};

type RecentPayment = {
  id: number;
  description: string;
  amount: number;
  date: Date;
  status: string;
};

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

export default function Dashboard() {
  const { user } = useAuth();
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [feeTypeNameByComponent, setFeeTypeNameByComponent] = useState<Record<number,string>>({});

  useEffect(() => {
    const fetchRecent = async () => {
      if (!user?.id) return;

      try {
        const studentId = parseInt(user.id);

        // Fetch most recent 3 fee payments for the student
        const { data: paymentsData } = await supabase
          .from('fee_payments')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false })
          .limit(3);

        const payments = (paymentsData || []).map((p: any) => ({
          id: p.id,
          description: `Fee #${p.id}`,
          amount: p.amount_paid || 0,
          date: p.last_payment_date ? new Date(p.last_payment_date) : new Date(p.created_at),
          status: p.payment_status || 'Unknown',
        })) as RecentPayment[];

        setRecentPayments(payments);

        // Fetch related components and types for nicer descriptions
        const { data: comps } = await supabase.from('fee_structure_components').select('*');
        const { data: types } = await supabase.from('fee_types').select('*');

        const typesById: Record<number,string> = {};
        (types || []).forEach((t: any) => { typesById[t.id] = t.name; });

        const compMap: Record<number,string> = {};
        (comps || []).forEach((c: any) => {
          const name = typesById[c.fee_type_id];
          if (name) compMap[c.id] = name;
        });

        setFeeTypeNameByComponent(compMap);

        // Replace descriptions where mapping exists
        setRecentPayments(prev => prev.map(p => ({
          ...p,
          description: compMap[(paymentsData || []).find((x: any) => x.id === p.id)?.fee_structure_component_id] || p.description
        })));

      } catch (e) {
        console.error('Error loading recent payments', e);
      }
    };

    fetchRecent();
  }, [user?.id]);

  return (
    <div className="pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
            <Link key={index} to={link.path} className={`card flex flex-col items-center text-center p-4 ${link.color} border border-transparent hover:border-primary-200`}>
              <span className="p-3 rounded-full bg-white mb-2">{link.icon}</span>
              <span className="text-sm font-medium">{link.title}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Admission Status</h2>
              <span className="status-badge status-approved">{admissionStatus.status}</span>
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
                <span className="ml-2 font-medium">{admissionStatus.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Next Step:</h3>
                <p className="flex items-center mt-1"><AlertCircle size={16} className="text-warning-500 mr-2" />{admissionStatus.nextStep}</p>
              </div>

              <div className="pt-2 text-right">
                <span className="text-xs text-gray-500">Last updated: {formatDistanceToNow(admissionStatus.lastUpdated, { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
              <Link to="/finances" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
            </div>

            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-500">{payment.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs px-2 py-0.5 rounded-full bg-success-100 text-success-800 inline-block">{payment.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <CreditCard size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No recent payments</h3>
                  <p className="mt-1 text-gray-500">Your recent payments will appear here once available.</p>
                </div>
              )}

              {recentPayments.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid</span>
                    <span className="font-bold">${recentPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            </div>

            <div className="space-y-3">
              {/* static upcoming deadlines kept as before */}
              <div className="p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <span className="p-1.5 rounded-md mr-2 bg-primary-100 text-primary-700">
                      <Compass size={16} />
                    </span>
                    <div>
                      <p className="font-medium">Visa Application Deadline</p>
                      <p className="text-sm text-gray-500">May 15, 2025</p>
                    </div>
                  </div>
                  <div><span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">{} days left</span></div>
                </div>
              </div>

            </div>
          </div>

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
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-gray-600">Application Submitted</span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-gray-600">Documents Verified</span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-gray-600">Application Approved</span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-warning-100 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
}
