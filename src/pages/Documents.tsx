import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, FileText, FileCheck, FileClock } from 'lucide-react';

// Mock documents data
const documents = [
  {
    id: 1,
    name: 'Admission Letter',
    type: 'PDF',
    status: 'Ready',
    date: new Date('2024-12-20'),
    size: '0.8 MB',
    category: 'admission',
  },
  {
    id: 2,
    name: 'Scholarship Offer',
    type: 'PDF',
    status: 'Ready',
    date: new Date('2024-12-22'),
    size: '0.5 MB',
    category: 'financial',
  },
  {
    id: 3,
    name: 'Payment Receipt - Application Fee',
    type: 'PDF',
    status: 'Ready',
    date: new Date('2024-12-15'),
    size: '0.3 MB',
    category: 'financial',
  },
  {
    id: 4,
    name: 'Visa Support Letter',
    type: 'PDF',
    status: 'Ready',
    date: new Date('2025-01-05'),
    size: '0.7 MB',
    category: 'visa',
  },
  {
    id: 5,
    name: 'Accommodation Confirmation',
    type: 'PDF',
    status: 'Processing',
    date: new Date('2025-01-10'),
    size: '-',
    category: 'accommodation',
  },
  {
    id: 6,
    name: 'Course Registration Form',
    type: 'PDF',
    status: 'Pending',
    date: new Date('2025-08-15'),
    size: '-',
    category: 'academic',
  },
  {
    id: 7,
    name: 'Student ID Card Application',
    type: 'PDF',
    status: 'Ready',
    date: new Date('2025-01-15'),
    size: '0.2 MB',
    category: 'admission',
  },
  {
    id: 8,
    name: 'Health Insurance Information',
    type: 'PDF',
    status: 'Ready',
    date: new Date('2025-01-20'),
    size: '1.2 MB',
    category: 'health',
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Documents' },
  { id: 'admission', name: 'Admission' },
  { id: 'financial', name: 'Financial' },
  { id: 'visa', name: 'Visa & Immigration' },
  { id: 'academic', name: 'Academic' },
  { id: 'health', name: 'Health & Insurance' },
  { id: 'accommodation', name: 'Accommodation' }
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter documents based on search, category and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = 
      activeTab === 'all' ||
      (activeTab === 'ready' && doc.status === 'Ready') ||
      (activeTab === 'pending' && (doc.status === 'Pending' || doc.status === 'Processing'));
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600">Manage and download your important documents</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Category filter */}
        <div className="flex items-center bg-gray-50 p-2 rounded-lg mb-6 overflow-x-auto whitespace-nowrap">
          <Filter size={16} className="text-gray-500 mr-2 flex-shrink-0" />
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Status tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`flex items-center pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ready'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileCheck size={16} className="mr-1" />
            Ready for Download
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileClock size={16} className="mr-1" />
            Pending
          </button>
        </div>
        
        {/* Documents list */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500">
                <div className="col-span-6">Document</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Action</div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50">
                    <div className="col-span-6 flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <FileText size={20} className="text-primary-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-500 hidden md:block">
                      {doc.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    
                    <div className="col-span-2 hidden md:block">
                      <span className={`status-badge ${
                        doc.status === 'Ready' 
                          ? 'status-approved' 
                          : doc.status === 'Processing'
                          ? 'status-pending'
                          : 'status-expired'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-end md:justify-start">
                      <div className="md:hidden flex-1">
                        <span className={`status-badge ${
                          doc.status === 'Ready' 
                            ? 'status-approved' 
                            : doc.status === 'Processing'
                            ? 'status-pending'
                            : 'status-expired'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      <button 
                        className={`btn ${
                          doc.status === 'Ready' 
                            ? 'btn-primary' 
                            : 'btn-outline opacity-50 cursor-not-allowed'
                        }`}
                        disabled={doc.status !== 'Ready'}
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Documents;