import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Send, Mail, HelpCircle, MessageSquare, Phone, User } from 'lucide-react';

type SupportFormInputs = {
  subject: string;
  category: string;
  message: string;
  attachment?: FileList;
};

// Mock data
const faqs = [
  {
    id: 1,
    question: 'How can I update my personal information?',
    answer: 'You can update your personal information by navigating to your Profile page. Click on the edit button next to the information you wish to update.'
  },
  {
    id: 2,
    question: 'When is the deadline for tuition fee payment?',
    answer: 'Tuition fee payments are typically due at the beginning of each semester. For the upcoming semester, the payment deadline is August 1, 2025. Late payments may incur additional fees.'
  },
  {
    id: 3,
    question: 'How do I request an official transcript?',
    answer: 'To request an official transcript, go to the Documents section and select "Request Official Transcript". Follow the prompts to complete your request. Processing may take 3-5 business days.'
  },
  {
    id: 4,
    question: 'What documents do I need for visa renewal?',
    answer: 'For visa renewal, you will need your current passport, I-20/DS-2019 form, proof of enrollment, proof of financial support, and recent passport-sized photos. Visit the Visa & Residency page for detailed information.'
  },
  {
    id: 5,
    question: 'How can I apply for on-campus housing?',
    answer: 'On-campus housing applications open 6 months before the start of each semester. Visit the Housing section under Services to complete your application and view available options.'
  }
];

const previousTickets = [
  {
    id: 'TKT-2025-001',
    subject: 'Question about payment methods',
    category: 'Financial',
    status: 'Resolved',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-17')
  },
  {
    id: 'TKT-2025-002',
    subject: 'Issues with document download',
    category: 'Technical',
    status: 'Closed',
    createdAt: new Date('2025-02-05'),
    updatedAt: new Date('2025-02-07')
  }
];

const Support = () => {
  const [activeTab, setActiveTab] = useState('submit-query');
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<SupportFormInputs>();
  
  const onSubmit = (data: SupportFormInputs) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Submitted data:', data);
      setLoading(false);
      setSubmitSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 2000);
  };
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
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
            <h1 className="text-2xl font-bold text-gray-900">Support & Queries</h1>
            <p className="text-gray-600">Get help or submit questions about your student journey</p>
          </div>
        </div>
        
        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="card bg-skyblue-50 border border-skyblue-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-skyblue-500 rounded-lg flex items-center justify-center mr-4">
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-600">support@university.edu</p>
                <p className="text-xs text-gray-500 mt-1">Response time: 24-48 hours</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-primary-50 border border-primary-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-secondary-50 border border-secondary-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mr-4">
                <MessageSquare size={24} className="text-primary-800" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Chat with a representative</p>
                <p className="text-xs text-gray-500 mt-1">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('submit-query')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'submit-query'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Submit a Query
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'faqs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('previous-tickets')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'previous-tickets'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Previous Tickets
          </button>
        </div>
        
        {/* Tab content */}
        {activeTab === 'submit-query' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit a Query</h2>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-success-50 border-l-4 border-success-500 text-success-700">
                <p className="font-medium">Query submitted successfully!</p>
                <p className="text-sm mt-1">
                  We have received your query and will respond as soon as possible. 
                  Please check your email for updates.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className={`input ${errors.subject ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter the subject of your query"
                    {...register('subject', { required: 'Subject is required' })}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-error-600">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className={`input ${errors.category ? 'border-error-500 focus:ring-error-500' : ''}`}
                    {...register('category', { required: 'Please select a category' })}
                  >
                    <option value="">Select a category</option>
                    <option value="academic">Academic</option>
                    <option value="financial">Financial</option>
                    <option value="visa">Visa & Immigration</option>
                    <option value="technical">Technical Support</option>
                    <option value="housing">Housing</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={`input ${errors.message ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Describe your query or issue in detail..."
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: { value: 20, message: 'Message should be at least 20 characters' }
                  })}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-error-600">{errors.message.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
                  Attachment (optional)
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="attachment"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="attachment"
                          type="file"
                          className="sr-only"
                          {...register('attachment')}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, JPG up to 10MB
                    </p>
                  </div>
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
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send size={18} className="mr-2" />
                    Submit Query
                  </span>
                )}
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'faqs' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                  >
                    <div className="flex items-center">
                      <HelpCircle size={18} className="text-primary-500 mr-2 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{faq.question}</span>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        expandedFaq === faq.id ? 'transform rotate-180' : ''
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 pt-0 text-gray-600">
                      <div className="pt-2 border-t border-gray-200">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-5 bg-skyblue-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Can't find what you're looking for?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Contact our support team for personalized assistance
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('submit-query')}
                  className="mt-4 md:mt-0 btn btn-primary"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'previous-tickets' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Support Tickets</h2>
            
            {previousTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previousTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{ticket.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{ticket.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`status-badge ${
                            ticket.status === 'Resolved'
                              ? 'status-approved'
                              : ticket.status === 'Pending'
                              ? 'status-pending'
                              : 'status-expired'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-700">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No previous tickets</h3>
                <p className="mt-1 text-gray-500">
                  You haven't submitted any support tickets yet.
                </p>
                <button
                  onClick={() => setActiveTab('submit-query')}
                  className="mt-4 btn btn-primary"
                >
                  Submit a Query
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Support;