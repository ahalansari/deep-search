import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../contexts/SettingsContext';

interface AIModel {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export default function Settings() {
  const { settings, updateSettings, resetSettings, isLoading } = useSettings();
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingSearx, setTestingSearx] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [searxStatus, setSearxStatus] = useState<string>('');
  const [searxEngines, setSearxEngines] = useState<string[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Track changes to show unsaved indicator
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  useEffect(() => {
    setUnsavedChanges(JSON.stringify(tempSettings) !== JSON.stringify(settings));
  }, [tempSettings, settings]);

  const fetchAvailableModels = async () => {
    setLoadingModels(true);
    try {
      const response = await axios.get(`/api/ai-models?aiUrl=${encodeURIComponent(tempSettings.aiUrl)}`);
      if (response.data.success) {
        setAvailableModels(response.data.models || []);
        setConnectionStatus('✅ Successfully fetched available models');
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
      setConnectionStatus('❌ Failed to fetch models: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const testAIConnection = async () => {
    setTestingConnection(true);
    try {
      const response = await axios.post('/api/ai-models', {
        aiUrl: tempSettings.aiUrl,
        testModel: tempSettings.selectedModel
      });
      
      if (response.data.success) {
        setConnectionStatus('✅ ' + response.data.status);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('❌ Connection test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTestingConnection(false);
    }
  };

  const testSearxConnection = async () => {
    setTestingSearx(true);
    try {
      const response = await axios.post('/api/searx-test', {
        searxUrl: tempSettings.searxUrl
      });
      
      if (response.data.success) {
        setSearxStatus('✅ ' + response.data.status);
        setSearxEngines(response.data.engines || []);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('SearX test failed:', error);
      setSearxStatus('❌ SearX test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setSearxEngines([]);
    } finally {
      setTestingSearx(false);
    }
  };

  const saveSettings = () => {
    updateSettings(tempSettings);
    setUnsavedChanges(false);
  };

  const discardChanges = () => {
    setTempSettings(settings);
    setUnsavedChanges(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      resetSettings();
      setTempSettings(settings);
      setConnectionStatus('');
      setSearxStatus('');
      setSearxEngines([]);
      setAvailableModels([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Settings - DeepSearch Engine</title>
        <meta name="description" content="Configure AI and search engine settings" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="search-container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ⚙️ Settings
              </h1>
              <p className="text-gray-600">
                Configure AI models, URLs, and search parameters
              </p>
            </div>
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Search
            </Link>
          </div>

          {/* Unsaved Changes Alert */}
          {unsavedChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">⚠️</span>
                  <span className="text-yellow-800 font-medium">You have unsaved changes</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={discardChanges}
                    className="text-yellow-600 hover:text-yellow-800 text-sm underline"
                  >
                    Discard
                  </button>
                  <button
                    onClick={saveSettings}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Configuration */}
            <div className="search-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🤖 AI Configuration
              </h2>
              
              {/* AI URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI API URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempSettings.aiUrl}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, aiUrl: e.target.value }))}
                    className="search-input flex-1"
                    placeholder="http://localhost:1234"
                  />
                  <button
                    onClick={testAIConnection}
                    disabled={testingConnection}
                    className="search-button whitespace-nowrap"
                  >
                    {testingConnection ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>

              {/* Available Models */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Models
                  </label>
                  <button
                    onClick={fetchAvailableModels}
                    disabled={loadingModels}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {loadingModels ? 'Loading...' : 'Refresh Models'}
                  </button>
                </div>
                <select
                  value={tempSettings.selectedModel}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, selectedModel: e.target.value }))}
                  className="search-input"
                >
                  <option value="">Select a model...</option>
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.id} ({model.owned_by || 'unknown'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Parameters */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature: {tempSettings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={tempSettings.temperature}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Focused</span>
                    <span>Creative</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={tempSettings.maxTokens === -1 ? '' : tempSettings.maxTokens}
                    onChange={(e) => setTempSettings(prev => ({ 
                      ...prev, 
                      maxTokens: e.target.value === '' ? -1 : parseInt(e.target.value) 
                    }))}
                    className="search-input"
                    placeholder="Unlimited (-1)"
                  />
                </div>
              </div>

              {/* Timeout */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={tempSettings.timeout / 1000}
                  onChange={(e) => setTempSettings(prev => ({ 
                    ...prev, 
                    timeout: parseInt(e.target.value) * 1000 
                  }))}
                  className="search-input"
                  min="5"
                  max="300"
                />
              </div>

              {/* Connection Status */}
              {connectionStatus && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  {connectionStatus}
                </div>
              )}
            </div>

            {/* Search Configuration */}
            <div className="search-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🔍 Search Configuration
              </h2>
              
              {/* SearX URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SearXNG URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempSettings.searxUrl}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, searxUrl: e.target.value }))}
                    className="search-input flex-1"
                    placeholder="http://localhost:8080"
                  />
                  <button
                    onClick={testSearxConnection}
                    disabled={testingSearx}
                    className="search-button whitespace-nowrap"
                  >
                    {testingSearx ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>

              {/* SearX Status and Engines */}
              {searxStatus && (
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-sm mb-3">
                    {searxStatus}
                  </div>
                  {searxEngines.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Search Engines ({searxEngines.length})
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <div className="flex flex-wrap gap-1">
                          {searxEngines.map((engine) => (
                            <span
                              key={engine}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {engine}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* System Prompt Prefix */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom System Prompt Prefix
                </label>
                <textarea
                  value={tempSettings.systemPromptPrefix}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, systemPromptPrefix: e.target.value }))}
                  className="search-input h-24 resize-none"
                  placeholder="Additional instructions to prepend to system prompts..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This text will be added to the beginning of all AI system prompts
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Reset to Defaults
            </button>
            
            <div className="flex space-x-3">
              {unsavedChanges && (
                <button
                  onClick={discardChanges}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Discard Changes
                </button>
              )}
              <button
                onClick={saveSettings}
                disabled={!unsavedChanges}
                className="search-button disabled:opacity-50"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}