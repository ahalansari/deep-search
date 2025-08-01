# DeepSearch Engine - Next.js

A powerful Next.js application that provides AI-enhanced search capabilities with multi-round deep analysis, built as a web interface for local SearXNG and AI models.

## 🚀 Features

### **Search Modes**
- **Quick Search**: Fast single-round search with AI analysis
- **Deep Search**: Multi-round comprehensive analysis with follow-up queries

### **Deep Search Capabilities**
- **Multi-Round Analysis**: 2-5 configurable search rounds
- **AI-Generated Follow-ups**: Intelligent query refinement based on initial results
- **Source Aggregation**: Combines results from multiple search engines
- **Comprehensive Synthesis**: AI provides detailed analysis of all gathered information
- **Progress Tracking**: Real-time feedback during search process

### **Modern UI Features**
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Interactive Controls**: Mode selection, depth configuration, results toggles
- **Real-time Progress**: Live updates during deep search operations
- **Detailed Results**: Optional view of all sources and metadata
- **Clean Presentation**: Well-organized results with clear hierarchy

## 📋 Prerequisites

Before running this application, ensure you have:

1. **SearXNG Instance**: Running on `http://localhost:8080`
   ```bash
   cd searxng
   docker-compose up -d
   ```

2. **Local AI Model**: Running on `http://localhost:1234`
   - Compatible with OpenAI API format
   - Recommended: LM Studio with `qwen/qwen3-30b-a3b-2507`

3. **Node.js**: Version 18 or higher

## 🛠️ Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Application**: Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── components/
│   └── SearchInterface.tsx    # Main search UI component
├── lib/
│   └── searchService.ts       # Core search logic and AI integration
├── pages/
│   ├── api/
│   │   ├── search.ts          # Quick search API endpoint
│   │   ├── deep-search.ts     # Deep search API endpoint
│   │   └── search-stream.ts   # Streaming search (future feature)
│   ├── _app.tsx               # Next.js app wrapper
│   └── index.tsx              # Home page
├── styles/
│   └── globals.css            # Global styles and Tailwind utilities
├── searxng/
│   ├── docker-compose.yml     # SearXNG container configuration
│   └── searxng.settings.yml   # SearXNG search engine settings
└── app.py                     # Original Python script (legacy)
```

## 🎯 API Endpoints

### **POST /api/search**
Quick search with immediate AI analysis.

**Request:**
```json
{
  "query": "your search query",
  "maxResults": 5
}
```

**Response:**
```json
{
  "success": true,
  "results": [...],
  "answer": "AI-generated response"
}
```

### **POST /api/deep-search**
Comprehensive multi-round search analysis.

**Request:**
```json
{
  "query": "your search query",
  "maxDepth": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [...],
    "comprehensiveAnswer": "Detailed AI analysis",
    "searchSummary": {
      "totalResults": 25,
      "sourceBreakdown": {"duckduckgo": 15, "wikipedia": 10},
      "searchRounds": 3
    }
  }
}
```

## ⚙️ Configuration

### **SearXNG Configuration**
Edit `searxng/searxng.settings.yml` to:
- Add/remove search engines
- Configure rate limiting
- Set language preferences
- Adjust result formats

### **AI Model Configuration**
Update `lib/searchService.ts` to:
- Change AI model endpoint
- Modify model parameters
- Adjust temperature settings
- Update system prompts

### **Search Behavior**
Customize in `DeepSearchService`:
- Maximum search depth
- Results per round
- Rate limiting delays
- Query generation logic

## 🔧 Development

### **Build for Production**:
```bash
npm run build
npm start
```

### **Linting**:
```bash
npm run lint
```

### **Type Checking**:
```bash
npx tsc --noEmit
```

## 🚦 Usage Examples

### **Quick Search**
1. Select "Quick Search" mode
2. Enter your query
3. Get immediate results with AI analysis

### **Deep Search**
1. Select "Deep Search" mode
2. Adjust search depth (2-5 rounds)
3. Enter your query
4. Watch real-time progress updates
5. Review comprehensive analysis
6. Optionally view detailed source results

## 🔒 Privacy & Security

- **Local Processing**: All searches and AI analysis happen locally
- **No External APIs**: No data sent to third-party services
- **SearXNG Privacy**: Respects SearXNG's privacy-focused design
- **CORS Protection**: API endpoints include proper CORS headers

## 🛠️ Troubleshooting

### **Common Issues**

1. **Search fails**: Ensure SearXNG is running on port 8080
2. **AI responses fail**: Check AI model is running on port 1234
3. **Slow performance**: Reduce search depth or check system resources
4. **No results**: Verify SearXNG search engines are configured correctly

### **Debug Mode**
Check browser console and terminal logs for detailed error information.

## 📈 Future Enhancements

- Real-time streaming search updates
- Search result caching
- Custom search engine configurations
- Export functionality for results
- Search history and bookmarks
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project maintains the same privacy-focused, local-first approach as the original Python version, now with a modern web interface powered by Next.js.