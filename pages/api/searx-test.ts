import { NextApiRequest, NextApiResponse } from 'next';

interface SearxTestResponse {
  success: boolean;
  status?: string;
  engines?: string[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearxTestResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { searxUrl } = req.body;

    if (!searxUrl) {
      return res.status(400).json({
        success: false,
        error: 'SearX URL is required for testing'
      });
    }

    // Test SearXNG connection with a simple search
    const testUrl = `${searxUrl}/search`;
    const params = new URLSearchParams({
      q: 'test',
      format: 'json'
    });

    const response = await fetch(`${testUrl}?${params}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeepSearchBot/1.0)'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`SearXNG responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract available engines from the response
    const engines = new Set<string>();
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any) => {
        if (result.engine) {
          engines.add(result.engine);
        }
      });
    }

    const enginesList = Array.from(engines).sort();

    res.status(200).json({
      success: true,
      status: `SearXNG connection successful! Found ${data.results?.length || 0} test results.`,
      engines: enginesList
    });

  } catch (error) {
    console.error('SearXNG connection test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Connection test failed'
    });
  }
}