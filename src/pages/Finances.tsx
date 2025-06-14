import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard, DollarSign, PieChart, TrendingUp, Check } from 'lucide-react';

// Mock financial data
const financialSummary = {
  totalFees: 15000,
  paidAmount: 4650,
  pendingAmount: 10350,
  nextPaymentDate: new Date('2025-08-01'),
  nextPaymentAmount: 5000,
};

const paymentHistory = [
  {
    id: 'pay-001',
    description: 'Tuition Fee - Semester 1',
    amount: 4500,
    date: new Date('2025-02-01'),
    status: 'Paid',
    receiptAvailable: true,
    method: 'Credit Card'
  },
  {
    id: 'pay-002',
    description: 'Application Fee',
    amount: 150,
    date: new Date('2024-12-15'),
    status: 'Paid',
    receiptAvailable: true,
    method: 'Bank Transfer'
  }
];

const upcomingPayments = [
  {
    id: 'up-001',
    description: 'Tuition Fee - Semester 2',
    amount: 5000,
    dueDate: new Date('2025-08-01'),
    status: 'Pending'
  },
  {
    id: 'up-002',
    description: 'Technology Fee',
    amount: 350,
    dueDate: new Date('2025-09-15'),
    status: 'Pending'
  },
  {
    id: 'up-003',
    description: 'Library & Resources',
    amount: 200,
    dueDate: new Date('2025-09-15'),
    status: 'Pending'
  },
  {
    id: 'up-004',
    description: 'Student Services',
    amount: 300,
    dueDate: new Date('2025-09-15'),
    status: 'Pending'
  },
];

// Fee structure
const feeStructure = {
  tuition: 9500,
  technology: 350,
  library: 200,
  studentServices: 300,
  accommodation: 4500,
  insurance: 150,
};

const Finances = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
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
                    style={{ width: `${(financialSummary.paidAmount / financialSummary.totalFees) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">
                  {Math.round((financialSummary.paidAmount / financialSummary.totalFees) * 100)}%
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
                      <div className="bg-primary-500 h-3 rounded-full" style={{ width: `${(financialSummary.paidAmount / financialSummary.totalFees) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">Upcoming Payments</h3>
                <div className="space-y-3">
                  {upcomingPayments.map(payment => (
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
                        <p className="font-bold">${payment.amount.toLocaleString()}</p>
                        <span className="text-xs text-warning-800 bg-warning-100 px-2 py-0.5 rounded-full">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
            
            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {payment.date.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">${payment.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{payment.method}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="status-badge status-approved">{payment.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {payment.receiptAvailable && (
                            <button className="text-primary-600 hover:text-primary-700 inline-flex items-center">
                              <Download size={16} className="mr-1" />
                              <span className="text-sm font-medium">Receipt</span>
                            </button>
                          )}
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
                <h3 className="text-lg font-medium text-gray-900">No payment history</h3>
                <p className="mt-1 text-gray-500">
                  Your payment history will appear here once you make payments.
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