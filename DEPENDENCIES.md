# Dependencies Documentation

## Frontend Dependencies (Next.js)

### axios (v1.7.x)
- **Purpose**: HTTP client for communicating with Python backend
- **License**: MIT
- **Docs**: https://axios-http.com/docs/intro
- **Why**: Industry-standard HTTP client with good TypeScript support and error handling
- **Size**: ~500KB (minified)

### pptxgenjs (v3.12.x)
- **Purpose**: Generate PowerPoint (.pptx) files programmatically
- **License**: MIT
- **Docs**: https://gitbrent.github.io/PptxGenJS/
- **Why**: Pure JavaScript library with no external dependencies, works in Node.js and browsers
- **Size**: ~300KB

### @heroicons/react (v2.x)
- **Purpose**: UI icons for the download button
- **License**: MIT
- **Docs**: https://heroicons.com/
- **Why**: Official Tailwind CSS icon library, tree-shakeable
- **Size**: Minimal (only icons used are bundled)

## Backend Dependencies (Python)

### fastapi (v0.115.x)
- **Purpose**: Modern Python web framework for building APIs
- **License**: MIT
- **Docs**: https://fastapi.tiangolo.com/
- **Why**: Fast, automatic API documentation, excellent async support
- **Size**: Lightweight with minimal dependencies

### lyricsgenius (v3.0.x)
- **Purpose**: Official Genius API wrapper for fetching lyrics
- **License**: MIT
- **Docs**: https://github.com/johnwmillr/LyricsGenius
- **Why**: Properly handles Genius API authentication and rate limiting
- **Note**: Requires Genius API token from https://genius.com/api-clients

### uvicorn (v0.32.x)
- **Purpose**: ASGI server for running FastAPI
- **License**: BSD-3-Clause
- **Docs**: https://www.uvicorn.org/
- **Why**: High-performance async server with WebSocket support

### python-dotenv (v1.0.x)
- **Purpose**: Load environment variables from .env file
- **License**: BSD-3-Clause
- **Docs**: https://github.com/theskumar/python-dotenv
- **Why**: Secure configuration management

## Security Considerations

- All dependencies from trusted sources with active maintenance
- Genius API token stored in environment variables (never committed)
- CORS configured to only allow requests from Next.js frontend
- No user data stored; all processing is ephemeral
- HTTPS recommended for production deployment

## Architecture Decision

**Why Python backend + Next.js frontend?**

Genius doesn't provide lyrics through their public API due to licensing restrictions. The `lyricsgenius` Python library (https://github.com/johnwmillr/LyricsGenius) is the recommended way to access lyrics via the Genius API with proper authentication.

**Alternative considered**: Direct web scraping from Next.js was rejected because:
1. Violates Genius Terms of Service
2. Fragile (breaks when HTML structure changes)
3. No rate limiting or authentication
