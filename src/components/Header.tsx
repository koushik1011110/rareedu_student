import { Bell, Menu, Search, User } from 'lucide-react';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Security deposit balance (default -$100)
  const securityDepositBalance = -100;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="md:hidden mr-4 text-gray-500 hover:text-primary-500 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 bg-primary-500 rounded-md text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            <h1 className="text-xl font-bold text-primary-800 hidden sm:block">Student Portal</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-md mx-8">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..."
            className="bg-transparent border-none outline-none ml-2 w-full text-sm" 
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Wallet Display */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Wallet size={18} className="text-gray-600 mr-2" />
            <div className="text-sm">
              <span className="text-gray-500">Balance: </span>
              <span className={`font-semibold ${securityDepositBalance < 0 ? 'text-error-600' : 'text-success-600'}`}>
                ${securityDepositBalance.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-500 hover:text-primary-500 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-primary-500">
                    <p className="text-sm font-medium">Admission Status Update</p>
                    <p className="text-xs text-gray-500">Your application has been approved</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-warning-500">
                    <p className="text-sm font-medium">Payment Reminder</p>
                    <p className="text-xs text-gray-500">Tuition payment due in 5 days</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-error-500">
                    <p className="text-sm font-medium">Visa Expiration</p>
                    <p className="text-xs text-gray-500">Your visa expires in 30 days</p>
                    <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-primary-500 hover:text-primary-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center"
              aria-label="User menu"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  <User size={18} />
                </div>
              )}
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                {user?.name}
              </span>
            </button>
            
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
              >
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;