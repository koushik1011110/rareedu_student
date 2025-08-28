import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  FileText,
  CreditCard,
  Plane,
  HelpCircle,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Services', href: '/services', icon: Settings },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Finances', href: '/finances', icon: CreditCard },
    { name: 'Visa', href: '/visa', icon: Plane },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg border border-gray-200"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={onToggle} />
      )}

      {/* Mobile navigation sidebar */}
      <div
        className={`md:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Student Portal</h2>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onToggle}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;