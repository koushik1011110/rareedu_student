import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-6 bg-gray-50"
    >
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl font-bold text-primary-600">4</span>
          <span className="text-6xl font-bold text-secondary-500">0</span>
          <span className="text-6xl font-bold text-primary-600">4</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/" className="btn btn-primary">
          <Home size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;