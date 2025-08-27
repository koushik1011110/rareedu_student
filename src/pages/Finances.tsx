import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard, DollarSign, PieChart, TrendingUp, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Types for financial data
type FeePayment = {
  id: number;
  student_id: number;
  fee_structure_component_id: number;
  amount_due: number;
  amount_paid: number;
  payment_status: string;
  due_date: string | null;
  last_payment_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type FeeStructure = {
  tuition: number;
  technology: number;
  library: number;
  studentServices: number;
  accommodation: number;
  insurance: number;
};

const Finances = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalFees: 0,
    paidAmount: 0,
    pendingAmount: 0,
    nextPaymentDate: new Date('2025-08-01'),
    nextPaymentAmount: 0,
  });

  // Mock fee structure - in production this would come from database
  const feeStructure: FeeStructure = {
    tuition: 9500,
    technology: 350,
    library: 200,
    studentServices: 300,
    accommodation: 4500,
    insurance: 150,
  };

  // Fetch financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const studentId = parseInt(user.id);

        // Fetch fee payments data
        const { data: feePaymentsData, error: feePaymentsError } = await supabase
          .from('fee_payments')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false });

        if (feePaymentsError) {
          console.error('Error fetching fee payments:', feePaymentsError);
        } else {
          setFeePayments(feePaymentsData || []);
        }

      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [user?.id]);

  // Calculate financial summary
  useEffect(() => {
    const totalFees = feePayments.reduce((sum, payment) => sum + payment.amount_due, 0);
    const paidAmount = feePayments.reduce((sum, payment) => sum + payment.amount_paid, 0);
    
    // Find next payment (earliest unpaid fee)
    const unpaidFees = feePayments.filter(payment => 
      payment.payment_status === 'pending' || payment.payment_status === 'partial'
    );

    const nextFee = unpaidFees.sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return dateA - dateB;
    })[0];

    setFinancialSummary({
      totalFees: totalFees || Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0),
      paidAmount,
      pendingAmount: (totalFees || Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0)) - paidAmount,
      nextPaymentDate: nextFee?.due_date ? new Date(nextFee.due_date) : new Date('2025-08-01'),
      nextPaymentAmount: nextFee ? (nextFee.amount_due - nextFee.amount_paid) : 5000,
    });
  }, [feePayments, feeStructure]);

  // Get upcoming payments from unpaid fees
  const getUpcomingPayments = () => {
    return feePayments
      .filter(payment => 
        payment.payment_status === 'pending' || payment.payment_status === 'partial'
      )
      .map(payment => {
        
        return {
          id: `up-${payment.id}`,
          description: `Fee Payment #${payment.id}`,
          status: payment.payment_status === 'pending' ? 'Pending' : 'Partial' as const,
          dueDate: payment.due_date ? new Date(payment.due_date) : new Date('2025-09-15')
        };
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
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

  const upcomingPayments = getUpcomingPayments();
  
  return (
    <div className="pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
            <p className="text-gray-600">Manage your payments and view fee structure</p>
          </div>
        </div>
        
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="card bg-primary-500 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-skyblue-100">Total Program Fees</p>
                <p className="mt-1 text-2xl font-bold">${financialSummary.totalFees.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-primary-400 rounded-lg">
                <DollarSign size={20} />
              </div>
            </div>
          </div>
          
          <div className="card bg-success-500 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-success-100">Amount Paid</p>
                <p className="mt-1 text-2xl font-bold">${financialSummary.paidAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-success-400 rounded-lg">
                <Check size={20} />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-success-400">
              <div className="text-xs text-success-100">Payment completion</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="w-full bg-success-600 rounded-full h-2 mr-2">
                  <div 
                    className="bg-white h-2 rounded-full" 
                    style={{ width: `${financialSummary.totalFees > 0 ? (financialSummary.paidAmount / financialSummary.totalFees) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">
                  {financialSummary.totalFees > 0 ? Math.round((financialSummary.paidAmount / financialSummary.totalFees) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="card bg-warning-500 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-warning-100">Next Payment</p>
                <p className="mt-1 text-2xl font-bold">${financialSummary.nextPaymentAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-warning-400 rounded-lg">
                <CreditCard size={20} />
              </div>
            </div>
            <p className="text-sm mt-4 text-white">
              Due: {financialSummary.nextPaymentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
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
            onClick={() => setActiveTab('payment-history')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'payment-history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('fee-structure')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'fee-structure'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fee Structure
          </button>
        </div>
        
        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Overview</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="mb-2 md:mb-0">
                      <p className="text-sm text-gray-500">Paid Amount</p>
                      <p className="text-lg font-bold text-success-600">${financialSummary.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="text-lg font-bold text-warning-600">${financialSummary.pendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-bold">${financialSummary.totalFees.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary-500 h-3 rounded-full" 
                        style={{ width: `${financialSummary.totalFees > 0 ? (financialSummary.paidAmount / financialSummary.totalFees) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">Upcoming Payments</h3>
                <div className="space-y-3">
                  {upcomingPayments.length > 0 ? (
                    upcomingPayments.map(payment => (
                      <div key={payment.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{payment.description}</p>
                          <p className="text-sm text-gray-500">
                            Due: {payment.dueDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            payment.status === 'Pending' 
                              ? 'text-warning-800 bg-warning-100' 
                              : 'text-primary-800 bg-primary-100'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No upcoming payments at this time.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
                <div className="space-y-4">
                  <button className="w-full btn btn-outline">
                    <CreditCard size={18} className="mr-2" />
                    Add Payment Method
                  </button>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-md flex items-center justify-center mr-3">
                          <CreditCard size={20} className="text-primary-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Bank Transfer</p>
                          <p className="text-xs text-gray-500">Bank account details available</p>
                        </div>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Support</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Need help with your payments or have questions about fees?
                </p>
                <button className="w-full btn btn-primary">Contact Financial Office</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'payment-history' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Payment Status</h2>
            
            {feePayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feePayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Fee #{payment.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {payment.due_date 
                              ? new Date(payment.due_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`status-badge ${
                            payment.payment_status === 'paid' ? 'status-approved' : 
                            payment.payment_status === 'partial' ? 'status-in-progress' : 'status-pending'
                          }`}>
                            {payment.payment_status === 'paid' ? 'Paid' :
                             payment.payment_status === 'partial' ? 'Partial' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {payment.last_payment_date 
                              ? new Date(payment.last_payment_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'No payment yet'
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <CreditCard size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No fee payments found</h3>
                <p className="mt-1 text-gray-500">
                  Your fee payment status will appear here once fees are assigned.
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'fee-structure' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-lg text-gray-900 mb-4">Program Fees Breakdown</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Tuition</span>
                      <span className="font-bold">${feeStructure.tuition.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Technology Fee</span>
                      <span className="font-bold">${feeStructure.technology.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Library & Resources</span>
                      <span className="font-bold">${feeStructure.library.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Student Services</span>
                      <span className="font-bold">${feeStructure.studentServices.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Accommodation (Optional)</span>
                      <span className="font-bold">${feeStructure.accommodation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Health Insurance</span>
                      <span className="font-bold">${feeStructure.insurance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 font-bold">
                      <span>Total</span>
                      <span>
                        ${Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full btn btn-primary mt-6">
                    <Download size={18} className="mr-2" />
                    Download Fee Structure
                  </button>
                </div>
              </div>
              
              <div>
                <div className="card mb-6">
                  <h3 className="font-medium text-lg text-gray-900 mb-4">Payment Schedule</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-success-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">First Installment</p>
                          <p className="text-sm text-gray-500">Due: Dec 15, 2024</p>
                        </div>
                        <span className="font-bold">$4,650</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success-100 text-success-800 inline-block mt-1">
                        Paid
                      </span>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-warning-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Second Installment</p>
                          <p className="text-sm text-gray-500">Due: Aug 1, 2025</p>
                        </div>
                        <span className="font-bold">$5,000</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-warning-100 text-warning-800 inline-block mt-1">
                        Upcoming
                      </span>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Third Installment</p>
                          <p className="text-sm text-gray-500">Due: Jan 15, 2026</p>
                        </div>
                        <span className="font-bold">$5,350</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 inline-block mt-1">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="font-medium text-lg text-gray-900 mb-4">Payment Options</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We offer multiple payment methods for your convenience. Please note that all payments should be made before the due date to avoid late fees.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
                        <CreditCard size={20} className="text-primary-700" />
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center mr-3">
                        <TrendingUp size={20} className="text-secondary-700" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-xs text-gray-500">Direct bank deposit or wire transfer</p>
                      </div>
                    </div>
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

export default Finances;