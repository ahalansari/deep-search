import { NextApiRequest, NextApiResponse } from 'next';
import { DeepSearchService } from '../../lib/searchService';

interface DeepSearchRequest {
  query: string;
  maxDepth?: number;
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

interface DeepSearchResponse {
  success: boolean;
  data?: {
    results: any[];
    comprehensiveAnswer: string;
    searchSummary: {
      totalResults: number;
      sourceBreakdown: Record<string, number>;
      searchRounds: number;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeepSearchResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { query, maxDepth = 5, settings }: DeepSearchRequest = req.body;

    console.log('Deep search request:', { query, maxDepth, hasSettings: !!settings });

    if (!query || typeof query !== 'string') {
      console.log('Invalid query:', { query, type: typeof query });
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required and must be a string' 
      });
    }

    if (maxDepth < 2 || maxDepth > 8) {
      console.log('Invalid maxDepth:', { maxDepth });
      return res.status(400).json({ 
        success: false, 
        error: 'Max depth must be between 2 and 8' 
      });
    }

    const searchService = new DeepSearchService(settings);
    
    // Perform deep search
    const deepSearchResult = await searchService.performDeepSearch(query, maxDepth);

    res.status(200).json({
      success: true,
      data: deepSearchResult
    });

  } catch (error) {
    console.error('Deep search API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}