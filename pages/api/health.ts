import { NextApiRequest, NextApiResponse } from 'next';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  services: {
    searxng: boolean;
    ai: boolean;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: { searxng: false, ai: false }
    });
  }

  const startTime = Date.now();
  
  // Check SearXNG health
  let searxngHealthy = false;
  try {
    const searxUrl = process.env.SEARXNG_URL || 'http://localhost:8080';
    const searxResponse = await fetch(`${searxUrl}/search?q=test&format=json`, {
      signal: AbortSignal.timeout(5000)
    });
    searxngHealthy = searxResponse.ok;
  } catch (error) {
    searxngHealthy = false;
  }

  // Check AI health (optional)
  let aiHealthy = false;
  try {
    const aiUrl = process.env.AI_URL || 'http://localhost:1234';
    const aiResponse = await fetch(`${aiUrl}/v1/models`, {
      signal: AbortSignal.timeout(5000)
    });
    aiHealthy = aiResponse.ok;
  } catch (error) {
    // AI is optional, so we don't fail the health check
    aiHealthy = false;
  }

  const responseTime = Date.now() - startTime;
  const status = searxngHealthy ? 'healthy' : 'degraded';

  res.status(200).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      searxng: searxngHealthy,
      ai: aiHealthy
    }
  });
}