import { NextApiRequest, NextApiResponse } from 'next';
import { DeepSearchService } from '../../lib/searchService';

interface QuickSearchRequest {
  query: string;
  maxResults?: number;
  settings?: {
    aiUrl?: string;
    searxUrl?: string;
    selectedModel?: string;
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
    systemPromptPrefix?: string;
  };
}

interface QuickSearchResponse {
  success: boolean;
  results?: any[];
  answer?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuickSearchResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { query, maxResults = 3, settings }: QuickSearchRequest = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required and must be a string' 
      });
    }

    const searchService = new DeepSearchService(settings);
    
    // Perform quick search
    const results = await searchService.quickSearch(query);
    
    if (!results.length) {
      return res.status(200).json({
        success: true,
        results: [],
        answer: "No results found for your query."
      });
    }

    // Generate AI answer based on search results
    const searchContext = results
      .map(r => `${r.title}: ${r.content}`)
      .join('\n');

    const answer = await searchService.askAI(query, searchContext);

    res.status(200).json({
      success: true,
      results,
      answer
    });

  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}