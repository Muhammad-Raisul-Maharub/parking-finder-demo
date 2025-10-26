import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeMapScreen } from './components/screens/HomeMapScreen';
import { SlotDetailsScreen } from './components/screens/SlotDetailsScreen';
import { MyReservationsScreen } from './components/screens/MyReservationsScreen';
import { AdminPanelScreen } from './components/screens/AdminPanelScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { Toaster } from './components/ui/sonner';

const AppContent: React.FC = () => {
  const { currentScreen, darkMode } = useApp();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'home':
        return <HomeMapScreen />;
      case 'slot-details':
        return <SlotDetailsScreen />;
      case 'reservations':
        return <MyReservationsScreen />;
      case 'admin':
        return <AdminPanelScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="font-sans antialiased">
      {renderScreen()}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            padding: '16px'
          }
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
