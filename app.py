import requests
import json
import time
from typing import List, Dict, Any, Tuple

class DeepSearchEngine:
    def __init__(self, searx_url="http://localhost:8080", ai_url="http://localhost:1234"):
        self.searx_url = searx_url
        self.ai_url = ai_url
        self.search_history = []
        
    def search_searx(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Enhanced search with more detailed results"""
        try:
            url = f"{self.searx_url}/search"
            params = {"q": query, "format": "json"}
            headers = {
                "User-Agent": "Mozilla/5.0 (compatible; DeepSearchBot/1.0)"
            }

            resp = requests.get(url, params=params, headers=headers, timeout=15)

            if resp.status_code != 200:
                print(f"❌ Error: Searx responded with status code {resp.status_code}")
                return []

            data = resp.json()
            results = data.get("results", [])
            
            # Return more detailed results
            enhanced_results = []
            for r in results[:max_results]:
                enhanced_results.append({
                    'title': r.get('title', ''),
                    'content': r.get('content', ''),
                    'url': r.get('url', ''),
                    'engine': r.get('engine', ''),
                    'score': r.get('score', 0)
                })
                
            return enhanced_results

        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
            return []
        except json.JSONDecodeError:
            print("❌ Failed to parse JSON from Searx")
            return []

    def generate_follow_up_queries(self, original_query: str, initial_results: List[Dict]) -> List[str]:
        """Generate follow-up search queries based on initial results"""
        if not initial_results:
            return []
            
        # Extract key topics from initial results
        all_content = " ".join([r['title'] + " " + r['content'] for r in initial_results[:5]])
        
        prompt = f"""Based on the original query "{original_query}" and these search results:
{all_content[:1000]}...

Generate 3-4 specific follow-up search queries that would provide deeper, more comprehensive information. Focus on:
1. Technical details or specifics
2. Recent developments or updates
3. Different perspectives or approaches
4. Related concepts or alternatives

Return only the queries, one per line, without numbers or bullets."""

        try:
            follow_up_queries = self.ask_ai(prompt, "").strip().split('\n')
            return [q.strip() for q in follow_up_queries if q.strip() and len(q.strip()) > 10][:4]
        except:
            # Fallback queries
            return [
                f"{original_query} latest developments",
                f"{original_query} technical details",
                f"{original_query} alternatives comparison"
            ]

    def ask_ai(self, user_prompt: str, search_context: str, temperature: float = 0.7) -> str:
        """Enhanced AI interaction with better context handling"""
        system_message = f"""You are an expert research assistant with access to comprehensive search data. 
Use the provided search context to give detailed, accurate, and well-structured responses.

Search Context:
{search_context}

Guidelines:
- Synthesize information from multiple sources
- Cite key facts and findings
- Identify any conflicting information
- Provide comprehensive coverage of the topic
- Structure your response clearly with sections if needed"""

        payload = {
            "model": "qwen/qwen3-30b-a3b-2507",
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": -1,
            "stream": False
        }

        try:
            response = requests.post(f"{self.ai_url}/v1/chat/completions",
                                   headers={"Content-Type": "application/json"},
                                   data=json.dumps(payload),
                                   timeout=60)
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"AI response failed: {e}"

    def perform_deep_search(self, query: str, max_depth: int = 3) -> Tuple[List[Dict], str]:
        """Perform multi-round deep search with query refinement"""
        print(f"🔍 Starting deep search for: '{query}'")
        all_results = []
        search_round = 1
        
        # Initial search
        print(f"\n📍 Round {search_round}: Initial search")
        initial_results = self.search_searx(query, max_results=8)
        all_results.extend(initial_results)
        
        if not initial_results:
            return [], "No initial results found."
            
        print(f"   Found {len(initial_results)} results")
        
        # Generate and execute follow-up searches
        follow_up_queries = self.generate_follow_up_queries(query, initial_results)
        
        for i, follow_up_query in enumerate(follow_up_queries[:max_depth-1], 2):
            print(f"\n📍 Round {i}: Deep search - '{follow_up_query}'")
            time.sleep(1)  # Rate limiting
            
            follow_up_results = self.search_searx(follow_up_query, max_results=6)
            if follow_up_results:
                # Filter out duplicates based on URL
                existing_urls = {r['url'] for r in all_results}
                new_results = [r for r in follow_up_results if r['url'] not in existing_urls]
                all_results.extend(new_results)
                print(f"   Found {len(new_results)} new results")
            else:
                print("   No new results found")
        
        # Compile comprehensive context
        print(f"\n🔬 Analyzing {len(all_results)} total results...")
        comprehensive_context = self.compile_search_context(all_results)
        
        # Generate final comprehensive answer
        final_prompt = f"""Based on my deep search research, provide a comprehensive answer to: "{query}"

Consider:
- Key facts and findings from multiple sources
- Recent developments and current state
- Different perspectives or approaches
- Technical details and practical implications
- Any limitations or conflicting information

Provide a well-structured, thorough response that synthesizes all the gathered information."""

        final_answer = self.ask_ai(final_prompt, comprehensive_context, temperature=0.5)
        
        return all_results, final_answer

    def compile_search_context(self, results: List[Dict]) -> str:
        """Compile search results into structured context for AI"""
        if not results:
            return "No search results available."
            
        context_parts = []
        
        # Group by engine/source for better organization
        by_engine = {}
        for result in results:
            engine = result.get('engine', 'unknown')
            if engine not in by_engine:
                by_engine[engine] = []
            by_engine[engine].append(result)
        
        for engine, engine_results in by_engine.items():
            context_parts.append(f"\n=== {engine.upper()} RESULTS ===")
            for i, result in enumerate(engine_results[:5], 1):  # Limit per engine
                context_parts.append(f"{i}. {result['title']}")
                if result['content']:
                    context_parts.append(f"   {result['content'][:200]}...")
                context_parts.append(f"   URL: {result['url']}")
                context_parts.append("")
        
        return "\n".join(context_parts)

# Legacy functions for backward compatibility
def search_searx(query):
    engine = DeepSearchEngine()
    results = engine.search_searx(query, max_results=3)
    if not results:
        return "No results found."
    snippets = [f"{r['title']}: {r['content']}" for r in results]
    return "\n".join(snippets)

def ask_local_ai(user_prompt, search_snippets):
    engine = DeepSearchEngine()
    return engine.ask_ai(user_prompt, search_snippets)

if __name__ == "__main__":
    print("🚀 DeepSearch Engine - Enhanced AI-Powered Search")
    print("=" * 50)
    
    # Get search mode preference
    mode = input("Choose search mode:\n1. Quick search (default)\n2. Deep search (comprehensive)\nEnter choice (1 or 2): ").strip()
    
    query = input("\nWhat do you want to search for? ")
    
    if mode == "2":
        # Deep search mode
        engine = DeepSearchEngine()
        
        # Ask for depth preference
        try:
            depth = int(input("Search depth (2-5 rounds, default 3): ") or "3")
            depth = max(2, min(5, depth))  # Clamp between 2-5
        except ValueError:
            depth = 3
            
        print(f"\n🎯 Performing deep search with {depth} rounds...")
        all_results, comprehensive_answer = engine.perform_deep_search(query, max_depth=depth)
        
        print(f"\n📊 Search Summary:")
        print(f"   Total results analyzed: {len(all_results)}")
        
        # Group results by engine for summary
        engines = {}
        for result in all_results:
            engine_name = result.get('engine', 'unknown')
            engines[engine_name] = engines.get(engine_name, 0) + 1
        
        print("   Sources:", ", ".join([f"{eng}: {count}" for eng, count in engines.items()]))
        
        print(f"\n🤖 Comprehensive AI Analysis:\n")
        print("=" * 60)
        print(comprehensive_answer)
        print("=" * 60)
        
        # Optionally show detailed results
        show_details = input("\nShow detailed search results? (y/N): ").lower().startswith('y')
        if show_details:
            print(f"\n📋 Detailed Results ({len(all_results)} items):")
            for i, result in enumerate(all_results, 1):
                print(f"\n{i}. {result['title']}")
                print(f"   Source: {result.get('engine', 'unknown')}")
                print(f"   URL: {result['url']}")
                if result['content']:
                    print(f"   Content: {result['content'][:150]}...")
    
    else:
        # Quick search mode (legacy behavior)
        print("\n🔍 Performing quick search...")
        snippets = search_searx(query)
        print("\n🔎 Search Snippets:\n", snippets)

        if "No results found" not in snippets:
            answer = ask_local_ai(query, snippets)
            print("\n🤖 AI Answer:\n", answer)
        else:
            print("❌ No results found for your query.")