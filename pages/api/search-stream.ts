import { NextApiRequest, NextApiResponse } from 'next';
import { DeepSearchService } from '../../lib/searchService';

interface StreamSearchRequest {
  query: string;
  maxDepth?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, maxDepth = 3 }: StreamSearchRequest = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required and must be a string' });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const sendProgress = (message: string) => {
      res.write(`data: ${JSON.stringify({ type: 'progress', message })}\n\n`);
    };

    const searchService = new DeepSearchService();
    
    try {
      // Perform deep search with progress updates
      const result = await searchService.performDeepSearch(query, maxDepth, sendProgress);
      
      // Send final result
      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        data: result 
      })}\n\n`);
      
    } catch (searchError) {
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        error: searchError instanceof Error ? searchError.message : 'Search failed' 
      })}\n\n`);
    }

    res.end();

  } catch (error) {
    console.error('Stream search API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}