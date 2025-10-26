import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Bell, Moon, Sun, LogOut, ChevronRight, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { BottomNav } from '../BottomNav';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner@2.0.3';

export const ProfileScreen: React.FC = () => {
  const { user, setUser, darkMode, setDarkMode, setCurrentScreen } = useApp();

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
    toast.success('Logged out successfully');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast.success(darkMode ? 'Light mode enabled' : 'Dark mode enabled');
  };

  if (!user) {
    setCurrentScreen('login');
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card shadow-sm px-6 py-4 z-10">
        <h1>Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1E90FF] to-[#1E90FF]/80 rounded-3xl p-6 mb-6 text-white"
        >
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarFallback className="bg-white/20 text-white text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white mb-1">{user.name}</h2>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              {user.isAdmin && (
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Administrator</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
          >
            Edit Profile
          </Button>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-6"
        >
          <h3 className="text-muted-foreground px-2 mb-3">Settings</h3>

          {/* Notifications */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E90FF]/10 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#1E90FF]" />
                </div>
                <div>
                  <h4 className="text-foreground">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Push notifications</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Dark Mode */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E90FF]/10 rounded-xl flex items-center justify-center">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-[#1E90FF]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[#1E90FF]" />
                  )}
                </div>
                <div>
                  <h4 className="text-foreground">Dark Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    {darkMode ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          <h3 className="text-muted-foreground px-2 mb-3">About</h3>

          <button className="w-full bg-card rounded-2xl shadow-sm border border-border p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center">
                <span className="text-sm">ℹ️</span>
              </div>
              <div className="text-left">
                <h4 className="text-foreground">App Version</h4>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-xl h-14 text-[#FF6B6B] border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};
