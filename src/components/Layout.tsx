import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 h-full z-30 w-64">
              <Sidebar />
            </div>
          </>
        )}
        
        <main className="flex-1 p-4 md:p-6 max-w-[1200px] mx-auto w-full">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default Layout;