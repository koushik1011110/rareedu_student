import { Link, useLocation } from 'react-router-dom';
import { BarChart, FileText, CreditCard, Compass, HelpCircle } from 'lucide-react';

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
    name: 'Visa', 
    path: '/visa', 
    icon: <Compass size={20} /> 
  },
  { 
    name: 'Support', 
    path: '/support', 
    icon: <HelpCircle size={20} /> 
  },
];

const MobileNavigation = () => {
  const location = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <span className={`${isActive ? 'text-primary-500' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="text-xs mt-1 font-medium">{item.name}</span>
              {isActive && (
                <span className="absolute top-0 w-10 h-1 bg-primary-500 rounded-b-lg"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;