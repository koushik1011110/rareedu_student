import { Link, useLocation } from 'react-router-dom';
import { BarChart, FileText, CreditCard, Compass, HelpCircle, User } from 'lucide-react';

const navItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: <BarChart size={20} />
  },
  { 
    name: 'Documents', 
    path: '/documents', 
    icon: <FileText size={20} /> 
  },
  { 
    name: 'Finances', 
    path: '/finances', 
    icon: <CreditCard size={20} /> 
  },
  { 
    name: 'Visa & Residency', 
    path: '/visa', 
    icon: <Compass size={20} /> 
  },
  { 
    name: 'Support', 
    path: '/support', 
    icon: <HelpCircle size={20} /> 
  },
  { 
    name: 'Profile', 
    path: '/profile', 
    icon: <User size={20} /> 
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 h-full min-h-screen">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-md text-white">
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
            <span className="text-xl font-bold text-primary-800">Student Portal</span>
          </Link>
        </div>
        
        <div className="py-6 flex-1 overflow-y-auto">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-primary-500' : 'text-gray-500 group-hover:text-primary-500'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-6 bg-primary-500 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-skyblue-100 rounded-lg p-4">
            <h3 className="font-semibold text-primary-800">Need Help?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Contact our support team for assistance with your student portal
            </p>
            <Link
              to="/support"
              className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-800 inline-block"
            >
              Get Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;