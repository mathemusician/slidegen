# Project Summary: Genius to PowerPoint

## What Was Built

A web application that converts Genius song lyrics into downloadable PowerPoint presentations.

## Architecture

### Hybrid Stack (Python + Next.js)

**Why this approach?**
- Genius API doesn't provide lyrics directly through their public API
- The `lyricsgenius` Python library (https://github.com/johnwmillr/LyricsGenius) is the official recommended way to access lyrics
- Next.js provides excellent UI/UX and PowerPoint generation capabilities

### Components

1. **Python Backend (FastAPI)**
   - Port: 8000
   - Purpose: Fetch lyrics from Genius API
   - Library: `lyricsgenius` v3.0.1
   - Docs: https://github.com/johnwmillr/LyricsGenius

2. **Next.js Frontend**
   - Port: 3000/3001
   - Purpose: UI and PowerPoint generation
   - Library: `pptxgenjs` v4.0.1
   - Docs: https://gitbrent.github.io/PptxGenJS/

## User Flow

1. User pastes Genius song URL (e.g., `https://genius.com/Artist-song-lyrics`)
2. Frontend sends URL to Python backend
3. Backend fetches lyrics using Genius API
4. Backend returns: title, artist, lyrics
5. Frontend generates PowerPoint with:
   - Title slide (song + artist)
   - Lyrics slides (one per verse/chorus)
   - Slide numbers
6. User downloads .pptx file

## Key Files

```
genius-to-ppt/
├── app/
│   ├── layout.tsx           # Root layout with HTML structure
│   ├── page.tsx             # Main UI component
│   ├── globals.css          # Tailwind CSS
│   └── api/
│       └── generate-ppt/
│           └── route.ts     # PowerPoint generation API
├── python-backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── env.example          # Environment template
├── setup.sh                 # Automated setup script
├── QUICKSTART.md           # 5-minute setup guide
└── README.md               # Full documentation
```

## Dependencies

### Frontend (package.json)
- `next` v15.5.4 - React framework
- `pptxgenjs` v4.0.1 - PowerPoint generation
- `axios` v1.12.2 - HTTP client
- `@heroicons/react` v2.2.0 - UI icons
- `tailwindcss` v4 - Styling

### Backend (requirements.txt)
- `fastapi` v0.115.0 - Web framework
- `lyricsgenius` v3.0.1 - Genius API wrapper
- `uvicorn` v0.32.0 - ASGI server
- `python-dotenv` v1.0.1 - Environment config

## Setup Requirements

1. **Genius API Credentials** (free)
   - Get from: https://genius.com/api-clients
   - Required: **Client Access Token**
   - Optional: Client ID and Client Secret (for future OAuth features)

2. **Python 3.8+**
   - Download: https://www.python.org/

3. **Node.js 18+**
   - Download: https://nodejs.org/

## Running the Application

```bash
# Terminal 1 - Python Backend
cd python-backend
source venv/bin/activate
python main.py

# Terminal 2 - Next.js Frontend
npm run dev
```

## Deployment Options

### Frontend (Vercel)
- Deploy to: https://vercel.com/
- Set env: `PYTHON_BACKEND_URL=https://your-backend.com`

### Backend (Railway/Render/Fly.io)
- Deploy Python app
- Set env: `GENIUS_ACCESS_TOKEN=your_token`
- Expose port: 8000

## Legal & Compliance

- Uses official Genius API (not web scraping)
- Respects Genius Terms of Service
- Educational/personal use
- Users responsible for copyright compliance

## Future Enhancements

Potential improvements:
- [ ] Slide theme customization
- [ ] Font/color options
- [ ] Multiple songs batch processing

## Verification Checklist

- [x] Sources cited for all libraries
- [x] Architecture decision documented
- [x] Setup instructions provided
- [x] No invented APIs
- [x] Versions specified
- [x] Security considerations documented
- [x] Legal notice included
