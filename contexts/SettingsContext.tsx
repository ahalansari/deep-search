import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AISettings {
  aiUrl: string;
  searxUrl: string;
  selectedModel: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  systemPromptPrefix: string;
}

export interface SettingsContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: AISettings = {
  aiUrl: 'http://localhost:1234',
  searxUrl: 'http://localhost:8080',
  selectedModel: 'qwen/qwen3-30b-a3b-2507',
  temperature: 0.7,
  maxTokens: -1,
  timeout: 60000,
  systemPromptPrefix: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('deepsearch-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('deepsearch-settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
      }
    }
  }, [settings, isLoading]);

  const updateSettings = (newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('deepsearch-settings');
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    isLoading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};