import { NextApiRequest, NextApiResponse } from 'next';

interface AIModel {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

interface ModelsResponse {
  success: boolean;
  models?: AIModel[];
  error?: string;
}

interface ConnectionTestResponse {
  success: boolean;
  status?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ModelsResponse | ConnectionTestResponse>
) {
  if (req.method === 'GET') {
    // Fetch available AI models
    try {
      const { aiUrl = 'http://localhost:1234' } = req.query;
      
      const response = await fetch(`${aiUrl}/v1/models`, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const data = await response.json();
      const models = data.data || [];

      res.status(200).json({
        success: true,
        models: models.map((model: any) => ({
          id: model.id,
          object: model.object || 'model',
          created: model.created,
          owned_by: model.owned_by || 'unknown'
        }))
      });

    } catch (error) {
      console.error('Failed to fetch AI models:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch models'
      });
    }
  } else if (req.method === 'POST') {
    // Test AI connection
    try {
      const { aiUrl, testModel } = req.body;

      if (!aiUrl) {
        return res.status(400).json({
          success: false,
          error: 'AI URL is required for testing'
        });
      }

      // Test basic connection first
      const modelsResponse = await fetch(`${aiUrl}/v1/models`, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!modelsResponse.ok) {
        throw new Error(`Connection test failed: ${modelsResponse.status}`);
      }

      // If a specific model is provided, test a simple completion
      if (testModel) {
        const testPayload = {
          model: testModel,
          messages: [
            { role: "user", content: "Hello, this is a connection test. Please respond with 'OK'." }
          ],
          max_tokens: 10,
          temperature: 0.1
        };

        const completionResponse = await fetch(`${aiUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testPayload),
          signal: AbortSignal.timeout(15000)
        });

        if (!completionResponse.ok) {
          throw new Error(`Model test failed: ${completionResponse.status}`);
        }

        const completionData = await completionResponse.json();
        const response = completionData.choices?.[0]?.message?.content || '';

        res.status(200).json({
          success: true,
          status: `Connection successful! Model responded: "${response.trim()}"`
        });
      } else {
        res.status(200).json({
          success: true,
          status: 'Connection successful! Models endpoint is accessible.'
        });
      }

    } catch (error) {
      console.error('AI connection test failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}