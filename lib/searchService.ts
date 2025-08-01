interface SearchResult {
  title: string;
  content: string;
  url: string;
  engine: string;
  score: number;
}

interface DeepSearchResponse {
  results: SearchResult[];
  comprehensiveAnswer: string;
  searchSummary: {
    totalResults: number;
    sourceBreakdown: Record<string, number>;
    searchRounds: number;
  };
}

export class DeepSearchService {
  private searxUrl: string;
  private aiUrl: string;
  private selectedModel: string;
  private temperature: number;
  private maxTokens: number;
  private timeout: number;
  private systemPromptPrefix: string;

  constructor(settings?: {
    searxUrl?: string;
    aiUrl?: string;
    selectedModel?: string;
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
    systemPromptPrefix?: string;
  }) {
    this.searxUrl = settings?.searxUrl || "http://localhost:8080";
    this.aiUrl = settings?.aiUrl || "http://localhost:1234";
    this.selectedModel = settings?.selectedModel || "qwen/qwen3-30b-a3b-2507";
    this.temperature = settings?.temperature || 0.7;
    this.maxTokens = settings?.maxTokens || -1;
    this.timeout = settings?.timeout || 60000;
    this.systemPromptPrefix = settings?.systemPromptPrefix || "";
  }

  async searchSearx(query: string, maxResults: number = 10): Promise<SearchResult[]> {
    try {
      const url = `${this.searxUrl}/search`;
      const params = new URLSearchParams({
        q: query,
        format: "json"
      });

      const response = await fetch(`${url}?${params}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DeepSearchBot/1.0)"
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        throw new Error(`Searx responded with status ${response.status}`);
      }

      const data = await response.json();
      const results = data.results || [];

      return results.slice(0, maxResults).map((r: any) => ({
        title: r.title || '',
        content: r.content || '',
        url: r.url || '',
        engine: r.engine || 'unknown',
        score: r.score || 0
      }));

    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async analyzeSearchCompleteness(
    originalQuery: string,
    currentResults: SearchResult[],
    currentRound: number
  ): Promise<{
    isComplete: boolean;
    reason: string;
    suggestedQueries: string[];
    confidence: number;
  }> {
    if (!currentResults.length) {
      return {
        isComplete: false,
        reason: "No results found yet",
        suggestedQueries: [`${originalQuery} basics`, `${originalQuery} overview`],
        confidence: 0
      };
    }

    const resultsContext = currentResults
      .slice(0, 10)
      .map(r => `${r.title}: ${r.content}`)
      .join('\n')
      .slice(0, 2000);

    const analysisPrompt = `As an AI research assistant, analyze if we have sufficient information to comprehensively answer: "${originalQuery}"

Current search results (Round ${currentRound}):
${resultsContext}

Please analyze and respond in this exact JSON format:
{
  "isComplete": boolean,
  "reason": "Brief explanation of why search is complete or needs more info",
  "suggestedQueries": ["query1", "query2", "query3"],
  "confidence": number between 0-1,
  "missingAspects": ["aspect1", "aspect2"]
}

Guidelines for determining completeness:
- isComplete = true if we have comprehensive coverage of the topic
- isComplete = false if missing key information, recent updates, or important perspectives
- suggestedQueries should target specific gaps in knowledge
- confidence should reflect how well the current results answer the original query
- Consider: technical details, recent developments, different viewpoints, practical applications

Be decisive - lean towards continuing search if there are any significant gaps.`;

    try {
      const response = await this.askAI(analysisPrompt, '', 0.1); // Low temperature for consistency
      
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      
      // Validate response structure
      if (typeof analysis.isComplete !== 'boolean') {
        throw new Error('Invalid response format');
      }

      return {
        isComplete: analysis.isComplete,
        reason: analysis.reason || 'AI analysis completed',
        suggestedQueries: Array.isArray(analysis.suggestedQueries) 
          ? analysis.suggestedQueries.slice(0, 3)
          : [],
        confidence: typeof analysis.confidence === 'number' 
          ? Math.max(0, Math.min(1, analysis.confidence))
          : 0.5
      };

    } catch (error) {
      console.error('Search completeness analysis failed:', error);
      
      // Fallback analysis based on simple heuristics
      const hasEnoughResults = currentResults.length >= 15;
      const hasRecentContent = currentResults.some(r => 
        r.content.toLowerCase().includes('2024') || 
        r.content.toLowerCase().includes('recent') ||
        r.content.toLowerCase().includes('latest')
      );
      const hasTechnicalContent = currentResults.some(r =>
        r.content.length > 200 && 
        (r.content.includes('how') || r.content.includes('technical') || r.content.includes('implementation'))
      );

      const isComplete = hasEnoughResults && hasRecentContent && hasTechnicalContent && currentRound >= 3;

      return {
        isComplete,
        reason: isComplete 
          ? "Heuristic analysis suggests sufficient information gathered"
          : "Heuristic analysis suggests more information needed",
        suggestedQueries: isComplete ? [] : [
          `${originalQuery} latest developments 2024`,
          `${originalQuery} technical implementation`,
          `${originalQuery} best practices`
        ],
        confidence: isComplete ? 0.7 : 0.4
      };
    }
  }

  async generateFollowUpQueries(
    originalQuery: string, 
    initialResults: SearchResult[]
  ): Promise<string[]> {
    // This method is now mainly used as a fallback
    // The main logic is in analyzeSearchCompleteness
    if (!initialResults.length) {
      return [];
    }

    const allContent = initialResults
      .slice(0, 5)
      .map(r => `${r.title} ${r.content}`)
      .join(' ')
      .slice(0, 1000);

    const prompt = `Based on the original query "${originalQuery}" and these search results:
${allContent}...

Generate 3-4 specific follow-up search queries that would provide deeper, more comprehensive information. Focus on:
1. Technical details or specifics
2. Recent developments or updates
3. Different perspectives or approaches
4. Related concepts or alternatives

Return only the queries, one per line, without numbers or bullets.`;

    try {
      const followUpQueries = await this.askAI(prompt, '');
      return followUpQueries
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 10)
        .slice(0, 4);
    } catch (error) {
      console.error('Follow-up query generation failed:', error);
      // Fallback queries
      return [
        `${originalQuery} latest developments`,
        `${originalQuery} technical details`,
        `${originalQuery} alternatives comparison`
      ];
    }
  }

  async askAI(
    userPrompt: string, 
    searchContext: string, 
    temperature: number = 0.7
  ): Promise<string> {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });

    const baseSystemMessage = `You are an expert research assistant with access to comprehensive search data. 
Today's date is ${currentDate}. Use this temporal context when analyzing information, especially when discussing recent developments, trends, or time-sensitive topics.

Search Context:
${searchContext}

Guidelines:
- Synthesize information from multiple sources
- Cite key facts and findings
- Identify any conflicting information
- Provide comprehensive coverage of the topic
- Structure your response clearly with sections using Markdown formatting
- Use proper Markdown syntax for headers (##), lists (-), bold (**text**), italic (*text*), and code blocks (\`\`\`)
- When mentioning dates or timeframes, consider the current date context
- Distinguish between recent and older information based on the current date`;

    const systemMessage = this.systemPromptPrefix 
      ? `${this.systemPromptPrefix}\n\n${baseSystemMessage}`
      : baseSystemMessage;

    const payload = {
      model: this.selectedModel,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt }
      ],
      temperature,
      max_tokens: this.maxTokens,
      stream: false
    };

    try {
      const response = await fetch(`${this.aiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI request failed:', error);
      return `AI response failed: ${error}`;
    }
  }

  async performAdaptiveSearch(
    query: string, 
    maxDepth: number = 5,
    onProgress?: (message: string) => void
  ): Promise<DeepSearchResponse> {
    const allResults: SearchResult[] = [];
    let searchRound = 1;
    let shouldContinueSearching = true;

    // Progress callback helper
    const updateProgress = (message: string) => {
      if (onProgress) onProgress(message);
    };

    updateProgress(`🧠 Starting AI-driven adaptive search for: "${query}"`);

    // Initial search
    updateProgress(`📍 Round ${searchRound}: Initial search`);
    const initialResults = await this.searchSearx(query, 8);
    allResults.push(...initialResults);

    if (!initialResults.length) {
      return {
        results: [],
        comprehensiveAnswer: "No initial results found.",
        searchSummary: {
          totalResults: 0,
          sourceBreakdown: {},
          searchRounds: 1
        }
      };
    }

    updateProgress(`   Found ${initialResults.length} results`);

    // AI-driven adaptive search loop
    while (shouldContinueSearching && searchRound < maxDepth) {
      // Let AI analyze current information and decide next steps
      const analysisResult = await this.analyzeSearchCompleteness(query, allResults, searchRound);
      
      if (analysisResult.isComplete) {
        updateProgress(`🎯 AI determined search is complete: ${analysisResult.reason}`);
        shouldContinueSearching = false;
        break;
      }

      if (analysisResult.suggestedQueries.length === 0) {
        updateProgress(`🔍 AI found no additional search directions needed`);
        shouldContinueSearching = false;
        break;
      }

      // Execute AI-suggested follow-up searches
      for (const suggestedQuery of analysisResult.suggestedQueries.slice(0, 2)) { // Limit to 2 per round
        searchRound++;
        
        updateProgress(`📍 Round ${searchRound}: AI-suggested search - "${suggestedQuery}"`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        const followUpResults = await this.searchSearx(suggestedQuery, 6);
        
        if (followUpResults.length) {
          // Filter out duplicates based on URL
          const existingUrls = new Set(allResults.map(r => r.url));
          const newResults = followUpResults.filter(r => !existingUrls.has(r.url));
          allResults.push(...newResults);
          updateProgress(`   Found ${newResults.length} new results`);
        } else {
          updateProgress(`   No new results found`);
        }
      }
    }

    if (searchRound >= maxDepth) {
      updateProgress(`🔄 Reached maximum search depth (${maxDepth})`);
    }

    // Compile comprehensive context
    updateProgress(`🔬 AI analyzing ${allResults.length} total results...`);
    const comprehensiveContext = this.compileSearchContext(allResults);

    // Generate final comprehensive answer
    const finalPrompt = `Based on my adaptive AI-driven search research, provide a comprehensive answer to: "${query}"

I conducted ${searchRound} rounds of intelligent search, gathering ${allResults.length} results from multiple sources.

Consider:
- Key facts and findings from multiple sources
- Recent developments and current state (remember today is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })})
- Different perspectives or approaches
- Technical details and practical implications
- Any limitations or conflicting information
- The adaptive nature of this search means the information should be comprehensive

FORMAT YOUR RESPONSE IN MARKDOWN with the following structure:
## Overview
Brief summary of the topic

## Key Findings
- Important facts and discoveries
- Recent developments (with temporal context)

## Technical Details
Specific technical information, code examples if relevant

## Different Perspectives
Various viewpoints or approaches

## Conclusion
Summary and implications

Use proper Markdown formatting including:
- Headers (##, ###)
- Bold (**text**) for emphasis
- Lists (- item) for better organization
- Code blocks (\`\`\`) for technical content
- Links when referencing sources`;

    const comprehensiveAnswer = await this.askAI(finalPrompt, comprehensiveContext, 0.3);

    // Calculate source breakdown
    const sourceBreakdown: Record<string, number> = {};
    allResults.forEach(result => {
      const engine = result.engine || 'unknown';
      sourceBreakdown[engine] = (sourceBreakdown[engine] || 0) + 1;
    });

    updateProgress(`✅ Adaptive search completed with ${searchRound} rounds!`);

    return {
      results: allResults,
      comprehensiveAnswer,
      searchSummary: {
        totalResults: allResults.length,
        sourceBreakdown,
        searchRounds: searchRound
      }
    };
  }

  // Legacy method for backward compatibility
  async performDeepSearch(
    query: string, 
    maxDepth: number = 3,
    onProgress?: (message: string) => void
  ): Promise<DeepSearchResponse> {
    return this.performAdaptiveSearch(query, maxDepth, onProgress);
  }

  compileSearchContext(results: SearchResult[]): string {
    if (!results.length) {
      return "No search results available.";
    }

    const contextParts: string[] = [];

    // Group by engine/source for better organization
    const byEngine: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      const engine = result.engine || 'unknown';
      if (!byEngine[engine]) {
        byEngine[engine] = [];
      }
      byEngine[engine].push(result);
    });

    Object.entries(byEngine).forEach(([engine, engineResults]) => {
      contextParts.push(`\n=== ${engine.toUpperCase()} RESULTS ===`);
      engineResults.slice(0, 5).forEach((result, i) => {
        contextParts.push(`${i + 1}. ${result.title}`);
        if (result.content) {
          contextParts.push(`   ${result.content.slice(0, 200)}...`);
        }
        contextParts.push(`   URL: ${result.url}`);
        contextParts.push('');
      });
    });

    return contextParts.join('\n');
  }

  // Quick search method for backward compatibility
  async quickSearch(query: string): Promise<SearchResult[]> {
    return this.searchSearx(query, 3);
  }
}