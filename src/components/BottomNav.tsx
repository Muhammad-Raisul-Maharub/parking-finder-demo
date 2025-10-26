import React from 'react';
import { motion } from 'motion/react';
import { Map, Clock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, user } = useApp();

  const navItems = [
    { id: 'home', icon: Map, label: 'Map' },
    { id: 'reservations', icon: Clock, label: 'Reservations' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  // Add admin panel for admin users
  if (user?.isAdmin) {
    navItems.splice(2, 0, { 
      id: 'admin', 
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ), 
      label: 'Admin' 
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom z-50">
      <nav className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className="relative flex flex-col items-center justify-center py-2 px-4 min-w-[4rem]"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#1E90FF' : '#6C757D'
                }}
                transition={{ duration: 0.2 }}
              >
                {React.createElement(item.icon, {
                  className: 'w-6 h-6'
                })}
              </motion.div>
              <motion.span
                animate={{
                  color: isActive ? '#1E90FF' : '#6C757D',
                  fontWeight: isActive ? 600 : 400
                }}
                className="text-xs mt-1"
              >
                {item.label}
              </motion.span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1E90FF] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
