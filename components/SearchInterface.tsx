import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useSettings } from '../contexts/SettingsContext';

interface SearchResult {
  title: string;
  content: string;
  url: string;
  engine: string;
  score: number;
}

interface SearchSummary {
  totalResults: number;
  sourceBreakdown: Record<string, number>;
  searchRounds: number;
}

interface DeepSearchResult {
  results: SearchResult[];
  comprehensiveAnswer: string;
  searchSummary: SearchSummary;
}

export default function SearchInterface() {
  const { settings } = useSettings();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'quick' | 'deep'>('quick');
  const [searchDepth, setSearchDepth] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState('');
  const [searchSummary, setSearchSummary] = useState<SearchSummary | null>(null);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const performQuickSearch = async () => {
    try {
      setIsLoading(true);
      setProgressMessages(['🔍 Performing quick search...']);
      
      const response = await axios.post('/api/search', {
        query,
        maxResults: 5,
        settings
      });

      if (response.data.success) {
        setResults(response.data.results);
        setAnswer(response.data.answer);
        setSearchSummary(null);
        setProgressMessages([]);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Quick search failed:', error);
      setAnswer('Search failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const performDeepSearch = async () => {
    try {
      setIsLoading(true);
      setProgressMessages([]);
      setResults([]);
      setAnswer('');
      setSearchSummary(null);

      const response = await axios.post('/api/deep-search', {
        query,
        maxDepth: searchDepth,
        settings
      });

      if (response.data.success) {
        const data: DeepSearchResult = response.data.data;
        setResults(data.results);
        setAnswer(data.comprehensiveAnswer);
        setSearchSummary(data.searchSummary);
        setProgressMessages(['✅ Deep search completed!']);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Deep search failed:', error);
      console.error('Request details:', { query, maxDepth: searchDepth, settings });
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Response data:', (error as any).response.data);
        console.error('Response status:', (error as any).response.status);
      }
      setAnswer('Deep search failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    if (searchMode === 'quick') {
      await performQuickSearch();
    } else {
      await performDeepSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <h1 className="text-4xl font-bold text-gray-800">
            🚀 DeepSearch Engine
          </h1>
          <Link 
            href="/settings"
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
        <p className="text-gray-600 mb-2">
          Enhanced AI-Powered Search with Multi-Round Analysis
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
          <div className="bg-gray-100 rounded-lg px-3 py-1">
            📅 AI Context Date: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="bg-blue-50 rounded-lg px-3 py-1">
            🤖 Model: {settings.selectedModel || 'Not configured'}
          </div>
          <div className="bg-green-50 rounded-lg px-3 py-1">
            🔍 SearX: {settings.searxUrl}
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="search-card mb-8">
        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Search Mode
          </label>
          <div className="flex space-x-3">
            <button
              onClick={() => setSearchMode('quick')}
              className={`mode-button ${
                searchMode === 'quick' 
                  ? 'mode-button-active' 
                  : 'mode-button-inactive'
              }`}
            >
              ⚡ Quick Search
            </button>
            <button
              onClick={() => setSearchMode('deep')}
              className={`mode-button ${
                searchMode === 'deep' 
                  ? 'mode-button-active' 
                  : 'mode-button-inactive'
              }`}
            >
              🧠 AI Adaptive Search
            </button>
          </div>
          {searchMode === 'deep' && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong>🧠 AI Adaptive Search:</strong> The AI will intelligently determine when it has gathered sufficient information and stop searching automatically, rather than using a fixed number of rounds.
            </div>
          )}
        </div>

        {/* Deep Search Depth Setting */}
        {searchMode === 'deep' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Search Depth: {searchDepth} rounds
            </label>
            <input
              type="range"
              min="3"
              max="8"
              value={searchDepth}
              onChange={(e) => setSearchDepth(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3 (Conservative)</span>
              <span>8 (Thorough)</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              ℹ️ AI may stop earlier if it determines sufficient information has been gathered
            </p>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What do you want to search for?"
              className="search-input flex-1"
              disabled={isLoading}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="search-button"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* Progress Messages */}
        {progressMessages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Progress:</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {progressMessages.map((message, index) => (
                <div key={index} className="progress-item">
                  <span>{message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {(answer || results.length > 0) && (
        <div className="space-y-6">
          {/* Search Summary */}
          {searchSummary && (
            <div className="search-card">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📊 {searchMode === 'deep' ? 'AI Adaptive Search Summary' : 'Search Summary'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Results:</span> {searchSummary.totalResults}
                </div>
                <div>
                  <span className="font-medium">
                    {searchMode === 'deep' ? 'AI-Determined Rounds:' : 'Search Rounds:'}
                  </span> {searchSummary.searchRounds}
                </div>
                <div>
                  <span className="font-medium">Sources:</span>{' '}
                  {Object.entries(searchSummary.sourceBreakdown)
                    .map(([engine, count]) => `${engine}: ${count}`)
                    .join(', ')}
                </div>
              </div>
              {searchMode === 'deep' && (
                <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
                  🎯 AI automatically determined when sufficient information was gathered
                </div>
              )}
            </div>
          )}

          {/* AI Answer */}
          {answer && (
            <div className="search-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  🤖 {searchMode === 'deep' ? 'AI Adaptive Analysis' : 'AI Analysis'}
                </h3>
                <div className="flex space-x-2">
                  <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                    📄 Markdown Formatted
                  </div>
                  {searchMode === 'deep' && searchSummary && (
                    <div className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded">
                      🧠 AI-Driven ({searchSummary.searchRounds} rounds)
                    </div>
                  )}
                </div>
              </div>
              <div className="prose prose-gray prose-lg max-w-none markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // Custom renderer for links to open in new tabs
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {answer}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Toggle Detailed Results */}
          {results.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => setShowDetailedResults(!showDetailedResults)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showDetailedResults ? 'Hide' : 'Show'} Detailed Results ({results.length} items)
              </button>
            </div>
          )}

          {/* Detailed Results */}
          {showDetailedResults && results.length > 0 && (
            <div className="search-card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📋 Detailed Search Results
              </h3>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="result-card">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {result.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Source: {result.engine} • Score: {result.score}
                    </p>
                    {result.content && (
                      <p className="text-gray-700 mb-2 text-sm">
                        {result.content.slice(0, 200)}...
                      </p>
                    )}
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Source
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}