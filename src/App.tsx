import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserConfig } from './types';

export default function App() {
  const [config, setConfig] = useState<UserConfig | null>(null);

  // Load saved configuration on mount to preserve state
  useEffect(() => {
    const saved = localStorage.getItem('luna_user_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved config", e);
      }
    }
  }, []);

  const handleOnboardingComplete = (newConfig: UserConfig) => {
    setConfig(newConfig);
    localStorage.setItem('luna_user_config', JSON.stringify(newConfig));
  };

  const handleLogout = () => {
    setConfig(null);
    localStorage.removeItem('luna_user_config');
  };

  const handleChangeConfig = (newConfig: UserConfig) => {
    setConfig(newConfig);
    localStorage.setItem('luna_user_config', JSON.stringify(newConfig));
  };

  // Render correct view state
  if (!config) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Dashboard 
      config={config} 
      onLogout={handleLogout} 
      onChangeConfig={handleChangeConfig} 
    />
  );
}
