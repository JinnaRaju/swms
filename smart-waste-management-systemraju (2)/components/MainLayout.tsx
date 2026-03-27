import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HomeIcon, ListBulletIcon, DocumentPlusIcon, ClockIcon, QuestionMarkCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navItems = [
    { path: '/dashboard', label: t('nav.home'), icon: <HomeIcon className="w-6 h-6" /> },
    { path: '/status', label: t('nav.status'), icon: <ListBulletIcon className="w-6 h-6" /> },
    { path: '/complaint', label: t('nav.new'), icon: <DocumentPlusIcon className="w-6 h-6" /> },
    { path: '/history', label: t('nav.history'), icon: <ClockIcon className="w-6 h-6" /> },
    { path: '/settings', label: t('nav.settings'), icon: <Cog6ToothIcon className="w-6 h-6" /> },
    { path: '/support', label: t('nav.support'), icon: <QuestionMarkCircleIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full hover:bg-green-700/50 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold tracking-tight drop-shadow-md">♻️ Smart Waste Management</h1>
            </div>
            <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-green-700/50 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                  aria-label="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-6 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-10">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map(item => ( // Show 5 main icons on mobile
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;